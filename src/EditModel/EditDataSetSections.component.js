import React from 'react';
import log from 'loglevel';

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';

import RaisedButton from 'material-ui/lib/raised-button';
import SectionDialog from './SectionDialog.component';

import snackActions from '../Snackbar/snack.actions';
import modelToEditStore from './modelToEditStore';

import TranslationDialog from 'd2-ui/lib/i18n/TranslationDialog.component';

import { goBack } from '../router';

const styles = {
    heading: {
        paddingBottom: 18,
    },
};

class EditDataSetSections extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            categoryCombos: null,
            sectionToEdit: false,
        };

        Promise.all([
            context.d2.Api.getApi().get(
                ['dataSets', props.params.modelId, 'categoryCombos'].join('/'),
                { fields: 'id,displayName', paging: false }
            ),
        ]).then(([
            catComboList,
        ]) => {
            this.setState({
                sections: modelToEditStore.state.sections.toArray().sort((a, b) => a.sortOrder - b.sortOrder),
                categoryCombos: catComboList.categoryCombos.map(cc => ({ value: cc.id, text: cc.displayName })),
            });
        });

        this.handleAddSectionClick = this.handleAddSectionClick.bind(this);
        this.handleEditSectionClick = this.handleEditSectionClick.bind(this);
        this.handleSectionSaved = this.handleSectionSaved.bind(this);

        this.handleDeleteSectionClick = this.handleDeleteSectionClick.bind(this);
        this.handleTranslateSectionClick = this.handleTranslateSectionClick.bind(this);
        this.handleTranslationSaved = this.handleTranslationSaved.bind(this);
        this.handleTranslationErrored = this.handleTranslationErrored.bind(this);

        this.swapSections = this.swapSections.bind(this);
        this.moveSectionUp = this.moveSectionUp.bind(this);
        this.moveSectionDown = this.moveSectionDown.bind(this);

        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    }

    handleAddSectionClick() {
        this.setState(state => ({
            sectionToEdit: Object.assign(modelToEditStore.state.sections.modelDefinition.create(), {
                dataSet: { id: modelToEditStore.state.id },
                sortOrder: state.sections.reduce((p, s) => Math.max(s.sortOrder, p), 0) + 1,
            })
        }));
    }

    handleEditSectionClick(sectionToEdit) {
        this.setState({ sectionToEdit });
    }

    handleSectionSaved(section) {
        this.setState(state => {
            let replaced = false;
            const sections = state.sections
                .map(s => {
                    if (s.id === section.id) {
                        replaced = true;
                        return section;
                    }
                    return s;
                })
                .sort((a, b) => a.sortOrder - b.sortOrder);
            if (!replaced) {
                sections.push(section);
            }

            return {
                sectionToEdit: false,
                sections,
            };
        }, () => {
            this.forceUpdate();
        });
    }

    handleDeleteSectionClick(section) {
        section.delete()
            .then(() => {
                snackActions.show({ message: this.getTranslation('section_deleted'), action: 'ok' });
                this.setState(state => ({
                    sections: state.sections.filter(s => s.id !== section.id),
                }));
            })
            .catch(err => {
                snackActions.show({ message: this.getTranslation('failed_to_delete_section') });
                log.warn('Failed to delete section', err);
            });
    }

    handleTranslateSectionClick(section) {
        this.setState({
            translationModel: section,
        });
    }

    handleTranslationSaved() {
        snackActions.show({ message: 'translation_saved', action: 'ok', translate: true });
    }

    handleTranslationErrored(errorMessage) {
        log.error(errorMessage);
        snackActions.show({ message: 'translation_save_error', translate: true });
    }

    swapSections(sectionA, sectionB) {
        this.setState(state => {
            const swapOrder = sectionA.sortOrder;
            sectionA.sortOrder = sectionB.sortOrder; // eslint-disable-line
            sectionB.sortOrder = swapOrder; // eslint-disable-line

            Promise.all([
                sectionA.save(),
                sectionB.save(),
            ])
                .then(() => {
                    snackActions.show({ message: this.getTranslation('section_moved'), action: 'ok' });
                })
                .catch(err => {
                    log.warn('Failed to swap sections:', err);
                    snackActions.show({ message: this.getTranslation('failed_to_move_section') });
                });

            return {
                sections: state.sections.sort((a, b) => a.sortOrder - b.sortOrder),
            };
        });
    }

    moveSectionUp(section) {
        const currentIndex = this.state.sections.indexOf(section);
        if (currentIndex > 0) {
            const swapSection = this.state.sections[currentIndex - 1];
            this.swapSections(swapSection, section);
        }
    }

    moveSectionDown(section) {
        const currentIndex = this.state.sections.indexOf(section);
        if (currentIndex < this.state.sections.length - 1) {
            const swapSection = this.state.sections[currentIndex + 1];
            this.swapSections(swapSection, section);
        }
    }

    render() {
        // TODO: Actual actions
        const noop = () => {
            snackActions.show({ message: 'Exciting funcionality coming soon™', action: 'huh?' });
        };
        const contextActions = {
            edit: this.handleEditSectionClick,
            delete: this.handleDeleteSectionClick,
            translate: this.handleTranslateSectionClick,
            manage_grey_fields: noop,
            move_up: this.moveSectionUp,
            move_down: this.moveSectionDown,
        };

        const contextMenuIcons = {
            edit: 'edit',
            move_up: 'arrow_upward',
            move_down: 'arrow_downward',
            manage_grey_fields: 'do_not_disturb',
        };

        const contextActionChecker = (model, action) => {
            if (action === 'move_up') {
                return this.state.sections.indexOf(model) > 0;
            } else if (action === 'move_down') {
                return this.state.sections.indexOf(model) < this.state.sections.length - 1;
            }

            return true;
        };

        return this.state.sections === undefined ? <LoadingMask /> : (
            <div>
                <Heading style={styles.heading}>
                    {modelToEditStore.state.displayName} {this.getTranslation('section_management')}
                </Heading>
                <DataTable
                    columns={['name']}
                    rows={this.state.sections}
                    contextMenuActions={contextActions}
                    contextMenuIcons={contextMenuIcons}
                    isContextActionAllowed={contextActionChecker}
                />
                <SectionDialog
                    open={!!this.state.sectionToEdit}
                    categoryCombos={this.state.categoryCombos}
                    dataElements={modelToEditStore.state.dataElements}
                    indicators={modelToEditStore.state.indicators}
                    sectionModel={this.state.sectionToEdit}
                    onRequestClose={() => { this.setState({ sectionToEdit: false }); }}
                    onSaveSection={this.handleSectionSaved}
                />
                {this.state.translationModel ? <TranslationDialog
                    objectToTranslate={this.state.translationModel}
                    objectTypeToTranslate={this.state.translationModel && this.state.translationModel.modelDefinition}
                    open={!!this.state.translationModel}
                    onTranslationSaved={this.handleTranslationSaved}
                    onTranslationError={this.handleTranslationErrored}
                    onRequestClose={() => { this.setState({ translationModel: null }); }}
                    fieldsToTranslate={['name']}
                /> : null }
                <RaisedButton
                    secondary
                    label="Add section"
                    onClick={this.handleAddSectionClick}
                />
            </div>
        );
    }
}

EditDataSetSections.propTypes = {
    params: React.PropTypes.any.isRequired,
};
EditDataSetSections.contextTypes = {
    d2: React.PropTypes.any.isRequired,
};

export default EditDataSetSections;
