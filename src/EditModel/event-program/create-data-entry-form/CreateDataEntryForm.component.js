import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper/Paper';
import { bindActionCreators } from 'redux';
import { arrayMove } from 'react-sortable-hoc';

import DefaultForm from './DefaultForm.component';
import SectionForm from './SectionForm.component';
import CustomForm from './CustomForm.component';

import mapPropsStream from 'recompose/mapPropsStream';
import mapProps from 'recompose/mapProps';
import { sortBy, get, getOr, compose, find } from 'lodash/fp';
import withHandlers from 'recompose/withHandlers';
import eventProgramStore from '../eventProgramStore';

import {
    changeProgramStageDataElementOrder,
    changeProgramStageSectionOrder,
    addProgramStageSection,
    removeProgramStageSection,
    editProgramStageSectionName,
} from './actions';

const sectionFormIndex = 1;

const styles = {
    tabContent: { padding: '3rem' },
    helpText: { color: 'gray', marginBottom: '2rem' },
};

class CreateDataEntryForm extends Component {
    programDataElementOrderChanged = ({ oldIndex, newIndex }) => {
        this.props.onChangeDefaultOrder(
            arrayMove(this.props.availableDataElements.map(dataElement => dataElement.id), oldIndex, newIndex)
        );
    };

    renderTab = (label, contentToRender) => (
        <Tab style={styles.tab} label={label}>
            <div style={styles.tabContent}>
                <HelpText />
                { contentToRender }
            </div>
        </Tab>
    );

    getTranslation = key => {
        return this.context.d2.i18n.getTranslation(key);
    };

    render() {
        return (
            <Paper>
                <Tabs initialSelectedIndex={sectionFormIndex}>
                    { this.renderTab(this.getTranslation('basic'),
                        <DefaultForm
                            availableDataElements={this.props.availableDataElements}
                            onChange={this.programDataElementOrderChanged}
                        />
                    )}

                    { this.renderTab(this.getTranslation('section'),
                        <SectionForm
                            availableDataElements={this.props.availableDataElements}
                            programStageSections={this.props.programStageSections}
                            onSectionNameChanged={this.props.onSectionNameChanged}
                            onSectionOrderChanged={this.props.onSectionOrderChanged}
                            onSectionAdded={this.props.onSectionAdded}
                            onSectionRemoved={this.props.onSectionRemoved}
                        />
                    )}

                    { this.renderTab(this.getTranslation('custom'),
                        <CustomForm />
                    )}
                </Tabs>
            </Paper>
        );
    }
}

CreateDataEntryForm.contextTypes = {
    d2: PropTypes.object,
};

const HelpText = (_, { d2 }) => (
    <div style={styles.helpText} >
        { d2.i18n.getTranslation('program_forms_help_text') }
    </div>
);

HelpText.contextTypes = {
    d2: PropTypes.object,
};

CreateDataEntryForm.propTypes = {
    onChangeDefaultOrder: PropTypes.func.isRequired,
    onSectionOrderChanged: PropTypes.func.isRequired,
    onSectionNameChanged: PropTypes.func.isRequired,
    onSectionAdded: PropTypes.func.isRequired,
    onSectionRemoved: PropTypes.func.isRequired,
    programStageSections: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        sortOrder: PropTypes.number.isRequired,
        displayName: PropTypes.string.isRequired,
        dataElements: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
        })).isRequired,
    })).isRequired,
    availableDataElements: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        sortOrder: PropTypes.number.isRequired,
    })).isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    changeProgramStageDataElementOrder,
    changeProgramStageSectionOrder,
    addProgramStageSection,
    removeProgramStageSection,
    editProgramStageSectionName,
}, dispatch);

const programStage$ = eventProgramStore
    .map(get('programStages[0]'));

const programStageSections$ = eventProgramStore
    .map(getOr([], 'programStageSections'));

const availableProgramStageDataElements$ = eventProgramStore
    .map(getOr([], 'programStages[0].programStageDataElements'));

const trackerDataElements$ = eventProgramStore
    .map(getOr([], 'availableDataElements'));

const enhance = compose(
    connect(null, mapDispatchToProps),
    mapPropsStream(props$ => props$
        .combineLatest(
            programStage$,
            programStageSections$,
            availableProgramStageDataElements$,
            trackerDataElements$,
            (props, programStage, programStageSections, availableProgramStageDataElements, trackerDataElements) => ({
                ...props,
                programStage,
                trackerDataElements,
                programStageSections,
                availableDataElements: availableProgramStageDataElements,
            })
        )
    ),
    mapProps(({ trackerDataElements, ...props }) => {
        const getDisplayNameForDataElement = dataElement => dataElement.displayName ||
                get('displayName', find(trackerDataElement => dataElement.id === trackerDataElement.id, trackerDataElements));

        return {
            ...props,
            programStageSections: sortBy(['sortOrder'], props.programStageSections.map((section) => {
                section.dataElements = Array.from(section.dataElements.values()).map(dataElement => ({
                    id: dataElement.id,
                    displayName: getDisplayNameForDataElement(dataElement),
                }));

                return section;
            })),
            availableDataElements: sortBy(['sortOrder'], props.availableDataElements.map(programDataElement => ({
                ...programDataElement.dataElement,
                displayName: getDisplayNameForDataElement(programDataElement.dataElement),
                sortOrder: programDataElement.sortOrder,
            }))),
        };
    }),
    withHandlers({
        onChangeDefaultOrder: ({ programStage, changeProgramStageDataElementOrder }) => (newDataElementOrder) => {
            changeProgramStageDataElementOrder({ programStage: programStage.id, newDataElementOrder });
        },
        onSectionNameChanged: ({ programStage, editProgramStageSectionName }) => (sectionId, newName) => {
            editProgramStageSectionName({
                programStage: programStage.id,
                programStageSectionId: sectionId,
                newProgramStageSectionName: newName,
            });
        },
        onSectionOrderChanged: ({ changeProgramStageSectionOrder }) => (programStageSections) => {
            changeProgramStageSectionOrder({ programStageSections });
        },
        onSectionAdded: ({ addProgramStageSection }) => (newSectionName) => {
            addProgramStageSection({ newSectionName });
        },
        onSectionRemoved: ({ removeProgramStageSection }) => (programStageSectionId) => {
            removeProgramStageSection({ programStageSectionId });
        },
    }),
);

export default enhance(CreateDataEntryForm);
