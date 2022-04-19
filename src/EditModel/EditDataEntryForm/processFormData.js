import log from 'loglevel';

// TODO: write tests for processFormData

export const generateHtmlForId = (id, {
    styleAttr,
    disabledAttr,
    insertGrey,
    operands,
    totals,
    indicators,
}) => {
    const style = styleAttr ? ` style=${styleAttr}` : '';
    const disabled = disabledAttr || insertGrey ? ' disabled="disabled"' : '';

    if (id.includes('-')) {
        const label = operands && operands[id];
        const attr = `name="entryfield" title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
        return `<input id="${id}" ${attr}/>`;
    } else if (totals.hasOwnProperty(id)) {
        const label = totals[id];
        // TODO: `name="total"` is included twice - can we remove one of them or
        // would this break something?
        const attr = `name="total" readonly title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
        return `<input dataelementid="${id}" id="total${id}" name="total" ${attr}/>`;
    } else if (indicators.hasOwnProperty(id)) {
        const label = indicators[id];
        const attr = `name="indicator" readonly title="${label}" value="[ ${label} ]"${style}${disabled}`.trim();
        return `<input indicatorid="${id}" id="indicator${id}" ${attr}/>`;
    }

    log.warn('Failed to generate HTML for ID:', id);
    return '';
}


const dataElementCategoryOptionIdPattern = /id="(\w*?)-(\w*?)-val"/;
const dataElementPattern = /dataelementid="(\w{11})"/;
const indicatorPattern = /indicatorid="(\w{11})"/;

const getIdFromInputHtml = inputHtml => {
    const idMatch = dataElementCategoryOptionIdPattern.exec(inputHtml);
    const dataElementTotalMatch = dataElementPattern.exec(inputHtml);
    const indicatorMatch = indicatorPattern.exec(inputHtml);

    if (idMatch) {
        return `${idMatch[1]}-${idMatch[2]}-val`;
    } else if (dataElementTotalMatch) {
        return dataElementTotalMatch[1];
    } else if (indicatorMatch) {
        return indicatorMatch[1];
    }
}

const inputPattern = /<input.*?\/>/gi;

export const processFormData = ({
    formData,
    insertGrey,
    operands,
    totals,
    indicators,
}) => {
    const inHtml = formData.hasOwnProperty('htmlCode') ? formData.htmlCode : formData || '';
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

        const id = getIdFromInputHtml(inputHtml);
        if (id) {
            usedIds.push(id);
            outHtml += generateHtmlForId(id, {
                styleAttr: inputStyle,
                disabledAttr: inputDisabled,
                insertGrey,
                operands,
                totals,
                indicators,
            });
        } else {
            outHtml += inputHtml;
        }

        inputElement = inputPattern.exec(inHtml);
    }
    outHtml += inHtml.substr(inPos);

    return {
        usedIds,
        outHtml
    };
}
