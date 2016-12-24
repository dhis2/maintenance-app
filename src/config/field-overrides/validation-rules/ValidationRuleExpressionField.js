import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { withState, withProps, compose, onlyUpdateForKeys } from 'recompose';
import ValidationRuleExpressionDialog from './ValidationRuleExpressionDialog';

function ValidationRuleExpressionField({ value = {}, onButtonClick, open, close, onChange, buttonLabel }) {
    return (
        <div>
            <RaisedButton onClick={onButtonClick}>{buttonLabel}</RaisedButton>
            <div>{value.description}</div>
            <ValidationRuleExpressionDialog
                open={open}
                close={close}
                save={(value) => {
                    onChange({
                        target: {
                            value,
                        },
                    });
                    close();
                }}
                value={value}
            />
        </div>
    );
}

const enhance = compose(
    onlyUpdateForKeys(['value']),
    withState('open', 'toggleOpen', false),
    withProps(({ toggleOpen }) => ({
        onButtonClick: () => toggleOpen(true),
        close: () => toggleOpen(false)
    }))
);

export default enhance(ValidationRuleExpressionField);