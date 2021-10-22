class ModelCollection {
    constructor(modelDefinition, items = []) {
        items.map(item => [item.id, item]);
        this.modelDefinition = modelDefinition;
    }
}

ModelCollection.create = jest.fn((...args) => new ModelCollection(...args));

module.exports = ModelCollection;
