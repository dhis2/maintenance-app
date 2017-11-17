import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon/FontIcon';
import Avatar from 'material-ui/Avatar';
import Auth from 'd2-ui/lib/auth/Auth.mixin';
import { goToRoute } from '../router-utils';
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial';

class ProgramSpeedDial extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [
                {
                    id: 'WITHOUT_REGISTRATION',
                    primaryText: 'Event Program',
                    rightAvatar: (<Avatar className="material-icons" icon={<FontIcon>event</FontIcon>} />)
                },
                {
                    id: 'WITH_REGISTRATION',
                    primaryText: 'Tracker Program',
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

const ListActionBar = React.createClass({
    propTypes: {
        modelType: React.PropTypes.string.isRequired,
        groupName: React.PropTypes.string.isRequired
    },

    mixins: [Auth],

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
            zIndex: 10
        };

        const modelDefinition = this.getModelDefinitionByName(
            this.props.modelType
        );

        if (!this.getCurrentUser().canCreate(modelDefinition)) {
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

export default ListActionBar;
