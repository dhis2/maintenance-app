/**
 * Formats the date to an ISO-formatted string (without z) where the timezone of date is ignored before conversion to UTC.
 * 
 * This is useful for date-selectors where we get information with timezone information,
 * but we are just interested in the date itself, and don't want the time to be adjusted when converting to UTC.
 * @param {Date} date - the date to convert to an ISO-formatted string without timezone information
 * @returns date formatted as ISO string without timezone information
 */ 
export const getISOFormatLocalTimestamp = date =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString().substring(0,23)
