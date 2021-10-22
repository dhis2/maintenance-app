import MockApi from '../../api/Api';
import GeoFeatures from '../GeoFeatures';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

describe('GeoFeatures', () => {
    let geoFeatures;

    beforeEach(() => {
        geoFeatures = new GeoFeatures();
    });

    describe('getGeoFeatures', () => {
        it('should create an instance of GeoFeatures', () => {
            expect(GeoFeatures.getGeoFeatures()).toBeInstanceOf(GeoFeatures);
        });
    });

    describe('byOrgUnit', () => {
        it('should return an instance of GeoFeatures', () => {
            expect(geoFeatures.byOrgUnit()).toBeInstanceOf(GeoFeatures);
        });

        it('should add LEVEL-3 to the orgUnits array', () => {
            geoFeatures = geoFeatures.byOrgUnit('LEVEL-3');

            expect(geoFeatures.orgUnits).toContain('LEVEL-3');
        });

        it('should add LEVEL-3 and org unit to the orgUnits array', () => {
            geoFeatures = geoFeatures.byOrgUnit(['LEVEL-3', 'YuQRtpLP10I']);

            expect(geoFeatures.orgUnits).toEqual(['LEVEL-3', 'YuQRtpLP10I']);
        });

        it('should not add undefined to the orgUnits array', () => {
            geoFeatures = geoFeatures.byOrgUnit(undefined);

            expect(geoFeatures.orgUnits).not.toContain(undefined);
        });

        it('should throw when invalid uid', () => {
            expect(() => geoFeatures.byOrgUnit('invalid')).toThrow('Invalid organisation unit: invalid');
        });

        it('should throw when invalid org unit level format', () => {
            expect(() => geoFeatures.byOrgUnit('LEVEL-1b')).toThrow('Invalid organisation unit: LEVEL-1b');
        });

        it('should throw when invalid org unit group format', () => {
            expect(() => geoFeatures.byOrgUnit('OU_GROUP-invalid')).toThrow('Invalid organisation unit: OU_GROUP-invalid');
        });

        it('should throw when invalid user org unit', () => {
            expect(() => geoFeatures.byOrgUnit('SHORTNAMES')).toThrow('Invalid organisation unit: SHORTNAMES');
        });
    });

    describe('displayProperty', () => {
        it('should return an instance of GeoFeatures', () => {
            expect(geoFeatures.displayProperty()).toBeInstanceOf(GeoFeatures);
        });

        it('should set displayProperty to SHORTNAME', () => {
            geoFeatures = geoFeatures.displayProperty('SHORTNAME');

            expect(geoFeatures.displayName).toEqual('SHORTNAME');
        });

        it('should return the same instance when display property is undefined', () => {
            expect(geoFeatures.displayProperty(undefined)).toBe(geoFeatures);
        });

        it('should throw when invalid displayProperty', () => {
            expect(() => geoFeatures.displayProperty('invalid')).toThrow('Invalid display property: invalid');
        });
    });

    describe('getAll', () => {
        let mockApi;

        beforeEach(() => {
            mockApi = MockApi.getApi();
        });

        afterEach(() => {
            MockApi.mockReset();
        });

        it('should request geoFeature for one org. unit', () => {
            mockApi.get.mockReturnValue(Promise.resolve([]));

            geoFeatures = geoFeatures.byOrgUnit('YuQRtpLP10I').getAll();

            expect(mockApi.get).toBeCalledWith('geoFeatures', {
                ou: 'ou:YuQRtpLP10I',
            });
        });

        it('should request geoFeature for multiple org. units', () => {
            mockApi.get.mockReturnValue(Promise.resolve([]));

            geoFeatures = geoFeatures
                .byOrgUnit(['XuQRtpLP10I', 'YuQRtpLP10I'])
                .getAll();

            expect(mockApi.get).toBeCalledWith('geoFeatures', {
                ou: 'ou:XuQRtpLP10I;YuQRtpLP10I',
            });
        });

        it('should request geoFeature using uid and SHORTNAME display property', () => {
            mockApi.get.mockReturnValue(Promise.resolve([]));

            geoFeatures = geoFeatures
                .byOrgUnit('YuQRtpLP10I')
                .displayProperty('SHORTNAME')
                .getAll();

            expect(mockApi.get).toBeCalledWith('geoFeatures', {
                ou: 'ou:YuQRtpLP10I',
                displayProperty: 'SHORTNAME',
            });
        });

        it('should request geoFeature using uid and extra URL parameter', () => {
            mockApi.get.mockReturnValue(Promise.resolve([]));

            geoFeatures = geoFeatures
                .byOrgUnit('YuQRtpLP10I')
                .getAll({
                    includeGroupSets: true,
                });

            expect(mockApi.get).toBeCalledWith('geoFeatures', {
                ou: 'ou:YuQRtpLP10I',
                includeGroupSets: true,
            });
        });

        it('should return an array of geoFeatures', () => {
            mockApi.get.mockReturnValue(Promise.resolve([
                {
                    id: 'YuQRtpLP10I',
                },
            ]));

            // Async test
            return geoFeatures.byOrgUnit('YuQRtpLP10I').getAll().then((features) => {
                expect(features).toEqual([
                    {
                        id: 'YuQRtpLP10I',
                    },
                ]);
            });
        });

        it('should reject the promise with an error if a wrong org. unit has been requested', (done) => {
            mockApi.get.mockReturnValue(Promise.reject());

            return geoFeatures.byOrgUnit('LEVEL-20').getAll().then(() => {
                throw new Error('this should have failed');
            }).catch(() => done());
        });
    });
});
