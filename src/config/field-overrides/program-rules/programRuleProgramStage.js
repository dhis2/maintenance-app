import React from 'react';
import DropdownAsync from '../../../forms/form-fields/drop-down-async';
import PropTypes from 'prop-types';

class ProgramStageField extends React.Component {
    constructor(props, context) {
        super(props);
        
        //Need this in state, or else the dropdown will reload all the time, since the
        //filter is a new reference
        this.state = {
            queryParamFilter: null,
            programId: null,
        };
    }

    componentWillReceiveProps(newProps) {
        const selectedProgram = newProps.model.program;
        if (selectedProgram && selectedProgram.id !== this.state.programId) {
            const queryParamFilter = [`program.id:eq:${selectedProgram.id}`];

            this.setState({
                programId: selectedProgram.id,
                queryParamFilter
            });
        }
    }

    shouldRender = () => {
        const props = this.props;
        const isEventProgram = props.model.program && props.model.program.programType === "WITHOUT_REGISTRATION";
        return props.model.program && !isEventProgram;
    }
    render() {
        if(!this.shouldRender()) {
            return null;
        }
        const props = this.props;
        const disabled = !this.state.programId;
        
        return (
            <DropdownAsync
                {...props}
                disabled={disabled}
                queryParamFilter={this.state.queryParamFilter}
                labelText={this.context.d2.i18n.getTranslation(
                    'trigger_rule_only_for_program_stage'
                )}
            />
        );
    }
}

ProgramStageField.contextTypes = {
    d2: PropTypes.object,
};

export default ProgramStageField;
