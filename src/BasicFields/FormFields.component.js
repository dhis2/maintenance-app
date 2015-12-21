import React from 'react';
import classes from 'classnames';
import FormUpdateContext from './FormUpdateContext.mixin';
import StylePropable from 'material-ui/lib/mixins/style-propable';

const FormFields = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.arrayOf(React.PropTypes.node)]),
        className: React.PropTypes.oneOfType(
            React.PropTypes.string,
            React.PropTypes.array,
            React.PropTypes.object
        ),
        style: React.PropTypes.object,
        highlight: React.PropTypes.bool,
    },

    contextTypes: {
        muiTheme: React.PropTypes.object,
    },

    mixins: [FormUpdateContext],

    render() {
        const classList = classes('d2-form-fields', this.props.className);

        const children = React.Children.map(this.props.children, child => {
            if (child) {
                return React.addons.cloneWithProps(child, {});
            }
        });

        const headerColor = this.props.highlight === true ? {backgroundColor: this.getTheme().secondaryColor} : {};
        const wrapStyle = Object.assign({}, this.props.style, headerColor);

        return (
            <div className={classList} style={wrapStyle}>
                {children}
            </div>
        );
    },

    getTheme() {
        return this.context.muiTheme.formFields;
    },
});

export default FormFields;
