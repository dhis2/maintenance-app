import Field from './Field';

import Textarea from '../Textarea.component';

class TextBox extends Field {
    constructor(options) {
        super(options);

        this.type = Textarea;
    }
}

export default TextBox;
