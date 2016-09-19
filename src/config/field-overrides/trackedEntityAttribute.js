import React, { Component } from 'react';
import Checkbox from '../../forms/form-fields/check-box';
import DropDown from '../../forms/form-fields/drop-down';
import DropDownAsync from '../../forms/form-fields/drop-down-async';
import { get, compose, curry } from 'lodash/fp';
import actions from '../../EditModel/objectActions';
import TextField from '../../forms/form-fields/text-field';
import ConfidentialField from './tracked-entity-attribute/ConfidentialField';
import switchOnBoolean from './helpers/switchOnBoolean';
import withD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import withSkipLogic from './helpers/withSkipLogic';
import SubFieldWrap from './helpers/SubFieldWrap';

const isUniqueInSystem = (trackedEntityAttribute) => (trackedEntityAttribute.orgunitScope === false || trackedEntityAttribute.orgunitScope === undefined) &&
    (trackedEntityAttribute.programScope === false || trackedEntityAttribute.programScope === undefined);
const isUniqueInOrgUnit = (trackedEntityAttribute) => trackedEntityAttribute.orgunitScope === true && (trackedEntityAttribute.programScope === false || trackedEntityAttribute.programScope === undefined);

const getUniqueInDropDownValueFromTrackedEntityAttribute = (trackedEntityAttribute) => {
    if (isUniqueInSystem(trackedEntityAttribute)) {
        return 'entire_system';
    }

    if (isUniqueInOrgUnit(trackedEntityAttribute)) {
        return 'organisation_unit';
    }
};

const updateValueForField = curry((fieldName, value) => {
    actions.update({
        fieldName,
        value,
    });
});

const GenerateFields = (props, context) => {
    return (
        <div>
            <Checkbox
                onChange={compose(() => updateValueForField('pattern', ''), updateValueForField('generated'), get('target.value'))}
                labelText={context.d2.i18n.getTranslation('generated')}
                value={props.model.generated}
            />
            {props.model.generated ? <TextField
                labelText={context.d2.i18n.getTranslation('pattern')}
                value={props.model.pattern}
                hintText="########"
                onChange={compose(updateValueForField('pattern'), get('target.value'))}
            /> : null}
        </div>
    );
};

GenerateFields.contextTypes = {
    d2: React.PropTypes.object,
};

const UniqueSubFields = (props, context) => {
    const uniqueWithinOption = [
        {
            text: 'entire_system',
            value: 'entire_system',
        }, {
            text: 'organisation_unit',
            value: 'organisation_unit',
        }
    ];

    const GenerateFieldsSwitch = switchOnBoolean((props) => isUniqueInSystem(props.model), GenerateFields);

    return (
        <SubFieldWrap>
            <DropDown
                options={uniqueWithinOption}
                translateOptions
                isRequired
                value={getUniqueInDropDownValueFromTrackedEntityAttribute(props.model)}
                onChange={compose((value) => {
                            if (value === 'organisation_unit') {
                                actions.update({fieldName: 'orgunitScope', value: true });
                            }

                            if (value === 'entire_system') {
                                actions.update({fieldName: 'orgunitScope', value: false });
                            }
                        }, get('target.value'))}
            />
            <GenerateFieldsSwitch {...props} />
        </SubFieldWrap>
    );
};

const TrackedEntityField = withD2Context((props, { d2 }) => { return (
    <SubFieldWrap>
        <DropDownAsync
            labelText={d2.i18n.getTranslation('tracked_entity')}
            referenceType="trackedEntity"
            value={props.model.trackedEntity}
            onChange={compose((value) => actions.update({fieldName: 'trackedEntity', value, }), get('target.value'))}
        />
    </SubFieldWrap>
)});

export default new Map([
    ['unique', {
        component: withSkipLogic((props) => props.value === true, UniqueSubFields, Checkbox),
    }],
    ['aggregationType', {
        fieldOptions: {
            options: [
                'SUM',
                'AVERAGE',
                'COUNT',
                'STDDEV',
                'VARIANCE',
                'MIN',
                'MAX',
                'NONE',
                'AVERAGE_SUM_ORG_UNIT',
            ]
        }
    }],
    ['confidential', {
        component: ConfidentialField,
    }],
    ['valueType', {
        component: withSkipLogic((props) => props.value === 'TRACKER_ASSOCIATE', TrackedEntityField, DropDown),
    }],
]);
