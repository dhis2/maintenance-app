import React from 'react';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';

class OrgUnitDialog extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            selected: this.props.model.organisationUnits.toArray().map(i => i.id),
        };

        this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        this.toggleOrgUnit = this.toggleOrgUnit.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.model) {
            this.setState({
                selected: props.model.organisationUnits.toArray().map(i => i.id),
            });
        }
    }

    toggleOrgUnit(e, orgUnit) {
        if (this.state.selected.indexOf(orgUnit.id) === -1) {
            this.props.model.organisationUnits.add(orgUnit).save()
                .then(() => { this.props.onOrgUnitAssignmentSaved(); })
                .catch(err => { this.props.onOrgUnitAssignmentErrored(err); });

            this.setState(state => ({
                selected: state.selected.concat(orgUnit.id),
            }));
        } else {
            this.props.model.organisationUnits.remove(orgUnit).save()
                .then(() => { this.props.onOrgUnitAssignmentSaved(); })
                .catch(err => { this.props.onOrgUnitAssignmentErrored(err); });

            this.setState(state => ({
                selected: state.selected.filter(x => x !== orgUnit.id),
            }));
        }
    }

    render() {
        const {
            root,
        } = { ...this.props };

        const dialogActions = [
            <FlatButton label={this.getTranslation('close')} onClick={this.props.onRequestClose} />,
        ];

        return (
            <Dialog
                title={this.props.model.displayName}
                actions={dialogActions}
                autoScrollBodyContent
                autoDetectWindowHeight
                {...this.props}
            >
                <div style={{ height: 450, minHeight: 450, maxHeight: 450 }}>
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
};
OrgUnitDialog.contextTypes = {
    d2: React.PropTypes.any,
};

export default OrgUnitDialog;
