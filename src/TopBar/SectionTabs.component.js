import React, {Component, PropTypes} from 'react';
import TopBarButtons from '../TopBar/TopBarButtons.component';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import noop from 'd2-utilizr/lib/noop';
import { shouldRenderHeaderBar } from '../utils/shouldRenderHeaderBar';
import IconInfo from 'material-ui/svg-icons/action/info';

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
        padding: '12px 16px',
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


class SectionTabs extends Component {
    static contextTypes = {
        d2: PropTypes.object,
    };

    constructor(props, context) {
        super(props);
        this.t = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        this.metadataEndpoint = `${context.d2.Api.getApi().baseUrl}/dhis-web-metadata-management`;
    }

    render() {
        const sections = this.props.sections
            .map((section, index) => (
                <Tab
                    key={index}
                    style={this.props.disabled ? styles.disabledTabStyle : styles.tabStyle}
                    disabled={this.props.disabled}
                    label={section.label}
                    value={section.key}
                />
            ));

        return (
            <div style={styles.navContainer}>
                <div style={styles.redirectBar}>
                    <IconInfo></IconInfo>
                    <span>
                        {this.t('app_no_longer_maintained')} <a href={this.metadataEndpoint}>{this.t('metadata_management_app')}</a>
                    </span>
                </div>
                <div style={styles.navStyle}>
                    <div style={styles.tabsWrap}>
                        <Tabs
                            value={this.props.current}
                            onChange={this.props.changeSection}
                            style={styles.tabsStyle}
                            tabItemContainerStyle={styles.tabItemContainerStyle}
                            inkBarStyle={this.props.disabled ? styles.disabledInkBarStyle : styles.inkBarStyle}
                        >
                            {sections}
                        </Tabs>
                    </div>
                    <div style={styles.extraButtons}>
                        <TopBarButtons disabled={this.props.disabled} />
                    </div>
                </div>
            </div>
        );
    }
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
