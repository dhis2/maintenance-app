import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import FlatButton from 'material-ui/FlatButton/FlatButton';

const styles = {
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    button: {
        minWidth: 50,
        margin: '5px 10px 5px 10px'
    }
}

class ExpressionFunctions extends Component {    
    render() {
        const classList = classes('expression-functions');

        return (
            <div className={classList} style={styles.wrapper}>
                <FlatButton style={styles.button} onClick={this.createOperatorClick(' if( ')}>if(</FlatButton>
                <FlatButton style={styles.button} onClick={this.createOperatorClick(' isNull( ')}>isNull(</FlatButton>
                <FlatButton style={styles.button} onClick={this.createOperatorClick(' firstNonNull( ')}>firstNonNull(</FlatButton>
                <FlatButton style={styles.button} onClick={this.createOperatorClick(' greatest( ')}>greatest(</FlatButton>
                <FlatButton style={styles.button} onClick={this.createOperatorClick(' least( ')}>least(</FlatButton>
                <FlatButton style={styles.button} onClick={this.createOperatorClick(' log( ')}>log(</FlatButton>
                <FlatButton style={styles.button} onClick={this.createOperatorClick(' log10( ')}>log10(</FlatButton>
                <FlatButton style={styles.button} onClick={this.createOperatorClick(' .periodOffset( ')}>.periodOffset(</FlatButton>
            </div>
        );
    }

    createOperatorClick(operatorValue) {
        return function functionButtonClicked() {
            this.props.onFunctionClick(operatorValue);
        }.bind(this);
    }
}

ExpressionFunctions.propTypes = {
    operatorClicked: PropTypes.func.isRequired,
};

export default ExpressionFunctions;
