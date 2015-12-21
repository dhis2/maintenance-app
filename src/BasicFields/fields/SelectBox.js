import Field from './Field';

import Select from '../Select.component';
import LabelWrapper from '../wrappers/LabelWrapper.component';

class SelectBox extends Field {
    constructor(options) {
        super(options);

        this.type = Select;
        this.wrapper = LabelWrapper;

        this.templateOptions.options = !!options.templateOptions && options.templateOptions.options || options.constants || [];

        this.templateOptions.options = this.templateOptions.options
            .map(constant => ({name: constant, value: constant}));
    }
}

export default SelectBox;
