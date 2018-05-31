import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FormHeading from '../EditModel/FormHeading';
import { goToRoute } from '../router-utils';
import LoadingMask from '../loading-mask/LoadingMask.component';
import snackActions from '../Snackbar/snack.actions';

const backToList = () => {
    goToRoute('list/otherSection/sqlView');
};

class SqlView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listGrid: null,
        };
    }

    async componentWillMount() {
        const { d2 } = this.context;
        const { params: { modelId } } = this.props;
        const url = `sqlViews/${modelId}/data`;
        const queryParams = { paging: false };

        try {
            const { listGrid } = await d2.Api.getApi().get(url, queryParams);
            this.setState({ listGrid });
        } catch (error) {
            backToList();
            snackActions.show({ message: d2.i18n.getTranslation('sql_query_error'), action: 'ok' });
        }
    }

    openFileLink(file) {
        const { params: { modelId } } = this.props;
        window.location.href = `../api/sqlViews/${modelId}/${file}`;
    }

    renderHeader() {
        const { title } = this.state.listGrid;
        const { d2 } = this.context;
        const headerText = `${d2.i18n.getTranslation('view_data_for')} "${title}"`;
        return (
            <div className="sql-view__header">
                <FormHeading
                    level={1}
                    groupName="otherSection"
                    schema="sqlView"
                    skipTranslation
                >
                    {headerText}
                </FormHeading>
            </div>
        );
    }

    renderButtonStrip() {
        const { d2 } = this.context;
        return [
            { label: 'download_as_excel', file: 'data.xls' },
            { label: 'download_as_csv', file: 'data.csv' },
            { label: 'download_as_pdf', file: 'data.pdf' },
            { label: 'download_as_html', file: 'data.html+css' },
            { label: 'download_as_xml', file: 'data.xml' },
            { label: 'download_as_json', file: 'data.json' },
        ].map(({ label, file }) => (
            <RaisedButton
                className="sql-view__download-btn"
                key={label}
                label={d2.i18n.getTranslation(label)}
                onClick={() => this.openFileLink(file)} // eslint-disable-line react/jsx-no-bind
            />
        ));
    }

    /* eslint-disable react/no-array-index-key */
    renderCell = (cell, index) => <td key={`cell${index}`}>{cell}</td>;
    renderRow = (row, index) => <tr key={`row${index}`}>{row.map(this.renderCell)}</tr>;
    /* eslint-enable react/no-array-index-key */

    renderTable() {
        const { listGrid: { headers, rows } } = this.state;
        return (
            <table className="sql-view__table">
                <thead>
                    <tr>
                        {headers.map(({ name }) => <th key={name}>{name}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(this.renderRow)}
                </tbody>
            </table>
        );
    }

    render() {
        if (!this.state.listGrid) {
            return <LoadingMask />;
        }

        return (
            <div>
                {this.renderHeader()}
                <div className="sql-view__btn-strip">
                    {this.renderButtonStrip()}
                </div>
                <Paper className="sql-view__content">
                    {this.renderTable()}
                </Paper>
            </div>
        );
    }
}
SqlView.propTypes = {
    params: PropTypes.shape({
        modelId: PropTypes.string,
    }).isRequired,
};

SqlView.contextTypes = {
    d2: PropTypes.object,
};

export default SqlView;
