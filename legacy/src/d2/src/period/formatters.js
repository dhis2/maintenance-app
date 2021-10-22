// For 'en': January 1, 2017
// For 'nl': 1 januari 2017
// For 'zh': 2017年1月1日
const localeDayFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

const getFormatterMemoized = (() => {
    const formatters = new Map();

    return (locale, options) => {
        if (formatters.has(locale) && formatters.get(locale).has(options)) {
            return formatters.get(locale).get(options);
        }
        const formatter = new Intl.DateTimeFormat(locale, options);

        formatters.set(locale, new Map([[options, formatter]]));

        return formatter;
    };
})();

export function toLocaleDayFormat(date, locale = 'en') { // eslint-disable-line import/prefer-default-export
    return getFormatterMemoized(locale, localeDayFormatOptions).format(date);
}
