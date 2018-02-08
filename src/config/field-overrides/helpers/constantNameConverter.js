
/* Map to translate constants to something else in the UI.
*  Structured so that the same constant in one model may be translated
*  independently of others. */

const constantDisplayNameMap= {
    'program': { //model
        'programType': { //field
            'WITH_REGISTRATION': 'TRACKER_PROGRAM', //map model name to a new displayname
            'WITHOUT_REGISTRATION': 'EVENT_PROGRAM'
        }
    },
    'programNotificationTemplate': {
        'notificationTrigger': {
            'COMPLETION': 'Program_stage'
        }
    }
}

/**
 * Used to translate constants from a model to
 * something else in the UI.
 * The value returned should later be translated by i18n.
 *
 * Useful when we have e.g "WITH_REGISTRATION" in the model
 * but want to show "Tracker program" in the UI.
 *
 * @param modelType - Modeltype that should be
 * @param fieldName
 * @param constantVal
 * @returns {*} The "mapped" value of the constant, or the constant not found in the  not exist
 */
export function constantNameConverter(modelType, fieldName, constantVal) {
    return constantDisplayNameMap[modelType] && constantDisplayNameMap[modelType][fieldName] &&
        constantDisplayNameMap[modelType][fieldName][constantVal] || constantVal;
}

export default constantNameConverter;