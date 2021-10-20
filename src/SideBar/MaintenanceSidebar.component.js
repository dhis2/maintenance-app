import PropTypes from 'prop-types'
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';
import noop from 'd2-utilizr/lib/noop';

function MaintenanceSideBar(props) {
    const sideBarWrapperStyle = {};

    return (
        <div style={sideBarWrapperStyle}>
            <Sidebar
                sections={props.sections}
                onChangeSection={noop}
                onSectionClick={props.onChangeSection || noop}
                currentSection={props.currentSection}
                styles={Object.assign({ leftBar: { overflowY: 'initial' } }, props.style)}
            />
            {props.children}
        </div>
    );
}

MaintenanceSideBar.propTypes = {
    style: PropTypes.object,
    sections: PropTypes.arrayOf(PropTypes.object),
    onChangeSection: PropTypes.func,
    currentSection: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};
MaintenanceSideBar.defaultProps = {
    style: {},
    sections: [],
};

export default MaintenanceSideBar;
