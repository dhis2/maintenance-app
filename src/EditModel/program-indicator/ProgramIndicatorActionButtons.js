import React from 'react';
import { bindActionCreators } from 'redux';
import { saveProgramIndicator } from './actions';
import { createConnectedFormActionButtonsForSchema } from '../FormActionButtons';

const mapDispatchToProps = (dispatch) => bindActionCreators({ onSaveAction: saveProgramIndicator }, dispatch);

const ProgramIndicatorActionButtons = createConnectedFormActionButtonsForSchema(mapDispatchToProps);

export default ProgramIndicatorActionButtons;
