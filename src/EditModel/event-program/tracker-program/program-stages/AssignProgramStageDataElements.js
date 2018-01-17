import React from 'react';
import AssignDataElements from '../../assign-data-elements/AssignDataElements';

export default props =>
    props.programStage$ &&
    <AssignDataElements {...props} programStage$={props.programStage$} />;
