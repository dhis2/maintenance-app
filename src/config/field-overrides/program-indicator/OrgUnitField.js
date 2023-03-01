import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DropDown from '../../../forms/form-fields/drop-down';

const PROGRAM_TYPE_WITH_REGISTRATION = 'WITH_REGISTRATION';
const PROGRAM_TYPE_WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION';
const ANALYTICS_TYPE_EVENT = 'EVENT';
const ANALYTICS_TYPE_ENROLLMENT = 'ENROLLMENT';
const ORG_UNIT_VALUE_TYPE = 'ORGANISATION_UNIT';

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
        };
        this.staticOptions = {
            event: {
                value: ANALYTICS_TYPE_EVENT,
                text: this.translate('Event'),
            },
            enrollment: {
                value: ANALYTICS_TYPE_ENROLLMENT,
                text: this.translate('Enrollment'),
            },
            ownerAtStart: {
                value: 'OWNER_AT_START',
                text: this.translate('Owner at start'),
            },
            ownerAtEnd: {
                value: 'OWNER_AT_END',
                text: this.translate('Owner at end'),
            },
            registration: {
                value: 'REGISTRATION',
                text: this.translate('Registration'),
            },
        };
        this.onChange = this.onChange.bind(this);

        this.updateManualPrevProps(props);
    }

    componentDidMount() {
        if (this.hasRequiredParams()) {
            this.fetchDataElements();
        }

        this.updateManualPrevProps();
    }

    componentDidUpdate() {
        if (
            this.hasRelevantPropChanged() &&
            this.shouldFetchDataElementsForProgram()
        ) {
            this.fetchDataElements();
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
            const api = this.d2.Api.getApi();
            const url = `programs/${this.props.model.program.id}`;
            const data = {
                fields:
                    'programStages[id,programStageDataElements[dataElement[id,displayName,valueType]]',
            };
            const allDataElements = await api.get(url, data);
            const orgUnitFieldDataElements = allDataElements.programStages
                .flatMap(({ programStageDataElements }) =>
                    programStageDataElements.map(
                        ({ dataElement }) => dataElement
                    )
                )
                .filter(({ valueType }) => valueType === ORG_UNIT_VALUE_TYPE);

            this.setState({
                dataElements: {
                    ...this.state.dataElements,
                    [this.props.model.program.id]: orgUnitFieldDataElements,
                },
                loading: false,
                error: null,
            });
        } catch (error) {
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

        if (program.programType === PROGRAM_TYPE_WITHOUT_REGISTRATION) {
            return true;
        }

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

        if (this.state.loading) {
            return false;
        }

        if (!this.hasRequiredParams()) {
            return false;
        }

        if (
            program.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            analyticsType === ANALYTICS_TYPE_ENROLLMENT
        ) {
            return false;
        }

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
                this.staticOptions.event,
                ...this.getDataElementsForProgram(),
            ];
        }

        if (
            programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            analyticsType === ANALYTICS_TYPE_EVENT &&
            hasDataElements
        ) {
            return [
                this.staticOptions.event,
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
                this.staticOptions.enrollment,
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
                labelText={this.translate('Organisation unit field')}
                errorText={this.state.error ? this.state.error.message : ''}
                onChange={this.onChange}
                translateLabel={false}
                options={this.getOptions()}
                disabled={this.state.loading}
                isRequired={true}
                value={this.props.value || this.getDefaultValue()}
            />
        );
    }
}

OrgUnitField.contextTypes = {
    d2: PropTypes.object,
};
