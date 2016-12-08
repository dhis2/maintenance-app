import React from 'react';
import EditModel from './EditModel.component';
import { camelCaseToUnderscores } from 'd2-utilizr';
import FormHeading from './FormHeading';

export default function EditModelContainer(props) {
    const schema = props.params.modelType || 'organisationUnit';

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                <FormHeading schema={schema}>{camelCaseToUnderscores(schema)}</FormHeading>
            </div>
            <EditModel
                groupName={props.params.groupName}
                modelType={schema}
                modelId={props.params.modelId}
            />
        </div>
    );
}
