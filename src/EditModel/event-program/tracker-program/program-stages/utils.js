import mapPropsStream from "recompose/mapPropsStream";
import programStore$ from "../../eventProgramStore";
import { get, compose } from 'lodash/fp';

const program$ = programStore$.map(get('program'));

const programStages$ = programStore$.map(get('programStages'));


/**
 * Maps the programStage$ observable to a normal object to read the values in the component.
 */
export const withProgramStageFromProgramStage$ = mapPropsStream(props$ =>
    props$.combineLatest(
        props$.flatMap(x => x.programStage$),
        (props, programStage) => {
            return {
                ...props,
                programStage
            };
        }
    )
);

/**
 * Adds program and programStages as props to the enhanced compontents.
 */

export const withProgramAndStages = compose(
    mapPropsStream(props$ =>
        props$.combineLatest(
            program$,
            programStages$,
            (props, program, programStages) => ({
                ...props,
                program,
                programStages
            })
        )
    )
);

export const getProgramStage$ById = stageId =>
    programStages$
        .flatMap(x => x)
        .filter(stage => stage.id && stage.id === stageId);
