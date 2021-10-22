const auths = Symbol('authorities');

/**
 * Simple wrapper class for the user authorities list
 *
 * @memberof module:current-user
 */
class UserAuthorities {
    /**
     * Creates the UserAuthorities object based off the given set of the user's authorities.
     *
     * @param {string[]} authorities A set of the user's authorities.
     */
    constructor(authorities = []) {
        this[auths] = new Set(authorities);
    }

    /**
     * Checks if the given authority is in the user's authority list.
     *
     * If the user has the 'ALL' authority any request for a authority will return `true`.
     *
     * @param {string} authority The authority to check for
     */
    has(authority) {
        if (this[auths].has('ALL')) {
            return true;
        }
        return this[auths].has(authority);
    }

    /**
     * Factory method for a UserAuthorities instance
     *
     * @param {string[]} authorities A set of the user's authorities as recieved from the api.
     */
    static create(authorities) {
        return new UserAuthorities(authorities);
    }
}

export default UserAuthorities;
