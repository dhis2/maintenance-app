import React from 'react';
import DropDown from '../../forms/form-fields/drop-down';
import SubFieldWrap from './helpers/SubFieldWrap';
import actions from '../../EditModel/objectActions';
import { isUrl } from 'd2-ui/lib/forms/Validators';

export default new Map([
    ['imageFormat', {
        component: (props) => {
            return props.model.mapService === 'WMS' ?
                <SubFieldWrap>
                    <DropDown
                        labelText={props.labelText}
                        options={props.options}
                        value={props.model.imageFormat}
                        onChange={(e) => { actions.update({ fieldName: 'imageFormat', value: e.target.value }); }}
                        isRequired
                    />
                </SubFieldWrap> : null
        },
    }],
    ['url', { validators: [{ validator: isUrl, message: isUrl.message }] }],
    ['legendSetUrl', { validators: [{ validator: isUrl, message: isUrl.message }] }],
    ['mapLayerPosition', { required: true }],
])
