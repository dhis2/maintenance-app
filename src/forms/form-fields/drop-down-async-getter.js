import React from 'react';
import DropDown from './drop-down';

class DropDownAsyncGetter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.d2 = context.d2; // Doubles as promise callback cancel hack (see componentWillUnmount)

        this.state = {
            options: [],
        };

        this.getOptions = this.getOptions.bind(this);

        if (props.model) {
            this.getOptions(props.model);
        }
    }

    componentWillReceiveProps(newProps) {
        this.getOptions(newProps.model);
    }

    componentWillUnmount() {
        delete this.d2;
    }

    async getOptions(programId) {
        const options = await this.props.getter(programId, this.d2);

        if (this.d2) {
            this.setState({ options });
        }
    }

    render() {
        const { getter, shouldRender, ...props } = this.props;
        if (shouldRender(this.props.model)) {
            const eventIdWrapper = (event) => {
                if (event.target.value) {
                    this.props.onChange({ target: { value: { id: event.target.value }} });
                } else {
                    this.props.onChange({ target: { value: null }});
                }
            };

            return (
                <DropDown {...props}
                          value={this.props.value && this.props.value.id}
                          onChange={eventIdWrapper}
                          options={this.state.options}
                />
            );
        }

        return null;
    }
}

DropDownAsyncGetter.contextTypes = { d2: React.PropTypes.any };
DropDownAsyncGetter.propTypes = Object.assign({
    getter: React.PropTypes.func.isRequired,
    shouldRender: React.PropTypes.func.isRequired,
}, DropDown.propTypes);

DropDownAsyncGetter.defaultProps = {
    shouldRender: () => true,
};

export default DropDownAsyncGetter;
