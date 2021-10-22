export default (function x() {
    const fixtures = {};

    function getFixture(fixtureName) {
        if (fixtures && fixtures[fixtureName]) {
            // Make sure we return a new object
            return JSON.parse(JSON.stringify(fixtures[fixtureName]));
        }
        throw new Error(['Fixture', fixtureName, 'does not exist'].join(' '));
    }

    function addFixture(fixtureName, fixtureData) {
        if (fixtureName && fixtureData && typeof fixtureName === 'string') {
            fixtures[fixtureName] = fixtureData;
        }
    }

    addFixture('/api/attributes', require('./json/api/schemas/attributes.json'));
    addFixture('/api/dataElements', require('./json/api/dataElements.json'));
    addFixture('/api/organisationUnits', require('./json/api/organisationUnits.json'));
    addFixture('/api/schemas', require('./json/api/schemas.json'));
    addFixture('/api/schemas/dataElement', require('./json/api/schemas/dataElement.json'));
    addFixture('/api/schemas/dataSet', require('./json/api/schemas/dataSet'));
    addFixture('/api/schemas/indicatorGroup', require('./json/api/schemas/indicatorGroup.json'));
    addFixture('/api/schemas/organisationUnit', require('./json/api/schemas/organisationUnit.json'));
    addFixture('/api/schemas/organisationUnitGroupSet', require('./json/api/schemas/organisationUnitGroupSet'));
    addFixture('/api/schemas/validationRule', require('./json/api/schemas/validationRule'));
    addFixture('/api/schemas/program', require('./json/api/schemas/program'));
    addFixture('/api/schemas/programNotificationTemplate', require('./json/api/schemas/programNotificationTemplate'));
    addFixture('/api/schemas/user', require('./json/api/schemas/user.json'));
    addFixture('/api/schemas/legendSet', require('./json/api/schemas/legendSet.json'));
    addFixture('/api/schemas/legend', require('./json/api/schemas/legend.json'));
    addFixture('/api/userSettings', require('./json/api/userSettings'));
    addFixture('/appStore', require('./json/api/appStore.json'));
    addFixture('/dataElementAttributes', require('./json/dataElementAttributes.json'));
    addFixture('/me', require('./json/api/me.json'));
    addFixture('/me/authorities', require('./json/api/me/authorities.json'));
    addFixture('/modelDefinitions/dataElement', require('./json/modelDefinitions/dataElement.json'));
    addFixture('/singleUserAllFields', require('./json/singleUserAllFields.json'));
    addFixture('/singleUserOwnerFields', require('./json/singleUserOwnerFields.json'));
    addFixture('/api/legendSets/k1JHPfXsJND', require('./json/api/legendSets/k1JHPfXsJND.json'));
    addFixture('/api/analytics/dataValueSet', require('./json/api/analytics/dataValueSet.json'));
    addFixture('/api/analytics/rawData', require('./json/api/analytics/rawData.json'));
    addFixture('/api/analytics/aggregate', require('./json/api/analytics/aggregate.json'));
    addFixture('/api/analytics/count', require('./json/api/analytics/count.json'));
    addFixture('/api/analytics/query', require('./json/api/analytics/query.json'));
    addFixture('/api/analytics/cluster', require('./json/api/analytics/cluster.json'));

    return {
        get: getFixture,
        add: addFixture,
    };
}());
