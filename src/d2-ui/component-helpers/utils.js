/**
 * @module lib/utils
 */


/**
 * Function to create CSS class names
 *
 * @param {String} name The base name
 * @param {String} selector string to append to the base name
 * @returns String
 */
export const createClassName = (name = '', selector = '') =>
    selector ? `${name} ${name}-${selector}` : name;
