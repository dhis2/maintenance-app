import {camelCaseToUnderscores} from 'd2-utils';
import Input from '../form-fields/text-field';
import {isRequired} from 'd2-ui/lib/forms/Validators';
import {getInstance} from 'd2/lib/d2';

class Field {
    constructor() {
        this.type = Input;
        this.fieldOptions = {};
        this.validators = [];
    }

    static create(options) {
        const field = Object.assign(new this(), options || {});

        // Set required validator
        if (options.required) {
            field.validators.push(isRequired);
        }

        if (options.unique) {
            console.log('Add unique validator to: ' + options.name);
            field.validators.push(function () {
                return getInstance()
                    .then(d2 => {
                        console.log(options);

                        return Promise.reject('not_unique');
                    });
            });
        }

        return field;
    }
}
export default Field;
