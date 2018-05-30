import React, { Component } from 'react';

export default class SqlView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryResults: null,
        };
    }

    render() {
        return (
            <div>
                <h1>This will be the SQL View</h1>
            </div>
        );
    }
}