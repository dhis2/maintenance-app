import React, { Component } from 'react';
import EditModelForm from './EditModelForm.component';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import OptionManagement from './option-set/OptionManagement.component';
import { camelCaseToUnderscores } from 'd2-utilizr';
import FormHeading from './FormHeading';
import Paper from 'material-ui/lib/paper';
import { goToRoute } from '../router';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

function onSaveError(errorMessage, props) {
    if (errorMessage === 'No changes to be saved') {
        goToRoute(`/list/${props.groupName}/${props.modelType}`);
    }
}

class EditOptionSet extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            tabsValue: props.params.activeView || '',
        };
    }

    render() {
        const context = this.context;
        const props = this.props;
        const params = Object.assign({}, props.params, { modelType: 'optionSet' });
        const styles = {
            tabItemContainerStyle: {
                background: 'transparent',
            },
            tabStyle: {
                color: '#666',
            },
            disabledTabStyle: {
                color: '#999',
                background: 'rgba(0,0,0, 0.1)',
            }
        };
        const activeTab = props.params.activeView ? props.params.activeView : '';
        const isAddOperation = params.modelId === 'add';
        const onTabChanged = (tabsValue, event) => {
            this.setState({
                tabsValue,
            });
            goToRoute(`/edit/${params.groupName}/${params.modelType}/${params.modelId}/${tabsValue}`);
        };

        const successHandler = (model) => {
            if (isAddOperation) {
                goToRoute(`/edit/${params.groupName}/${params.modelType}/${model.id}/options`);
            } else {
                goToRoute(`/list/${params.groupName}/${params.modelType}`);
            }
        };

        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                    <FormHeading>{camelCaseToUnderscores(params.modelType)}</FormHeading>
                </div>
                <Paper>
                    <Tabs
                        tabItemContainerStyle={styles.tabItemContainerStyle}
                        value={activeTab}
                        onChange={onTabChanged}
                    >
                        <Tab
                            value=""
                            label={context.d2.i18n.getTranslation('primary_details')}
                            style={styles.tabStyle}
                        >
                            <EditModelForm
                                {...props}
                                {...params}
                                onCancel={() => goToRoute(`/list/${params.groupName}/${params.modelType}`)}
                                onSaveSuccess={successHandler}
                                onSaveError={(errorMessage) => onSaveError(errorMessage, params)}
                            />
                        </Tab>
                        <Tab
                            value="options"
                            label={context.d2.i18n.getTranslation('options')}
                            disabled={isAddOperation}
                            style={(isAddOperation ? styles.disabledTabStyle : styles.tabStyle)}
                        >
                            <OptionManagement />
                        </Tab>
                    </Tabs>
                </Paper>
            </div>
        );
    }
}

export default addD2Context(EditOptionSet);
