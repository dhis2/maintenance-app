import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DropdownAsync from '../../forms/form-fields/drop-down-async';
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress';
import has from 'lodash/fp/has';
import { first, uniqBy, isEqual } from 'lodash/fp';
import Store from 'd2-ui/lib/store/Store';
import TextField from 'material-ui/TextField/TextField';
import GroupEditorWithOrdering from 'd2-ui/lib/group-editor/GroupEditorWithOrdering.component';

const TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE';
const PROGRAM_INSTANCE = 'PROGRAM_INSTANCE';
const PROGRAM_STAGE_INSTANCE = 'PROGRAM_STAGE_INSTANCE';

const relationshipEntities = {
    [TRACKED_ENTITY_INSTANCE]: 'tracked_entity_instance',
    [PROGRAM_INSTANCE]: 'enrollment_in_program',
    [PROGRAM_STAGE_INSTANCE]: 'event_in_program_or_program_stage',
};
//PROGRAMSTAGE INSTANCE: Event in program stage
//Program instance: Enrollment in program

const isEventProgram = model =>
    model && model.programType === 'WITHOUT_REGISTRATION';

const isTrackerProgram = model =>
    model && model.programType === 'WITH_REGISTRATION';

const toDisplayElement = model => ({
    value: model.id,
    text: model.displayName,
});

// Map of the different valid selection of the embedded objects, according to selected constraint-type
const modelTypesForRelationshipEntity = {
    TRACKED_ENTITY_INSTANCE: [
        {
            modelType: 'trackedEntityType',
            required: true,
            mutex: true, // Used to clear program when selected
        },
        {
            modelType: 'program',
            required: false,
            filter: (props, state) => {
                return [
                    'programType:eq:WITH_REGISTRATION',
                    `trackedEntityType.id:eq:${
                        state.selected.trackedEntityType.id
                    }`,
                ];
            },
        },
    ],
    PROGRAM_INSTANCE: [
        {
            modelType: 'program',
            required: true,
            filter: ['programType:eq:WITH_REGISTRATION'],
        },
    ],
    PROGRAM_STAGE_INSTANCE: [
        {
            // This is only used to render the selectors
            // programStage is used to identify the program regardless of programType
            modelType: 'program',
            mutex: 'programStage',
            required: true,
            // exclude from posted value, "default"-programStage is used in case of event-program
            excludeFromValue: true,
        },
        {
            modelType: 'programStage',
            mutex: 'program',
            required: true,
            filter: (props, state) => {
                return [`program.id:eq:${state.selected.program.id}`];
            },
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
        position: 'relative',
    },
    groupEditor: {
        padding: '2rem 0rem 4rem',
        width: '100%',
    },
    fieldname: {
        fontSize: 16,
        color: '#00000080',
    },
};

class Constraint extends Component {
    constructor(props, context) {
        super(props);
        this.d2 = context.d2;
        this.translate = this.d2.i18n.getTranslation.bind(context.d2.i18n);

        /* The value that should be posted to the API. Has a relationShipEntity (the selected) constraint.
            "TRACKED_ENTITY_INSTANCE" constraint has the following structure
                program: { id },
                relationshipEntity: "TRACKED_ENTITY_INSTANCE",
                trackedEntityType: { id }

        When Program Stage Instance is selected, we need to know the programType for selected programs, so we keep a reference to the model.
        We use the program-dropdown as a 'filter' (for trackerprograms) to only show programStages for the selected program,
        however we cannot post the `program` value to the server together with a programStage, as that results in an error.
        Therefore we save the selected values in the state. */

        let selected = null;
        if (props.value && props.value.relationshipEntity) {
            const relationshipEntity = props.value.relationshipEntity;
            const modelTypes =
                modelTypesForRelationshipEntity[relationshipEntity];
            selected = {};
            modelTypes.forEach(objOpts => {
                const modelType = objOpts.modelType;
                if (props.value[modelType]) {
                    selected[modelType] = props.value[modelType];
                }
            });
        }

        this.state = {
            selected,
            loading: true,
            error: false,
            // loading state for options
            // these are initialized in componentDidMount and loaded by `DropdownAsync`
            // shaped like
            // { program: true, trackedEntityType: true }
            optionsLoading: {
                // program: true,
                // trackedEntityType: true,
            },
        };
    }

    componentDidMount() {
        /* Since we cannot get the programId from the same request as when loading the model,
        (due to the nature of the dynamic structure of the relationShipConstraint object, which only returns programStage)
        we need to grab the program with another request, as we need this to show the
        program that the selected program stage belongs to. */
        const selectedPS =
            this.state.selected && this.state.selected.programStage;
        if (selectedPS) {
            this.fetchProgramForProgramStage(selectedPS.id)
                .then(programModel => {
                    this.setState(state => ({
                        selected: {
                            ...state.selected,
                            program: programModel,
                        },
                        loading: false,
                    }));
                })
                .catch(e => {
                    console.error(e);
                    this.setState({
                        error: e,
                    });
                });
        } else {
            // console.log('SET LOADING ELSE FALSE');
            this.setState({ loading: false });
        }
    }

    componentDidUpdate(prevProps) {
        const prevEntity = this.getSelectedRelationshipEntity(prevProps);
        const entity = this.getSelectedRelationshipEntity();

        if (prevEntity !== entity) {
            console.log('CHANGED ENTITY', entity);
            const modelTypes = modelTypesForRelationshipEntity[entity];

            // initialize loading state for modelTypes
            const optionsLoadingState = modelTypes.reduce((acc, modelOpts) => {
                const modelType = modelOpts.modelType;
                acc[modelType] = this.shouldRenderModelType(modelType);
                return acc;
            }, {});
            console.log({ optionsLoadingState }, optionsLoadingState);
            //this.setState({ optionsLoading: optionsLoadingState });
        }
    }

    isLoading = () => {
        const optionsLoading = this.isOptionsLoading();
        console.log(this.state);
        return this.state.loading || optionsLoading;
    };

    isOptionsLoading = () => {
        return Object.values(this.state.optionsLoading).some(
            loading => loading
        );
    };

    getSelectedRelationshipEntity = (props = this.props) => {
        return (props.value && props.value.relationshipEntity) || null;
    };

    getSelectedIDForModelType = modelType => {
        // We use state here, since program and programStage cannot be selected
        // at the same time (for the actual posted value). See constructor comment
        return (this.state.selected && this.state.selected[modelType]) || null;
    };

    fetchProgramForProgramStage = async programStageId => {
        const program = await this.d2.models.program
            .filter()
            .on('programStages.id')
            .equals(programStageId)
            .list({ paging: false, fields: ['id,displayName,programType'] });
        return program.toArray()[0];
    };

    getFilterForModelType(entityModelProps) {
        const filter = entityModelProps.filter;
        if (typeof filter === 'function') {
            return filter(this.props, this.state);
        } else if (Array.isArray(filter)) {
            return filter;
        }
        return null;
    }

    handleChange = newValue => {
        this.props.onChange({ target: { value: newValue } });
    };

    handleSelectRelationshipEntity = (_, __, value) => {
        this.setState({
            error: false,
            selected: null,
        });
        this.handleChange({ relationshipEntity: value });
    };

    handleSelectValue = (modelType, { target: { value } }) => {
        const selectedRelationshipEntity = this.getSelectedRelationshipEntity();
        const objOptions = modelTypesForRelationshipEntity[
            selectedRelationshipEntity
        ].find(obj => obj.modelType === modelType);

        let modelTypeValue = {
            id: (value && value.id) || null,
        };
        // Clear values if mutually exclusive
        let prevState = objOptions.mutex ? {} : this.props.value;

        // if its an event-program, we need to set the "default"-programStage
        // and exclude "program"-from the posted-value
        if (modelType === 'program' && isEventProgram(value)) {
            prevState = {
                ...prevState,
                programStage: first(value.programStages.toArray()),
            };
        }

        const relationshipConstraint = {
            ...prevState,
            relationshipEntity: this.props.value.relationshipEntity,
            ...(!objOptions.excludeFromValue && {
                [modelType]: modelTypeValue,
            }),
        };

        this.props.onChange({
            target: {
                value: relationshipConstraint,
            },
        });

        // Keep reference in state to check for selected programType etc
        // Clear state when program changes
        const clearState =
            modelType === 'program' &&
            selectedRelationshipEntity === PROGRAM_STAGE_INSTANCE;

        this.setState(state => ({
            selected: {
                ...(!clearState && { ...state.selected }),
                [modelType]: value,
            },
        }));
    };

    handleSelectTrackedEntityAttribute = trackedEntityAttributeIds => {
        const newValue = {
            ...this.props.value,
            trackerDataView: {
                ...this.props.value.trackerDataView,
                attributes: trackedEntityAttributeIds,
            },
        };
        this.handleChange(newValue);
    };

    hasSelectedTrackerProgram = () =>
        has('selected.program', this.state) &&
        isTrackerProgram(this.state.selected.program);

    handleOptionsLoaded = (modelType, options) => {
        // get reference to already selected constraint
        // ie when a saved model is edited, so we can check for programType
        console.log('HANDLE OPTIONS LOADED', modelType);
        if (!this.state.selected) {
            this.setState({ loading: false });
            return;
        }
        // this.forceUpdate()
        const selectedModelID =
            this.state.selected[modelType] && this.state.selected[modelType].id;
        const option = options.find(opt => opt.value === selectedModelID);
        if (option) {
            this.setState(state => ({
                loading: false,
                selected: {
                    ...state.selected,
                    [modelType]: option.model,
                },
                optionsLoading: {
                    ...state.optionsLoading,
                    [modelType]: false,
                },
            }));
        }
    };

    renderLoading = () => {
        return (
            <div style={{ height: '72px' }}>
                <CircularProgress />
            </div>
        );
    };

    renderErrorOrLoading = () => {
        if (this.state.loading) {
            return this.renderLoading();
        }
        if (this.state.error) {
            return (
                <div style={styles.modelTypeSelectField}>
                    Failed to load program for program stage.
                </div>
            );
        }
    };

    shouldRenderModelType = modelType => {
        const entity = this.getSelectedRelationshipEntity();
        if (
            entity === PROGRAM_STAGE_INSTANCE &&
            modelType === 'programStage' &&
            !this.hasSelectedTrackerProgram()
        ) {
            //Hide programStage selector when Tracker Program is not selected
            return false;
        } else if (
            entity === TRACKED_ENTITY_INSTANCE &&
            modelType === 'program' &&
            !has('selected.trackedEntityType.id', this.state)
        ) {
            //Hide program when tet is not selected
            return false;
        }
        return true;
    };

    renderModelTypeSelectFields = () => {
        if (this.state.loading || this.state.error) {
            return this.renderErrorOrLoading();
        }
        const entity = this.getSelectedRelationshipEntity();
        const modelTypes = modelTypesForRelationshipEntity[entity];

        // Create fields for the selected relationshipEntity
        const modelDropdowns = modelTypes.map(objOpts => {
            const modelType = objOpts.modelType;
            let value = this.getSelectedIDForModelType(modelType);

            if (!this.shouldRenderModelType(modelType)) {
                return null;
            }
            const filter = this.getFilterForModelType(objOpts);

            return (
                <div style={styles.modelTypeSelectField} key={modelType}>
                    <DropdownAsync
                        isRequired={objOpts.required}
                        labelText={`${this.translate(
                            camelCaseToUnderscores(modelType)
                        )} ${objOpts.required ? ' *' : ''}`}
                        value={value}
                        referenceType={modelType}
                        onChange={this.handleSelectValue.bind(this, modelType)}
                        onOptionsLoaded={this.handleOptionsLoaded}
                        queryParamFilter={filter}
                        orFilter={false}
                    />
                </div>
            );
        });

        return modelDropdowns;
    };

    renderAssignTrackedEntityAttributes() {
        const selectedProgram = this.state.selected.program;
        const selectedTrackedEntityType = this.state.selected.trackedEntityType;

        if (!selectedProgram && !selectedTrackedEntityType) {
            return null;
        }

        const trackedEntityTypeAttributes =
            selectedTrackedEntityType &&
            Array.isArray(selectedTrackedEntityType.trackedEntityTypeAttributes)
                ? selectedTrackedEntityType.trackedEntityTypeAttributes.map(
                      teta => teta.trackedEntityAttribute
                  )
                : [];

        const programTrackedEntityAttributes =
            selectedProgram &&
            Array.isArray(selectedProgram.programTrackedEntityAttributes)
                ? selectedProgram.programTrackedEntityAttributes.map(
                      pteta => pteta.trackedEntityAttribute
                  )
                : [];

        // normally programTrackedEntity-Attributes should be a superset of trackedEntityType-Attributes
        // however this is not guaranteed, and is only "enforced" client-side when creating a program.
        // program attributes are also not updated if attributes are updated for a tet.
        // thus we concat these lists and remove duplicates to be sure to show all available attributes.
        const availableAttributes = uniqBy('id')(
            trackedEntityTypeAttributes.concat(programTrackedEntityAttributes)
        ).sort((a, b) => a.displayName.localeCompare(b.displayName));

        const assignedAttributes =
            this.props.value && this.props.value.trackerDataView
                ? this.props.value.trackerDataView.attributes
                : [];

        return (
            <AssignTrackedEntityAttributes
                availableAttributes={availableAttributes}
                assignedAttributes={assignedAttributes}
                onChange={this.handleSelectTrackedEntityAttribute}
            />
        );
    }

    // https://dhis2.atlassian.net/browse/DHIS2-13547
    renderRelationshipDisplaySelect = () => {
        const entity = this.getSelectedRelationshipEntity();
        if (!this.state.selected) {
            return null;
        }
        if (this.isLoading()) {
            return this.renderLoading();
        }

        if (entity === TRACKED_ENTITY_INSTANCE || entity === PROGRAM_INSTANCE) {
            return this.renderAssignTrackedEntityAttributes();
        }

        return null;
    };

    render = () => {
        return (
            <div>
                <SelectField
                    fullWidth
                    value={this.getSelectedRelationshipEntity()}
                    onChange={this.handleSelectRelationshipEntity}
                    floatingLabelText={this.props.labelText}
                >
                    {Object.keys(relationshipEntities).map(entity => (
                        <MenuItem
                            key={entity}
                            value={entity}
                            primaryText={this.translate(
                                relationshipEntities[entity]
                            )}
                        />
                    ))}
                </SelectField>
                <div style={styles.modelTypeWrapper}>
                    {this.getSelectedRelationshipEntity() &&
                        this.renderModelTypeSelectFields()}
                    {this.renderRelationshipDisplaySelect()}
                </div>
            </div>
        );
    };
}

Constraint.contextTypes = {
    d2: PropTypes.object,
};

class AssignTrackedEntityAttributes extends Component {
    constructor(props) {
        super(props);

        // we need to "copy" to state here because GroupEditor-component
        // need a d2-store
        this.state = {
            availableAttributesStore: Store.create({
                getInitialState() {
                    return props.availableAttributes.map(toDisplayElement);
                },
            }),
            assignedAttributesStore: Store.create({
                getInitialState() {
                    return props.assignedAttributes;
                },
            }),
            filterText: '',
            //assignedAttributes: this.props.trackedEntityTypeAttributes || [],
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const currAvailableAttributes = this.props.availableAttributes;
        if (!isEqual(currAvailableAttributes)(prevProps.availableAttributes)) {
            const currAssignedAttributes = this.props.assignedAttributes;

            // update d2-store to new values
            this.state.availableAttributesStore.setState(
                currAvailableAttributes.map(toDisplayElement)
            );

            // filter out selected attributes that are now unavailable
            const newAssignedAttributes = currAssignedAttributes.filter(id =>
                currAvailableAttributes.find(attr => attr.id === id)
            );

            // if program is changed, update assigned attributes to deselect attributes part of program only
            if (newAssignedAttributes.length !== currAssignedAttributes) {
                const attributesToRemove = currAssignedAttributes.filter(
                    id => !newAssignedAttributes.includes(id)
                );
                console.log('REMOVE', attributesToRemove);
                this.onRemoveAttributes(attributesToRemove);
            }
        }
    }

    onAssignAttributes = assignedAttributes => {
        const newAssignedAttributes = this.state.assignedAttributesStore
            .getState()
            .concat(assignedAttributes);

        this.handleChange(newAssignedAttributes);
        return Promise.resolve();
    };

    onRemoveAttributes = removedAttributeIds => {
        console.log({
            removedAttributeIds,
            assigned: this.state.assignedAttributesStore.getState(),
        });
        const newAssignedAttributes = this.state.assignedAttributesStore
            .getState()
            .filter(
                assignedAttributeId =>
                    !removedAttributeIds.includes(assignedAttributeId)
            );

        this.handleChange(newAssignedAttributes);
        return Promise.resolve();
    };

    onMoveAttributes = newAssignedAttributes => {
        this.handleChange(newAssignedAttributes);
    };

    getTranslation = value => this.context.d2.i18n.getTranslation(value);

    handleChange = newAssignedAttributesIds => {
        this.state.assignedAttributesStore.setState(newAssignedAttributesIds);
        this.props.onChange(newAssignedAttributesIds);
    };

    setFilterText = event => {
        this.setState({ filterText: event.target.value });
    };

    render() {
        if (this.state.isLoading) {
            return null;
        }
        return (
            <div style={styles.groupEditor}>
                <div style={styles.fieldname}>
                    {this.getTranslation(
                        'tracked_entity_attributes_to_display_in_list'
                    )}
                </div>
                <TextField
                    hintText={this.getTranslation(
                        'search_available_tracked_entity_type_attributes'
                    )}
                    onChange={this.setFilterText}
                    value={this.state.filterText}
                    fullWidth
                />
                <GroupEditorWithOrdering
                    itemStore={this.state.availableAttributesStore}
                    assignedItemStore={this.state.assignedAttributesStore}
                    height={250}
                    filterText={this.state.filterText}
                    onAssignItems={this.onAssignAttributes}
                    onRemoveItems={this.onRemoveAttributes}
                    onOrderChanged={this.onMoveAttributes}
                />
            </div>
        );
    }
}

AssignTrackedEntityAttributes.propTypes = {
    availableAttributes: PropTypes.array,
    assignedAttributes: PropTypes.array,
    onChange: PropTypes.func.isRequired,
};
AssignTrackedEntityAttributes.contextTypes = {
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
