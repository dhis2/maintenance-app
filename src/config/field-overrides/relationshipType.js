import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const TRACKED_ENTITY_INSTANCE = "TRACKED_ENTITY_INSTANCE";
const PROGRAM_INSTANCE = "PROGRAM_INSTANCE";
const PROGRAM_STAGE_INSTANCE = "PROGRAM_STAGE_INSTANCE";

const constraintOptions = [
    TRACKED_ENTITY_INSTANCE,
    PROGRAM_INSTANCE,
    PROGRAM_STAGE_INSTANCE,
];

const resolveToTrue = () => true;

class Constraint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchResults: [],
        };
    }

    translate = s => this.context.d2.i18n.getTranslation(s);

    selectConstraint = (_, __, value) => {
        let searchLabel;

        switch(value) {
            case TRACKED_ENTITY_INSTANCE: searchLabel = this.translate("tracked_entity_type"); break;
            case PROGRAM_INSTANCE: searchLabel = this.translate("program"); break;
            case PROGRAM_STAGE_INSTANCE: searchLabel = this.translate("program_stage"); break;
        }

        this.setState({
            constraint: value,
            searchLabel,
        });
    }

    updateSearchInput = (searchText) => {
        switch(this.state.constraint) {
            case TRACKED_ENTITY_INSTANCE: {
                this.searchTrackedEntityTypes(searchText);
                break;
            }

            case PROGRAM_INSTANCE: {
                this.searchPrograms(searchText);
                break;
            }

            case PROGRAM_STAGE_INSTANCE: {
                this.searchProgramStages(searchText);
                break;
            }
        }
    }

    searchWithD2 = options => {
        this.handleSearch(options);
    }

    handleSearch = ({ resource, fields, filter, handler }) => {
        this.context.d2.Api.getApi().get(resource, {
            fields,
            filter,
            paging: false,
        }).then(result => {
            console.warn('Got result:', result[resource]);
            handler(result[resource]);
        });
    }

    searchTrackedEntityTypes = (searchText) => {
        console.warn('Searching tracked entity types:', searchText);
        this.searchWithD2({
            resource: 'trackedEntityTypes',
            fields: 'id,displayName',
            filter: `name:startsWith:${searchText}`,
            handler: (searchResults) => {
                this.setState({
                    searchResults,
                });
            },
        });
    }

    searchPrograms = (searchText) => {
        console.warn('Loading programs:', searchText);

        this.searchWithD2({
            resource: 'programs',
            fields: 'id,displayName',
            filter: `name:startsWith:${searchText}`,
            handler: (searchResults) => {
                this.setState({
                    searchResults,
                });
            },
        })
    }

    searchProgramStages = (searchText) => {
        console.warn('Loading program stages:', searchText);

        this.searchWithD2({
            resource: 'programStages',
            fields: 'id,displayName',
            filter: `name:startsWith:${searchText}`,
            handler: (searchResults) => {
                this.setState({
                    searchResults,
                });
            },
        })
    }

    render = () => (
        <div>
            <SelectField
                fullWidth
                value={this.state.constraint}
                onChange={this.selectConstraint}
                floatingLabelText={this.translate("from_constraint")}
            >
                {constraintOptions.map(constraint => (
                    <MenuItem
                        key={constraint}
                        value={constraint}
                        primaryText={this.translate(constraint)}
                    />
                ))}
            </SelectField>
            { this.state.constraint && (
                <AutoComplete
                    fullWidth
                    hintText="Search ..."
                    filter={resolveToTrue}
                    dataSourceConfig={{ text: 'displayName', value: 'id' }}
                    floatingLabelText={`${this.translate("select")} ${this.state.searchLabel}`}
                    dataSource={this.state.searchResults}
                    onUpdateInput={this.updateSearchInput}
                />
            )}
        </div>
    );
}

Constraint.contextTypes = {
    d2: PropTypes.object,
};

export default new Map([
    ['fromConstraint', {
        component: Constraint,
        required: false,
    }],
    ['toConstraint', {
        component: Constraint,
        required: false,
    }]
]);
