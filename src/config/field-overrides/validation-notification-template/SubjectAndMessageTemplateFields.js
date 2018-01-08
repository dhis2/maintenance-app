import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField/TextField';
import Row from 'd2-ui/lib/layout/Row.component';
import Column from 'd2-ui/lib/layout/Column.component';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Heading from 'd2-ui/lib/headings/Heading.component';
import { map, compose } from 'lodash/fp';

function prepareProps(d2, onItemSelected) {
    return function ([type, name]) {
        const label = name.displayName ? name.displayName : d2.i18n.getTranslation(name);
        const varName = name.id ? name.id : name;
        return {
            primaryText: label,
            onClick() {
                onItemSelected(`${type}{${varName}}`);
            },
        };
    };
}

function renderListItem(props) {
    return (
        <ListItem
            key={props.primaryText}
            {...props}
        />
    );
}

function VariableList({ onItemSelected, variableTypes }, { d2 }) {
    const listItems = map(compose(renderListItem, prepareProps(d2, onItemSelected)), variableTypes);

    return (
        <div style={{ flex: '0 0 33%' }}>
            <Heading level={4} style={{ fontSize: '1rem', paddingBottom: '1rem' }}>Template variables</Heading>
            <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                <List>
                    {listItems}
                </List>
            </div>
        </div>
    );
}

VariableList.contextTypes = {
    d2: PropTypes.object,
};

export default class SubjectAndMessageTemplateFields extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            lastActiveField: 'subjectTemplate',
            lastIndex: 0,
        };

        this.insertVariable = this.insertVariable.bind(this);
    }

    setActiveField(field) {
        return (event) => {
            this.setState({
                lastActiveField: field,
                lastIndex: event.target.selectionEnd,
            });
        };
    }

    insertVariable(variable) {
        const lastIndex = this.state.lastIndex;
        const currentValue = (this.props.model[this.state.lastActiveField] || '');

        this.props.onUpdate({
            fieldName: this.state.lastActiveField,
            value: `${currentValue.slice(0, lastIndex)}${variable}${currentValue.slice(lastIndex)}`,
        });
    }

    render() {
        const d2 = this.context.d2;
        const { model, onUpdate } = this.props;

        const styles = {
            divider: {
                marginTop: '2rem',
                marginBottom: '2rem',
                marginLeft: '-5rem',
                marginRight: '-5rem',
            },
            heading: {
                fontSize: '1.25rem',
            },
            subject: {
                flex: '0 0 72px',
            },
        };

        return (
            <div>
                <Divider style={styles.divider} />
                <Heading level={3} style={styles.heading}>Message template</Heading>
                <Row>
                    <Column>
                        <div style={styles.subject}>
                            <TextField
                                name="subjectTemplate"
                                fullWidth
                                floatingLabelText={d2.i18n.getTranslation('subject_template')}
                                onBlur={this.setActiveField('subjectTemplate')}
                                value={model.subjectTemplate || ''}
                                onChange={(event, value) => onUpdate({ fieldName: 'subjectTemplate', value })}
                                onKeyUp={this.setActiveField('subjectTemplate')}
                            />
                        </div>
                        <div>
                            <TextField
                                name="messageTemplate"
                                multiLine
                                fullWidth
                                floatingLabelText={d2.i18n.getTranslation('message_template')}
                                onBlur={this.setActiveField('messageTemplate')}
                                value={model.messageTemplate || ''}
                                onChange={(event, value) => onUpdate({ fieldName: 'messageTemplate', value })}
                            />
                        </div>
                    </Column>
                    <VariableList onItemSelected={this.insertVariable} variableTypes={this.props.variableTypes} />
                </Row>
                <Divider style={styles.divider} />
            </div>
        );
    }
}

SubjectAndMessageTemplateFields.contextTypes = {
    d2: PropTypes.object,
};
