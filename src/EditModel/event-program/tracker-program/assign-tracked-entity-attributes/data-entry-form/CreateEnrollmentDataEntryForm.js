import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper/Paper';
import { bindActionCreators } from 'redux';
import { arrayMove } from 'react-sortable-hoc';

import SectionForm from '../../../create-data-entry-form/SectionForm';
import { CustomRegistrationDataEntryForm } from '../../../data-entry-form/EditCustomRegistrationForm';
import mapPropsStream from 'recompose/mapPropsStream';
import withProps from 'recompose/withProps';
import { sortBy, get, getOr, compose, find } from 'lodash/fp';
import withHandlers from 'recompose/withHandlers';
import eventProgramStore from '../../../eventProgramStore';
import {
    changeProgramStageDataElementOrder,
    changeProgramStageSectionOrder,
    addProgramStageSection,
    removeProgramStageSection,
    updateProgramStageSection,
} from './actions';

const sectionFormIndex = 1;

const formIndex = {
    basic: 0,
    section: 1,
    custom: 2,
    
}

const styles = {
    tabContent: { padding: '3rem' },
    helpText: { color: 'gray', marginBottom: '2rem' },
};

class CreateEnrollmentDataEntryForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            curTab: 0
        }
    }

    onTabChange = (_, __, tab) => {
        const curTab = tab.props.index
        this.setState({ curTab })
    }

    programDataElementOrderChanged = ({ oldIndex, newIndex }) => {
        this.props.onChangeDefaultOrder(
            arrayMove(
                this.props.availableDataElements.map(
                    dataElement => dataElement.id
                ),
                oldIndex,
                newIndex
            )
        );
    };

    renderTab = (label, contentToRender) =>
        <Tab style={styles.tab} label={label}>
            <div style={styles.tabContent}>
                <HelpText />
                {contentToRender}
            </div>
        </Tab>;

    getTranslation = key => {
        return this.context.d2.i18n.getTranslation(key);
    };

    render() {
        console.log(this.props)
        
        return (
            <Paper>
                <Tabs
                    initialSelectedIndex={sectionFormIndex}
                    onChange={this.onTabChange}
                >
                    {this.renderTab(
                        this.getTranslation('section'),
                        <SectionForm
                            availableElements={
                                this.props.availableAttributes
                            }
                            sections={
                                this.props.programSections
                            }
                            onSectionUpdated={
                                this.props.onSectionUpdated
                            }
                            onSectionOrderChanged={
                                this.props.onSectionOrderChanged
                            }
                            onSectionAdded={this.props.onSectionAdded}
                            onSectionRemoved={this.props.onSectionRemoved}
                            elementPath='attribute'
                        />
                    )}

                    {/* Super hacky to use the number 2 here */ ''}
                    {/* I just didn't see another way */ ''}
                    {this.renderTab(
                        this.getTranslation('custom'),
                        (
                            <CustomRegistrationDataEntryForm
                                isVisible={this.state.curTab === 2}
                                programStage={this.props.programStage}
                            />
                        )
                    )}
                </Tabs>
            </Paper>
        );
    }
}

CreateEnrollmentDataEntryForm.contextTypes = {
    d2: PropTypes.object,
};

const HelpText = (_, { d2 }) =>
    <div style={styles.helpText}>
        {d2.i18n.getTranslation('program_forms_help_text')}
    </div>;

HelpText.contextTypes = {
    d2: PropTypes.object,
};

CreateEnrollmentDataEntryForm.propTypes = {
    onChangeDefaultOrder: PropTypes.func.isRequired,
    onSectionOrderChanged: PropTypes.func.isRequired,
    onSectionUpdated: PropTypes.func.isRequired,
    onSectionAdded: PropTypes.func.isRequired,
    onSectionRemoved: PropTypes.func.isRequired,
    programStageSections: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            sortOrder: PropTypes.number.isRequired,
            displayName: PropTypes.string.isRequired,
            dataElements: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    displayName: PropTypes.string.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            changeProgramStageDataElementOrder,
            changeProgramStageSectionOrder,
            addProgramStageSection,
            removeProgramStageSection,
            updateProgramStageSection,
        },
        dispatch
    );

const sections$ = eventProgramStore.map(
        getOr([], 'programSections')
    );

const enhance = compose(
    connect(null, mapDispatchToProps),
    mapPropsStream(props$ => props$.combineLatest(sections$, (props, sections) => ({
        ...props,
        programSections: sections,
    }) )),
   
    withHandlers({
        onChangeDefaultOrder: ({
            programStage,
            changeProgramStageDataElementOrder,
        }) => newDataElementOrder => {
            changeProgramStageDataElementOrder({
                programStage: programStage.id,
                newDataElementOrder,
            });
        },
        onSectionUpdated: ({
            programStage,
            updateProgramStageSection,
        }) => (sectionId, newSectionData) => {
            updateProgramStageSection({
                programStage: programStage.id,
                programStageSectionId: sectionId,
                newProgramStageSectionData: newSectionData,
            });
        },
        onSectionOrderChanged: ({
            programStage,
            changeProgramStageSectionOrder,
        }) => programStageSections => {
            changeProgramStageSectionOrder({
                programStage: programStage.id,
                programStageSections
            });
        },
        onSectionAdded: ({ programStage, addProgramStageSection }) => (newSectionData) => {
            addProgramStageSection({
                programStage: programStage.id,
                newSectionData,
            });
        },
        onSectionRemoved: ({
            programStage,
            removeProgramStageSection,
        }) => programStageSection => {
            removeProgramStageSection({
                programStage: programStage.id,
                programStageSection });
        },
    })
);

export default enhance(CreateEnrollmentDataEntryForm);
