import React from 'react';
import log from 'loglevel';

import DropDown from '../forms/form-fields/drop-down';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';

import snackActions from '../Snackbar/snack.actions';
import modelToEditStore from './modelToEditStore';

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
            categoryCombo: null,
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

        this.handleCategoryComboChange = this.handleCategoryComboChange.bind(this);
        this.swapSections = this.swapSections.bind(this);
        this.moveSectionUp = this.moveSectionUp.bind(this);
        this.moveSectionDown = this.moveSectionDown.bind(this);

        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    }

    handleCategoryComboChange(event) {
        this.setState({ categoryCombo: event.target.value });
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

    renderCategoryComboBox() {
        return (
            <DropDown
                options={this.state.categoryCombos}
                labelText={this.getTranslation('category_combo')}
                onChange={this.handleCategoryComboChange}
                defaultValue={this.state.categoryCombo}
                isRequired
            />
        );
    }

    render() {
        const noop = () => {
            snackActions.show({ message: 'Exciting funcionality coming soon™', action: 'huh?' });
        };
        const contextActions = {
            edit: noop,
            delete: noop,
            translate: noop,
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
                    columns={['displayName', 'sortOrder']}
                    rows={this.state.sections}
                    contextMenuActions={contextActions}
                    contextMenuIcons={contextMenuIcons}
                    isContextActionAllowed={contextActionChecker}
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
