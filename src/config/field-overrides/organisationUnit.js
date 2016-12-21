import React from 'react';
import CoordinateField from '../../forms/form-fields/coordinate-field';
import MultiSelect from '../../forms/form-fields/multi-select';
import systemSettingsStore from '../../App/systemSettingsStore';

function showHideBasedOnSystemSetting(systemSettingKey) {
    return function ShowHideBasedOnSystemSetting(props) {
        const systemSettings = systemSettingsStore.getState();

        if (systemSettings[systemSettingKey]) {
            return (
                <MultiSelect
                    {...props}
                />
            );
        }

        return <div />;
    }
}

export default new Map([
    [
        'coordinates', {
            component: CoordinateField,
            fieldOptions: {},
        },
    ],
    [
        'dataSets', {
            component: showHideBasedOnSystemSetting('keyAllowObjectAssignment')
        }
    ]
]);
