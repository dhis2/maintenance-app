import React from 'react';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';
function noop() {}

function MaintenanceSideBar(props) {
    const sideBarWrapperStyle = {
        //display: 'flex',
        //flexDirection: 'column',
        //flexFlow: 'column',
        //flex: 1,
    };

    return (
        <div style={sideBarWrapperStyle}>
            <Sidebar
                sections={props.sections}
                onChangeSection={props.onChangeSection || noop}
                currentSection={props.currentSection}
                styles={Object.assign({leftBar: {overflowY: 'initial'}}, props.style)}
            />
            {props.children}
        </div>
    );
}
MaintenanceSideBar.propTypes = {
    style: React.PropTypes.object,
    sections: React.PropTypes.arrayOf(React.PropTypes.object),
    onChangeSection: React.PropTypes.func,
    currentSection: React.PropTypes.string,
};
MaintenanceSideBar.defaultProps = {
    style: {},
    sections: [],
};

export default MaintenanceSideBar;
