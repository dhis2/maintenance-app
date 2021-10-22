import { r as react, T as Translate, en as d2lib, g as _default, bT as _default$1, bU as _default$2, s as _extends, ae as Store, a5 as _default$3, ai as GroupEditor, j as _slicedToArray, p as log, F as _default$4, cz as _default$5, cA as _default$6 } from './index-44839b1a.js';

function hasNameInArray(listToCheck) {
  return function hasNameInArrayInner(value) {
    // If no list has been given the result is always true
    if (listToCheck.length === 0) {
      return true;
    }

    return listToCheck.indexOf(value.name) !== -1;
  };
}

var ModelTypeSelector = react.createClass({
  displayName: "ModelTypeSelector.component",
  propTypes: {
    nameListFilter: react.PropTypes.arrayOf(react.PropTypes.string),
    onChange: react.PropTypes.func.isRequired
  },
  mixins: [Translate],
  getDefaultProps: function getDefaultProps() {
    return {
      nameListFilter: []
    };
  },
  getInitialState: function getInitialState() {
    return {
      selectedModel: null
    };
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    d2lib.getInstance().then(function (d2) {
      return _this.setState({
        models: d2.models
      });
    });
  },
  _onChange: function _onChange(event, index, modelType) {
    this.setState({
      selectedModel: modelType
    });
    this.props.onChange(modelType);
  },
  renderOptions: function renderOptions() {
    var _this2 = this;

    if (this.state && this.state.models) {
      return this.state.models.mapThroughDefinitions(function (v) {
        return v;
      }).filter(hasNameInArray(this.props.nameListFilter)).map(function (value) {
        return {
          text: _this2.getTranslation(_default(value.plural)),
          payload: value
        };
      }).map(function (option, index) {
        return /*#__PURE__*/react.createElement(_default$1, {
          key: index,
          primaryText: option.text,
          value: option.payload
        });
      });
    }

    return [];
  },
  render: function render() {
    return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(_default$2, _extends({
      value: this.state.selectedModel,
      hintText: this.getTranslation('select_an_object_type'),
      fullWidth: true
    }, this.props, {
      onChange: this._onChange
    }), this.renderOptions()));
  }
});

var ItemSelector = react.createClass({
  displayName: "ItemSelector.component",
  propTypes: {
    itemListStore: react.PropTypes.object.isRequired,
    onItemSelected: react.PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      items: []
    };
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    this.subscription = this.props.itemListStore.map(function (modelList) {
      return modelList.map(function (model) {
        return {
          text: model.displayName,
          payload: model.id,
          model: model
        };
      });
    }).subscribe(function (items) {
      if (items.length) {
        _this.props.onItemSelected(items[0].model);
      }

      _this.setState({
        items: items
      });
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.subscription && this.subscription.unsubscribe) {
      this.subscription.unsubscribe();
    }
  },
  renderOptions: function renderOptions() {
    return this.state.items.map(function (option, index) {
      return /*#__PURE__*/react.createElement(_default$1, {
        key: index,
        primaryText: option.text,
        value: option.payload
      });
    });
  },
  render: function render() {
    return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(_default$2, {
      onChange: this._onChange,
      value: this.props.value && this.props.value.id,
      fullWidth: true
    }, this.renderOptions()));
  },
  _onChange: function _onChange(event, index, value) {
    if (this.state.items && this.state.items[index]) {
      this.props.onItemSelected(this.state.items[index].model);
    }
  }
});

var ItemsInGroupManager = react.createClass({
  displayName: "ItemsInGroupManager.component",
  mixins: [Translate],
  contextTypes: {
    d2: react.PropTypes.object
  },
  getInitialState: function getInitialState() {
    var itemStore = Store.create();
    var assignedItemStore = Store.create();
    var itemListStore = Store.create();
    itemStore.state = [];
    assignedItemStore.state = [];
    return {
      itemListStore: itemListStore,
      itemStore: itemStore,
      assignedItemStore: assignedItemStore,
      filterText: '',
      showGroupEditor: false
    };
  },
  renderGroupEditor: function renderGroupEditor() {
    if (!this.state.showGroupEditor) {
      return null;
    }

    return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(ItemSelector, {
      value: this.state.modelToEdit || this.state.itemListStore.state[0],
      itemListStore: this.state.itemListStore,
      onItemSelected: this._workItemChanged
    }), /*#__PURE__*/react.createElement(_default$3, {
      fullWidth: true,
      hintText: this.getTranslation('search_available_selected_items'),
      defaultValue: this.state.filterText,
      onChange: this._setFilterText
    }), /*#__PURE__*/react.createElement(GroupEditor, {
      itemStore: this.state.itemStore,
      assignedItemStore: this.state.assignedItemStore,
      onAssignItems: this._assignItems,
      onRemoveItems: this._removeItems,
      filterText: this.state.filterText
    }));
  },
  createUrls: function createUrls(items) {
    var _this$state = this.state,
        modelToEdit = _this$state.modelToEdit,
        itemDefinition = _this$state.itemDefinition;
    return items.map(function (id) {
      return "".concat(modelToEdit.modelDefinition.plural, "/").concat(modelToEdit.id, "/").concat(itemDefinition, "/").concat(id);
    });
  },
  render: function render() {
    var d2 = this.context.d2;
    var accessibleGroups = ['indicatorGroup', 'dataElementGroup', 'categoryOptionGroup'].filter(function (groupName) {
      return d2.currentUser.canCreate(d2.models[groupName]);
    });
    var contentStyle = {
      padding: '2rem'
    };
    return /*#__PURE__*/react.createElement("div", {
      style: contentStyle
    }, /*#__PURE__*/react.createElement(ModelTypeSelector, {
      nameListFilter: accessibleGroups,
      onChange: this._typeChanged
    }), this.renderGroupEditor());
  },
  _assignItems: function _assignItems(items) {
    var _this = this;

    var requests = this.createUrls(items).map(function (url) {
      return d2lib.getInstance().then(function (d2) {
        return d2.Api.getApi();
      }).then(function (api) {
        return api.post(url);
      });
    });
    return Promise.all(requests).then(function () {
      var itemDefinition = _this.state.modelToEdit.modelDefinition.name.replace('Group', '');

      return d2lib.getInstance().then(function (d2) {
        return Promise.all([d2, d2.models[_this.state.modelToEdit.modelDefinition.name].get(_this.state.modelToEdit.id)]);
      }).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            d2 = _ref2[0],
            fullModel = _ref2[1];

        _this.state.assignedItemStore.setState(fullModel[d2.models[itemDefinition].plural]);

        _this.setState({
          modelToEdit: fullModel
        });
      })["catch"](function (message) {
        return log.error(message);
      });
    });
  },
  _removeItems: function _removeItems(items) {
    var _this2 = this;

    var requests = this.createUrls(items).map(function (url) {
      return d2lib.getInstance().then(function (d2) {
        return d2.Api.getApi();
      }).then(function (api) {
        return api["delete"](url);
      });
    });
    return Promise.all(requests).then(function () {
      var itemDefinition = _this2.state.modelToEdit.modelDefinition.name.replace('Group', '');

      return d2lib.getInstance().then(function (d2) {
        return Promise.all([d2, d2.models[_this2.state.modelToEdit.modelDefinition.name].get(_this2.state.modelToEdit.id)]);
      }).then(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            d2 = _ref4[0],
            fullModel = _ref4[1];

        _this2.state.assignedItemStore.setState(fullModel[d2.models[itemDefinition].plural]);

        _this2.setState({
          modelToEdit: fullModel
        });
      })["catch"](function (message) {
        return log.error(message);
      });
    });
  },
  _typeChanged: function _typeChanged(modelDef) {
    var _this3 = this;

    if (!modelDef) {
      return;
    }

    modelDef.list({
      paging: false,
      fields: 'id,displayName,name'
    }).then(function (modelCollection) {
      return modelCollection.toArray();
    }).then(function (models) {
      return _this3.state.itemListStore.setState(models);
    }).then(function () {
      return _this3.setState({
        showGroupEditor: true
      });
    })["catch"](function (message) {
      return log.error(message);
    });
  },
  _setFilterText: function _setFilterText(event) {
    this.setState({
      filterText: event.target.value
    });
  },
  _workItemChanged: function _workItemChanged(model) {
    var _this4 = this;

    var itemDefinition = model.modelDefinition.name.replace('Group', '');
    d2lib.getInstance().then(function (d2) {
      if (!d2.models[itemDefinition]) {
        return Promise.reject("This groupType does not have a model named: ".concat(itemDefinition));
      }

      var availablePromise = d2.models[itemDefinition].list({
        paging: false
      });
      var modelPromise = d2.models[model.modelDefinition.name].get(model.id);
      Promise.all([availablePromise, modelPromise]).then(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            availableItems = _ref6[0],
            fullModel = _ref6[1];

        _this4.state.itemStore.setState(availableItems);

        _this4.state.assignedItemStore.setState(fullModel[d2.models[itemDefinition].plural]);

        _this4.setState({
          modelToEdit: fullModel,
          itemDefinition: d2.models[itemDefinition].plural
        });
      });
    })["catch"](function (message) {
      return log.error(message);
    });
  },
  reset: function reset() {
    var _this5 = this;

    if (!this.state.modelToEdit) {
      return;
    }

    var itemDefinition = this.state.modelToEdit.modelDefinition.name.replace('Group', '');
    d2lib.getInstance().then(function (d2) {
      return Promise.all([d2, d2.models[_this5.state.modelToEdit.modelDefinition.name].get(_this5.state.modelToEdit.id)]);
    }).then(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          d2 = _ref8[0],
          fullModel = _ref8[1];

      _this5.state.assignedItemStore.setState(fullModel[d2.models[itemDefinition].plural]);

      _this5.setState({
        modelToEdit: fullModel
      });
    })["catch"](function (message) {
      return log.error(message);
    });
  }
});

var GroupsForItemManager = react.createClass({
  displayName: "GroupsForItemManager.component",
  mixins: [Translate],
  getInitialState: function getInitialState() {
    var itemStore = Store.create();
    var assignedItemStore = Store.create();
    var itemListStore = Store.create();
    itemStore.state = [];
    assignedItemStore.state = [];
    return {
      itemListStore: itemListStore,
      itemStore: itemStore,
      assignedItemStore: assignedItemStore,
      filterText: '',
      showGroupEditor: false
    };
  },
  renderGroupEditor: function renderGroupEditor() {
    if (!this.state.showGroupEditor) {
      return [];
    }

    return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(ItemSelector, {
      value: this.state.modelToEdit || this.state.itemListStore.state[0],
      itemListStore: this.state.itemListStore,
      onItemSelected: this._workItemChanged
    }), /*#__PURE__*/react.createElement(_default$3, {
      fullWidth: true,
      hintText: this.getTranslation('search_available_selected_items'),
      defaultValue: this.state.filterText,
      onChange: this._setFilterText
    }), /*#__PURE__*/react.createElement(GroupEditor, {
      itemStore: this.state.itemStore,
      assignedItemStore: this.state.assignedItemStore,
      onAssignItems: this._assignItems,
      onRemoveItems: this._removeItems,
      filterText: this.state.filterText
    }));
  },
  render: function render() {
    var contentStyle = {
      padding: '2rem'
    };
    var d2 = this.context.d2;
    var accessibleModels = ['indicator', 'dataElement', 'categoryOption'].filter(function (schemaName) {
      return d2.currentUser.canCreate(d2.models["".concat(schemaName, "Group")]);
    });
    return /*#__PURE__*/react.createElement("div", {
      style: contentStyle
    }, /*#__PURE__*/react.createElement(ModelTypeSelector, {
      nameListFilter: accessibleModels,
      onChange: this._typeChanged
    }), this.renderGroupEditor());
  },
  createUrls: function createUrls(items) {
    var _this$state = this.state,
        modelToEdit = _this$state.modelToEdit,
        itemDefinition = _this$state.itemDefinition;
    return items.map(function (id) {
      return "".concat(modelToEdit.modelDefinition.plural, "/").concat(modelToEdit.id, "/").concat(itemDefinition, "/").concat(id);
    });
  },
  _assignItems: function _assignItems(items) {
    var _this = this;

    var requests = this.createUrls(items).map(function (url) {
      return d2lib.getInstance().then(function (d2) {
        return d2.Api.getApi();
      }).then(function (api) {
        return api.post(url);
      });
    });
    return Promise.all(requests).then(function () {
      var itemDefinition = "".concat(_this.state.modelToEdit.modelDefinition.name, "Group");
      return d2lib.getInstance().then(function (d2) {
        return Promise.all([d2, d2.models[_this.state.modelToEdit.modelDefinition.name].get(_this.state.modelToEdit.id)]);
      }).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            d2 = _ref2[0],
            fullModel = _ref2[1];

        _this.state.assignedItemStore.setState(fullModel[d2.models[itemDefinition].plural]);

        _this.setState({
          modelToEdit: fullModel
        });
      });
    })["catch"](function (message) {
      return log.error(message);
    });
  },
  _removeItems: function _removeItems(items) {
    var _this2 = this;

    var requests = this.createUrls(items).map(function (url) {
      return d2lib.getInstance().then(function (d2) {
        return d2.Api.getApi();
      }).then(function (api) {
        return api["delete"](url);
      });
    });
    return Promise.all(requests).then(function () {
      var itemDefinition = "".concat(_this2.state.modelToEdit.modelDefinition.name, "Group");
      return d2lib.getInstance().then(function (d2) {
        return Promise.all([d2, d2.models[_this2.state.modelToEdit.modelDefinition.name].get(_this2.state.modelToEdit.id)]);
      }).then(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            d2 = _ref4[0],
            fullModel = _ref4[1];

        _this2.state.assignedItemStore.setState(fullModel[d2.models[itemDefinition].plural]);

        _this2.setState({
          modelToEdit: fullModel
        });
      });
    })["catch"](function (message) {
      return log.error(message);
    });
  },
  _typeChanged: function _typeChanged(modelDef) {
    var _this3 = this;

    modelDef.list({
      paging: false,
      fields: 'id,displayName,name'
    }).then(function (modelCollection) {
      return modelCollection.toArray();
    }).then(function (models) {
      return _this3.state.itemListStore.setState(models);
    }).then(function () {
      return _this3.setState({
        showGroupEditor: true
      });
    })["catch"](function (message) {
      return log.error(message);
    });
  },
  _setFilterText: function _setFilterText(event) {
    this.setState({
      filterText: event.target.value
    });
  },
  _workItemChanged: function _workItemChanged(model) {
    var _this4 = this;

    var itemDefinition = "".concat(model.modelDefinition.name, "Group");
    d2lib.getInstance().then(function (d2) {
      if (!d2.models[itemDefinition]) {
        return Promise.reject("This groupType does not have a model named: ".concat(itemDefinition));
      }

      var availablePromise = d2.models[itemDefinition].list({
        paging: false
      });
      var modelPromise = d2.models[model.modelDefinition.name].get(model.id);
      Promise.all([availablePromise, modelPromise]).then(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            availableItems = _ref6[0],
            fullModel = _ref6[1];

        _this4.state.itemStore.setState(availableItems);

        _this4.state.assignedItemStore.setState(fullModel[d2.models[itemDefinition].plural]);

        _this4.setState({
          modelToEdit: fullModel,
          itemDefinition: d2.models[itemDefinition].plural
        });
      });
    })["catch"](function (message) {
      return log.error(message);
    });
  },
  reset: function reset() {
    var _this5 = this;

    if (!this.state.modelToEdit) {
      return;
    }

    var itemDefinition = "".concat(this.state.modelToEdit.modelDefinition.name, "Group");
    d2lib.getInstance().then(function (d2) {
      return Promise.all([d2, d2.models[_this5.state.modelToEdit.modelDefinition.name].get(_this5.state.modelToEdit.id)]);
    }).then(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          d2 = _ref8[0],
          fullModel = _ref8[1];

      _this5.state.assignedItemStore.setState(fullModel[d2.models[itemDefinition].plural]);

      _this5.setState({
        modelToEdit: fullModel
      });
    })["catch"](function (message) {
      return log.error(message);
    });
  }
});

var GroupEditor_component = react.createClass({
  displayName: "GroupEditor.component",
  render: function render() {
    return /*#__PURE__*/react.createElement(_default$4, null, /*#__PURE__*/react.createElement(_default$5, {
      onChange: this._tabChanged
    }, /*#__PURE__*/react.createElement(_default$6, {
      label: "Manage items in group"
    }, /*#__PURE__*/react.createElement(ItemsInGroupManager, {
      ref: "itemsForGroup"
    })), /*#__PURE__*/react.createElement(_default$6, {
      label: "Manage groups for item"
    }, /*#__PURE__*/react.createElement(GroupsForItemManager, {
      ref: "groupsForItem"
    }))));
  },
  _tabChanged: function _tabChanged() {
    this.refs.itemsForGroup.reset();
    this.refs.groupsForItem.reset();
  }
});

export { GroupEditor_component as default };
