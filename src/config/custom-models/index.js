import locale from './locale';

function createFromSchema(customModel) {
    return customModel.ModelDefinition.createFromSchema(customModel.schema);
}

export default [
    createFromSchema(locale),
];