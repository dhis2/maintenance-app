import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import { blue500, orange500 } from 'material-ui/styles/colors';

import EditDefaultEntryForm from './EditDefaultEntryForm.component';
import EditSectionEntryForm from './EditSectionEntryForm.component';

const tabStyle = { color: 'gray' };
const inkBarStyle = { backgroundColor: orange500, marginBottom: '3rem' };
const tabItemContainerStyle = { backgroundColor: 'white' };

const helpText = "If you create both a section form and a custom form, the system displays the custom form during data entry. Users who enter data can't select which form they want to use. In web-based data entry the order of display preference is: Custom form (if it exists), Section form (if it exists), Default form. Mobile devices do not support custom forms. In mobile-based data entry, the order fo display preference is: Section form (if it exists), Default from."

class EditDataEntryForm extends Component {
    renderTab = (label, contentToRender) => (
        <Tab
            style={tabStyle}
            label={label}
        >
            <div>
                { contentToRender }
            </div>
        </Tab>
    );

    render() {
        return (
            <div>
                <div style={{
                    color: 'gray',
                    marginBottom: '2rem',
                }}>
                    {helpText}
                </div>
                <Tabs
                    initialSelectedIndex={0}
                    inkBarStyle={inkBarStyle}
                    tabItemContainerStyle={tabItemContainerStyle}
                >
                    { this.renderTab('Default', <EditDefaultEntryForm />) }
                    { this.renderTab('Section', <EditSectionEntryForm />) }
                    { this.renderTab('Custom', 'Custom entry form') }
                </Tabs>
            </div>
        );
    }
}

const ConnectedEditDataEntryForm = connect(
  (state) => ({
    ...state,
  }),
  (dispatch) => ({}),
)(EditDataEntryForm);

export default ConnectedEditDataEntryForm;
