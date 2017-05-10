import React from 'react';

// TODO: Put this in D2-UI
// TODO: Auto-completion
// TODO: Hacketihacks!

const styles = {
    outerWrap: {
        marginTop: 32,
        marginBottom: 32,
    },

    ed17x0r: {
        minHeight: 75,
        width: '100%',
        fontSize: 15,
        fontFamily: 'monospace',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 3,
        margin: '16px 0 8px',
        padding: 4,
    },

};

class ProgramRuleConditionField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onChange = (editorState) => {
            this.props.onChange( { target: { value: editorState.getCurrentContent().getPlainText() } } );
            this.setState({editorState});
        };
    }

    insertText(text) {
        if (this.editor) {
            const value = this.editor.value;
            const selectionStart = this.editor.selectionStart;
            const selectionEnd = this.editor.selectionEnd;
            this.props.onChange({
                target: {
                    value: `${value.substr(0, selectionStart)}${text}${value.substr(selectionEnd)}`,
                }
            });
            setTimeout(() => {
                // Take the cursor and shove it like riiiight after the text that was just putted
                this.editor.setSelectionRange(selectionStart + text.length, selectionStart + text.length);
                this.editor.focus();
            });
        }
    }

    render() {
        return (
            <textarea
                disabled={this.props.disabled}
                style={styles.ed17x0r}
                value={this.props.value}
                onChange={this.props.onChange}
                ref={(r) => this.editor = r}
            />
        );
    }
}

ProgramRuleConditionField.contextTypes = {
    d2: React.PropTypes.any,
};

export default ProgramRuleConditionField;
