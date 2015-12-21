import Field from './Field';
import CheckBoxComponent from '../CheckBox.component';

class CheckBox extends Field {
    constructor(options) {
        super(options);

        this.type = CheckBoxComponent;
    }
}

export default CheckBox;
