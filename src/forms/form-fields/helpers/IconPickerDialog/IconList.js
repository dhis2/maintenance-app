import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress.js';
import Icon from './Icon.js';

export class IconList extends Component {
    constructor(props, context) {
        super(props, context);

        this.d2 = context.d2;

        this.state = {
            loading: false,
            pager: {
                page: 1,
            },
            icons: [],
        };

        this.intersectionObserver = null;
        this.loadingRef = null;
    }

    componentDidMount() {
        this.intersectionObserver = new IntersectionObserver(
            entries => {
                if (this.state.loading) {
                    return;
                }
                const [{ isIntersecting }] = entries;

                if (isIntersecting) {
                    console.log({ intersecting: isIntersecting });
                }
            },
            { threshold: 0.8 }
        );

        this.intersectionObserver.observe(this.loadingRef);

        this.fetchIcons(1);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.textFilter !== this.props.textFilter) {
            this.setState({ icons: [] }, () => this.fetchIcons(1));
        }
    }

    componentWillUnmount() {
        this.intersectionObserver.disconnect();
    }

    fetchIconAndAddToStartOfList = async key => {
        const icon = await this.d2.Api.getApi().get(`/icons/${key}`);
        this.setState(prevState => ({
            icons: [icon, ...prevState.icons],
        }));
    };

    fetchIcons = async page => {
        const typeFilter = this.props.type === 'custom' ? 'custom' : 'default';
        const filter = this.props.textFilter || '';
        const response = await this.d2.Api.getApi().get('/icons', {
            type: typeFilter,
            paging: true,
            page: page,
            keys: filter,
        });

        this.setState(prevState => ({
            pager: response.pager,
            icons: [...prevState.icons, ...response.icons.slice(0,25)],
        }));
    };

    render() {
        const isLastPage =
            this.state.pager.pageCount &&
            this.state.pager.pageSize &&
            this.state.pager.total &&
            this.state.pager.page ===
                Math.floor(this.state.pager.total / this.state.pager.pageSize);

        const shouldShowLoading = this.state.loading || false;
        const icons = this.props.prependedIcons
            ? [...this.props.prependedIcons, ...this.state.icons]
            : this.state.icons;

        return (
            <div>
                <div>
                    {this.state.selectedIcon && (
                        <Icon
                            icon={this.state.selectedIcon}
                            key={this.state.selectedIcon.key}
                            selectedIconKey={this.props.selectedIconKey}
                            handleClick={this.props.onIconSelect}
                        />
                    )}
                    {icons.map(icon => (
                        <Icon
                            icon={icon}
                            key={icon.key}
                            selectedIconKey={this.props.selectedIconKey}
                            handleClick={this.props.onIconSelect}
                        />
                    ))}
                </div>

                <div
                    className="icon-picker__list-loader"
                    style={{ display: shouldShowLoading ? 'block' : 'none' }}
                    ref={ref => (this.loadingRef = ref)}
                >
                    <CircularProgress />
                </div>
            </div>
        );
    }
}

IconList.propTypes = {
    type: PropTypes.oneOf(['default', 'custom']).isRequired,
    textFilter: PropTypes.string,
    selectedIconKey: PropTypes.string,
    onIconSelect: PropTypes.func.isRequired,
    prependedIcons: PropTypes.array,
};

IconList.contextTypes = {
    d2: PropTypes.object,
};
