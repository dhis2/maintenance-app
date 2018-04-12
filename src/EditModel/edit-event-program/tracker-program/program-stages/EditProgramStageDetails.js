import React from 'react';
import { PropTypes } from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import pure from 'recompose/pure';

import { editProgramStageField } from './actions';
import fieldOrder from '../../../../config/field-config/field-order';
import { wrapVerticalStepInPaper } from '../../../helpers/componentHelpers';
import { createFormFor } from '../../../helpers/formHelpers';

const programStageFields = fieldOrder.for('programStage');

export const EditProgramStageDetails = (props) => {
    const connectedEditForm = connect(null, dispatch =>
        bindActionCreators(
            {
                editFieldChanged: (field, value) =>
                    editProgramStageField(props.programStage.id, field, value),
            },
            dispatch,
        ),
    );
    const ProgramStageDetailsForm = pure(connectedEditForm(
        wrapVerticalStepInPaper(
            createFormFor(
                props.programStage$,
                'programStage',
                programStageFields,
            ),
        ),
    ));
    return <ProgramStageDetailsForm {...props} />;
};

EditProgramStageDetails.propTypes = {
    programStage$: PropTypes.object,
};

export default EditProgramStageDetails;
