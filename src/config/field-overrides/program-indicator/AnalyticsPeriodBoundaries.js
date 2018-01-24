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

// definitions mapped to java enum
// https://github.com/dhis2/dhis2-core/blob/markus-program-indicators-cohorts/dhis-2/dhis-api/src/main/java/org/hisp/dhis/program/AnalyticsPeriodBoundaryType.java#L37-L40
const periodBoundaryTypes = [
    {
        text: 'Before start of reporting period',
        value: 'BEFORE_START_OF_REPORTING_PERIOD'
    },
    {
        text: 'Before end of reporting period',
        value: 'BEFORE_END_OF_REPORTING_PERIOD'
    },
    {
        text: 'After start of reporting period',
        value: 'AFTER_START_OF_REPORTING_PERIOD'
    },
    {
        text: 'After end of reporting period',
        value: 'AFTER_END_OF_REPORTING_PERIOD'
    }
];

const boundaryTargets = [
    {
        text: 'Incident date',
        value: 'INCIDENT_DATE'
    },
    {
        text: 'Event date',
        value: 'EVENT_DATE'
    },
    {
        text: 'Enrollment date',
        value: 'ENROLLMENT_DATE'
    }
];


// just wrap the component in a span with some margins as they are
// inline in this form
const withStyle = function withStyle(BaseField, styles) {
    return props => (
        <span style={styles}>
            <BaseField {...props}/>
        </span>
    );
};

function AnalyticsPeriodBoundary (props) {
    const style = {
        marginRight: '14px'
    }

    const DD = withStyle(DropDown, style);
    const TF = withStyle(TextField, style);
    const PTDD = withStyle(PeriodTypeDropDown, style);

    return (
        <div>
            <DD
                style={ {marginRight: '14px'} }
                labelText="Boundary target"
                options={boundaryTargets}
                onChange={e => props.onChange(e, "boundaryTarget")}
                value={props.boundaryTarget}
            />

            <DD
                labelText="Analytics period boundary type"
                style={ {position: 'relative', marginRight: '14px'} }
                options={periodBoundaryTypes}
                onChange={e => props.onChange(e, "analyticsPeriodBoundaryType")}
                value={props.analyticsPeriodBoundaryType}
            />

            <TF type="number"
                style={ { top: '-14px', width: '128px' } }
                labelText="offset"
                value={props.offsetNumberOfPeriods}
                onChange={e => props.onChange(e, "offsetNumberOfPeriods")}
            />

            <PTDD
                labelText="period"
                onChange={e => props.onChange(e, "offsetPeriodType")}
                style={ { marginRight: '14px' } }
                value={props.offsetPeriodType}
            />

            <RaisedButton
                label="Remove"
                onClick={e => props.onClick(e)}/>
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
    const list = model.analyticsPeriodBoundaries;
    const newVal = {
        analyticsPeriodBoundaryType: '',
        boundaryTarget: '',
        offsetNumberOfPeriods: 0,
        offsetPeriodType: '',
        programIndicator: model.id
    };

    return onChange({ target: {
        value: list.concat([newVal])
    }});
}

function AnalyticsPeriodBoundaryList ({ d2, model, onChange }) {
    const cssStyles = {
        marginLeft: '14px'
    };

    const boundaries = model.analyticsPeriodBoundaries.map((props, i) => (
        <AnalyticsPeriodBoundary
            key={i}
            onChange={updateSubField.bind(this, props, model, onChange, i)}
            onClick={removeSubField.bind(this, model, onChange, i)}
            {...props}
        />
    ));

    return (<div>
                <h3 style={ {color: 'rgba(0,0,0,0.5)', fontWeight: 'normal', fontSize: '16px'} }>Analytics period boundaries</h3>
                <div style={cssStyles}>
                    <div>{boundaries}</div>
                    <div style={ { marginTop: '14px' } }>
                        <RaisedButton
                            secondary
                            onClick={addSubField.bind(this, model, onChange)}
                            label="Add new boundary"
                            />
                    </div>
                </div>
            </div>);
}

const enhance = compose(
    getContext({ d2: PropTypes.object })
);

export let AnalyticsPeriodBoundaries = enhance(AnalyticsPeriodBoundaryList);
