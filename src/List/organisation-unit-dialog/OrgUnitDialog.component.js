import React from 'react';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import OrgUnitSelectByLevel from 'd2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component';
import OrgUnitSelectByGroup from 'd2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component';
import OrgUnitSelectAll from 'd2-ui/lib/org-unit-select/OrgUnitSelectAll.component';

import snackbarActions from '../../Snackbar/snack.actions';

class OrgUnitDialog extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            selected: this.props.model.organisationUnits.toArray().map(i => i.id),
            groups: [],
            levels: [],
            loading: false,
        };

        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        this.toggleOrgUnit = this.toggleOrgUnit.bind(this);
        this.setNewSelection = this.setNewSelection.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillMount() {
        const d2 = this.context.d2;

        Promise.all([
            d2.models.organisationUnitLevels.list({
                paging: false,
                fields: 'id,level,displayName',
                order: 'level:asc',
            }),
            d2.models.organisationUnitGroups.list({
                paging: false,
                fields: 'id,displayName',
            }),
        ])
            .then(([
                levels,
                groups,
            ]) => {
                this.setState({ groups, levels });
            });
    }

    componentWillReceiveProps(props) {
        if (props.model) {
            this.setState({
                selected: props.model.organisationUnits.toArray().map(i => i.id),
            });
        }
    }

    setNewSelection(selected) {
        const d2 = this.context.d2;
        const modelOrgUnits = this.props.model.organisationUnits;
        const assigned = modelOrgUnits.toArray().map(ou => ou.id);

        const additions = selected
        // Filter out already assigned ids
            .filter(id => assigned.indexOf(id) === -1)
            // Add the rest
            .map(id => d2.models.organisationUnits.create({ id }));

        const deletions = assigned
        // Filter out ids that should be left in
            .filter(id => selected.indexOf(id) === -1)
            // Add the rest
            .map(id => d2.models.organisationUnits.create({ id }));

        additions.forEach(ou => {
            modelOrgUnits.add(ou);
        });
        deletions.forEach(ou => {
            modelOrgUnits.remove(ou);
        });

        this.setState({ selected });
    }

    toggleOrgUnit(e, orgUnit) {
        if (this.state.selected.indexOf(orgUnit.id) === -1) {
            this.props.model.organisationUnits.add(orgUnit);
            this.setState(state => ({
                selected: state.selected.concat(orgUnit.id),
            }));
        } else {
            this.props.model.organisationUnits.remove(orgUnit);
            this.setState(state => ({
                selected: state.selected.filter(x => x !== orgUnit.id),
            }));
        }
    }

    save() {
        if (this.props.model.isDirty()) {
            this.setState({ loading: true });
            this.props.model
                .save()
                .then(() => {
                    this.setState({ loading: false });
                    this.props.onOrgUnitAssignmentSaved();
                    this.props.onRequestClose();
                })
                .catch(err => {
                    this.setState({ loading: false });
                    this.props.onOrgUnitAssignmentError(err);
                    this.props.onRequestClose();
                });
        } else {
            snackbarActions.show({ message: this.getTranslation('no_changes_to_be_saved'), action: 'ok' });
            this.props.onRequestClose();
        }
    }

    render() {
        const {
            root,
        } = { ...this.props };

        const styles = {
            dialog: {
                minWidth: 875, maxWidth: '100%',
            },
            wrapper: {
                position: 'relative',
                height: 450, minHeight: 450, maxHeight: 450,
                minWidth: 800,
            },
            loadingMask: {
                position: 'fixed',
                top: 54, right: 22,
                width: 480,
                height: 250,
                background: 'rgba(255,255,255,0.6)',
                zIndex: 5,
            },
            controls: {
                position: 'fixed',
                top: 56, right: 24,
                width: 475,
                zIndex: 1,
                background: 'white',
            },
            cancelButton: {
                marginRight: 16,
            },
        };

        const dialogActions = [
            <FlatButton
                label={this.getTranslation('cancel')}
                onClick={this.props.onRequestClose}
                style={styles.cancelButton}
                disabled={this.state.loading}
            />,
            <RaisedButton
                primary
                label={this.getTranslation('save')}
                onClick={this.save}
                disabled={this.state.loading}
            />,
        ];

        return (
            <Dialog
                title={`${this.props.model.displayName} ${this.getTranslation('org_unit_assignment')}`}
                actions={dialogActions}
                autoScrollBodyContent
                autoDetectWindowHeight
                contentStyle={styles.dialog}
                {...this.props}
            >
                <div style={styles.wrapper}>
                    {this.state.loading ? (
                        <div style={styles.loadingMask}>
                            <LoadingMask />
                        </div>
                    ) : undefined}
                    <div style={styles.controls}>
                        <OrgUnitSelectByGroup
                            groups={this.state.groups}
                            selected={this.state.selected}
                            onUpdateSelection={this.setNewSelection}
                        />
                        <OrgUnitSelectByLevel
                            levels={this.state.levels}
                            selected={this.state.selected}
                            onUpdateSelection={this.setNewSelection}
                        />
                        <div style={{ marginTop: 16 }}>
                            <OrgUnitSelectAll
                                selected={this.state.selected}
                                onUpdateSelection={this.setNewSelection}
                            />
                        </div>
                    </div>
                    <div className="organisation-unit-tree__selected">
                        {`${this.state.selected.length} ${this.getTranslation('organisation_units_selected')}`}
                    </div>
                    <OrgUnitTree
                        root={root}
                        selected={this.state.selected}
                        initiallyExpanded={[root.id]}
                        onClick={this.toggleOrgUnit}
                    />
                </div>
            </Dialog>
        );
    }
}
OrgUnitDialog.propTypes = {
    onRequestClose: React.PropTypes.func.isRequired,
    root: React.PropTypes.object.isRequired,
    model: React.PropTypes.object.isRequired,
    onOrgUnitAssignmentSaved: React.PropTypes.func.isRequired,
    onOrgUnitAssignmentError: React.PropTypes.func.isRequired,
};
OrgUnitDialog.contextTypes = {
    d2: React.PropTypes.any,
};

export default OrgUnitDialog;
