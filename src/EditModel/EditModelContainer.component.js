import React from 'react';
import EditModel from './EditModel.component';
import { camelCaseToUnderscores } from 'd2-utilizr';
import FormHeading from './FormHeading';

export default function EditModelContainer(props) {
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                <FormHeading>{camelCaseToUnderscores(props.params.modelType || 'organisationUnit')}</FormHeading>
            </div>
            <EditModel
                groupName={props.params.groupName}
                modelType={props.params.modelType || 'organisationUnit'}
                modelId={props.params.modelId}
            />
        </div>
    );
}
