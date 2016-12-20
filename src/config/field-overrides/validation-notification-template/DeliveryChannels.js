import React, { PropTypes } from 'react';
import actions from '../../../EditModel/objectActions';
import CheckBox from '../../../forms/form-fields/check-box';
import SubFieldWrap from '../helpers/SubFieldWrap';
import { compose, map, get, curry, memoize } from 'lodash/fp';

// TODO: Move these out to D2?
const DELIVERY_CHANNELS = ['SMS', 'EMAIL'];

function createChangeHandler(model, deliveryChannel) {
    return function () {
        if (hasDeliveryChannel(model, deliveryChannel)) {
            actions.update({fieldName: 'deliveryChannels', value: model.deliveryChannels.filter(d => d !== deliveryChannel)});
        } else {
            actions.update({fieldName: 'deliveryChannels', value: model.deliveryChannels.concat([deliveryChannel])});
        }
    }
}

function hasDeliveryChannel(model, deliveryChannel) {
    return model.deliveryChannels && model.deliveryChannels.indexOf(deliveryChannel) >= 0;
}

const createDeliveryChannelCheckBox = memoize((deliveryChannel) => {
    function DeliveryChannelCheckBox({ model }, { d2 }) {
        return (
            <CheckBox
                labelText={d2.i18n.getTranslation(deliveryChannel.toLowerCase())}
                onChange={createChangeHandler(model, deliveryChannel)}
                value={hasDeliveryChannel(model, deliveryChannel)}
            />
        );
    }
    DeliveryChannelCheckBox.contextTypes = {
        d2: PropTypes.object,
    };

    return [deliveryChannel, DeliveryChannelCheckBox];
});

const renderDeliveryChannelCheckbox = curry((model, [deliveryChannel, DeliveryChannelCheckBox]) => (
    <DeliveryChannelCheckBox key={deliveryChannel} model={model} />
));

export default function DeliveryChannels({ model }) {
    const deliveryChannelCheckBoxes = map(compose(renderDeliveryChannelCheckbox(model), createDeliveryChannelCheckBox), DELIVERY_CHANNELS);

    return (
        <SubFieldWrap style={{ paddingTop: '1rem' }}>
            {deliveryChannelCheckBoxes}
        </SubFieldWrap>
    );
}