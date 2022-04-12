import ReactCreateClass from 'create-react-class'
import PropTypes from 'prop-types'
import ObservedEvents from '../utils/ObservedEvents.mixin';
import Translate from '@dhis2/d2-ui-translation-dialog/Translate.mixin.js';
import TextField from 'material-ui/TextField/TextField';
import { currentSubSection$ } from '../App/appStateStore';
import { withRouter } from 'react-router';

const unsearchableSections = ['organisationUnit'];

const SearchBox = ReactCreateClass({
    propTypes: {
        searchObserverHandler: PropTypes.func.isRequired,
        initialValue: PropTypes.string,
    },

    mixins: [ObservedEvents, Translate],

    getInitialState() {
        return {
            showSearchField: false,
            value: this.props.initialValue || '',
        };
    },

    UNSAFE_componentWillMount() {
        this.searchBoxCb = this.createEventObserver('searchBox');
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
        // Searchbox is not remounted when switching sections,
        // Clear the value when this happens
        if (this.props.params.modelType !== nextProps.params.modelType) {
            this.setState({
                value: '',
            });
        }
    },

    componentDidMount() {
        const searchObserver = this.events.searchBox
            .debounceTime(400)
            .map(
                event =>
                    event && event.target && event.target.value
                        ? event.target.value
                        : ''
            )
            .distinctUntilChanged();

        this.props.searchObserverHandler(searchObserver);
        this.subscription = currentSubSection$.subscribe(currentSection =>
            this.setState({
                ...this.state,
                showSearchField: !unsearchableSections.includes(currentSection),
            })
        );
    },

    componentWillUnmount() {
        this.subscription &&
            this.subscription.unsubscribe &&
            this.subscription.unsubscribe();
    },

    render() {
        const style = {
            display: 'inline-block',
            marginRight: 16,
            position: 'relative',
            top: -15,
        };
        return this.state.showSearchField ? (
            <div className="search-list-items" style={style}>
                <TextField
                    className="list-search-field"
                    value={this.state.value}
                    fullWidth={false}
                    type="search"
                    onChange={this._onKeyUp}
                    floatingLabelText={`${this.getTranslation('search_by_name_code_id')}`}
                />
            </div>
        ) : null;
    },

    _onKeyUp(event) {
        this.setState({
            value: event.target.value,
        });
        this.searchBoxCb(event);
    },
});

export default withRouter(SearchBox);
