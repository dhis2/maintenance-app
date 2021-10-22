import Api from '../api/Api';
import { isValidUid } from '../uid';

/**
 * @class GeoFeatures
 * @description
 * GeoFeatures class used to request organisation unit coordinates from the Web API.
 */
class GeoFeatures {
    /**
     * @constructor
     *
     * @param {Array} orgUnits Organisation units (UID, level, group, user org. unit) to include in the response.
     * @param {String} displayName The name property to display (NAME|SHORTNAME).
     */
    constructor(orgUnits = [], displayName) {
        this.orgUnits = orgUnits;
        this.displayName = displayName;
    }

    /**
     * @method byOrgUnit
     *
     * @param {Array} orgUnits Organisation units (UID, level, group, user org. unit) to include in the response.
     *
     * @returns {GeoFeatures}
     */
    byOrgUnit(orgUnits) {
        if (!orgUnits) {
            return this;
        }

        const orgUnitsArray = [].concat(orgUnits);

        if (!orgUnitsArray.every(GeoFeatures.isValidOrgUnit)) {
            throw new Error(`Invalid organisation unit: ${orgUnits}`);
        }

        return new GeoFeatures(orgUnitsArray, this.displayName);
    }

    /**
     * @method byOrgUnit
     *
     * @param {String} displayName The name property to display (NAME|SHORTNAME).
     *
     * @returns {GeoFeatures}
     */
    displayProperty(displayName) {
        if (!displayName) {
            return this;
        }

        if (!GeoFeatures.isValidDisplayName(displayName)) {
            throw new Error(`Invalid display property: ${displayName}`);
        }

        return new GeoFeatures(this.orgUnits, displayName);
    }

    /**
     * @method getAll
     *
     * @param {Object} params Extra URL params to pass to the Web API endpoint.
     *
     * @returns {Promise} with an array of geofeatures.
     */
    getAll(params = {}) {
        const api = Api.getApi();
        const urlParams = params;

        if (this.orgUnits.length) {
            urlParams.ou = `ou:${this.orgUnits.join(';')}`;
        }

        if (this.displayName) {
            urlParams.displayProperty = this.displayName;
        }

        return api.get('geoFeatures', urlParams);
    }

    /**
     * @method isValidOrgUnit
     * @static
     *
     * @returns {boolean} True if the org. unit is valid
     *
     * @description
     * Checks if the org. unit is valid (UID, level, group, user org. unit)
     */
    static isValidOrgUnit(orgUnit) {
        return (
            isValidUid(orgUnit) ||
            GeoFeatures.isValidOrgUnitLevel(orgUnit) ||
            GeoFeatures.isValidOrgUnitGroup(orgUnit) ||
            GeoFeatures.isValidUserOrgUnit(orgUnit)
        );
    }

    /**
     * @method isValidOrgUnitLevel
     * @static
     *
     * @returns {boolean} True if the org. unit level is valid
     *
     * @description
     * Checks if the org. unit level is valid.
     */
    static isValidOrgUnitLevel(level) {
        return /^LEVEL-[0-9]+$/.test(level);
    }

    /**
     * @method isValidOrgUnitGroup
     * @static
     *
     * @returns {boolean} True if the org. unit group is valid
     *
     * @description
     * Checks if the org. unit group is valid.
     */
    static isValidOrgUnitGroup(group) {
        const match = group.match(/OU_GROUP-(.*)$/);
        return Array.isArray(match) && isValidUid(match[1]);
    }

    /**
     * @method isValidUserOrgUnit
     * @static
     *
     * @returns {boolean} True if the user org. unit is valid
     *
     * @description
     * Checks if the user org. unit is valid.
     */
    static isValidUserOrgUnit(orgUnit) {
        return (
            orgUnit === GeoFeatures.USER_ORGUNIT ||
            orgUnit === GeoFeatures.USER_ORGUNIT_CHILDREN ||
            orgUnit === GeoFeatures.USER_ORGUNIT_GRANDCHILDREN
        );
    }

    /**
     * @method isValidDisplayName
     * @static
     *
     * @returns {boolean} True if display name is valid
     *
     * @description
     * Checks if the display name is valid.
     */
    static isValidDisplayName(displayName) {
        return (
            displayName === GeoFeatures.DISPLAY_PROPERTY_NAME ||
            displayName === GeoFeatures.DISPLAY_PROPERTY_SHORTNAME
        );
    }

    /**
     * @method getGeoFeatures
     * @static
     *
     * @returns {GeoFeatures} Object with interaction properties
     *
     * @description
     * Get a new instance of the GeoFeatures object.
     */
    static getGeoFeatures(...args) {
        return new GeoFeatures(...args);
    }

    static DISPLAY_PROPERTY_NAME = 'NAME';
    static DISPLAY_PROPERTY_SHORTNAME = 'SHORTNAME';
    static USER_ORGUNIT = 'USER_ORGUNIT';
    static USER_ORGUNIT_CHILDREN = 'USER_ORGUNIT_CHILDREN';
    static USER_ORGUNIT_GRANDCHILDREN = 'USER_ORGUNIT_GRANDCHILDREN';
}

export default GeoFeatures;
