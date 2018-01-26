import { hashHistory } from 'react-router';

export function goToRoute(url) {
    hashHistory.push(url);
}

export function goToAndScrollUp(url) {
    goToRoute(url);
    global.scrollTo && global.scrollTo(0, 0);
}

export function goBack() {
    hashHistory.goBack();
}

/**
 * @param {Object} query
 */
export const addQuery = (query) => {
    const location = Object.assign({}, hashHistory.getCurrentLocation());
    Object.assign(location.query, query);
    hashHistory.push(location);
};

/**
 * @param {...String} queryNames
 */
export const removeQuery = (...queryNames) => {
    const location = Object.assign({}, hashHistory.getCurrentLocation());
    queryNames.forEach(q => delete location.query[q]);
    hashHistory.push(location);
};
