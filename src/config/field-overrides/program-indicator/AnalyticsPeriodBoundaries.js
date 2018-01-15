import React, { PropTypes } from 'react';
import { equals, compose } from 'lodash/fp';
import withState from 'recompose/withState';
import getContext from 'recompose/getContext';
import { getInstance } from 'd2/lib/d2';
import lifecycle from 'recompose/lifecycle';

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
    {text: 'Incident date', value: 'INCIDENT_DATE'},
    {text: 'Event date', value: 'EVENT_DATE'},
    {text: 'Enrollment date', value: 'ENROLLMENT_DATE'}
];


function AnalyticsPeriodBoundary (props) {
    console.dir(props)
    return (
        <div>
            <DropDown
                labelText="Boundary target"
                options={boundaryTargets}
                onChange={e => props.onChange(e, "boundaryTarget")}
                value={props.boundaryTarget}
            />

            <DropDown
                labelText="Analytics period boundary type"
                options={periodBoundaryTypes}
                onChange={e => props.onChange(e, "analyticsPeriodBoundaryType")}
                value={props.analyticsPeriodBoundaryType}
            />

            <TextField type="number"
                labelText="offset"
                value={props.offsetNumberOfPeriods}
                onChange={e => props.onChange(e, "offsetNumberOfPeriods")}
            />

            <PeriodTypeDropDown
                labelText="period"
                onChange={e => props.onChange(e, "offsetPeriodType")}
                value={props.offsetPeriodType}
            />

            <button onClick={e => props.onClick(e)}>Delete</button>
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
    let boundaries = model.analyticsPeriodBoundaries.map((props, i) => (
        <AnalyticsPeriodBoundary
            key={i}
            onChange={updateSubField.bind(this, props, model, onChange, i)}
            onClick={removeSubField.bind(this, model, onChange, i)}
            {...props}
        />
    ));

    return (<div>
                <div>{boundaries}</div>
                <div>
                    <button onClick={addSubField.bind(this, model, onChange)}>
                        Add new boundary
                    </button>
                </div>
            </div>);
}

const enhance = compose(
    getContext({ d2: PropTypes.object })
);

export let AnalyticsPeriodBoundaries = enhance(AnalyticsPeriodBoundaryList);
