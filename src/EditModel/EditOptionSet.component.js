import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import Paper from 'material-ui/Paper/Paper';

import { camelCaseToUnderscores } from 'd2-utilizr';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

import EditModelForm from './EditModelForm.component';
import OptionManagement from './option-set/OptionManagement.component';
import FormHeading from './FormHeading';
import { goToRoute } from '../router-utils';
import LoadingMask from '../loading-mask/LoadingMask.component';

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
            loading: true,
        };
    }

    async componentDidMount() {
        const api = this.context.d2.Api.getApi();

        try {
            const { attributes } = await api.get('attributes', { fields: ':all,optionSet[:all,options[:all]]', paging: false });

            this.reloadAttributes('optionSet', attributes);
            this.reloadAttributes('option', attributes);

        } catch (error) {
            console.error(error);

        } finally {
            this.setState({ loading: false });
        }
    }

    reloadAttributes(modelDefinitionName, attributes) {
            const modelDefinition = this.context.d2.models[modelDefinitionName];
            const schemaAttributes = attributes.filter((attributeDescriptor) => {
                return attributeDescriptor[`${modelDefinitionName}Attribute`] === true;
            });

            // clear without reassigning 
            for (const key in modelDefinition.attributeProperties) {
                if (modelDefinition.attributeProperties.hasOwnProperty(key)) {
                    delete modelDefinition.attributeProperties[key];
                }
            }

            // Attach fresh attributes
            for (const attribute of schemaAttributes) {
                modelDefinition.attributeProperties[attribute.name] = attribute;
            }
        
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
            },
        };
        const activeTab = props.params.activeView ? props.params.activeView : '';
        const isAddOperation = params.modelId === 'add';
        const onTabChanged = (tabsValue) => {
            // The following check prevents propagated change events to change the tabs. (https://jira.dhis2.org/browse/DHIS2-1059)
            // TODO: This has been fixed in material-ui 0.16. So this can be removed when upgraded. (https://github.com/callemall/material-ui/issues/2189)
            if (typeof tabsValue !== 'string') { return; }

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

        if (this.state.loading) {
            return <LoadingMask />
        }

        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                    <FormHeading schema="optionSet" groupName="otherSection">
                        {camelCaseToUnderscores(params.modelType)}
                    </FormHeading>
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
                                onSaveError={errorMessage => onSaveError(errorMessage, params)}
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

EditOptionSet.propTypes = {
    params: PropTypes.any.isRequired,
};

export default addD2Context(EditOptionSet);
