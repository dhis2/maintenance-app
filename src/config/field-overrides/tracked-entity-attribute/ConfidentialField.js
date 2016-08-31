import React from 'react';
import switchOnBoolean from './switchOnBoolean';
import Checkbox from '../../../forms/form-fields/check-box';
import InfoMessage from './InfoMessage';

const ConfidentialField = switchOnBoolean(
    (props, { d2 }) => d2.system.systemInfo.encryption === true,
    Checkbox,
    () => (<InfoMessage message="confidentiality_option_not_available_since_encryption_is_not_configured" />)
);

export default ConfidentialField;
