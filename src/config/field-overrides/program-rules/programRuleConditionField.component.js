import React from 'react';
import TextEditor from '../../../forms/form-fields/text-editor-field';
import modelToEditStore from '../../../EditModel/modelToEditStore';
import programRuleFunctions from './programRuleFunctions';

import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';

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
        this.sub = modelToEditStore.subscribe(modelToEdit => {
            // const modelToEdit = modelToEditStore.getState();
            // if (modelToEdit) {
                this.getProgramRuleVariablesForProgram(modelToEdit.program);
            // }
        });
    }

    getProgramRuleVariablesForProgram(program) {
        if (program) {
            this.d2.models.programRuleVariables.list({ filter: `program.id:eq:${program.id}`, paging: false })
                .then(list => this.setState({ programRuleVariables: list.toArray() }));
        } else {
            this.setState({ programRuleVariables: [] });
        }
    }

    componentWillUnmount() {
        if (this.sub) {
            this.sub.unsubscribe();
            delete this.sub;
        }
    }

    render() {
        const styles = {
            outerWrap: {
                marginTop: 32,
                marginBottom: 32,
                minHeight: 170,
                color: this.props.disabled ? 'rgba(0,0,0,0.3)' : 'inherit',
                fontSize: 16,
                width: '100%',
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
            },

            operatorButtonSeparator: {
                marginTop: 8,
            },

            expand: {
                cursor: 'pointer',
            },

            innerWrapperButtonWrapper: {
                float: 'right',
                margin: '-11px 0 -18px',
            },
        };

        const pushText = (text) => {
            if (this.editor) {
                this.editor.insertText(text);
            }
        };

        const makeTextPusher = (text) => {
            return () => pushText(text);
        };

        const op = (label, op) =>
            <RaisedButton
                label={label}
                onClick={makeTextPusher(`${op || label}`)}
                style={styles.operatorButton}
                disabled={this.props.disabled}
            />;

        const expander = (section) => {
            return () => this.setState({ expand: section });
        };

        // Hack me some styles u-huh!
        const makeArrowStyle = (section) => ({
            display: 'inline-block',
            marginRight: 8,
            transition: 'all 175ms ease-out',
            transform: this.state.expand === section ? 'rotateZ(90deg)' : undefined,
        });

        const makeSectionStyle = (section) => {
            return Object.assign({
                maxHeight: this.state.expand === section ? 350 : 0,
                overflowY: this.state.expand === section ? 'auto' : 'auto',
                padding: this.state.expand === section ? '0 4px 4px 2px' : '0 2px',
            }, styles.rightScroll);
        };

        const refreshProgramRuleVariables = (e) => {
            this.getProgramRuleVariablesForProgram(modelToEditStore.getState().program);
            e.stopPropagation();
        };

        return (
            <div style={Object.assign(styles.outerWrap, this.props.style)}>
                {this.getTranslation('expression')}
                <div style={styles.rightWrap}>
                    <div onClick={expander('v')} style={styles.expand}>
                        <div style={makeArrowStyle('v')}>&#9656;</div>
                        {this.getTranslation('variables')}
                        <div style={styles.innerWrapperButtonWrapper}>
                            <Link
                                to="/edit/programSection/programRuleVariable/add"
                                target="_blank"
                                rel="noopener nofollow">
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
                    </div>
                    <div style={makeSectionStyle('v')}>
                        {this.state.programRuleVariables.map((v, i) => (
                            <RaisedButton
                                key={i}
                                label={`#{${v.displayName}}`}
                                labelStyle={{ textTransform: 'none' }}
                                style={styles.insertButton}
                                disabled={this.props.disabled}
                                onClick={makeTextPusher(`#{${v.displayName}}`)}
                            />
                        ))}
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
                                labelStyle={{ textTransform: 'none' }}
                                style={styles.insertButton}
                                disabled={this.props.disabled}
                                onClick={makeTextPusher(f)}
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
                        ref={(r) => this.editor = r}
                        disabled={this.props.disabled}
                    />
                    <div>
                        <div>{this.getTranslation('operators')}:</div>
                        {op('+')} {op('-')} {op('*')} {op('/')} {op('%')}
                        <div style={styles.operatorButtonSeparator}/>
                        {op('>')} {op('>=')} {op('<')} {op('<=')} {op('==')} {op('!=')}
                        <div style={styles.operatorButtonSeparator}/>
                        {op('NOT', '!')} {op('AND', '&&')} {op('OR', '||')}
                    </div>
                </div>
                <div style={{ clear: 'both' }}/>
            </div>
        )
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
};

ProgramRuleConditionField.defaultProps = {
    disabled: false,
};

export default ProgramRuleConditionField;
