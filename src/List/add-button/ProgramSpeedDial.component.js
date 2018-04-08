import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial';

import FontIcon from 'material-ui/FontIcon/FontIcon';
import Avatar from 'material-ui/Avatar';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

import { goToRoute } from '../../router-utils';

class ProgramSpeedDial extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            items: [
                {
                    id: 'WITHOUT_REGISTRATION',
                    primaryText: context.d2.i18n.getTranslation('event_program'),
                    rightAvatar: (<Avatar className="material-icons" icon={<FontIcon>event</FontIcon>} />),
                },
                {
                    id: 'WITH_REGISTRATION',
                    primaryText: context.d2.i18n.getTranslation('tracker_program'),
                    rightAvatar: (<Avatar className="material-icons" icon={<FontIcon>assignment</FontIcon>} />),
                },
            ],
        };
    }

    handleClick(item) {
        goToRoute(`/edit/${this.props.groupName}/${this.props.modelType}/add?type=${item.id}`);
    }

    render() {
        return (
            <SpeedDial hasBackdrop>
                <BubbleList>
                    {this.state.items.map((item, index) =>
                        <BubbleListItem key={item.id} {...item} onClick={this.handleClick.bind(this, item)} />,
                    )}
                </BubbleList>
            </SpeedDial>
        );
    }
}

ProgramSpeedDial.propTypes = {
    groupName: PropTypes.string.isRequired,
    modelType: PropTypes.string.isRequired,
};

export default addD2Context(ProgramSpeedDial);
