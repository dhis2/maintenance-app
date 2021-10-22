import { r as react, bT as _default, bU as _default$1, P as PropTypes, bV as Action, i as getInstance, O as Observable, bW as CircularProgress, a5 as _default$2, g as _default$3, ag as _default$4, w as withStateFrom, ae as Store, ah as _default$5 } from './index-44839b1a.js';

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LocaleSelector = function (_Component) {
    _inherits$2(LocaleSelector, _Component);

    function LocaleSelector(props, context) {
        _classCallCheck$2(this, LocaleSelector);

        var _this = _possibleConstructorReturn$2(this, (LocaleSelector.__proto__ || Object.getPrototypeOf(LocaleSelector)).call(this, props, context));

        _this.onLocaleChange = function (event, index, locale) {
            _this.setState({
                locale: locale
            });

            _this.props.onChange(locale, event);
        };

        var i18n = _this.context.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    _createClass$2(LocaleSelector, [{
        key: 'render',
        value: function render() {
            var localeMenuItems = [{ payload: '', text: '' }].concat(this.props.locales).map(function (locale, index) {
                return react.createElement(_default, { key: index, primaryText: locale.name, value: locale.locale });
            });

            return react.createElement(
                _default$1,
                _extends$1({
                    fullWidth: true
                }, this.props, {
                    value: this.state && this.state.locale,
                    hintText: this.getTranslation('select_locale'),
                    onChange: this.onLocaleChange
                }),
                localeMenuItems
            );
        }
    }]);

    return LocaleSelector;
}(react.Component);

LocaleSelector.propTypes = {
    value: PropTypes.string,
    locales: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        locale: PropTypes.string.isRequired
    })).isRequired,
    onChange: PropTypes.func.isRequired
};

LocaleSelector.contextTypes = {
    d2: PropTypes.object
};

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function getLocales() {
    if (!getLocales.localePromise) {
        getLocales.localePromise = getInstance().then(function (d2) {
            var api = d2.Api.getApi();

            return api.get('locales/db');
        }).then(function (locales) {
            return {
                locales: locales
            };
        });
    }

    return Observable.fromPromise(getLocales.localePromise);
}

function getModelHref(model) {
    if (model.href) {
        return model.href;
    }

    return model.modelDefinition.apiEndpoint + '/' + model.id;
}

function getTranslationsForModel(model) {
    return Observable.of(model).flatMap(function (model) {
        var modelDefinition = model.modelDefinition;

        if (!modelDefinition && !modelDefinition.name) {
            return Promise.reject(new Error('Can not find modelDefinition for ' + model.id));
        }

        return getInstance().then(function (d2) {
            var api = d2.Api.getApi();

            return api.get(getModelHref(model) + '/translations');
        });
    });
}

var saveTranslations = Action.create('saveTranslations');

saveTranslations.subscribe(function (_ref) {
    var _ref$data = _slicedToArray(_ref.data, 2),
        model = _ref$data[0],
        translations = _ref$data[1],
        complete = _ref.complete,
        error = _ref.error;

    var translationHref = getModelHref(model) + '/translations';

    getInstance().then(function (d2) {
        var api = d2.Api.getApi();

        api.update(translationHref, { translations: translations }, { dataType: 'text' }).then(function () {
            return complete(translations);
        }).catch(error);
    });
});

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getTranslationFormData(model) {
    var translationStore = Store.create();

    getTranslationsForModel(model).subscribe(function (translations) {
        translationStore.setState(translations);
    });

    return Observable.combineLatest(getLocales(), translationStore, function () {
        for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
            data[_key] = arguments[_key];
        }

        return Object.assign.apply(Object, [{
            objectToTranslate: model,
            setTranslations: function setTranslations(translations) {
                translationStore.setState({
                    translations: translations
                });
            }
        }].concat(data));
    });
}

function getTranslationFormFor(model) {
    return withStateFrom(getTranslationFormData(model), TranslationForm);
}

var TranslationForm = function (_Component) {
    _inherits$1(TranslationForm, _Component);

    function TranslationForm(props, context) {
        _classCallCheck$1(this, TranslationForm);

        var _this = _possibleConstructorReturn$1(this, (TranslationForm.__proto__ || Object.getPrototypeOf(TranslationForm)).call(this, props, context));

        _this.state = {
            loading: true,
            translations: {},
            translationValues: {},
            currentSelectedLocale: ''
        };

        _this.setCurrentLocale = function (locale) {
            _this.setState({
                currentSelectedLocale: locale
            });
        };

        _this.setValue = function (property, event) {
            var newTranslations = [].concat(_this.props.translations);
            var translation = newTranslations.find(function (t) {
                return t.locale === _this.state.currentSelectedLocale && t.property.toLowerCase() === _default$3(property);
            });

            if (translation) {
                if (event.target.value) {
                    translation.value = event.target.value;
                } else {
                    // Remove translation from the array
                    newTranslations = newTranslations.filter(function (t) {
                        return t !== translation;
                    });
                }
            } else {
                translation = {
                    property: _default$3(property).toUpperCase(),
                    locale: _this.state.currentSelectedLocale,
                    value: event.target.value
                };

                newTranslations.push(translation);
            }

            _this.props.setTranslations(newTranslations);
        };

        _this.saveTranslations = function () {
            saveTranslations(_this.props.objectToTranslate, _this.props.translations).subscribe(_this.props.onTranslationSaved, _this.props.onTranslationError);
        };

        var i18n = _this.context.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    _createClass$1(TranslationForm, [{
        key: 'getLoadingdataElement',
        value: function getLoadingdataElement() {
            return react.createElement(
                'div',
                { style: { textAlign: 'center' } },
                react.createElement(CircularProgress, { mode: 'indeterminate' })
            );
        }
    }, {
        key: 'renderFieldsToTranslate',
        value: function renderFieldsToTranslate() {
            var _this2 = this;

            return this.props.fieldsToTranslate.filter(function (fieldName) {
                return fieldName;
            }).map(function (fieldName) {
                return react.createElement(
                    'div',
                    { key: fieldName },
                    react.createElement(_default$2, {
                        floatingLabelText: _this2.getTranslation(_default$3(fieldName)),
                        value: _this2.getTranslationValueFor(fieldName),
                        fullWidth: true,
                        onChange: _this2.setValue.bind(_this2, fieldName)
                    }),
                    react.createElement(
                        'div',
                        null,
                        _this2.props.objectToTranslate[fieldName]
                    )
                );
            });
        }
    }, {
        key: 'renderForm',
        value: function renderForm() {
            return react.createElement(
                'div',
                null,
                this.renderFieldsToTranslate(),
                react.createElement(_default$4, {
                    label: this.getTranslation('save'),
                    primary: true,
                    onClick: this.saveTranslations
                }),
                react.createElement(_default$4, {
                    style: { marginLeft: '1rem' },
                    label: this.getTranslation('cancel'),
                    onClick: this.props.onCancel
                })
            );
        }
    }, {
        key: 'renderHelpText',
        value: function renderHelpText() {
            return react.createElement(
                'div',
                null,
                react.createElement(
                    'p',
                    null,
                    this.getTranslation('select_a_locale_to_enter_translations_for_that_language')
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.locales && !this.props.translations) {
                return this.getLoadingdataElement();
            }

            return react.createElement(
                'div',
                { style: { minHeight: 250 } },
                react.createElement(LocaleSelector, { locales: this.props.locales, onChange: this.setCurrentLocale }),
                this.state.currentSelectedLocale ? this.renderForm() : this.renderHelpText()
            );
        }
    }, {
        key: 'getTranslationValueFor',
        value: function getTranslationValueFor(fieldName) {
            var _this3 = this;

            var translation = this.props.translations.find(function (t) {
                return t.locale === _this3.state.currentSelectedLocale && t.property.toLowerCase() === _default$3(fieldName);
            });

            if (translation) {
                return translation.value;
            }
        }
    }]);

    return TranslationForm;
}(react.Component);

TranslationForm.propTypes = {
    onTranslationSaved: PropTypes.func.isRequired,
    onTranslationError: PropTypes.func.isRequired,
    objectToTranslate: PropTypes.shape({
        id: PropTypes.string.isRequired
    }),
    fieldsToTranslate: PropTypes.arrayOf(PropTypes.string)
};

TranslationForm.defaultProps = {
    fieldsToTranslate: ['name', 'shortName', 'description']
};

TranslationForm.contextTypes = {
    d2: PropTypes.object
};

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TranslationDialog = function (_Component) {
    _inherits(TranslationDialog, _Component);

    function TranslationDialog(props, context) {
        _classCallCheck(this, TranslationDialog);

        var _this = _possibleConstructorReturn(this, (TranslationDialog.__proto__ || Object.getPrototypeOf(TranslationDialog)).call(this, props, context));

        _this.i18n = context.d2.i18n;

        _this.state = {
            TranslationForm: getTranslationFormFor(_this.props.objectToTranslate)
        };

        _this.translationSaved = _this.translationSaved.bind(_this);
        _this.translationError = _this.translationError.bind(_this);
        _this.closeTranslationDialog = _this.closeTranslationDialog.bind(_this);
        return _this;
    }

    _createClass(TranslationDialog, [{
        key: 'render',
        value: function render() {
            return react.createElement(
                _default$5,
                _extends({
                    title: this.i18n.getTranslation('translation_dialog_title'),
                    autoDetectWindowHeight: true,
                    autoScrollBodyContent: true
                }, this.props),
                react.createElement(this.state.TranslationForm, {
                    onTranslationSaved: this.translationSaved,
                    onTranslationError: this.translationError,
                    onCancel: this.closeTranslationDialog,
                    fieldsToTranslate: this.props.fieldsToTranslate
                })
            );
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            if (newProps.objectToTranslate) {
                this.setState({
                    TranslationForm: getTranslationFormFor(newProps.objectToTranslate)
                });
            }
        }
    }, {
        key: 'closeTranslationDialog',
        value: function closeTranslationDialog() {
            this.props.onRequestClose();
        }
    }, {
        key: 'translationSaved',
        value: function translationSaved(args) {
            this.props.onTranslationSaved(args);
            this.closeTranslationDialog();
        }
    }, {
        key: 'translationError',
        value: function translationError(err) {
            this.props.onTranslationError(err);
        }
    }]);

    return TranslationDialog;
}(react.Component);

TranslationDialog.propTypes = {
    objectToTranslate: PropTypes.shape({
        id: PropTypes.string.isRequired
    }).isRequired,
    onTranslationSaved: PropTypes.func.isRequired,
    onTranslationError: PropTypes.func.isRequired,
    open: PropTypes.bool,
    onRequestClose: PropTypes.func.isRequired,
    fieldsToTranslate: PropTypes.array
};

TranslationDialog.contextTypes = {
    d2: PropTypes.object
};

var TranslationDialog$1 = TranslationDialog;

export { TranslationDialog$1 as T };
