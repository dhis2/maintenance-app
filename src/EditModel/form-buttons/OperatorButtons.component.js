import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
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
    wrapper: {
        marginLeft: -6,
    },
};

class OperatorButtons extends Component {
    operatorButton(label, value) {
        const onClick = () => this.props.onClick(value || label);
        return (
            <RaisedButton
                label={label}
                onClick={onClick}
                style={styles.operatorButton}
            />);
    }

    render() {
        return (
            <div style={styles.wrapper}>
                <div style={styles.operatorButtonSeparator}>
                    {this.operatorButton(' + ')}
                    {this.operatorButton(' - ')}
                    {this.operatorButton(' * ')}
                    {this.operatorButton(' / ')}
                    {this.operatorButton(' % ')}
                </div>
                <div style={styles.operatorButtonSeparator}>
                    {this.operatorButton(' > ')}
                    {this.operatorButton(' >= ')}
                    {this.operatorButton(' < ')}
                    {this.operatorButton(' <= ')}
                    {this.operatorButton(' == ')}
                    {this.operatorButton(' != ')}
                </div>
                <div style={styles.operatorButtonSeparator}>
                    {this.operatorButton('NOT', ' ! ')}
                    {this.operatorButton('AND', ' && ')}
                    {this.operatorButton('OR', ' || ')}
                </div>
            </div>);
    }
}

OperatorButtons.propTypes = { onClick: React.PropTypes.func.isRequired };

export default OperatorButtons;
