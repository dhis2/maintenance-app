import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mapPropsStream from 'recompose/mapPropsStream';
import { get, compose } from 'lodash/fp';
import {createFormFor} from "../../formHelpers";
import {flattenRouterProps, wrapInPaper} from "../../componentHelpers";
import programStore from "../eventProgramStore";
import fieldOrder from "../../../config/field-config/field-order";
import {editFieldChanged} from "../actions";
import CustomRegistrationForm from './CustomRegistrationForm';
const program$ = programStore.map(get('program'));
const enrollmentFields = fieldOrder.for('enrollment');

const mapDispatchToProps = dispatch =>
    bindActionCreators({ editFieldChanged }, dispatch);

const connectEditForm = compose(
    flattenRouterProps,
    connect(null, mapDispatchToProps),
);

const EnrollmentDetailsForm = connectEditForm(
    createFormFor(program$, 'program', enrollmentFields, true, 'enrollment')
);

const EnrollmentDetails = props => (
    <div>
        <EnrollmentDetailsForm {...props}/>
        <CustomRegistrationForm {...props} />
    </div>
)

export default wrapInPaper(EnrollmentDetails);
