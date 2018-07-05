import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DropdownAsync from '../../forms/form-fields/drop-down-async';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';

const TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE';
const PROGRAM_INSTANCE = 'PROGRAM_INSTANCE';
const PROGRAM_STAGE_INSTANCE = 'PROGRAM_STAGE_INSTANCE';

const constraintOptions = [TRACKED_ENTITY_INSTANCE, PROGRAM_INSTANCE, PROGRAM_STAGE_INSTANCE];

// Map of the different valid selection of the embedded objects, according to selected constraint-type
const objectTypesForRelationshipEntity = {
    TRACKED_ENTITY_INSTANCE: ['trackedEntityType', 'program'],
    PROGRAM_INSTANCE: ['program'],
    PROGRAM_STAGE_INSTANCE: ['program', 'programStage'],
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
                const objectTypes = objectTypesForRelationshipEntity[relationshipEntity];
                embeddedValue = {};
                objectTypes.forEach(objType => {
                    if(props.value[objType]) {
                        embeddedValue[objType] = props.value[objType];
                    }
                })
            }
        }

        console.log(embeddedValue)
        this.state = {
            relationshipEntity,
            embeddedValue,
        };
    }

    selectRelationshipEntity = (_, __, value) => {
        this.setState({
            relationshipEntity: value,
        });
    };

    handleEmbeddedValueSelect = (objectType, { target: { value } }) => {
        const relationshipConstraint = {
            ...this.state.embeddedValue,
            relationshipEntity: this.state.relationshipEntity,
            [objectType]: {
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

    renderObjectSelect = () => {
        const entity = this.state.relationshipEntity;
        const objectTypes = objectTypesForRelationshipEntity[entity];
        return (
            objectTypes.map(objType => (<DropdownAsync
                {...this.props}
                labelText={`${this.translate('select')} ${this.translate(camelCaseToUnderscores(objType))}`}
                value={this.state.embeddedValue[objType]}
                key={objType}
                referenceType={objType}
                onChange={this.handleEmbeddedValueSelect.bind(this, objType)}
            />))
        );
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
                {this.state.relationshipEntity && this.renderObjectSelect() }
            </div>
        );
    };
}

/* (
                    <DropdownAsync
                        {...this.props}
                        labelText={`${this.translate('select')} ${this.state.selectLabel}`}
                        value={this.state.embeddedValue}
                        referenceType={constraintToObjectType[this.state.relationshipEntity]}
                        onChange={this.handleEmbeddedValueSelect}
                    />
                )*/

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
