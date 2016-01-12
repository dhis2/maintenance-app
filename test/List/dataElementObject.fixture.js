export default function dataElementObjectFixture() {
    return JSON.parse(`{
        "code": "BS_COLL_N_DSD_TARGET7",
        "lastUpdated": "2015-09-15T11:03:24.367+0000",
        "href": "http://localhost:8080/dhis/api/dataElements/umC9U5YGDq4",
        "id": "umC9U5YGDq4",
        "created": "2014-12-21T23:15:50.886+0000",
        "name": "BS_COLL (N, DSD) TARGET: Blood Units Donated",
        "shortName": "BS_COLL (N, DSD) TARGET7",
        "aggregationType": "SUM",
        "dimensionType": "PROGRAM_DATAELEMENT",
        "domainType": "AGGREGATE",
        "displayName": "BS_COLL (N, DSD) TARGET: Blood Units Donated",
        "publicAccess": "--------",
        "description": "Target the total number of blood units that were donated in the country National Blood Transfusion Service (NBTS) network.",
        "displayShortName": "BS_COLL (N, DSD) TARGET7",
        "externalAccess": false,
        "valueType": "INTEGER",
        "dimension": "umC9U5YGDq4",
        "displayDescription": "Target the total number of blood units that were donated in the country National Blood Transfusion Service (NBTS) network.",
        "allItems": false,
        "zeroIsSignificant": true,
        "url": "",
        "aggregationOperator": "sum",
        "dataDimension": true,
        "optionSetValue": true,
        "access": {"read": true, "update": true, "externalize": false, "delete": true, "write": true, "manage": true},
        "optionSet": {
            "id": "P5T6XLxAMuT",
            "name": "EA Point of Service",
            "created": "2014-06-30T15:27:07.998+0000",
            "lastUpdated": "2014-06-30T15:27:07.998+0000",
            "href": "http://localhost:8080/dhis/api/optionSets/P5T6XLxAMuT"
        },
        "categoryCombo": {
            "id": "bjDvmb4bfuf",
            "name": "default",
            "created": "2014-01-28T17:43:51.405+0000",
            "lastUpdated": "2015-02-19T13:50:59.543+0000",
            "href": "http://localhost:8080/dhis/api/categoryCombos/bjDvmb4bfuf"
        },
        "commentOptionSet": {
            "id": "P5T6XLxAMuT",
            "name": "EA Point of Service",
            "created": "2014-06-30T15:27:07.998+0000",
            "lastUpdated": "2014-06-30T15:27:07.998+0000",
            "href": "http://localhost:8080/dhis/api/optionSets/P5T6XLxAMuT"
        },
        "user": {
            "id": "kwwcGq36yOZ",
            "name": "Jim Grace",
            "created": "2014-01-29T00:45:59.984+0000",
            "lastUpdated": "2015-04-13T12:51:14.865+0000",
            "href": "http://localhost:8080/dhis/api/users/kwwcGq36yOZ"
        },
        "userGroupAccesses": [{"access": "r-------", "userGroupUid": "c6hGi8GEZot"}],
        "attributeValues": [{
            "lastUpdated": "2015-09-15T11:03:25.798+0000",
            "created": "2015-09-14T10:29:07.383+0000",
            "value": "123",
            "attribute": {
                "id": "FpoWdhxCMwH",
                "name": "marktribute",
                "code": "marktribute3",
                "created": "2015-08-24T13:15:09.589+0000",
                "lastUpdated": "2015-09-15T10:19:28.280+0000"
            }
        }, {
            "lastUpdated": "2015-09-15T11:03:25.971+0000",
            "created": "2015-09-14T10:34:26.131+0000",
            "value": "",
            "attribute": {
                "id": "tpA3Ngyvp9N",
                "name": "marktribute2",
                "code": "marktribute2",
                "created": "2015-08-27T08:27:02.743+0000",
                "lastUpdated": "2015-08-31T16:30:14.953+0000"
            }
        }, {
            "lastUpdated": "2015-09-15T11:03:25.862+0000",
            "created": "2015-09-14T10:29:07.470+0000",
            "value": "John",
            "attribute": {
                "id": "S8a2OBRnqEc",
                "name": "name",
                "created": "2015-08-31T16:15:23.963+0000",
                "lastUpdated": "2015-08-31T16:30:24.234+0000"
            }
        }, {
            "lastUpdated": "2015-09-15T11:03:25.915+0000",
            "created": "2015-09-14T10:29:07.519+0000",
            "value": "Medium",
            "attribute": {
                "id": "Rin3jjx18PI",
                "name": "select",
                "code": "select",
                "created": "2015-09-09T11:20:13.173+0000",
                "lastUpdated": "2015-09-09T11:20:13.173+0000"
            }
        }],
        "dataElementGroups": [{
            "id": "mLYVq09X8i6",
            "name": "All SIMS Above Site",
            "created": "2015-03-23T15:52:46.438+0000",
            "lastUpdated": "2015-09-14T10:33:32.806+0000",
            "href": "http://localhost:8080/dhis/api/dataElementGroups/mLYVq09X8i6"
        }, {
            "id": "RXqZwdvvXav",
            "name": "All SI - Targets Narratives (DSD, TA)",
            "created": "2015-03-19T15:28:45.337+0000",
            "lastUpdated": "2015-09-14T10:29:07.362+0000",
            "href": "http://localhost:8080/dhis/api/dataElementGroups/RXqZwdvvXav"
        }],
        "dataSets": [{
            "id": "JXKUYJqmyDd",
            "name": "MER Targets: Facility Based - DoD ONLY",
            "code": "MER_TARGETS_SITE_FY15_DOD",
            "created": "2015-01-28T04:27:57.550+0000",
            "lastUpdated": "2015-09-14T10:29:07.092+0000",
            "href": "http://localhost:8080/dhis/api/dataSets/JXKUYJqmyDd"
        }, {
            "id": "xxo1G5V1JG2",
            "name": "MER Targets: Operating Unit Level (IM)",
            "code": "MER_TARGETS_OU_IM_FY15",
            "created": "2014-10-01T11:46:59.588+0000",
            "lastUpdated": "2015-09-14T10:29:07.097+0000",
            "href": "http://localhost:8080/dhis/api/dataSets/xxo1G5V1JG2"
        }, {
            "id": "lbwuIo56YoG",
            "name": "MER Targets: Community Based - DoD ONLY",
            "code": "MER_TARGETS_SUBNAT_FY15_DOD",
            "created": "2015-01-28T01:19:13.837+0000",
            "lastUpdated": "2015-09-14T10:29:07.100+0000",
            "href": "http://localhost:8080/dhis/api/dataSets/lbwuIo56YoG"
        }, {
            "id": "tCIW2VFd8uu",
            "name": "MER Targets: Community Based",
            "code": "MER_TARGETS_SUBNAT_FY15",
            "created": "2014-09-27T17:44:34.834+0000",
            "lastUpdated": "2015-09-14T10:29:07.102+0000",
            "href": "http://localhost:8080/dhis/api/dataSets/tCIW2VFd8uu"
        }, {
            "id": "qRvKHvlzNdv",
            "name": "MER Targets: Facility Based",
            "code": "MER_TARGETS_SITE_FY15",
            "created": "2014-09-23T15:22:46.107+0000",
            "lastUpdated": "2015-09-14T10:29:07.104+0000",
            "href": "http://localhost:8080/dhis/api/dataSets/qRvKHvlzNdv"
        }],
        "aggregationLevels": [1, 2, 8],
        "items": []
    }`);
}
