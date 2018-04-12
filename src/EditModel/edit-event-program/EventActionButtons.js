import { bindActionCreators } from 'redux';
import { saveEventProgram } from './actions';
import { createConnectedFormActionButtonsForSchema } from '../form-buttons/FormActionButtons';
import { isSaving } from './selectors';

const mapDispatchToProps = dispatch => bindActionCreators({ onSaveAction: saveEventProgram }, dispatch);
const mapStateToProps = state => ({ isSaving: isSaving(state) });

const EventActionButtons = createConnectedFormActionButtonsForSchema(mapDispatchToProps, mapStateToProps);

export default EventActionButtons;
