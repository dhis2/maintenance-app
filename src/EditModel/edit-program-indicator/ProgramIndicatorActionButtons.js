import { bindActionCreators } from 'redux';
import { saveProgramIndicator } from './actions';
import { createConnectedFormActionButtonsForSchema } from '../form-buttons/FormActionButtons';

const mapDispatchToProps = dispatch => bindActionCreators({ onSaveAction: saveProgramIndicator }, dispatch);

const ProgramIndicatorActionButtons = createConnectedFormActionButtonsForSchema(mapDispatchToProps);

export default ProgramIndicatorActionButtons;
