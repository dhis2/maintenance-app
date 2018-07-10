import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DropdownAsync from '../../forms/form-fields/drop-down-async';

const TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE';
const PROGRAM_INSTANCE = 'PROGRAM_INSTANCE';
const PROGRAM_STAGE_INSTANCE = 'PROGRAM_STAGE_INSTANCE';

const constraintOptions = [TRACKED_ENTITY_INSTANCE, PROGRAM_INSTANCE, PROGRAM_STAGE_INSTANCE];

// Map of the different valid selection of the embedded objects, according to selected constraint-type
const modelTypesForRelationshipEntity = {
    TRACKED_ENTITY_INSTANCE: [
        {
            modelType: 'trackedEntityType',
            required: true,
        },
        {
            modelType: 'program',
            required: false,
        },
    ],
    PROGRAM_INSTANCE: [
        {
            modelType: 'program',
            required: true,
        },
    ],
    PROGRAM_STAGE_INSTANCE: [
        {
            modelType: 'program',
            mutex: 'programStage',
            required: true,
        },
        {
            modelType: 'programStage',
            mutex: 'program',
            required: true,
        },
    ],
};

const styles = {
    modelTypeWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'top',
        marginBottom: '16px',
        paddingLeft: '8px',
        paddingRight: '8px',
        borderStyle: 'none none none solid',
        borderWidth: '1px',
        borderColor: 'rgb(189, 189, 189)',
    },
    modelTypeSelectField: {
        flex: '1 1 300px',
        marginRight: '14px',
    },
};

class Constraint extends Component {
    constructor(props, context) {
        super(props);
        this.translate = context.d2.i18n.getTranslation.bind(context.d2.i18n);

        let embeddedValue = null;
        let relationshipEntity = null;

        if (props.value) {
            relationshipEntity = props.value.relationshipEntity;
            if (relationshipEntity) {
                const modelTypes = modelTypesForRelationshipEntity[relationshipEntity];
                embeddedValue = {};
                modelTypes.forEach(objOpts => {
                    const modelType = objOpts.modelType;
                    if (props.value[modelType]) {
                        embeddedValue[modelType] = props.value[modelType];
                    }
                });
            }
        }

        this.state = {
            relationshipEntity,
            embeddedValue,
        };
    }

    selectRelationshipEntity = (_, __, value) => {
        this.setState({
            relationshipEntity: value,
            embeddedValue: {},
        });
    };

    handleEmbeddedValueSelect = (modelType, { target: { value } }) => {
        const objOptions = modelTypesForRelationshipEntity[this.state.relationshipEntity].find(
            obj => obj.modelType === modelType,
        );

        // Clear values if mutually exclusive
        const prevState = objOptions.mutex ? {} : this.state.embeddedValue;
        const relationshipConstraint = {
            ...prevState,
            relationshipEntity: this.state.relationshipEntity,
            [modelType]: {
                id: (value && value.id) || null,
            },
        };
        this.props.onChange({
            target: {
                value: relationshipConstraint,
            },
        });

        this.setState({
            embeddedValue: relationshipConstraint,
        });
    };

    renderModelTypeSelect = () => {
        const entity = this.state.relationshipEntity;
        const modelTypes = modelTypesForRelationshipEntity[entity];
        const modelDropdowns = modelTypes.map(objOpts => {
            const modelType = objOpts.modelType;
            return (
                <div style={styles.modelTypeSelectField}>
                    <DropdownAsync
                        {...this.props}
                        isRequired={objOpts.required}
                        labelText={`${this.translate(camelCaseToUnderscores(modelType))} ${
                            objOpts.required ? ' *' : ''
                        }`}
                        value={this.state.embeddedValue[modelType]}
                        key={modelType}
                        referenceType={modelType}
                        onChange={this.handleEmbeddedValueSelect.bind(this, modelType)}
                    />
                </div>
            );
        });

        return <div style={styles.modelTypeWrapper}>{modelDropdowns}</div>;
    };

    render = () => {
        return (
            <div>
                <SelectField
                    fullWidth
                    value={this.state.relationshipEntity}
                    onChange={this.selectRelationshipEntity}
                    floatingLabelText={this.props.labelText}
                >
                    {constraintOptions.map(constraint => (
                        <MenuItem
                            key={constraint}
                            value={constraint}
                            primaryText={this.translate(constraint)}
                        />
                    ))}
                </SelectField>
                {this.state.relationshipEntity && this.renderModelTypeSelect()}
            </div>
        );
    };
}

Constraint.contextTypes = {
    d2: PropTypes.object,
};

export default new Map([
    [
        'fromConstraint',
        {
            component: Constraint,
            required: true,
            unique: false,
        },
    ],
    [
        'toConstraint',
        {
            component: Constraint,
            required: true,
            unique: false,
        },
    ],
]);
