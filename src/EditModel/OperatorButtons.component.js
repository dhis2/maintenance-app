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
};

class OperatorButtons extends Component {
    op(label, value) {
        return (
            <RaisedButton
                label={label}
                onClick={() => this.props.onClick(value || label)}
                style={styles.operatorButton}
            />);
    }

    render() {
        return (
            <div style={{ marginLeft: -6 }}>
                <div style={styles.operatorButtonSeparator}>
                    {this.op(' + ')}
                    {this.op(' - ')}
                    {this.op(' * ')}
                    {this.op(' / ')}
                    {this.op(' % ')}
                </div>
                <div style={styles.operatorButtonSeparator}>
                    {this.op(' > ')}
                    {this.op(' >= ')}
                    {this.op(' < ')}
                    {this.op(' <= ')}
                    {this.op(' == ')}
                    {this.op(' != ')}
                </div>
                <div style={styles.operatorButtonSeparator}>
                    {this.op('NOT', ' ! ')}
                    {this.op('AND', ' && ')}
                    {this.op('OR', ' || ')}
                </div>
            </div>);
    }
}

OperatorButtons.propTypes = {
    onClick: React.PropTypes.func.isRequired,
};

export default OperatorButtons;
