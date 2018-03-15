import log from 'loglevel';

const inputPattern = /<input.*?\/>/gi;

export const elementPatterns = {
    attributeIdPattern: /attributeid="(\w*?)"/,
    programIdPattern: /programid="(\w*?)"/,
    dataElementCategoryOptionIdPattern: /id="(\w*?)-(\w*?)-val"/
}

export function generateHtmlForField(id, styleAttr, disabledAttr, label, nameAttr = "entryfield") {
    const style = styleAttr ? ` style=${styleAttr}` : '';
    const disabled = disabledAttr ? ` disabled=${disabledAttr}` : '';

    const attr = `name="${nameAttr}" title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
    return `<input id="${id}" ${attr}/>`;

}

export function processFormData(formData, elements, idPattern) {
    const inHtml = formData;
    let outHtml = '';

    const usedIds = [];

    let inputElement = inputPattern.exec(inHtml);
    let inPos = 0;
    while (inputElement !== null) {
        outHtml += inHtml.substr(inPos, inputElement.index - inPos);
        inPos = inputPattern.lastIndex;

        const inputHtml = inputElement[0];
        const inputStyle = (/style="(.*?)"/.exec(inputHtml) || ['', ''])[1];
        const inputDisabled = /disabled/.exec(inputHtml) !== null;

        const idMatch = idPattern.exec(inputHtml);

        if (idMatch) {
            console.log(idMatch);
            const id = idMatch.length > 2 ? `${idMatch[1]}-${idMatch[2]}-val` : `${idMatch[1]}`;
            usedIds.push(id);
            const label = elements && elements[id];
            outHtml += generateHtmlForField(id, inputStyle, inputDisabled, label);
        } else {
            outHtml += inputHtml;
        }

        inputElement = inputPattern.exec(inHtml);
    }
    outHtml += inHtml.substr(inPos);
    console.log(outHtml)
    return {
        usedIds,
        outHtml
    }
}

export function bindFuncsToKeys(obj, func, selfArg) {
    const boundFuncs = {};
    Object.keys(obj).forEach((x) => {
        boundFuncs[x] = func.bind(selfArg, x);
    });
    return boundFuncs;
}

export function insertElement(id, label, editor) {
    editor.insertHtml(generateHtmlForField(id, null, null, label), 'unfiltered_html');
    // Move the current selection to just after the newly inserted element
    const range = editor.getSelection().getRanges()[0];
    range.moveToElementEditablePosition(range.endContainer, true);
}