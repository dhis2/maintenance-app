import React, { Component } from 'react';
import { removeQuery } from '../../../../router-utils';

const EditProgramStage = props => {
    return (
        <p>
            EDIT PROGRAM STAGE HERE
            <button onClick={() => removeQuery('stage')}>Create stage</button>
        </p>
    );
};

export default EditProgramStage;
