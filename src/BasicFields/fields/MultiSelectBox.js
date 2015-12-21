import log from 'loglevel';

import Field from './Field';

import MultiSelect from '../MultiSelect.component';
import LabelWrapper from '../wrappers/LabelWrapper.component';

class MultiSelectBox extends Field {
    constructor(options) {
        super(options);

        this.type = MultiSelect;
        this.data = this.data || {};
        this.data.referenceType = options.referenceType;
        this.data.source = options.source || [];

        this.wrapper = LabelWrapper;
    }

    static create(modelValidation, models) {
        modelValidation.templateOptions = modelValidation.templateOptions || {};

        if (models && models[modelValidation.referenceType]) {
            modelValidation.source = () => {
                return models[modelValidation.referenceType.name].list();
            };
            modelValidation.referenceType = models[modelValidation.referenceType];
            return new MultiSelectBox(modelValidation);
        }
        // FIXME: Don't allow MultiSelectBoxes without source;
        log.warn('Warning: Trying to create a MultiSelect box without a referenceType or a referenceType that does not exist', modelValidation.referenceType);
        return new MultiSelectBox(modelValidation);
    }
}
MultiSelectBox.FIELDS_NOT_TO_COPY = MultiSelectBox.FIELDS_NOT_TO_COPY.concat(['source', 'referenceType']);

export default MultiSelectBox;
