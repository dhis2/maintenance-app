import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import React from 'react';
import { editProgramStageField } from './actions';
import { connect } from 'react-redux';
import fieldOrder from '../../../../config/field-config/field-order';
import { wrapInPaper } from '../../../componentHelpers';
import { createFormFor } from '../../../formHelpers';
import { bindActionCreators } from 'redux';
import pure from 'recompose/pure';
const programStageFields = fieldOrder.for('programStage');

export const EditProgramStageDetails = props => {
    const connectedEditForm = connect(null, dispatch =>
        bindActionCreators(
            {
                editFieldChanged: (field, value) =>
                    editProgramStageField(props.programStage.id, field, value)
            },
            dispatch
        )
    );
    const ProgramStageDetailsForm = pure(connectedEditForm(
        wrapInPaper(
            createFormFor(
                props.programStage$,
                'programStage',
                programStageFields
            )
        )
    ));
    return <ProgramStageDetailsForm {...props} />;
};

export default EditProgramStageDetails;
