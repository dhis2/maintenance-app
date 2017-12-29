import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';

import TextEditor from '../../../forms/form-fields/text-editor-field';
import modelToEditStore from '../../../EditModel/modelToEditStore';
import programRuleFunctions from './programRuleFunctions';

import OperatorButtons from '../../../EditModel/OperatorButtons.component';

class ProgramRuleConditionField extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.d2 = context.d2;
        this.getTranslation = this.d2.i18n.getTranslation.bind(this.d2.i18n);

        this.state = {
            programRuleVariables: [],
            expand: 'v',
        };
    }

    componentDidMount() {
        this.sub = modelToEditStore.subscribe((modelToEdit) => {
            this.getProgramRuleVariablesForProgram(modelToEdit.program);
        });
    }

    componentWillUnmount() {
        if (this.sub) {
            this.sub.unsubscribe();
            delete this.sub;
        }
    }

    getProgramRuleVariablesForProgram(program) {
        if (program) {
            this.d2.models.programRuleVariables.list({ filter: `program.id:eq:${program.id}`, paging: false })
                .then((list) => {
                    // If the component has been unmounted while the query was in progress,
                    // this.sub will have been deleted
                    if (this.sub) {
                        this.setState({ programRuleVariables: list.toArray() });
                    }
                });
        } else {
            this.setState({ programRuleVariables: [] });
        }
    }

    render() {
        const styles = {
            outerWrap: {
                marginTop: 32,
                marginBottom: 32,
                minHeight: 170,
                minWidth: 680,
                color: this.props.disabled ? 'rgba(0,0,0,0.3)' : 'inherit',
                fontSize: 16,
                width: '100%',
            },

            labelStyle: {
                fontSize: 16,
                color: 'rgba(0,0,0,0.3)',
            },

            leftWrap: {
                marginRight: 320,
            },

            rightWrap: {
                width: 300,
                float: 'right',
                marginRight: 0,
                display: 'flex',
                flexDirection: 'column',
            },

            rightScroll: {
                overflowX: 'hidden',
                margin: '8px 0',
                transition: 'all 175ms ease-in-out',
                flexGrow: 1,
            },

            insertButton: {
                display: 'block',
                marginTop: 8,
                marginBottom: 4,
            },

            operatorButton: {
                marginRight: 8,
                marginTop: 8,
                minWidth: 50,
            },

            operatorButtonSeparator: {
                display: 'inline-block',
                marginTop: 8,
                marginLeft: 8,
                whiteSpace: 'nowrap',
            },

            expand: {
                cursor: 'pointer',
                fontSize: 14,
            },

            innerWrapperButtonWrapper: {
                float: 'right',
                margin: '-16px 0 -18px',
            },

            varSyntax: {
                opacity: 0.4,
            },
        };

        const pushText = (text) => {
            if (this.editor) {
                this.editor.insertText(text);
            }
        };

        const makeTextPusher = text => () => pushText(text);

        const expander = section => () => this.setState({ expand: section });

        const makeArrowStyle = section => ({
            display: 'inline-block',
            marginRight: 8,
            transition: 'all 175ms ease-out',
            transform: this.state.expand === section ? 'rotateZ(90deg)' : undefined,
        });

        const makeSectionStyle = section => Object.assign({
            maxHeight: this.state.expand === section ? 350 : 0,
            overflowY: this.state.expand === section ? 'auto' : 'auto',
            padding: this.state.expand === section ? '0 4px 4px 2px' : '0 2px',
        }, styles.rightScroll);

        const refreshProgramRuleVariables = (e) => {
            this.getProgramRuleVariablesForProgram(modelToEditStore.getState().program);
            e.stopPropagation();
        };

        const programRuleButtonMapperRenderer = (v, i) => {
            const varSymbol = v.programRuleVariableSourceType === 'TEI_ATTRIBUTE' ? 'A' : '#';
            const _a = '{';
            const a_ = '}'; // Workaround for IntelliJ parsing error
            const varLabel = (
                <span>
                    <span style={styles.varSyntax}>{varSymbol}{_a}</span>
                    {v.displayName}
                    <span style={styles.varSyntax}>{a_}</span>
                </span>
            );
            const varText = `${varSymbol}{${v.displayName}}`;
            return (
                <RaisedButton
                    key={i}
                    label={varLabel}
                    labelStyle={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                    style={styles.insertButton}
                    disabled={this.props.disabled}
                    onClick={makeTextPusher(varText)}
                    title={varText}
                />
            );
        };

        return (
            <div style={Object.assign(styles.outerWrap, this.props.style)}>
                <div style={styles.labelStyle}>{this.props.labelText}</div>
                <div style={styles.rightWrap}>
                    <div onClick={expander('v')} style={styles.expand}>
                        <div style={makeArrowStyle('v')}>&#9656;</div>
                        {this.getTranslation('variables')}
                        {this.props.quickAddLink && (
                            <div style={styles.innerWrapperButtonWrapper}>
                                <Link
                                    to="/edit/programSection/programRuleVariable/add"
                                    target="_blank"
                                    rel="noopener nofollow"
                                >
                                    <IconButton
                                        iconClassName="material-icons"
                                        disabled={this.props.disabled}
                                    >add_circle_outline</IconButton>
                                </Link>
                                <IconButton
                                    iconClassName="material-icons"
                                    onClick={refreshProgramRuleVariables}
                                    disabled={this.props.disabled}
                                >refresh</IconButton>
                            </div>
                        )}
                    </div>
                    <div style={makeSectionStyle('v')}>
                        {this.state.programRuleVariables.map(programRuleButtonMapperRenderer)}
                    </div>
                    <div onClick={expander('f')} style={styles.expand}>
                        <div style={makeArrowStyle('f')}>&#9656;</div>
                        {this.getTranslation('functions')}
                    </div>
                    <div style={makeSectionStyle('f')}>
                        {programRuleFunctions.map((f, i) => (
                            <RaisedButton
                                key={i}
                                label={f}
                                labelStyle={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                                style={styles.insertButton}
                                disabled={this.props.disabled}
                                onClick={makeTextPusher(f)}
                                title={f}
                            />
                        ))}
                    </div>
                </div>
                <div style={styles.leftWrap}>
                    <TextEditor
                        placeholder={this.getTranslation('enter_expression')}
                        editorState={this.state.editorState}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        ref={r => this.editor = r}
                        disabled={this.props.disabled}
                    />
                    <OperatorButtons onClick={pushText} />
                </div>
                <div style={{ clear: 'both' }} />
            </div>
        );
    }
}

ProgramRuleConditionField.contextTypes = {
    d2: React.PropTypes.any,
};

ProgramRuleConditionField.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.any,
    disabled: React.PropTypes.bool,
    style: React.PropTypes.object,
    quickAddLink: React.PropTypes.bool,
};

ProgramRuleConditionField.defaultProps = {
    disabled: false,
    quickAddLink: true,
};

export default ProgramRuleConditionField;
