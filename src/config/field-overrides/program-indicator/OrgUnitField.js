import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DropDown from '../../../forms/form-fields/drop-down';

const PROGRAM_TYPE_WITH_REGISTRATION = 'WITH_REGISTRATION';
const PROGRAM_TYPE_WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION';
const ANALYTICS_TYPE_EVENT = 'EVENT';
const ANALYTICS_TYPE_ENROLLMENT = 'ENROLLMENT';
const ORG_UNIT_VALUE_TYPE = 'ORGANISATION_UNIT';
const PROGRAM_REQUEST_OPTIONS = {
    fields:
        'programStages[id,programStageDataElements[dataElement[id,displayName,valueType]]',
    paging: false,
};
const extractOrgUnitDataElementsFromProgramStage = program =>
    program.programStages.toArray().flatMap(({ programStageDataElements }) =>
        programStageDataElements.reduce((acc, { dataElement }) => {
            if (dataElement.valueType === ORG_UNIT_VALUE_TYPE) {
                acc.push(dataElement);
            }
            return acc;
        }, [])
    );

/*
The reason all of this works needs some clarification:
- This field component is dependant on the values in the `program`
  and `analyticsType` field
- It needs to be aware of when these values change and update its UI
- Ideally, it would have been good if we could have specified the following
  two field rules:
  1. When program changes set the `programId` prop of the `OrgUnitField`
  2. When analyticsType changes set the `analyticsType` prop of the `OrgUnitField`
- But as far as I could tell, our field rules do not support this and I did not
  see an easy way to add support either. So trying to implement this in the
  `componentDidUpdate` hook of the component seemed like the only way forward.
- Without a field-rule in place for the `orgUnitField`, the `componentDidUpdate`
  hook will not get called when other fields change. So we need a field rule and
  luckily, the issue also specifies that the `orgUnitField` needs to be hidden
  when no program is selected yet.
- So `componentDidUpdate` is being called because the field-rule is in place.
  We must not remove it.
- And unfortunately, we are reading the `programId` and `analyticsType` from a
  d2 model. Since these are mutable objects the values we find in `prevProps.model`
  are identical to the ones in `this.props.model`. To address this issue we have to
  keep track of the previous values manually
*/

export default class OrgUnitField extends Component {
    constructor(props, context) {
        super(props);
        this.d2 = context.d2;
        this.translate = this.d2.i18n.getTranslation.bind(context.d2.i18n);
        this.state = {
            loading: false,
            error: null,
            value: undefined,
            dataElements: {},
            options: [],
        };
        this.staticOptions = {
            eventDefault: {
                value: ANALYTICS_TYPE_EVENT,
                text: this.translate('event_organisation_unit_default'),
            },
            enrollmentDefault: {
                value: ANALYTICS_TYPE_ENROLLMENT,
                text: this.translate('enrollment_organisation_unit_default'),
            },
            enrollment: {
                value: ANALYTICS_TYPE_ENROLLMENT,
                text: this.translate('enrollment_organisation_unit'),
            },
            ownerAtStart: {
                value: 'OWNER_AT_START',
                text: this.translate('owner_at_start_organisation_unit'),
            },
            ownerAtEnd: {
                value: 'OWNER_AT_END',
                text: this.translate('owner_at_end_organisation_unit'),
            },
            registration: {
                value: 'REGISTRATION',
                text: this.translate('registration_organisation_unit'),
            },
        };
        this.onChange = this.onChange.bind(this);

        this.updateManualPrevProps(props);
    }

    componentDidMount() {
        if (this.hasRequiredParams()) {
            this.fetchDataElements();
        }
        this.setState({ options: this.getOptions() });

        this.updateManualPrevProps();
    }

    componentDidUpdate(_, prevState) {
        const isDoneLoading =
            prevState.loading === true && this.state.loading === false;
        const hasRelevantPropChanged = this.hasRelevantPropChanged();
        const shouldFetchDataElementsForProgram = this.shouldFetchDataElementsForProgram();
        const shouldFetch =
            hasRelevantPropChanged && shouldFetchDataElementsForProgram;
        const shouldSetOptions =
            (isDoneLoading || hasRelevantPropChanged) &&
            !shouldFetchDataElementsForProgram;

        if (shouldFetch) {
            this.fetchDataElements();
        }

        if (shouldSetOptions) {
            const options = this.getOptions();
            const isCurrentValueInOptions = options.some(
                ({ value }) => value === this.props.value
            );

            // Reset selection to default if selected option is no longer valid
            if (!isCurrentValueInOptions) {
                this.props.onChange({ target: { value: undefined } });
            }

            this.setState({ options });
        }

        this.updateManualPrevProps();
    }

    updateManualPrevProps(props = this.props) {
        this.manualPrevProps = {
            programId: props.model.program.id,
            analyticsType: props.model.analyticsType,
        };
    }

    hasRelevantPropChanged() {
        return this.hasProgramChanged() || this.hasAnalyticsTypeChanged();
    }

    hasProgramChanged() {
        return this.manualPrevProps.programId !== this.props.model.program.id;
    }

    hasAnalyticsTypeChanged() {
        return (
            this.manualPrevProps.analyticsType !==
            this.props.model.analyticsType
        );
    }

    async fetchDataElements() {
        this.setState({
            loading: true,
            error: null,
        });

        try {
            const orgUnitFieldDataElements = await this.d2.models.program
                .get(this.props.model.program.id, PROGRAM_REQUEST_OPTIONS)
                .then(extractOrgUnitDataElementsFromProgramStage);

            this.setState({
                dataElements: {
                    ...this.state.dataElements,
                    [this.props.model.program.id]: orgUnitFieldDataElements,
                },
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error(error);
            this.setState({
                loading: false,
                error,
            });
        }
    }

    hasRequiredParams() {
        const { program, analyticsType } = this.props.model;

        if (!program) {
            return false;
        }

        // For event programs no analytics type is required
        if (program.programType === PROGRAM_TYPE_WITHOUT_REGISTRATION) {
            return true;
        }

        // For tracker programs we do need and analytics type
        if (
            program.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            analyticsType
        ) {
            return true;
        }

        return false;
    }

    shouldFetchDataElementsForProgram() {
        const { program, analyticsType } = this.props.model;

        // Do not fetch whilst loading
        if (this.state.loading) {
            return false;
        }

        // Only fetch when all params are available
        if (!this.hasRequiredParams()) {
            return false;
        }

        // This combination of params does not need data elements
        if (
            program.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            analyticsType === ANALYTICS_TYPE_ENROLLMENT
        ) {
            return false;
        }

        // Only fetch when not unavailable
        return !Array.isArray(
            this.state.dataElements[this.props.model.program.id]
        );
    }

    getDataElementsForProgram() {
        const dataElements =
            this.state.dataElements[this.props.model.program.id] || [];
        return dataElements.map(de => ({
            value: de.id,
            text: de.displayName,
        }));
    }

    getProgramAttributesForProgram() {
        return this.props.model.program.programTrackedEntityAttributes.reduce(
            (acc, { trackedEntityAttribute }) => {
                if (trackedEntityAttribute.valueType === ORG_UNIT_VALUE_TYPE) {
                    acc.push({
                        value: trackedEntityAttribute.id,
                        text: trackedEntityAttribute.displayName,
                    });
                }
                return acc;
            },
            []
        );
    }

    getOptions() {
        if (!this.hasRequiredParams() || this.state.loading) {
            return [];
        }

        const programType = this.props.model.program.programType;
        const analyticsType = this.props.model.analyticsType;
        const hasDataElements = Array.isArray(
            this.state.dataElements[this.props.model.program.id]
        );

        if (
            programType === PROGRAM_TYPE_WITHOUT_REGISTRATION &&
            hasDataElements
        ) {
            return [
                this.staticOptions.eventDefault,
                ...this.getDataElementsForProgram(),
            ];
        }

        if (
            programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            analyticsType === ANALYTICS_TYPE_EVENT &&
            hasDataElements
        ) {
            return [
                this.staticOptions.eventDefault,
                ...this.getProgramAttributesForProgram(),
                ...this.getDataElementsForProgram(),
                this.staticOptions.registration,
                this.staticOptions.enrollment,
                this.staticOptions.ownerAtStart,
                this.staticOptions.ownerAtEnd,
            ];
        }

        if (
            programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            analyticsType === ANALYTICS_TYPE_ENROLLMENT
        ) {
            return [
                this.staticOptions.enrollmentDefault,
                ...this.getProgramAttributesForProgram(),
                this.staticOptions.registration,
                this.staticOptions.ownerAtStart,
                this.staticOptions.ownerAtEnd,
            ];
        }

        return [];
    }

    onChange(event) {
        const value =
            event.target.value === this.getDefaultValue()
                ? undefined
                : event.target.value;
        this.props.onChange({ target: { value } });
    }

    getDefaultValue() {
        const programType = this.props.model.program.programType;
        const analyticsType = this.props.model.analyticsType;

        if (
            programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            analyticsType === ANALYTICS_TYPE_ENROLLMENT
        ) {
            return ANALYTICS_TYPE_ENROLLMENT;
        } else {
            return ANALYTICS_TYPE_EVENT;
        }
    }

    render() {
        if (!this.hasRequiredParams()) {
            return null;
        }

        return (
            <DropDown
                labelText={this.translate('organisation_unit_field')}
                errorText={this.state.error ? this.state.error.message : ''}
                onChange={this.onChange}
                translateLabel={false}
                options={this.state.options}
                disabled={this.state.loading}
                isRequired={true}
                value={this.props.value || this.getDefaultValue()}
                style={this.props.style}
            />
        );
    }
}

OrgUnitField.contextTypes = {
    d2: PropTypes.object,
};
