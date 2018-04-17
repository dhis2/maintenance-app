import log from 'loglevel';

const inputPattern = /<input.*?\/>/gi;

/* AttributeIdPattern is used in tracker-programs Custom registration forms
   programIdPattern is used in tracker-programs Custom registration forms
        Fixed to incidentDate and enrollmentDate
* combinedIdPattern is used for:
*   - Event-programs data entry form (dataElementId-categoryOptionId)
*   - Tracker-programs Data entry form (programStageId-dataElementId)*/
export const elementPatterns = {
    programid: /attributeid="(\w*?)"/,
    attributeid: /programid="(\w*?)"/,
    id: /id="(\w*?)-(\w*?)-val"/
}

const fieldTypes = {
    'programid': 'programid',
    'attributeid': 'attributeid',
    'id': 'id'
}

const allPatterns = /attributeid="(\w*?)"|programid="(\w*?)"|id="(\w*?)-(\w*?)-val"/

const matchIndexes = {
    'attributeid': 1,
    'programid': 3,
    'id': ''
}


//These elements are static for Custom Registration Form
const staticElements = [
    'incidentDate',
    'enrollmentDate'
]

export function generateHtmlForField(id, styleAttr, disabledAttr, label, nameAttr = "entryfield", fieldType='id') {
    const style = styleAttr ? ` style=${styleAttr}` : '';
    const disabled = disabledAttr ? ` disabled=${disabledAttr}` : '';

    const attr = `name="${nameAttr}" title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
    console.log(attr)
    console.log("FIELDTYPE", fieldType)
    return `<input ${fieldType}="${id}" ${attr}/>`;

}

/* Operands with ID's that contain a dot ('.') are a combined IDs of two objects.
 The API returns ie. "dataElementId.categoryOptionId", which are transformed to the format expected by
 custom forms: "dataElementId-categoryOptionId-val"
    This is used for programStageId-dataElementId for Tracker-programs.
    And dataElementId-categoryOptionId for event-programs
 */
export function transformElementsToCustomForm(elements) {
    elements
        .filter(op => op.id.indexOf('.') !== -1)
        .reduce((out, op) => {
            const id = `${op.id.split('.').join('-')}-val`;
            out[id] = op.displayName; // eslint-disable-line
            return out;
        }, {});
}

export function processFormData(formData, elements, idPattern) {
    const inHtml = formData;
    let outHtml = '';

    const usedIds = [];
    idPattern = elementPatterns.attributeid
    let inputElement = inputPattern.exec(inHtml);
    let inPos = 0;
    while (inputElement !== null) {
        outHtml += inHtml.substr(inPos, inputElement.index - inPos);
        inPos = inputPattern.lastIndex;
        const fieldType = elementPatterns.attributeid
        const inputHtml = inputElement[0];
        const inputStyle = (/style="(.*?)"/.exec(inputHtml) || ['', ''])[1];
        const inputDisabled = /disabled/.exec(inputHtml) !== null;

        const idMatch = idPattern.exec(inputHtml);
        const allMatch = allPatterns.exec(inputHtml);
        console.log(allMatch)
        console.log(idMatch)
        if (idMatch) {
         //   console.log(idMatch);
            const id = idMatch.length > 2 ? `${idMatch[1]}-${idMatch[2]}-val` : `${idMatch[1]}`;
            usedIds.push(id);
            const label = elements && elements[id];
            outHtml += generateHtmlForField(id, inputStyle, inputDisabled, label, undefined, fieldType);
        } else {
            outHtml += inputHtml;
        }

        inputElement = inputPattern.exec(inHtml);
    }
    outHtml += inHtml.substr(inPos);
    //console.log(outHtml)
    return {
        usedIds,
        outHtml
    }
}

/**
 * Helper to bind the keys of an object to given function
 * So that multiple elements can be bound to the same function.
 * The first parameter of each bound function will be the key.
 * @param obj Object with keys to bind
 * @param func Function to bind each key to
 * @param selfArg this context of the function
 * @param extraArgs An object of extra arguments
 * @returns {{}} - And object where each property is a bound function
 */
export function bindFuncsToKeys(obj, func, selfArg, extraArgs) {
    const boundFuncs = {};
    Object.keys(obj).forEach((x) => {
        boundFuncs[x] = func.bind(selfArg, x, extraArgs);
    });
    return boundFuncs;
}

export function insertElement(id, label, editor, fieldType = 'id') {
    console.log(fieldType)
    const elementHtml = generateHtmlForField(id, null, null, label, undefined, fieldType);
    console.log("ElementHTML", elementHtml);
    editor.insertHtml(elementHtml, 'unfiltered_html');
    // Move the current selection to just after the newly inserted element
    const range = editor.getSelection().getRanges()[0];
    console.log(range)
    range && range.moveToElementEditablePosition(range.endContainer, true);
}

export function insertFlag(img, editor) {
    editor.insertHtml(`<img src="../dhis-web-commons/flags/${img}" />`, 'unfiltered_html');
    const range = editor.getSelection().getRanges()[0];
    range && range.moveToElementEditablePosition(range.endContainer, true);
}