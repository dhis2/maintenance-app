import React from 'react';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import DropDown from '../../../forms/form-fields/drop-down';
import TextField from '../../../forms/form-fields/text-field';
import programRuleActionTypes from './programRuleActionTypes';
import ProgramRuleConditionField from './programRuleConditionField.component';
import snackActions from '../../../Snackbar/snack.actions';


class ProgramRuleActionDialog extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            programRuleAction: this.props.ruleActionModel
        };

        this.d2 = context.d2;
        this.getTranslation = this.d2.i18n.getTranslation.bind(this.d2.i18n);
        this.save = this.save.bind(this);
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        if (this.props.program && this.props.program.id) {
            Promise.all([
                this.d2.models.programs.get(this.props.program.id, {
                    fields: [
                        'programStages[id,displayName',
                        'programStageSections[id,displayName]',
                        'programStageDataElements[id,dataElement[id,displayName]]]'
                    ].join(','),
                }),
                this.d2.models.programs.get(this.props.program.id, {
                    fields: 'programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName]]',
                }),
                this.d2.models.programRuleVariables.list({
                    filter: `program.id:eq:${this.props.program.id}`,
                    fields: 'id,displayName',
                    paging: false,
                }),
            ]).then(([ wrappedUpDataElements, wrappedUpTrackedEntityAttributes, programVariables ]) => {

                const programDataElements =
                    Object.values(wrappedUpDataElements.programStages.toArray()
                        .map(stage => stage.programStageDataElements.map(psde => psde.dataElement))
                        .reduce((a, s) => { return a.concat(s); }, [])
                        .reduce((o, de) => { o[de.id] = de; return o; }, {})
                    )
                    .map(de => ({ text: de.displayName, value: de.id, model: de }))
                    .sort((a, b) => a.text.localeCompare(b.text));

                const programSections =
                    wrappedUpDataElements.programStages.toArray()
                        .reduce((a, s) => a.concat(s.programStageSections.toArray()), [])
                        .map(s => ({ text: s.displayName, value: s.id, model: s }))
                        .sort((a, b) => a.text.localeCompare(b.text));

                const programStages =
                    wrappedUpDataElements.programStages.toArray()
                        .map(s => ({ text: s.displayName, value: s.id, model: s }))
                        .sort((a, b) => a.text.localeCompare(b.text));

                const programTrackedEntityAttributes =
                    wrappedUpTrackedEntityAttributes.programTrackedEntityAttributes
                        .map(ptea => ({
                            text: ptea.trackedEntityAttribute.displayName,
                            value: ptea.trackedEntityAttribute.id,
                            model: ptea.trackedEntityAttribute,
                        }))
                        .sort((a, b) => a.text.localeCompare(b.text));

                this.setState({
                    programStages,
                    programSections,
                    programDataElements,
                    programTrackedEntityAttributes,
                    programVariables: programVariables.toArray().map(v => ({
                        text: `#{${v.displayName}}`,
                        value: `#{${v.displayName}}`,
                    })),
                });
            }).catch(err => {
                this.props.onRequestClose();
                snackActions.show({ message: `Error: ${err}`, action: 'ok' });
            });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.programRuleAction) {
            this.setState({
                programRuleAction: newProps.ruleActionModel
            });
        }
    }

    async save() {
        const programRuleAction = this.state.programRuleAction;

        // Fancily translate from DropDown format to DataTable format - consistency is for sheeple
        const fieldRefs = {
            'dataElement': this.state.programDataElements,
            'trackedEntityAttribute': this.state.programTrackedEntityAttributes,
            'programStage': this.state.programStages,
            'programStageSection': this.state.programSections,
        };

        Object.keys(fieldRefs).forEach(field => {
            if(programRuleAction[field]) {
                const ref = fieldRefs[field].filter(v => v.value === programRuleAction[field])[0];
                programRuleAction[field] = { id: ref.value, displayName: ref.text };
            } else {
                programRuleAction[field] = undefined;
            }
        });

        if (programRuleAction.id) {
            // <hack>
            // TODO: Add support for modifying an existing member of a ModelCollectionProperty in d2
            this.props.parentModel.programRuleActions.set(programRuleAction.id, programRuleAction);
            this.props.parentModel.programRuleActions.dirty = true;
            // </hack>

            this.props.onChange({ target: { value: this.props.parentModel.programRuleActions }});
            this.props.onRequestClose();
        } else {
            const newUid = await this.d2.Api.getApi().get('/system/id');
            this.props.parentModel.programRuleActions.add(Object.assign(programRuleAction, { id: newUid.codes[0] }));
            this.props.onChange({ target: { value: this.props.parentModel.programRuleActions }});
            this.props.onRequestClose();
        }
    }

    update(fieldName, value) {
        this.state.programRuleAction[fieldName] = value;

        this.setState({
            programRuleAction: this.state.programRuleAction,
        });
    }

    render() {
        const modelDefinition = this.d2.models.programRuleActions;
        const ruleActionModel = this.state.programRuleAction;
        const currentActionType = ruleActionModel.programRuleActionType;
        const fieldMapping = programRuleActionTypes[currentActionType];

        const fieldConfig = [
            {
                name: 'programRuleActionType',
                component: DropDown,
                props: {
                    labelText: `${this.getTranslation('action')} (*)`,
                    fullWidth: true,
                    options: modelDefinition.modelProperties.programRuleActionType.constants
                        .filter(o => o !== 'CREATEEVENT' || (ruleActionModel.id !== undefined && ruleActionModel.programRuleActionType === 'CREATEEVENT'))
                        .map(o => ({ text: this.getTranslation(programRuleActionTypes[o].label), value: o })),
                    value: ruleActionModel.programRuleActionType,
                    isRequired: true,
                },
            },
            {
                name: 'location',
                component: DropDown,
                props: {
                    labelText: this.getTranslation('display_widget'),
                    value: ruleActionModel.location,
                    options: [
                        { text: this.getTranslation('feedback_widget'), value: 'feedback' },
                        { text: this.getTranslation('program_indicator_widget'), value: 'indicators' },
                    ],
                    fullWidth: true,
                },
            },
            {
                name: 'dataElement',
                component: DropDown,
                props: {
                    labelText: this.getTranslation('data_element'),
                    options: this.state && this.state.programDataElements || [],
                    value: ruleActionModel.dataElement,
                    fullWidth: true,
                },
            },
            {
                name: 'trackedEntityAttribute',
                component: DropDown,
                props: {
                    labelText: this.getTranslation('tracked_entity_attribute'),
                    options: this.state && this.state.programTrackedEntityAttributes || [],
                    value: ruleActionModel.trackedEntityAttribute,
                    style: { display: ruleActionModel.trackedEntityAttribute ? 'inline-block' : 'none' },
                    fullWidth: true,
                },
            },
            {
                name: 'programStage',
                component: DropDown,
                props: {
                    labelText: this.getTranslation('program_stage'),
                    options: this.state && this.state.programStages || [],
                    value: ruleActionModel.programStage,
                    fullWidth: true,
                },
            },
            {
                name: 'programStageSection',
                component: DropDown,
                props: {
                    labelText: this.getTranslation('program_stage_section'),
                    options: this.state && this.state.programSections || [],
                    value: ruleActionModel.programStageSection,
                    disabled: !this.state.programSections || this.state.programSections.length === 0,
                    fullWidth: true,
                },
            },
            {
                name: 'content',
                component: currentActionType === 'ASSIGN' ? DropDown : TextField,
                props: {
                    labelText: this.getTranslation('content'),
                    value: ruleActionModel.content,
                    fullWidth: true,
                    options: currentActionType === 'ASSIGN' ? this.state.programVariables : undefined,
                },
            },
            {
                name: 'data',
                component: ProgramRuleConditionField,
                props: {
                    labelText: this.getTranslation('data'),
                    value: ruleActionModel.data,
                    fullWidth: true,
                    hideOperators: true,
                    quickAddLink: false,
                },
            },
        ].map(field => {
            if (field.name !== 'programRuleActionType') {
                const isRequired = fieldMapping && fieldMapping.required && fieldMapping.required.includes(field.name);
                const isOptional = fieldMapping && fieldMapping.optional && fieldMapping.optional.includes(field.name);

                if (isOptional || isRequired) {
                    field.props.style = { display: 'inline-block' };
                    if (isRequired) {
                        field.props.isRequired = true;
                        field.props.labelText += ' (*)';
                    }
                } else {
                    field.props.style = { display: 'none' };
                }
            }
            return field;
        }).map((field) => {
            if (fieldMapping && fieldMapping.labelOverrides && fieldMapping.labelOverrides[field.name]) {
                field.props.labelText = this.getTranslation(fieldMapping.labelOverrides[field.name]);
            }

            return field;
        });

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
                title={this.getTranslation('define_program_rule_action')}
                autoScrollBodyContent
                actionsContainerStyle={{ marginTop: 0 }}
                titleStyle={{ marginBottom: 0 }}
                actions={[
                    <FlatButton
                        label={this.getTranslation('cancel')}
                        style={{ marginRight: 8 }}
                        onClick={this.props.onRequestClose}
                    />,
                    <RaisedButton
                        label={this.getTranslation('save')}
                        primary
                        style={{ marginRight: 16 }}
                        onClick={this.save}
                    />
                ]}
            >
                {this.state.programDataElements ? (
                    <FormBuilder fields={fieldConfig} onUpdateField={this.update}/>
                ) : <div>Loading...</div>}
            </Dialog>
        );
    }
}

ProgramRuleActionDialog.contextTypes = { d2: React.PropTypes.any };

ProgramRuleActionDialog.propTypes = {
    open: React.PropTypes.bool.isRequired,
    onRequestClose: React.PropTypes.func.isRequired,
    onUpdateRuleActionModel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    program: React.PropTypes.object.isRequired,
    ruleActionModel: React.PropTypes.object.isRequired,
};

export default ProgramRuleActionDialog;
