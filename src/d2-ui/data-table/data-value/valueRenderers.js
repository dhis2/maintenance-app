import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { isNil } from 'lodash/fp';
import Color from './Color.component';
import Translate from '../../i18n/Translate.component';

function TextValue({ value = '' }) {
    const textWrapStyle = {
        width: '100%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'absolute',
        wordBreak: 'break-all',
        wordWrap: 'break-word',
        top: 0,
        lineHeight: '50px',
        paddingRight: '1rem',
    };

    const displayValue = value.toString();

    return (<span title={displayValue} style={textWrapStyle} >{displayValue}</span>);
}

function getDateToShowInList(value, locale = 'en') {
    if (isNil(value)) {
        return '';
    }

    if (typeof global.Intl !== 'undefined' && Intl.DateTimeFormat) {
        return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value));
    }

    return value.substr(0, 19).replace('T', ' ');
}

class DateValue extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            uiLocale: 'en',
        };
    }

    componentDidMount() {
        // Get the locale from the userSettings
        this.context.d2.currentUser.userSettings
            .get('keyUiLocale')
            .then(uiLocale => this.setState({ uiLocale }));
    }

    render() {
        const displayDate = getDateToShowInList(this.props.value, this.state.uiLocale);

        return (
            <TextValue value={displayDate} />
        );
    }
}
DateValue.contextTypes = {
    d2: PropTypes.object,
};

function ObjectWithDisplayName(props) {
    const textValue = props.value && (props.value.displayName || props.value.name);
    return (<TextValue {...props} value={textValue} />);
}

const dhis2DateFormat = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{2,3}$/;
function isDateValue({ valueType, value }) {
    return valueType === 'DATE' || dhis2DateFormat.test(value);
}

function isColorValue({ value }) {
    return /#([a-z0-9]{6})$/i.test(value);
}

function isObjectWithDisplayName({ value }) {
    return value && (value.displayName || value.name);
}

function PublicAccessValue({ value }) {
    if (value) {
        const metaData = value.substr(0, 2);
        const data = value.substr(2, 2);
        const other = value.substr(4, 4);

        if (other === '----' && (data === '--' || data === 'r-' || data === 'rw')) {
            if (metaData === 'rw') {
                return <Translate>public_can_edit</Translate>;
            } else if (metaData === 'r-') {
                return <Translate>public_can_view</Translate>;
            } else if (metaData === '--') {
                return <Translate>public_none</Translate>;
            }
        }
    }

    return <TextValue value={value} />;
}

function isPublicAccess({ columnName }) {
    return columnName === 'publicAccess';
}

let valueRenderers = [
    [isPublicAccess, PublicAccessValue],
    [isDateValue, DateValue],
    [isObjectWithDisplayName, ObjectWithDisplayName],
    [isColorValue, Color],
];

/**
 * Register a new ValueRenderer. The value renderers are used to render different values in the DataTable. (e.g. colors should be rendered as a Color component).
 * The new renderer is added to the start of the renderer list. If your passed `checker` is too specific the `component` might be used for values that you might not want.
 * Passing `() => true` as a checker will result the passed `component` to be used for every value in the DataTable.
 *
 * @param {function} checker Check if the value is valid for the `component` to be rendered. This function receives an object with `value`, `valueType` and `columnName` that can be used to determine if this `component` should render the value.
 * @param {function} component A React component to render when the `checker` returns true. This is the component that will be returned from `findValueRenderer`.
 *
 * @returns {function} A de-register function to unregister the checker. If you want to remove the valueRenderer from the list of renderers you can use this function to undo the add.
 */
export function addValueRenderer(checker, component) {
    valueRenderers.unshift([checker, component]);

    /**
     * Un-register the valueRenderer
     */
    return function removeValueRenderer() {
        const rendererMap = new Map(valueRenderers);

        rendererMap.delete(checker);

        valueRenderers = Array.from(rendererMap);
    };
}

/**
 * This method is used by the DataTableRow component to find a ValueRenderer for the value that should be displayed in the table's cell.
 * It will recieve an object like the one below and loop through a list of renderers until it finds one that will handle this type of value.
 * ```json
 * {
 *   "value": "#FFFFFF",
 *   "valueType": "TEXT",
 *   "columnName": "color",
 * }
 * ```
 *
 * @param {object} valueDetails The value and its details. The object has the properties `columnName`, `value` and `valueType`.
 * @returns {function} The React component that can render a value for the passed `valueDetails`.
 */
export const findValueRenderer = (valueDetails) => {
    const valueCheckers = valueRenderers.map(([checker]) => checker);
    const checkerIndex = valueCheckers.findIndex(checker => checker(valueDetails));

    return (valueRenderers[checkerIndex] && valueRenderers[checkerIndex][1]) || TextValue;
};
