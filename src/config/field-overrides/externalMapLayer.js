import DropDown from '../../forms/form-fields/drop-down';
import TextField from '../../forms/form-fields/text-field';
import SubFieldWrap from './helpers/SubFieldWrap';
import actions from '../../EditModel/objectActions';
import { isUrl } from '@dhis2/d2-ui-forms/Validators';
import { addD2Context } from '@dhis2/d2-ui-core';

export default new Map([
    ['imageFormat', {
        component: addD2Context((props, { d2 }) => (props.model.mapService === 'WMS' ?
            <SubFieldWrap>
                <DropDown
                    labelText={props.labelText}
                    options={props.options}
                    value={props.model.imageFormat}
                    onChange={(e) => { actions.update({ fieldName: 'imageFormat', value: e.target.value }); }}
                    isRequired
                    style={{ width: '97.5%' }}
                />
                <div style={{ clear: 'both' }} />
                <TextField
                    labelText={d2.i18n.getTranslation('layers')}
                    value={props.model.layers || ''}
                    onChange={(e) => { actions.update({ fieldName: 'layers', value: e.target.value }); }}
                    style={{ width: '97.5%' }}
                />
            </SubFieldWrap> : null)),
    }],
    ['url', { validators: [{ validator: isUrl, message: isUrl.message }] }],
    ['legendSetUrl', { validators: [{ validator: isUrl, message: isUrl.message }] }],
    ['mapLayerPosition', { required: true }],
]);
