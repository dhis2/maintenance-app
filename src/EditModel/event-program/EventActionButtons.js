import React from 'react';
import { bindActionCreators } from 'redux';
import { saveEventProgram } from './actions';
import { createConnectedFormActionButtonsForSchema } from '../FormActionButtons';

const mapDispatchToProps = (dispatch) => bindActionCreators({ onSaveAction: saveEventProgram }, dispatch);

const EventActionButtons = createConnectedFormActionButtonsForSchema(mapDispatchToProps);

export default EventActionButtons;
