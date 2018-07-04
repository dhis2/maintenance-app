import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DropdownAsync from '../../forms/form-fields/drop-down-async';

const TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE';
const PROGRAM_INSTANCE = 'PROGRAM_INSTANCE';
const PROGRAM_STAGE_INSTANCE = 'PROGRAM_STAGE_INSTANCE';

const constraintOptions = [TRACKED_ENTITY_INSTANCE, PROGRAM_INSTANCE, PROGRAM_STAGE_INSTANCE];

// Map of the different names of the embedded objects, according to selected constraint-type
const constraintToObjectType = {
    TRACKED_ENTITY_INSTANCE: 'trackedEntityType',
    PROGRAM_INSTANCE: 'program',
    PROGRAM_STAGE_INSTANCE: 'programStage',
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
                const objectName = constraintToObjectType[relationshipEntity];
                embeddedValue = props.value[objectName];
            }
        }

        const label = this.getRelationshipEntityLabel(relationshipEntity);

        this.state = {
            searchResults: [],
            relationshipEntity,
            selectLabel: label,
            embeddedValue,
        };
    }

    getRelationshipEntityLabel = relationshipEntity => {
        switch (relationshipEntity) {
            case TRACKED_ENTITY_INSTANCE:
                return this.translate('tracked_entity_type');
            case PROGRAM_INSTANCE:
                return this.translate('program');
            case PROGRAM_STAGE_INSTANCE:
                return this.translate('program_stage');
        }

        return null;
    };

    selectRelationshipEntity = (_, __, value) => {
        const selectLabel = this.getRelationshipEntityLabel(value);

        this.setState({
            relationshipEntity: value,
            selectLabel,
        });
    };

    handleEmbeddedValueSelect = ({ target: { value } }) => {
        const objType = constraintToObjectType[this.state.relationshipEntity];
        const relationshipConstraint = {
            relationshipEntity: this.state.relationshipEntity,
            [objType]: {
                id: (value && value.id) || null,
            },
        };
        this.props.onChange({
            target: {
                value: relationshipConstraint,
            },
        });

        this.setState({
            embeddedValue: relationshipConstraint[objType],
        });
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
                {this.state.relationshipEntity && (
                    <DropdownAsync
                        {...this.props}
                        labelText={`${this.translate('select')} ${this.state.selectLabel}`}
                        value={this.state.embeddedValue}
                        referenceType={constraintToObjectType[this.state.relationshipEntity]}
                        onChange={this.handleEmbeddedValueSelect}
                    />
                )}
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
