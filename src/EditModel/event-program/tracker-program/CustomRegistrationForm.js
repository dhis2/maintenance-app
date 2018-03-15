import React, { Component } from 'react';
import { get, compose } from 'lodash/fp';
import Checkbox from 'material-ui/Checkbox';
import programStore from '../eventProgramStore';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

class CustomRegistrationForm extends Component {
    state = {
        useCustom: !!this.props.model.dataEntryForm
    }

    handleUseCustom = (value) => {

       // programStore.program.dataEntryForm =

    }
    render() {
        console.log(this.state.useCustom)
        return (
            <div>
                <Checkbox/>
            </div>
        )
    }
}
export default addD2Context(CustomRegistrationForm);