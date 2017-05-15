import mapPropsStream from 'recompose/mapPropsStream';
import { noop } from 'lodash/fp';
import { Observable } from 'rxjs';
import { getInstance, config } from 'd2/lib/d2';
import CollapsibleList from './CollapsibleList';

config.i18n.strings.add('enrollment_count');
config.i18n.strings.add('program_stage_id');
config.i18n.strings.add('enrollment_status');
config.i18n.strings.add('tei_count');

const programIndicatorVariables = [
    'event_date',
    'due_date',
    'incident_date',
    'current_date',
    'completed_date',
    'value_count',
    'zero_pos_value_count',
    'event_count',
    'program_stage_name',
    'program_stage_id',
];
const additionalTrackerProgramsVariables = [
    'enrollment_count',
    'tei_count',
    'enrollment_date',
    'enrollment_status',
];

const getProgramVariablesForProgramType = (programType) => {
    if (programType === 'WITH_REGISTRATION') {
        return programIndicatorVariables.concat(additionalTrackerProgramsVariables);
    }

    return programIndicatorVariables;
};

const d2$ = Observable.fromPromise(getInstance());

const withVariablePropsForProgramType = mapPropsStream(props$ => props$
    .mergeMap(({ programType, ...props }) => {
        const variables = getProgramVariablesForProgramType(programType);

        return d2$
            .map(d2 => {
                return {
                    ...props,
                    variables: variables
                        .map(variable => ({
                            label: d2.i18n.getTranslation(variable),
                            value: variable,
                        })),
                };
            });
    })
    .map(({ variables, onSelect = noop, ...props }) => {
        return ({
            ...props,
            items: variables.map(({ label, value }) => ({
                value: `V{${value}}`,
                label,
            })),
            onItemClick: onSelect,
        });
    })
);

const VariableSelector = withVariablePropsForProgramType(CollapsibleList);

export default VariableSelector;
