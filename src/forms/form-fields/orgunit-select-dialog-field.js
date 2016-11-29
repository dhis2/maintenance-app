import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import TextField from 'material-ui/TextField';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTreeMultipleRoots.component';

import appStateStore from '../../App/appStateStore';

// TODO: Search?

class OrgUnitTreeSingleSelect extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            dialogOpen: false,
            value: props.value,
            roots: [],
            initiallyExpanded: [],
        };

        if (props.value) {
            context.d2.models.organisationUnits.get(props.value.id, { fields: 'id,displayName,path', }).then(orgUnit => {
                this.setState({
                    initiallyExpanded: orgUnit.path
                        .split('/')
                        .filter(ou => ou.trim().length > 0)
                        .filter(ou => ou !== orgUnit.id),
                    parentName: orgUnit.displayName,
                });
            });
        }

        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        this.handleSelectClick = this.handleSelectClick.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillMount() {
        this.disposables = [];
        this.disposables.push(appStateStore.subscribe((appState) => {
            this.setState({ roots: appState.userOrganisationUnits.toArray() });
        }));
    }

    componentWillUnmount() {
        this.disposables.forEach(disposable => disposable.dispose && disposable.dispose());
    }

    handleSelectClick(e, orgUnit) {
        this.setState({ value: orgUnit });
    }

    save() {
        this.props.onChange({ target: { value: { id: this.state.value.id } } });
        this.setState({
            dialogOpen: false,
            parentName: this.state.value.displayName,
            initiallyExpanded: this.state.value.path
                .split('/')
                .filter(ou => ou.trim().length > 0)
                .filter(ou => ou !== this.state.value.id)
        });
    }

    render() {
        const styles = {
            wrapper: {
                color: 'rgba(0,0,0,0.4)',
            },
            dialogContent: {
                minHeight: 450, maxHeight: 450,
            },
            cancelButton: {
                marginRight: '16px',
            },
        };

        const dialogActions = [
            <FlatButton
                label={this.getTranslation('cancel')}
                onClick={() => this.setState({ dialogOpen: false })}
                style={styles.cancelButton}
            />,
            <RaisedButton
                primary
                label={this.getTranslation('select')}
                onClick={this.save}
            />,
        ];

        return this.props.value ? (
            <div style={styles.wrapper}>
                <TextField
                    floatingLabelText={this.props.labelText}
                    style={{width: '100%'}}
                    value={this.state.parentName || ''}
                    onClick={(e) => this.setState({ value: this.props.value, dialogOpen: true })}
                />
                <Dialog
                    open={this.state.dialogOpen}
                    title={this.props.labelText}
                    onRequestClose={() => this.setState({ dialogOpen: false })}
                    autoScrollBodyContent
                    autoDetectWindowHeight
                    actions={dialogActions}
                >
                    <div style={styles.dialogContent}>
                        <OrgUnitTree
                            roots={this.state.roots}
                            selected={[this.state.value.id]}
                            initiallyExpanded={this.state.initiallyExpanded}
                            onSelectClick={this.handleSelectClick}
                        />
                    </div>
                </Dialog>
            </div>
        ) : null;
    }
}
OrgUnitTreeSingleSelect.contextTypes = {
    d2: React.PropTypes.object.isRequired,
};
OrgUnitTreeSingleSelect.propTypes = {
    value: React.PropTypes.object.isRequired,
    readOnly: React.PropTypes.bool,
};

export default OrgUnitTreeSingleSelect;
