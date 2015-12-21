/* eslint-disable */
(function () {
    var fixtures = {};

    fixtures.modelValidations = {
        "aggregationLevels": {
            "persisted": true,
            "type": "COLLECTION",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "zeroIsSignificant": {
            "persisted": true,
            "type": "BOOLEAN",
            "required": true,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "displayDescription": {
            "persisted": false,
            "type": "TEXT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "dimensionType": {
            "persisted": false,
            "type": "CONSTANT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false,
            "constants": ["INDICATOR", "DATAELEMENT", "DATASET", "DATAELEMENT_OPERAND", "DATA_X", "DATA_COLLAPSED", "CATEGORY_OPTION_COMBO", "PERIOD", "ORGANISATIONUNIT", "CATEGORYOPTION_GROUPSET", "DATAELEMENT_GROUPSET", "ORGANISATIONUNIT_GROUPSET", "CATEGORY", "TRACKED_ENTITY_ATTRIBUTE", "TRACKED_ENTITY_DATAELEMENT", "PROGRAM_INDICATOR", "STATIC"]
        },
        "type": {
            "persisted": true,
            "type": "TEXT",
            "required": true,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "dataDimension": {
            "persisted": false,
            "type": "BOOLEAN",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "optionSet": {
            "persisted": true,
            "type": "REFERENCE",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true,
            "referenceType": "optionSet"
        },
        "id": {
            "persisted": true,
            "type": "IDENTIFIER",
            "required": false,
            "min": 11,
            "max": 11,
            "owner": true,
            "unique": true,
            "writable": true
        },
        "created": {
            "persisted": true,
            "type": "DATE",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "description": {
            "persisted": true,
            "type": "TEXT",
            "required": false,
            "min": 1,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "displayFormName": {
            "persisted": false,
            "type": "TEXT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "commentOptionSet": {
            "persisted": true,
            "type": "REFERENCE",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true,
            "referenceType": "optionSet"
        },
        "name": {
            "persisted": true,
            "type": "TEXT",
            "required": true,
            "min": 1,
            "max": 2147483647,
            "owner": true,
            "unique": true,
            "writable": true
        },
        "externalAccess": {
            "persisted": false,
            "type": "BOOLEAN",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "textType": {
            "persisted": true,
            "type": "TEXT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "href": {
            "persisted": false,
            "type": "URL",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "dataElementGroups": {
            "persisted": true,
            "type": "COLLECTION",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": true
        },
        "publicAccess": {
            "persisted": true,
            "type": "TEXT",
            "required": false,
            "min": 8,
            "max": 8,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "aggregationOperator": {
            "persisted": true,
            "type": "TEXT",
            "required": true,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "formName": {
            "persisted": true,
            "type": "TEXT",
            "required": false,
            "min": 2,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "lastUpdated": {
            "persisted": true,
            "type": "DATE",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "dataSets": {
            "persisted": true,
            "type": "COLLECTION",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": true
        },
        "code": {
            "persisted": true,
            "type": "IDENTIFIER",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": true,
            "writable": true
        },
        "access": {
            "persisted": false,
            "type": "COMPLEX",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "url": {
            "persisted": true,
            "type": "URL",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "numberType": {
            "persisted": true,
            "type": "TEXT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "domainType": {
            "persisted": true,
            "type": "CONSTANT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true,
            "constants": ["AGGREGATE", "TRACKER"]
        },
        "legendSet": {
            "persisted": true,
            "type": "REFERENCE",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true,
            "referenceType": "legendSet"
        },
        "categoryCombo": {
            "persisted": true,
            "type": "REFERENCE",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true,
            "referenceType": "categoryCombo"
        },
        "dimension": {
            "persisted": false,
            "type": "TEXT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "attributeValues": {
            "persisted": true,
            "type": "COLLECTION",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "items": {
            "persisted": false,
            "type": "COLLECTION",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "userGroupAccesses": {
            "persisted": true,
            "type": "COLLECTION",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true
        },
        "shortName": {
            "persisted": true,
            "type": "TEXT",
            "required": true,
            "min": 1,
            "max": 2147483647,
            "owner": true,
            "unique": true,
            "writable": true
        },
        "displayName": {
            "persisted": false,
            "type": "TEXT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "displayShortName": {
            "persisted": false,
            "type": "TEXT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        },
        "user": {
            "persisted": true,
            "type": "REFERENCE",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": true,
            "unique": false,
            "writable": true,
            "referenceType": "user"
        },
        "filter": {
            "persisted": false,
            "type": "TEXT",
            "required": false,
            "min": -2147483648,
            "max": 2147483647,
            "owner": false,
            "unique": false,
            "writable": false
        }
    };

    window.fixtures = {
        get: function (fixtureName) {
            if (fixtures[fixtureName])
                return JSON.parse(JSON.stringify(fixtures[fixtureName]));
            throw new Error('Fixture named "' + fixtureName + '" does not exist');
        }
    };

}(window));
