import SelectBox from './SelectBox';

class SelectBoxAsync extends SelectBox {
    constructor(options) {
        super(options);

        this.data = {
            loading: true,
        };

        // TODO: Poor mans promise detection (But might be needed because of different Promise Libraries)
        if (options.source && options.source.then && options.source.catch) {
            this.data.sourcePromise = options.source
                .then(result => {
                    this.templateOptions.options = result;
                    this.data.loading = false;
                    return result;
                })
                .catch(error => {
                    this.data.loading = false;
                    throw new Error('Unable to load values for: ' + options.fieldName + ' Error:' + error);
                });
        }
    }

    static create(modelValidation, models) {
        modelValidation.templateOptions = modelValidation.templateOptions || {};

        if (models && models[modelValidation.referenceType]) {
            modelValidation.source = models[modelValidation.referenceType]
                .list({paging: false})
                .then(modelCollection => modelCollection.toArray());
            return new SelectBoxAsync(modelValidation);
        }
        throw new Error('Passed models does not have a reference to the type: ' + modelValidation.referenceType);
    }
}
SelectBoxAsync.FIELDS_NOT_TO_COPY = SelectBox.FIELDS_NOT_TO_COPY.concat(['source']);

export default SelectBoxAsync;
