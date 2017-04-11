import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import { blue500, orange500 } from 'material-ui/styles/colors';
import { getInstance } from 'd2/lib/d2';
import { arrayMove } from 'react-sortable-hoc';

import DefaultForm from './DefaultForm.component';
import SectionForm from './SectionForm.component';

const tabStyle = { color: 'gray' };
const inkBarStyle = { backgroundColor: orange500, marginBottom: '3rem' };
const tabItemContainerStyle = { backgroundColor: 'white' };

const helpText = "If you create both a section form and a custom form, the system displays the custom form during data entry. Users who enter data can't select which form they want to use. In web-based data entry the order of display preference is: Custom form (if it exists), Section form (if it exists), Default form. Mobile devices do not support custom forms. In mobile-based data entry, the order fo display preference is: Section form (if it exists), Default from."

class EditDataEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
          sections: this.props.sections,
          programDataElements: this.props.programDataElements,
        };
    }

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

    programDataElementOrderChanged = ({oldIndex, newIndex}) => {
      this.setState({
          programDataElements: arrayMove(this.state.programDataElements, oldIndex, newIndex),
      });
    }

    sectionsChanged = (newSections) => {
        console.warn('New sections:', newSections);
        this.setState({
            sections: newSections,
        });
    }

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
                    { this.renderTab('Default',
                        <DefaultForm
                            programDataElements={this.state.programDataElements}
                            onChange={this.programDataElementOrderChanged}
                        />
                    )}

                    { this.renderTab('Section',
                        <SectionForm
                            dataElements={this.state.programDataElements}
                            sections={this.state.sections}
                            onChange={this.sectionsChanged}
                        />
                    )}

                    { this.renderTab('Custom', 'Custom entry form') }
                </Tabs>
            </div>
        );
    }
}

EditDataEntryForm.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        dataElements: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
        })).isRequired,
    })).isRequired,
    programDataElements: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
    })).isRequired,
};

/* Faked redux store */
class ConnectedEditDataEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store: null,
        };

        this.loadData();
    }

    loadData = () => {
        getInstance().then((d2) => {
          const programStageSections = d2.models.programStage
            .get('pTo4uMt3xur', {
              fields: ':owner,programStageDataElements[:owner,displayName,dataElement[displayName,id]],programStageSections[:owner,displayName,dataElements[displayName,id]]'
            })
            .then(result => {
                const sections = result.programStageSections.toArray().map(programStageSection => ({
                    id: programStageSection.id,
                    displayName: programStageSection.displayName,
                    dataElements: programStageSection.dataElements.toArray().map(programStageSectionDataElement => ({
                        id: programStageSectionDataElement.id,
                    })),
                }));

                const programDataElements = result.programStageDataElements.map(programStageDataElement => ({
                    id: programStageDataElement.dataElement.id,
                    displayName: programStageDataElement.dataElement.displayName,
                }));

                this.setState({
                    store: { sections, programDataElements },
                })
            })
        });
    }

    render() {
        return !this.state.store ? <div>Loading ...</div> : (
            <EditDataEntryForm
                sections={this.state.store.sections}
                programDataElements={this.state.store.programDataElements}
            />
        );
    }
}

/* Connect to store when API connector is redundant
const ConnectedEditDataEntryForm = connect(
  (state) => ({
    ...state,
  }),
  (dispatch) => ({}),
)(EditDataEntryForm);
*/

export default ConnectedEditDataEntryForm;
