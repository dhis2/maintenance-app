import { isEqual } from 'lodash/fp';

import {
    BEFORE_START_OF_REPORTING_PERIOD,
    BEFORE_END_OF_REPORTING_PERIOD,
    AFTER_START_OF_REPORTING_PERIOD,
    AFTER_END_OF_REPORTING_PERIOD,
    EVENT_DATE,
    ENROLLMENT_DATE,
} from '../field-overrides/program-indicator/enums';

export function defaultAnalyticsPeriodBoundaries(type, current) {
    const defaultProps = {
        enrollment: [
            {
                analyticsPeriodBoundaryType: AFTER_START_OF_REPORTING_PERIOD,
                boundaryTarget: ENROLLMENT_DATE,
            },
            {
                analyticsPeriodBoundaryType: BEFORE_END_OF_REPORTING_PERIOD,
                boundaryTarget: ENROLLMENT_DATE,
            },
        ],
        event: [
            {
                analyticsPeriodBoundaryType: AFTER_START_OF_REPORTING_PERIOD,
                boundaryTarget: EVENT_DATE,
            },
            {
                analyticsPeriodBoundaryType: BEFORE_END_OF_REPORTING_PERIOD,
                boundaryTarget: EVENT_DATE,
            },
        ],
    };

    function isNotDefault(val) {
        return !isEqual(val, defaultProps.event)
            && !isEqual(val, defaultProps.enrollment);
    }

    if (current && isNotDefault(current)) {
        return current;
    }

    return defaultProps[type];
}
