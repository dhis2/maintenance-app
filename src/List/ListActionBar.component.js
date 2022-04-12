import { Component } from 'react';
import ReactCreateClass from 'create-react-class'
import PropTypes from 'prop-types'
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import Avatar from 'material-ui/Avatar';
import { goToRoute } from '../router-utils';
import { withAuth } from "../utils/Auth";
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial';
import { addD2Context } from '@dhis2/d2-ui-core';

class ProgramSpeedDial extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            items: [
                {
                    id: 'WITHOUT_REGISTRATION',
                    primaryText: context.d2.i18n.getTranslation('event_program'),
                    rightAvatar: (<Avatar className="material-icons" icon={<FontIcon>event</FontIcon>} />)
                },
                {
                    id: 'WITH_REGISTRATION',
                    primaryText: context.d2.i18n.getTranslation('tracker_program'),
                    rightAvatar: (<Avatar className="material-icons" icon={<FontIcon>assignment</FontIcon>} />)
                }
            ]
        }
    }

    handleClick(item) {
        goToRoute(`/edit/${this.props.groupName}/${this.props.modelType}/add?type=${item.id}`)
    }

    render() {
        return (
            <SpeedDial hasBackdrop={true}>
                <BubbleList>
                    {this.state.items.map((item, index) =>
                        <BubbleListItem key={item.id} {...item} onClick={this.handleClick.bind(this, item)}/>
                    )}
                </BubbleList>
            </SpeedDial>
        );
    }
}

ProgramSpeedDial = addD2Context(ProgramSpeedDial);

const ListActionBar = ReactCreateClass({
    propTypes: {
        modelType: PropTypes.string.isRequired,
        groupName: PropTypes.string.isRequired
    },

    _addClick() {
        goToRoute(`/edit/${this.props.groupName}/${this.props.modelType}/add`);
    },

    render() {
        const cssStyles = {
            textAlign: 'right',
            marginTop: '1rem',
            bottom: '1.5rem',
            right: '1.5rem',
            position: 'fixed',
            zIndex: 10,
        };

        const modelDefinition = this.props.getModelDefinitionByName(
            this.props.modelType
        );

        if (!this.props.getCurrentUser().canCreate(modelDefinition)) {
            return null;
        }

        if (this.props.modelType === 'program' && !this.props
                .getCurrentUser()
                .canCreate(
                    this.props.getModelDefinitionByName('programStage')
                )) {
            return null;
        }

        return (
            <div style={cssStyles}>
                {this.props.modelType === 'program' ? <ProgramSpeedDial {...this.props} /> : (<FloatingActionButton onClick={this._addClick}>
                    <FontIcon className="material-icons">add</FontIcon>
                </FloatingActionButton>)}
            </div>
        );
    }
});

export default withAuth(ListActionBar);
