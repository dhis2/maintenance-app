import fixtures from '../../__fixtures__/fixtures';
import CurrentUser from '../../current-user/CurrentUser';
import UserAuthorities from '../../current-user/UserAuthorities';
import UserSettings from '../../current-user/UserSettings';
import { noCreateAllowedFor } from '../../defaultConfig';

describe('CurrentUser', () => {
    let currentUser;
    let userData;
    let modelDefinitions;
    let mockUserAuthorities;

    beforeEach(() => {
        modelDefinitions = {
            userGroup: {
                list: jest.fn().mockReturnValue(Promise.resolve([])),
                authorities: [
                    {
                        type: 'CREATE_PUBLIC',
                        authorities: ['F_USERGROUP_PUBLIC_ADD'],
                    },
                ],
            },
            userRole: {
                list: jest.fn().mockReturnValue(Promise.resolve([])),
            },
            organisationUnit: {
                list: jest.fn().mockReturnValue(Promise.resolve([])),
                authorities: [
                    {
                        type: 'CREATE',
                        authorities: [
                            'F_ORGANISATIONUNIT_ADD',
                        ],
                    }, {
                        type: 'DELETE',
                        authorities: [
                            'F_ORGANISATIONUNIT_DELETE',
                        ],
                    },
                ],
            },
            organisationUnitLevel: {
                authorities: [{ type: 'UPDATE', authorities: ['F_ORGANISATIONUNITLEVEL_UPDATE'] }],
            },
            categoryOptionCombo: {
                name: 'categoryOptionCombo',
                authorities: [
                    {
                        type: 'CREATE',
                        authorities: [
                            'F_CATEGORY_COMBO_PUBLIC_ADD',
                            'F_CATEGORY_COMBO_PRIVATE_ADD',
                        ],
                    }, {
                        type: 'DELETE',
                        authorities: [
                            'F_CATEGORY_COMBO_DELETE',
                        ],
                    },
                ],
            },
        };

        noCreateAllowedFor.clear();
        noCreateAllowedFor.add('categoryOptionCombo');

        userData = fixtures.get('/me');
        jest.spyOn(UserAuthorities, 'create');
        mockUserAuthorities = [
            'F_ORGANISATIONUNIT_ADD',
            'F_ORGANISATIONUNIT_DELETE',
            'F_ORGANISATIONUNITLEVEL_UPDATE',
            'F_USERGROUP_PUBLIC_ADD',
            'F_CATEGORY_COMBO_PRIVATE_ADD',
        ];
        currentUser = CurrentUser.create(userData, mockUserAuthorities, modelDefinitions);
    });

    it('should be an instance of CurrentUser', () => {
        expect(currentUser).toBeInstanceOf(CurrentUser);
    });

    it('should contain an instance of UserSettings', () => {
        expect(currentUser.userSettings).toBeInstanceOf(UserSettings);
    });

    it('should have an authorities property', () => {
        expect(currentUser.authorities).toBeInstanceOf(UserAuthorities);
    });

    describe('create', () => {
        it('should call create on UserAuthorities with the user authorities array', () => {
            expect(UserAuthorities.create).toBeCalledWith(mockUserAuthorities);
        });
    });

    describe('properties', () => {
        it('should have set the properties from the data object', () => {
            expect(currentUser.name).toBe('John Traore');
            expect(currentUser.jobTitle).toBe('Super user');
        });

        it('should not override the authorities property', () => {
            currentUser = CurrentUser.create({ authorities: [] }, ['ALL'], modelDefinitions);
            expect(currentUser.authorities).toBeInstanceOf(UserAuthorities);
        });
    });

    describe('userCredentials', () => {
        it('should set the userCredentials properties onto the currentUser object', () => {
            expect(currentUser.username).toBe('admin');
        });

        it('should not set the userCredentials property onto the currentUser', () => {
            expect(currentUser.userCredentials).toBeUndefined();
        });

        it('should not modify the passed data object', () => {
            expect(userData.userCredentials).toBeDefined();
        });

        it('should keep the created date of the orignal user object', () => {
            expect(currentUser.created).toBe('2013-04-18T15:15:08.407+0000');
        });
    });

    describe('reference and collection properties', () => {
        it('userGroups should not exist', () => {
            expect(currentUser.userGroups).toBeUndefined();
        });

        it('userRoles should not exist', () => {
            expect(currentUser.userRoles).toBeUndefined();
        });

        it('organisationUnits should not exist', () => {
            expect(currentUser.organisationUnits).toBeUndefined();
        });

        it('dataViewOrganisationUnits should not exist', () => {
            expect(currentUser.dataViewOrganisationUnits).toBeUndefined();
        });
    });

    describe('getUserGroups', () => {
        it('should return a promise', () => {
            expect(currentUser.getUserGroups()).toBeInstanceOf(Promise);
        });

        it('should be called with the userGroup ids', () => {
            currentUser.getUserGroups();

            expect(modelDefinitions.userGroup.list)
                .toBeCalledWith({ filter: ['id:in:[vAvEltyXGbD,wl5cDMuUhmF,QYrzIjSfI8z,jvrEwEJ2yZn]'], paging: false });
        });
    });

    describe('getUserRoles', () => {
        it('should return a promise', () => {
            expect(currentUser.getUserRoles()).toBeInstanceOf(Promise);
        });

        it('should be called with the userRole ids', () => {
            currentUser.getUserRoles();

            expect(modelDefinitions.userRole.list).toBeCalledWith({ filter: ['id:in:[Ufph3mGRmMo]'], paging: false });
        });
    });

    describe('getOrganisationUnits', () => {
        it('should return a promise', () => {
            expect(currentUser.getOrganisationUnits()).toBeInstanceOf(Promise);
        });

        it('should be called with organisationUnit ids', () => {
            currentUser.getOrganisationUnits();

            expect(modelDefinitions.organisationUnit.list)
                .toBeCalledWith({
                    fields: ':all,displayName,path,children[id,displayName,path,children::isNotEmpty]',
                    filter: ['id:in:[ImspTQPwCqd]'],
                    paging: false,
                });
        });
    });

    describe('getDataViewOrganisationUnits', () => {
        it('should return a promise', () => {
            expect(currentUser.getDataViewOrganisationUnits()).toBeInstanceOf(Promise);
        });

        it('should be called with organisationUnit ids', () => {
            currentUser.getDataViewOrganisationUnits();

            expect(modelDefinitions.organisationUnit.list)
                .toBeCalledWith({
                    fields: ':all,displayName,path,children[id,displayName,path,children::isNotEmpty]',
                    filter: ['id:in:[]'],
                    paging: false,
                });
        });
    });

    describe('canCreate', () => {
        it('should return false if the no model is passed', () => {
            expect(currentUser.canCreate()).toBe(false);
        });

        it('should return false for userRole', () => {
            expect(currentUser.canCreate(modelDefinitions.userRole)).toBe(false);
        });

        it('should return true for organisationUnit', () => {
            expect(currentUser.canCreate(modelDefinitions.organisationUnit)).toBe(true);
        });

        it('should return for userGroup', () => {
            expect(currentUser.canCreate(modelDefinitions.userGroup)).toBe(true);
        });

        it('should return false when the modelDefinition is in the noCreateAllowedFor list', () => {
            expect(currentUser.canCreate(modelDefinitions.categoryOptionCombo)).toBe(false);
        });
    });

    describe('canDelete', () => {
        it('should return false if the no model is passed', () => {
            expect(currentUser.canDelete()).toBe(false);
        });

        it('should return false for userGroup', () => {
            expect(currentUser.canDelete(modelDefinitions.userGroup)).toBe(false);
        });

        it('should return true for organisationUnit', () => {
            expect(currentUser.canDelete(modelDefinitions.organisationUnit)).toBe(true);
        });
    });

    describe('canUpdate', () => {
        it('should return false if no model is passed', () => {
            expect(currentUser.canUpdate()).toBe(false);
        });

        it('should return false for userRole', () => {
            expect(currentUser.canCreate(modelDefinitions.userRole)).toBe(false);
        });

        it('should return true for userGroup', () => {
            expect(currentUser.canUpdate(modelDefinitions.userGroup)).toBe(true);
        });

        it('should return true for organisationUnitLevel', () => {
            expect(currentUser.canUpdate(modelDefinitions.organisationUnitLevel)).toBe(true);
        });
    });

    describe('canCreatePublic', () => {
        it('should return false if no model is passed', () => {
            expect(currentUser.canCreatePublic()).toBe(false);
        });

        it('should return false for userGroup', () => {
            expect(currentUser.canCreatePublic(modelDefinitions.userGroup)).toBe(true);
        });

        it('should return false for userGroup ' +
            'even when the user has the authority due to the presence in the ignore list', () => {
            noCreateAllowedFor.add('userGroup');

            expect(currentUser.canCreatePrivate(modelDefinitions.userGroup)).toBe(false);
        });
    });

    describe('canCreatePrivate', () => {
        it('should return false if no model is passed', () => {
            expect(currentUser.canCreatePrivate()).toBe(false);
        });

        it('should return false for userGroup', () => {
            expect(currentUser.canCreatePrivate(modelDefinitions.userGroup)).toBe(false);
        });
    });
});
