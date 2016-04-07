import React from 'react';
import TopBarButtons from '../TopBar/TopBarButtons.component';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

function SectionTabs(props) {
    const styles = {
        navStyle: {
            display: 'flex',
            flexOrientation: 'row',
            position: 'fixed',
            background: '#5892BE',
            width: '100%',
            zIndex: 10,
            top: '44px',
            flex: 1,
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
            flex: 1,
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
    };

    const sections = props.sections
        .map((section, index) => {
            return (
                <Tab key={index} label={section.label} value={section.key} />
            );
        });

    return (
        <div style={styles.navStyle}>
            <div style={styles.tabsWrap}>
                <Tabs value={props.current || 'unknown'} onChange={props.changeSection} style={styles.tabsStyle} tabItemContainerStyle={styles.tabItemContainerStyle}>
                    {sections}
                </Tabs>
            </div>
            <div style={styles.extraButtons}>
                <TopBarButtons />
            </div>
        </div>
    );
}
SectionTabs.defaultProps = {
    sections: [],
};

export default SectionTabs;
