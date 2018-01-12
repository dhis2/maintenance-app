import DropDown from '../../../forms/form-fields/drop-down';
import TextField from '../../../forms/form-fields/text-field';
import PeriodTypeDropDown from '../../../forms/form-fields/period-type-drop-down';

const periods = [
    {text: 'years', value: 'Yearly'},
    {text: 'days', value: 'Daily'},
    {text: 'months', value: 'Monthly'}
];

const periodBoundaryTypes = [
    {text: 'Before end of reporting period', value: 'BEFORE_END_OF_REPORTING_PERIOD'},
    {text: 'After start of reporting period', value: 'AFTER_START_OF_REPORTING_PERIOD'}
];

const boundaryTarget = [
    {text: 'Incident date', value: 'INCIDENT_DATE'},
    {text: 'Event date', value: 'EVENT_DATE'},
    {text: 'Enrollment date', value: 'ENROLLMENT_DATE'}
];

function onChange (e) {
    console.log('onChange', e);
}

function AnalyticsPeriodBoundary (props) {
    console.dir(props)
    return (
        <div>
            <DropDown
                labelText="Boundary target"
                options={boundaryTarget}
                onChange={onChange}
                value={props.boundaryTarget}
            />

            <DropDown
                labelText="Analytics period boundary type"
                options={periodBoundaryTypes}
                onChange={onChange}
                value={props.analyticsPeriodBoundaryType}
            />

            <TextField type="number"
                labelText="offset"
                value={props.offsetNumberOfPeriods}
                onChange={onChange}
            />

            <PeriodTypeDropDown
                labelText="period"
                onChange={onChange}
                value={props.offsetPeriodType}
            />

            <button>Delete</button>
        </div>
    );
}

export function AnalyticsPeriodBoundaries (props) {
    console.log(props.model.analyticsPeriodBoundaries);
    let boundaries = props.model.analyticsPeriodBoundaries.map(AnalyticsPeriodBoundary);
    return (
        <div>{boundaries}</div>
    );
}
