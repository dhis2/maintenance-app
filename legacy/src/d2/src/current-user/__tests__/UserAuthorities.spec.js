import fixtures from '../../__fixtures__/fixtures';
import UserAuthorities from '../../current-user/UserAuthorities';

describe('UserAuthorities', () => {
    let authorities;
    let userAuthorities;

    beforeEach(() => {
        authorities = fixtures.get('/me/authorities');

        userAuthorities = UserAuthorities.create(authorities);
    });

    it('should return true if the user has an authority', () => {
        expect(userAuthorities.has('F_DATAVALUE_DELETE')).toBe(true);
    });

    it('should return false if the user does not have an authority', () => {
        expect(userAuthorities.has('F_DOCUMENT_PUBLIC_DELETE')).toBe(false);
    });

    it('should return true if the user does not have an authority but does have ALL', () => {
        userAuthorities = UserAuthorities.create(['F_DATAVALUE_DELETE', 'ALL']);

        expect(userAuthorities.has('F_DOCUMENT_PUBLIC_DELETE')).toBe(true);
    });

    it('should return false when asking for ALL and the user does not have it', () => {
        expect(userAuthorities.has('ALL')).toBe(false);
    });

    it('should return true when asking for ALL and the user has the authority', () => {
        userAuthorities = UserAuthorities.create(['F_DATAVALUE_DELETE', 'ALL']);

        expect(userAuthorities.has('ALL')).toBe(true);
    });
});
