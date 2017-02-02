import IconButton from 'material-ui/IconButton';
import inlineHelpMapping from '../config/inlinehelp-mapping';
import { camelCaseToUnderscores } from 'd2-utilizr';

/**
 * Returns the "version" of the documentation that corresponds with the current dhis2 version.
 *
 * @param {Object} version - The version definition as provided by d2.system.version.
 * @param {number} version.minor - The minor dhis2 version. e.g. The 25 in 2.25.
 * @param {boolean} version.snapshot - True when the current version is the snapshot(master/development) branch.
 *
 * @returns {string} `master` for a snapshot branch. `25` for 2.25 etc.
 */
function getDocsVersion({ major, minor, snapshot }) {
    if (snapshot) {
        return 'master';
    }
    return `${major}.${minor}`;
}

/**
 * Attempts to find a help link as defined in the inlinehelp-mapping.js It will always pick the first match that it finds.
 * The search is done using a regular expression that matches the path from the start. This means that paths that are longer/dynamic can still show help links.
 *
 * For example a help link key that is defined as  `/edit/dataElementSection/dataElement` would show up on both `/edit/dataElementSection/dataElement/add` and `/edit/dataElementSection/dataElement/wap68IYzTXr`.
 *
 * @param {string} path The current path/route that the browser is on. This is the path that the help link should be used for.
 * @param {string} schema The name of the schema to find help for.
 *
 * @returns {string} The partial path that the refers to the help content in the documentation.  e.g. `/en/user/html/manage_org_unit.html`
 */
function findHelpLinkForPath(path, schema) {
    const variablesToReplace = new Map([
        ['objectType', schema],
    ]);

    const variablesToReplaceCamel = new Map([
        ['objectType', camelCaseToUnderscores(schema)]
    ]);

    const firstRouteWithHelpLink = Object.keys(inlineHelpMapping)
        .find(key => {
            const pathToMatch = getReplacedPath(key, variablesToReplace);

            return (new RegExp(pathToMatch)).test(path);
        });

    if (firstRouteWithHelpLink && inlineHelpMapping[firstRouteWithHelpLink]) {
        return getReplacedPath(inlineHelpMapping[firstRouteWithHelpLink], variablesToReplaceCamel);
    }

    return '';
}

function getReplacedPath(key, variablesToReplace) {
    const placeholder = /\$\{(.+?)\}/g;

    return key.replace(placeholder, function (match, variable, fullstring) {
        if (variablesToReplace.has(variable) && variablesToReplace.get(variable)) {
            return variablesToReplace.get(variable);
        }
        return '.+?';
    });
}

export default function HelpLink({ schema }, { d2 }) {
    const path = window.location.hash
        .replace(/^#/, '') // Remove leading hash
        .replace(/\?.+?$/, ''); // Remove query param/cache breaker

    const docsLink = `https://ci.dhis2.org/docs/${getDocsVersion(d2.system.version)}`;
    const helpLink = findHelpLinkForPath(path, schema);

    if (helpLink) {
        return (
            <IconButton
                href={`${docsLink}${helpLink}`}
                target="_blank"
                rel="noopener noreferrer"
                tooltip={d2.i18n.getTranslation('open_user_guide')}
                tooltipPosition="bottom-center"
                iconClassName="material-icons"
                >
                help_outline
            </IconButton>
        )
    }

    return null;
}
HelpLink.contextTypes = {
    d2: React.PropTypes.object,
}
