import PropTypes from 'prop-types'
import ReactCreateClass from 'create-react-class'
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';

export default ReactCreateClass({
    propTypes: {
        isLoading: PropTypes.bool.isRequired,
    },

    getDefaultProps() {
        return {
            isLoading: false,
        };
    },

    render() {
        if (!this.props.isLoading) { return null; }

        return (
            <LinearProgress mode="indeterminate" style={{ backgroundColor: 'lightblue' }} />
        );
    },
});
