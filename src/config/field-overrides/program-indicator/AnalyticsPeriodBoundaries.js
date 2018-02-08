import React, { PropTypes } from 'react';
import { equals, compose } from 'lodash/fp';
import withState from 'recompose/withState';
import getContext from 'recompose/getContext';
import lifecycle from 'recompose/lifecycle';

import { getInstance } from 'd2/lib/d2';

import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';

import DropDown from '../../../forms/form-fields/drop-down';
import TextField from '../../../forms/form-fields/text-field';
import PeriodTypeDropDown from '../../../forms/form-fields/period-type-drop-down';

import {
    BEFORE_START_OF_REPORTING_PERIOD,
    BEFORE_END_OF_REPORTING_PERIOD,
    AFTER_START_OF_REPORTING_PERIOD,
    AFTER_END_OF_REPORTING_PERIOD,
    INCIDENT_DATE,
    EVENT_DATE,
    ENROLLMENT_DATE
} from './enums'

// just wrap the component in a span with some margins as they are
// inline in this form
const withStyle = function withStyle(BaseField, styles) {
    return props => (
        <span style={styles}>
            <BaseField {...props}/>
        </span>
    );
};

const style = {
    marginRight: '14px'
};

const StyledDropDown = withStyle(DropDown, style);
const StyledTextField = withStyle(TextField, style);
const StyledPeriodTypeDropDown = withStyle(PeriodTypeDropDown, style);

const boundaryTargets = [
    {
        text: 'boundary_target_incident_date',
        value: INCIDENT_DATE
    },
    {
        text: 'boundary_target_event_date',
        value: EVENT_DATE
    },
    {
        text: 'boundary_target_enrollment_date',
        value: ENROLLMENT_DATE
    }
];

const boundaryTypes =[
    {
        text: 'report_period_before_start',
        value: BEFORE_START_OF_REPORTING_PERIOD
    },
    {
        text: 'report_period_before_end',
        value: BEFORE_END_OF_REPORTING_PERIOD
    },
    {
        text: 'report_period_after_start',
        value: AFTER_START_OF_REPORTING_PERIOD
    },
    {
        text: 'report_period_after_end',
        value: AFTER_END_OF_REPORTING_PERIOD
    }
];

// boundary type definitions mapped to java enum
// dhis2-core/dhis-2/dhis-api/src/main/java/org/hisp/dhis/program/AnalyticsPeriodBoundaryType.java#L37-L40
// as they are not exposed over the API
function AnalyticsPeriodBoundary (props) {
    const getTranslation = props.d2.i18n.getTranslation.bind(props.d2.i18n);
    return (
        <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: '',
                alignItems: 'center'
        }}>
            <StyledDropDown
                style={ {marginRight: '14px'} }
                labelText={getTranslation('analytics_boundary_target')}
                translateOptions={true}
                options={boundaryTargets}
                onChange={e => props.onChange(e, "boundaryTarget")}
                value={props.boundaryTarget}
            />

            <StyledDropDown
                labelText={getTranslation('analytics_period_boundary_type')}
                style={ {position: 'relative', marginRight: '14px'} }
                translateOptions={true}
                options={boundaryTypes}
                onChange={e => props.onChange(e, "analyticsPeriodBoundaryType")}
                value={props.analyticsPeriodBoundaryType}
            />

            <StyledTextField type="number"
                style={ { flex: '0 1 auto' } }
                labelText={getTranslation('period_number_offset')}
                value={props.offsetNumberOfPeriods}
                onChange={e => props.onChange(e, "offsetNumberOfPeriods")}
            />

            <StyledPeriodTypeDropDown
                labelText={getTranslation('period_offset')}
                onChange={e => props.onChange(e, "offsetPeriodType")}
                style={ { marginRight: '14px' } }
                value={props.offsetPeriodType}
            />

            <div style={{ flex: '0 1 auto' }}>
                <RaisedButton
                    label={getTranslation('remove_singular')}
                    onClick={e => props.onClick(e)}/>
            </div>
        </div>
    );
}

function updateSubField(element, model, onChange, idx, e, fieldName) {
    const changeToVal = e.target.value;

    const list = model.analyticsPeriodBoundaries;
    const newEl = Object.assign({}, element, {[fieldName]: changeToVal});

    list[idx] = newEl;

    return onChange({ target: { value: list}})
}

function removeSubField(model, onChange, idx, e) {
    const list = model.analyticsPeriodBoundaries;
    const newList = list.filter((_, i) => i !== idx);

    return onChange({ target: { value: newList }});
}

function addSubField(model, onChange) {
    const list = model.analyticsPeriodBoundaries || [];

    const newVal = {
        analyticsPeriodBoundaryType: '',
        boundaryTarget: '',
        offsetNumberOfPeriods: 0,
        offsetPeriodType: ''
    };

    return onChange({ target: {
        value: list.concat([newVal])
    }});
}

function AnalyticsPeriodBoundaryList ({ d2, model, onChange }) {
    const getTranslation = d2.i18n.getTranslation.bind(d2.i18n);

    let analyticsPeriodBoundaries = [];

    if (model.analyticsPeriodBoundaries) {
        analyticsPeriodBoundaries = model.analyticsPeriodBoundaries;
    }

    const boundaries = analyticsPeriodBoundaries.map((props, i) => (
        <AnalyticsPeriodBoundary
            key={i}
            d2={d2}
            onChange={updateSubField.bind(this, props, model, onChange, i)}
            onClick={removeSubField.bind(this, model, onChange, i)}
            {...props}
        />
    ));

    return (<div>
                <h3 style={ {color: 'rgba(0,0,0,0.5)', fontWeight: 'normal', fontSize: '16px'} }>
                    {getTranslation('analytics_period_boundaries')}
                </h3>
                <div>
                    <div>{boundaries}</div>
                    <div style={ { marginTop: '14px' } }>
                        <RaisedButton
                            secondary
                            onClick={addSubField.bind(this, model, onChange)}
                            label={getTranslation('add_period_boundary')}
                            />
                    </div>
                </div>
            </div>);
}

const enhance = compose(
    getContext({ d2: PropTypes.object })
);

export let AnalyticsPeriodBoundaries = enhance(AnalyticsPeriodBoundaryList);
