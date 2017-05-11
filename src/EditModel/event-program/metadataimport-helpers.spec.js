import { getImportStatus } from './metadataimport-helpers';

describe('MetaDataImport helpers', () => {
    let successfullImportResponse;
    let unsuccessfullImportResponse;

    beforeEach(() => {
        successfullImportResponse = {
            "importParams": {
                "importMode": "COMMIT",
                "identifier": "UID",
                "preheatMode": "REFERENCE",
                "importStrategy": "CREATE_AND_UPDATE",
                "atomicMode": "ALL",
                "mergeMode": "REPLACE",
                "flushMode": "AUTO",
                "skipSharing": false,
                "skipValidation": false,
                "username": "admin"
            },
            "status": "OK",
            "stats": {
                "created": 1,
                "updated": 0,
                "deleted": 0,
                "ignored": 0,
                "total": 1
            },
            "typeReports": [
                {
                    "klass": "org.hisp.dhis.dataelement.DataElementCategoryOption",
                    "stats": {
                        "created": 1,
                        "updated": 0,
                        "deleted": 0,
                        "ignored": 0,
                        "total": 1
                    }
                }
            ]
        };

        unsuccessfullImportResponse = {
            "importParams": {
                "importMode": "COMMIT",
                "identifier": "UID",
                "preheatMode": "REFERENCE",
                "importStrategy": "CREATE_AND_UPDATE",
                "atomicMode": "ALL",
                "mergeMode": "REPLACE",
                "flushMode": "AUTO",
                "skipSharing": false,
                "skipValidation": false,
                "username": "admin"
            },
            "status": "ERROR",
            "stats": {
                "created": 0,
                "updated": 0,
                "deleted": 0,
                "ignored": 2,
                "total": 2
            },
            "typeReports": [
                {
                    "klass": "org.hisp.dhis.program.Program",
                    "stats": {
                        "created": 0,
                        "updated": 0,
                        "deleted": 0,
                        "ignored": 1,
                        "total": 1
                    },
                    "objectReports": [
                        {
                            "klass": "org.hisp.dhis.program.Program",
                            "index": 0,
                            "uid": "MslrqljzDcW",
                            "errorReports": [
                                {
                                    "message": "Missing required property `name`.",
                                    "mainKlass": "org.hisp.dhis.program.Program",
                                    "errorKlass": "java.lang.String",
                                    "errorProperty": "name",
                                    "errorCode": "E4000"
                                }
                            ]
                        }
                    ]
                },
                {
                    "klass": "org.hisp.dhis.dataelement.DataElementCategoryOption",
                    "stats": {
                        "created": 0,
                        "updated": 0,
                        "deleted": 0,
                        "ignored": 1,
                        "total": 1
                    },
                    "objectReports": [
                        {
                            "klass": "org.hisp.dhis.dataelement.DataElementCategoryOption",
                            "index": 0,
                            "errorReports": [
                                {
                                    "message": "Property `code` with value `2222332` on object 234234 [Jg6u9usyKgl] (DataElementCategoryOption) already exists on object ucZp3aEMfR5.",
                                    "mainKlass": "org.hisp.dhis.dataelement.DataElementCategoryOption",
                                    "mainId": "ucZp3aEMfR5",
                                    "errorProperty": "code",
                                    "errorCode": "E5003"
                                },
                                {
                                    "message": "Property `name` with value `234234` on object 234234 [Jg6u9usyKgl] (DataElementCategoryOption) already exists on object ucZp3aEMfR5.",
                                    "mainKlass": "org.hisp.dhis.dataelement.DataElementCategoryOption",
                                    "mainId": "ucZp3aEMfR5",
                                    "errorProperty": "name",
                                    "errorCode": "E5003"
                                },
                                {
                                    "message": "Property `shortName` with value `2422` on object 234234 [Jg6u9usyKgl] (DataElementCategoryOption) already exists on object ucZp3aEMfR5.",
                                    "mainKlass": "org.hisp.dhis.dataelement.DataElementCategoryOption",
                                    "mainId": "ucZp3aEMfR5",
                                    "errorProperty": "shortName",
                                    "errorCode": "E5003"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    });

    it('should return an object', () => {
        expect(getImportStatus(successfullImportResponse)).to.be.a('object');
    });

    it('should retain the original properties on success', () => {
        expect(getImportStatus(successfullImportResponse).typeReports).to.deep.equal(successfullImportResponse.typeReports)
        expect(getImportStatus(successfullImportResponse).stats).to.deep.equal(successfullImportResponse.stats);
        expect(getImportStatus(successfullImportResponse).importParams).to.deep.equal(successfullImportResponse.importParams);
        expect(getImportStatus(successfullImportResponse).status).to.deep.equal(successfullImportResponse.status);
    });

    it('should retain the original properties on failure', () => {
        expect(getImportStatus(unsuccessfullImportResponse).typeReports).to.deep.equal(unsuccessfullImportResponse.typeReports)
        expect(getImportStatus(unsuccessfullImportResponse).stats).to.deep.equal(unsuccessfullImportResponse.stats);
        expect(getImportStatus(unsuccessfullImportResponse).importParams).to.deep.equal(unsuccessfullImportResponse.importParams);
        expect(getImportStatus(unsuccessfullImportResponse).status).to.deep.equal(unsuccessfullImportResponse.status);
    });

    describe('isOk', () => {
        it('should be a function', () => {
            expect(getImportStatus(successfullImportResponse).isOk).to.be.a('function');
        });

        it('should return true when the import is successful', () => {
            expect(getImportStatus(successfullImportResponse).isOk()).to.be.true;
        });

        it('should return false when the import errored', () => {
            expect(getImportStatus(unsuccessfullImportResponse).isOk()).to.be.false;
        });
    });

    describe('typeReports', () => {
        it('should have a type report for each object on success', () => {
            expect(getImportStatus(successfullImportResponse).typeReports).to.have.length(1);
        });

        it('should have a type report for each object on failure', () => {
            expect(getImportStatus(unsuccessfullImportResponse).typeReports).to.have.length(2);
        });
    });

    describe('errorsPerObject', () => {
        it('should be an empty array on successful import', () => {
            expect(getImportStatus(successfullImportResponse).errorsPerObject).to.deep.equal([]);
        });

        it('should contain an object for each object that has errors', () => {
            expect(getImportStatus(unsuccessfullImportResponse).errorsPerObject).to.have.length(2);
        });

        it('should have the id for the program object', () => {
            expect(getImportStatus(unsuccessfullImportResponse).errorsPerObject[0].id).to.equal('MslrqljzDcW');
        });

        // TODO: The id a categoryOption can not be retrieved in a reliable way
        xit('should have the id for the categoryOption object', () => {
            expect(getImportStatus(unsuccessfullImportResponse).errorsPerObject[1].id).to.equal('Jg6u9usyKgl');
        });

        it('should have the errors group by property', () => {
            expect(getImportStatus(unsuccessfullImportResponse).errorsPerObject[1].errors).to.deep.equal({
                code: [{
                    "message": "Property `code` with value `2222332` on object 234234 [Jg6u9usyKgl] (DataElementCategoryOption) already exists on object ucZp3aEMfR5.",
                    "mainKlass": "org.hisp.dhis.dataelement.DataElementCategoryOption",
                    "mainId": "ucZp3aEMfR5",
                    "errorProperty": "code",
                    "errorCode": "E5003"
                }],
                name: [{
                    "message": "Property `name` with value `234234` on object 234234 [Jg6u9usyKgl] (DataElementCategoryOption) already exists on object ucZp3aEMfR5.",
                    "mainKlass": "org.hisp.dhis.dataelement.DataElementCategoryOption",
                    "mainId": "ucZp3aEMfR5",
                    "errorProperty": "name",
                    "errorCode": "E5003"
                }],
                shortName: [{
                    "message": "Property `shortName` with value `2422` on object 234234 [Jg6u9usyKgl] (DataElementCategoryOption) already exists on object ucZp3aEMfR5.",
                    "mainKlass": "org.hisp.dhis.dataelement.DataElementCategoryOption",
                    "mainId": "ucZp3aEMfR5",
                    "errorProperty": "shortName",
                    "errorCode": "E5003"
                }],
            });
        });
    });
});
