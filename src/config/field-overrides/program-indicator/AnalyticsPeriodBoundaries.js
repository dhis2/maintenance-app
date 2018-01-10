import DropDown from '../../../forms/form-fields/drop-down';
import TextField from '../../../forms/form-fields/text-field';

const periods = [
    {text: 'years', value: 'Yearly'},
    {text: 'days', value: 'Daily'},
    {text: 'months', value: 'Monthly'}
];

const boundaries = [
    {text: 'Before end of reporting period', value: 'BEFORE_END_OF_REPORTING_PERIOD'},
    {text: 'After start of reporting period', value: 'AFTER_START_OF_REPORTING_PERIOD'}
];

const reports = [
    {text: 'Incident date', value: 'INCIDENT_DATE'},
    {text: 'Event data', value: 'EVENT_EXECUTION_DATE'}
];

function onChange (e) {
    console.log('onChange', e);
}

function AnalyticsPeriodBoundary (props) {
    console.dir(props)
    return (
        <div>
            <DropDown
                labelText="report"
                options={reports}
                onChange={onChange}
                value={props.boundaryTarget} />

            <DropDown
                labelText="boundary"
                options={boundaries}
                onChange={onChange}
                value={props.analyticsPeriodBoundaryType} />

            <TextField type="number"
                labelText="offset"
                value={props.offsetNumberOfPeriods}
                onChange={onChange} />

            <DropDown
                labelText="period"
                options={periods}
                onChange={onChange}
                value={props.offsetPeriodType}/>

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
