import React, { PropTypes } from 'react';
import TopBarButtons from '../TopBar/TopBarButtons.component';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import noop from 'd2-utilizr/lib/noop';
import { shouldRenderHeaderBar } from '../utils/shouldRenderHeaderBar';
// import { IconWarning } from 'material-ui/svg-icons';
import IconWarning from 'material-ui/svg-icons/alert/warning';
import IconInfo from 'material-ui/svg-icons/action/info';

function SectionTabs(props) {
    const styles = {
        navContainer: {
            zIndex: 10,
            top: shouldRenderHeaderBar ? '44px' : 0,
            position: 'fixed',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        redirectBar: {
            backgroundColor: '#ffecb3',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px 16px',
            gap: '4px',
        },
        navStyle: {
            display: 'flex',
            flexOrientation: 'row',            
            background: '#E4E4E4',            
        },
        navButtonStyle: {
            display: 'inline-block',
            padding: '1rem',
            width: '100%',
            borderBottom: '2px solid #DDD',
            color: '#AAA',
        },
        navWrapButtonStyle: {
            width: 'auto',
        },
        extraButtons: {
            flex: 0,
            textAlign: 'right',
        },
        tabItemContainerStyle: {
            width: 'auto',
            backgroundColor: 'transparent',
        },
        tabsStyle: {
            // flex: 1,
        },
        tabsWrap: {
            flex: 1,
        },
        tabStyle: {
            color: 'rgba(0,0,0,0.6)',
        },
        disabledTabStyle: {
            color: 'rgba(0,0,0,0.2)',
        },
        inkBarStyle: {},
        disabledInkBarStyle: {
            opacity: 0.4,
        },
    };

    const sections = props.sections
        .map((section, index) => (
            <Tab
                key={index}
                style={props.disabled ? styles.disabledTabStyle : styles.tabStyle}
                disabled={props.disabled}
                label={section.label}
                value={section.key}
            />
        ));

    return (
        <div style={styles.navContainer}>
            <div style={styles.redirectBar}>
                {/* <IconWarning></IconWarning> */}
                <IconInfo></IconInfo>
                <span>This app is no longer maintained. We recommend that you instead use the <a href='https://www.dhis2.org'>Metadata Management app</a></span>
            </div>
        <div style={styles.navStyle}>
            <div style={styles.tabsWrap}>
                <Tabs
                    value={props.current}
                    onChange={props.changeSection}
                    style={styles.tabsStyle}
                    tabItemContainerStyle={styles.tabItemContainerStyle}
                    inkBarStyle={props.disabled ? styles.disabledInkBarStyle : styles.inkBarStyle}
                >
                    {sections}
                </Tabs>
            </div>
            <div style={styles.extraButtons}>
                <TopBarButtons disabled={props.disabled} />
            </div>
        </div>
        </div>
    );
}
SectionTabs.propTypes = {
    sections: PropTypes.array,
    current: PropTypes.string,
    changeSection: PropTypes.func,
};
SectionTabs.defaultProps = {
    sections: [],
    current: 'unknown',
    changeSection: noop,
};

export default SectionTabs;
