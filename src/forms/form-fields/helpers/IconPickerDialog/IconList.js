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
        // init observer only after first page is fetched
        // this is needed so that the observer doesnt return early due to loading state
        this.fetchIcons(1).then(() => this.initIntersectionObserver());
    }

    initIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            entries => {
                if (this.state.loading) {
                    return;
                }
                const [{ isIntersecting }] = entries;

                if (isIntersecting) {
                    console.log({ t: this });
                    console.log({ intersecting: isIntersecting });
                    this.fetchIcons(this.state.pager.page + 1);
                }
            },
            { threshold: 0.8 }
        );

        this.intersectionObserver.observe(this.loadingRef);
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
        const typeFilter = this.props.type;

        const filter = this.props.textFilter || '';

        this.setState({ loading: true });
        const response = await this.d2.Api.getApi().get('/icons', {
            type: typeFilter,
            paging: true,
            page: page,
            search: filter,
            pageSize: 200,
        });

        this.setState(prevState => ({
            pager: response.pager,
            icons: [...prevState.icons, ...response.icons],
            loading: false,
        }));
    };

    render() {
        const isLastPage =
            this.state.pager.total === 0 ||
            (this.state.pager.pageCount &&
                this.state.pager.page === this.state.pager.pageCount);

        const shouldShowLoading = !!this.state.loading || !isLastPage;
        const icons = this.state.icons;

        console.log({ icons });
        // console.log({io: this.intersectionObserver })
        return (
            <div>
                <div>
                    {this.state.selectedIcon && (
                        <Icon
                            icon={this.state.selectedIcon}
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
                    style={shouldShowLoading ? undefined : { display: 'none' }}
                    ref={ref => (this.loadingRef = ref)}
                >
                    <CircularProgress />
                </div>
            </div>
        );
    }
}

IconList.propTypes = {
    type: PropTypes.oneOf(['default', 'custom', 'all']).isRequired,
    textFilter: PropTypes.string,
    selectedIconKey: PropTypes.string,
    onIconSelect: PropTypes.func.isRequired,
};

IconList.contextTypes = {
    d2: PropTypes.object,
};
