import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import { path, getOr } from 'lodash/fp';

import contextActions from './ContextActions';
import getConstantDisplayNameOrOld from '../helpers/getConstantDisplayNameOrOld';
import snackActions from '../../Snackbar/snack.actions';
import { withAuth } from '../../utils/Auth';

const styles = {
    dataTableWrap: {
        display: 'flex',
        flexDirection: 'column',
        flex: 2,
    },
};

class ListDataTable extends Component {
    getTranslation = key => this.context.d2.i18n.getTranslation(key);

    // For table columns like 'a___b', flatten values to b being a child of a
    magicallyUnwrapChildValues = (row) => {
        this.props.tableColumns.reduce((o, col) => {
            if (col.includes('___')) {
                const objectName = col.substr(0, col.indexOf('___'));

                const objectProp = col.substr(col.indexOf('___') + 3);

                const column = getOr('', `row[${objectName}][${objectProp}]`, row);

                Object.assign(o, { [col]: column });
            }
            return o;
        }, row);
        return row;
    }

    // Because "default" really means "None" and that's something everybody knows duh
    defaultReallyMeansNone = (row) => {
        if (path('displayName', row.categoryCombo) &&
            row.categoryCombo.displayName === 'default' &&
            row.categoryCombo___displayName === row.categoryCombo.displayName
        ) {
            row.categoryCombo___displayName = this.getTranslation('none');
            row.categoryCombo.displayName = this.getTranslation('none');
        }
        return row;
    }


    // Get translations for row values that are constants
    // Some props are read only on the model object, which means the can not be translated - boo!
    translateConstants = (row) => {
        const untranslatableColumnNames = {
            organisationUnit: ['level'],
            dataSet: ['formType'],
        };

        const isTranslatable = (modelType, columnName) => {
            const b = !(
                untranslatableColumnNames.hasOwnProperty(modelType) &&
                untranslatableColumnNames[modelType].includes(columnName)
            );
            return b;
        };


        return row.noMoreGottaTranslateCauseIsDone
            ? row
            : this.props.tableColumns.reduce((prow, columnName) => {
                if (isTranslatable(row.modelDefinition.name, columnName) &&
                    path(`modelDefinition.modelProperties[${columnName}].constants`, row)
                ) {
                    // Hack it to fix another hack - sweeet
                    row.noMoreGottaTranslateCauseIsDone = true;

                    const displayName = getConstantDisplayNameOrOld(
                        row.modelDefinition.name,
                        columnName,
                        row[columnName],
                    ).toLowerCase();

                    if (row[columnName]) {
                        prow[columnName] = this.getTranslation(displayName);
                    }
                }
                return prow;
            }, row);
    }

    // Filters out any actions `edit`, `clone` when the user can not update/edit this modelType
    actionsThatRequireCreate = (action) => {
        const modelDef = this.props.getModelDefinitionByName(this.props.modelType);
        if ((action !== 'edit' && action !== 'clone') || this.props.getCurrentUser().canUpdate(modelDef)) {
            return true;
        }
        return false;
    }

    // Filters out the `delete` when the user can not delete this modelType
    actionsThatRequireDelete = (action) => {
        const modelDef = this.props.getModelDefinitionByName(this.props.modelType);
        if (action !== 'delete' || this.props.getCurrentUser().canDelete(modelDef)) {
            return true;
        }
        return false;
    }

    handleActionSpecialCases = (action, model) => {
        const hasWriteAccess = model.access.write;
        const hasReadAccess = model.access.read;

        const isDataSet = model.modelDefinition.name === 'dataSet';
        const isProgram = model.modelDefinition.name === 'program';
        const isPushAnalysis = model.modelDefinition.name === 'pushAnalysis';
        const isDataSetWithWriteAccess = isDataSet && hasWriteAccess;
        const isPushAnalysisWithWriteAccess = isPushAnalysis && hasWriteAccess;

        const isActionAllowed = {
            edit: hasWriteAccess,
            clone: !isDataSet && !isProgram && hasWriteAccess,
            translate: hasReadAccess && model.modelDefinition.identifiableObject,
            details: hasReadAccess,
            share: model.modelDefinition.isShareable && hasWriteAccess,
            compulsoryDataElements: isDataSetWithWriteAccess,
            sectionForm: isDataSetWithWriteAccess,
            dataEntryForm: isDataSetWithWriteAccess,
            pdfDataSetForm: isDataSet && hasReadAccess,
            runNow: isPushAnalysisWithWriteAccess,
            preview: isPushAnalysisWithWriteAccess,
        };
        return isActionAllowed.hasOwnProperty(action)
            ? isActionAllowed[action]
            : true;
    }

    handleCategoryOptionCombo = (action, model) => {
        if (action === 'edit') {
            return model.access.write;
        }

        if (action === 'details') {
            return model.access.read;
        }

        return false;
    }

    handleActions = (action, model) => {
        // TODO: Remove categoryOptionCombo available actions hack when this is sorted through the API
        if (model.modelDefinition.name === 'categoryOptionCombo') {
            this.handleCategoryOptionCombo(action, model);
        }

        // Shortcut for access detection where action names match to access properties
        if (model.access.hasOwnProperty(action)) {
            return model.access[action];
        }

        if ((action === 'runNow') && (model.modelDefinition.name === 'predictor')) {
            return this.context.d2.currentUser.authorities.has('F_PREDICTOR_RUN');
        }

        return this.handleActionSpecialCases(action, model);
    }

    // Don't allow anything if we can't determine the access
    isContextActionAllowed = (model, action) => (
        path('access', model)
            ? this.handleActions(action, model)
            : false
    );

    render() {
        const contextMenuIcons = {
            clone: 'content_copy',
            sharing: 'share',
            sectionForm: 'assignment_turned_in',
            dataEntryForm: 'assignment',
            pdfDataSetForm: 'picture_as_pdf',
            compulsoryDataElements: 'border_color',
            runNow: 'queue_play_next',
            preview: 'dashboard',
        };

        const primaryAction = (model) => {
            if (model.access.write) {
                this.availableActions.edit(model);
            } else {
                // TODO: The no access message should be replaced with the read-only mode described in DHIS2-1773
                snackActions.show({
                    message: 'you_do_not_have_permissions_to_edit_this_object',
                    translate: true,
                    action: 'dismiss',
                });
            }
        };

        const availableActions =
            Object.keys(contextActions)
                .filter(this.actionsThatRequireCreate)
                .filter(this.actionsThatRequireDelete)
                .filter((actionName) => {
                    if (actionName === 'share') {
                        return path('isShareable', this.context.d2.models[this.props.modelType]);
                    }
                    return true;
                })
                .reduce((actions, actionName) => {
                    actions[actionName] = contextActions[actionName];
                    return actions;
                }, {});

        const rows = this.props.dataRows
            .map(this.magicallyUnwrapChildValues)
            .map(this.defaultReallyMeansNone)
            .map(this.translateConstants);

        return (
            <div style={styles.dataTableWrap}>
                {!!this.props.dataRows && !!this.props.dataRows.length
                    ? (<DataTable
                        rows={rows}
                        columns={this.props.tableColumns}
                        contextMenuActions={availableActions}
                        contextMenuIcons={contextMenuIcons}
                        primaryAction={primaryAction}
                        isContextActionAllowed={this.isContextActionAllowed}
                    />)
                    : <div>{this.getTranslation('no_results_found')}</div>}
            </div>
        );
    }
}

ListDataTable.propTypes = {
    getCurrentUser: PropTypes.func.isRequired,
    getModelDefinitionByName: PropTypes.func.isRequired,
    modelType: PropTypes.string.isRequired,
    dataRows: PropTypes.array.isRequired,
    tableColumns: PropTypes.array.isRequired,
};

ListDataTable.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default withAuth(ListDataTable);
