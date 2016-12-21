import React, { PropTypes } from 'react';
import actions from '../../../EditModel/objectActions';
import CheckBox from '../../../forms/form-fields/check-box';
import MultiSelect from '../../../forms/form-fields/multi-select';
import SubFieldWrap from '../helpers/SubFieldWrap';
import { compose, get } from 'lodash/fp';

export default function UserGroupRecipientFields({ model }, { d2 }) {
    return (
        <SubFieldWrap>
            <MultiSelect
                referenceType="userGroup"
                referenceProperty="recipientUserGroups"
                model={model}
                labelText={d2.i18n.getTranslation('recipient_user_groups')}
                onChange={compose((value) => actions.update({fieldName: 'recipientUserGroups', value, }), get('target.value'))}
                value={model.recipientUserGroups}
            />
            <CheckBox
                onChange={compose(value => actions.update({fieldName: 'notifyUsersInHierarchyOnly', value, }), get('target.value'))}
                labelText={d2.i18n.getTranslation('notify_users_in_hierarchy_only')}
                value={model.notifyUsersInHierarchyOnly}
            />
        </SubFieldWrap>
    );
}
UserGroupRecipientFields.contextTypes = {
    d2: PropTypes.object,
};
