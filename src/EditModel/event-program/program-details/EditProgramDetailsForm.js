import React from 'react';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import Paper from 'material-ui/Paper/Paper';
import { createFieldConfigsFor } from '../../formHelpers';
import mapPropsStream from 'recompose/mapPropsStream';
import eventProgramStore from '../eventProgramStore';
import { get, noop } from 'lodash/fp';
import { editFieldChanged } from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const program$ = eventProgramStore
    .map(get('program'))
    .do(console.log.bind(console));

const mapDispatchToProps = (dispatch) => bindActionCreators({ editFieldChanged }, dispatch);

const enhance = compose(
    mapProps(props => ({
        groupName: props.params.groupName,
        modelType: props.schema,
        modelId: props.params.modelId })
    ),
    mapPropsStream(props$ => props$
        .combineLatest(program$, (props, model) => ({ ...props, model}))
    ),
    createFieldConfigsFor('program'),
    connect(null, mapDispatchToProps)
);

const styles = {
    paper: {
        padding: '3rem',
    },
};

function EditProgramDetailsForm({ fieldConfigs, editFieldChanged, detailsFormStatusChange = noop }) {
    return (
        <Paper style={styles.paper}>
            <FormBuilder
                fields={fieldConfigs}
                onUpdateField={editFieldChanged}
                onUpdateFormStatus={detailsFormStatusChange}
            />
        </Paper>
    );
}

export default enhance(EditProgramDetailsForm);
