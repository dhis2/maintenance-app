import { r as react, H as Heading, w as withStateFrom, a0 as addD2Context, O as Observable, i as getInstance, e as appState, bV as Action, a4 as _objectSpread2, eo as searchForOrganisationUnitsWithinHierarchy, ep as setAppState, A as _defineProperty, cq as _toConsumableArray, F as _default, eq as OrganisationUnitTreeWithSingleSelectionAndSearch, E as _default$1, ag as _default$2, ad as snackActions, p as log, f as _asyncToGenerator, j as _slicedToArray } from './index-44839b1a.js';

function AccessDenied() {
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(Heading, null, "Access denied!"), /*#__PURE__*/react.createElement("p", null, "Unfortunately you do not have access to this functionality."));
}

function identity(v) {
  return v;
}

var d2$ = Observable.fromPromise(getInstance());
var hierarchy$ = appState.map(function (state) {
  return state.hierarchy || {};
});
var rightTreeSearch = Action.create('rightTreeSearch', 'Hierarchy');
var leftTreeSearch = Action.create('leftTreeSearch', 'Hierarchy');
Observable // Merge the search action streams for the left and right side trees as we handle them the same
.merge(leftTreeSearch.map(function (action) {
  return _objectSpread2(_objectSpread2({}, action), {}, {
    side: 'left'
  });
}).debounceTime(400), rightTreeSearch.map(function (action) {
  return _objectSpread2(_objectSpread2({}, action), {}, {
    side: 'right'
  });
}).debounceTime(400)) // Only search when we have values
.filter(function (action) {
  return action.data;
}) // Do the actual search
.map(function (_ref) {
  var complete = _ref.complete,
      error = _ref.error,
      data = _ref.data,
      side = _ref.side;
  return Observable.fromPromise(searchForOrganisationUnitsWithinHierarchy(data, 50)).map(function (organisationUnits) {
    return {
      complete: complete,
      error: error,
      organisationUnits: organisationUnits,
      side: side
    };
  });
}) // Make sure we only take the latest
.concatAll() // Grab the current state from the appState
.flatMap(function (v) {
  return Observable.of(v).combineLatest(hierarchy$.take(1), function (result, hierarchy) {
    return {
      result: result,
      hierarchy: hierarchy
    };
  });
}) // Update the app state with the result
.subscribe(function (_ref2) {
  var result = _ref2.result;
      _ref2.hierarchy;
  setAppState({
    hierarchy: _objectSpread2(_objectSpread2({}, appState.state.hierarchy), {}, _defineProperty({}, "".concat(result.side, "Roots"), result.organisationUnits))
  });
}); // Reset the trees to the userOrganisationUnits when no search value was found

Observable.merge( // Emit for the empty left searchfield
leftTreeSearch.filter(function (action) {
  return !action.data;
}).map(function () {
  return 'left';
}), // Emit for the empty right searchfield
rightTreeSearch.filter(function (action) {
  return !action.data;
}).map(function () {
  return 'right';
})).flatMap(function (side) {
  return appState.take(1).map(function (state) {
    return {
      side: side,
      state: state
    };
  });
}).subscribe(function (_ref3) {
  var side = _ref3.side,
      state = _ref3.state;
  setAppState({
    hierarchy: _objectSpread2(_objectSpread2({}, state.hierarchy), {}, _defineProperty({}, "".concat(side, "Roots"), state.userOrganisationUnits.toArray()))
  });
});
var organisationUnitHierarchy$ = appState.map(function (_ref4) {
  var _ref4$hierarchy = _ref4.hierarchy,
      hierarchy = _ref4$hierarchy === void 0 ? {} : _ref4$hierarchy,
      userOrganisationUnits = _ref4.userOrganisationUnits;
  return {
    roots: userOrganisationUnits.toArray(),
    leftRoots: hierarchy.leftRoots,
    rightRoots: hierarchy.rightRoots,
    initiallyExpanded: userOrganisationUnits.toArray().map(function (model) {
      return model.path;
    }),
    moveTargetPath: hierarchy.moveTargetPath || null,
    selectedLeft: hierarchy.selectedLeft || [],
    selectedRight: hierarchy.selectedRight || [],
    isProcessing: hierarchy.isProcessing,
    reload: hierarchy.reload
  };
});

function onClickLeft(event, model) {
  hierarchy$.take(1) // Only grab the current state
  .subscribe(function (hierarchy) {
    var selectAllChildren = event.shiftKey;
    var selectedLeft = [];
    var modelIdsToRemove = hierarchy.selectedLeft.filter(function (m) {
      return m.id === model.id;
    }).map(function (m) {
      return m.id;
    });
    var children = model.children.toArray();
    var childrenToAdd = []; // add all children that is not already selected if shift-clicked

    if (selectAllChildren) {
      childrenToAdd = children.filter(function (child) {
        return hierarchy.selectedLeft.findIndex(function (m) {
          return m.id === child.id;
        }) < 0;
      });
    } // remove selection if already present


    if (modelIdsToRemove.length > 0) {
      if (selectAllChildren) {
        modelIdsToRemove.push.apply(modelIdsToRemove, _toConsumableArray(children.map(function (child) {
          return child.id;
        })));
      }

      selectedLeft = hierarchy.selectedLeft.filter(function (m) {
        return modelIdsToRemove.indexOf(m.id) < 0;
      });
    } else {
      var _hierarchy$selectedLe;

      selectedLeft = (_hierarchy$selectedLe = hierarchy.selectedLeft).concat.apply(_hierarchy$selectedLe, [model].concat(_toConsumableArray(childrenToAdd)));
    }

    setAppState({
      hierarchy: _objectSpread2(_objectSpread2({}, hierarchy), {}, {
        reload: [],
        selectedLeft: selectedLeft
      })
    });
  });
}

function getOrganisationUnitByIds(_x) {
  return _getOrganisationUnitByIds.apply(this, arguments);
}

function _getOrganisationUnitByIds() {
  _getOrganisationUnitByIds = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ids) {
    var d2, organisationUnits;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getInstance();

          case 2:
            d2 = _context.sent;
            _context.next = 5;
            return d2.models.organisationUnit.list({
              filter: ["id:in:[".concat(ids.join(','), "]")],
              fields: ':owner,href,id,parent,displayName,path,children[id,displayName,path]',
              paging: false
            });

          case 5:
            organisationUnits = _context.sent;
            return _context.abrupt("return", organisationUnits.toArray());

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getOrganisationUnitByIds.apply(this, arguments);
}

function setHierarchyProcessingStatus(hierarchy, status) {
  setAppState({
    hierarchy: _objectSpread2(_objectSpread2({}, hierarchy), {}, {
      isProcessing: status
    })
  });
}

function changeOrganisationUnitParentAndSave(organisationUnit) {
  return hierarchy$.take(1).combineLatest(d2$).flatMap(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        hierarchy = _ref6[0],
        d2 = _ref6[1];

    organisationUnit.parent = {
      id: hierarchy.selectedRight[0] && hierarchy.selectedRight[0].id
    };
    var movingStatus = organisationUnit.save().then(function () {
      return d2.i18n.getTranslation('successfully_moved_$$ouName$$', {
        ouName: organisationUnit.displayName
      });
    })["catch"](function (e) {
      return d2.i18n.getTranslation('failed_to_move_$$ouName$$_($$errorMessage$$)', {
        ouName: organisationUnit.displayName,
        errorMessage: e
      });
    });
    return Observable.fromPromise(movingStatus);
  });
}

function moveOrganisationUnit() {
  hierarchy$.take(1)["do"](function (hierarchy) {
    return setHierarchyProcessingStatus(hierarchy, true);
  }).map(function (hierarchy) {
    return (hierarchy.selectedLeft || []).map(function (model) {
      return model.id;
    });
  }).flatMap(function (ouIds) {
    return Observable.fromPromise(getOrganisationUnitByIds(ouIds)).flatMap(identity);
  }).map(changeOrganisationUnitParentAndSave).concatAll().subscribe(function (message) {
    snackActions.show({
      message: message,
      translate: false
    });
  }, function (e) {
    setHierarchyProcessingStatus(appState.state.hierarchy, false);
  }, function () {
    setAppState({
      hierarchy: _objectSpread2(_objectSpread2({}, appState.state.hierarchy), {}, {
        selectedLeft: [],
        selectedRight: [],
        initiallySelected: [],
        moveTargetPath: appState.state.hierarchy.selectedRight[0].path,
        reload: [].concat(appState.state.hierarchy.selectedRight.map(function (model) {
          return model.id;
        })).concat(appState.state.hierarchy.selectedLeft.map(function (model) {
          if (model.parent && model.parent.id) {
            return model.parent.id;
          }

          return appState.state.hierarchy.leftRoots.concat(appState.state.hierarchy.rightRoots).map(function (value) {
            return value.id;
          }).filter(function (rootId) {
            return new RegExp(rootId).test(model.path);
          }).reduce(function (value) {
            return value;
          });
        }))
      })
    }); // Wait till stack clears before setting isProcessing to false and triggering a rerender
    // Without this the UI represents a stale state

    setTimeout(function () {
      setHierarchyProcessingStatus(appState.state.hierarchy, false);
    }, 0);
  });
}

function onClickRight(event, model) {
  hierarchy$.take(1) // Only grab the current state
  .subscribe(function (hierarchy) {
    return setAppState({
      hierarchy: _objectSpread2(_objectSpread2({}, hierarchy), {}, {
        reload: [],
        selectedRight: [model],
        moveTargetPath: null
      })
    });
  });
}

function SelectedOrganisationUnitList(props, context) {
  var styles = {
    title: {
      color: '#666',
      marginBottom: '.5rem'
    },
    message: {
      color: '#666',
      padding: '.5rem',
      display: 'block'
    },
    list: {
      paddingLeft: '1.5rem'
    }
  };
  var listItems = props.organisationUnits.map(function (model) {
    return /*#__PURE__*/react.createElement("li", {
      key: model.id
    }, model.displayName);
  });
  var noOrganisationUnitsMessage = /*#__PURE__*/react.createElement("span", {
    style: styles.message
  }, context.d2.i18n.getTranslation(props.noOrganisationUnitsMessage));
  return /*#__PURE__*/react.createElement("div", {
    style: props.style
  }, /*#__PURE__*/react.createElement("div", {
    style: styles.title
  }, context.d2.i18n.getTranslation(props.title)), listItems.length ? /*#__PURE__*/react.createElement("ul", {
    style: styles.list
  }, listItems) : noOrganisationUnitsMessage);
}

SelectedOrganisationUnitList.defaultProps = {
  organisationUnits: []
};
var SelectedOrganisationUnitListWithContext = addD2Context(SelectedOrganisationUnitList);

function hasEqualElement(left, right, selector) {
  return left.map(selector).some(function (item) {
    return right.map(selector).indexOf(item) >= 0;
  });
}

function splitOuPath() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return path.split('/').filter(function (part) {
    return part;
  });
}

function sourceIsInPathOfTarget(source, target) {
  if (source.some(function (model) {
    return !model.path;
  }) || target.some(function (model) {
    return !model.path;
  })) {
    log.warn('No path found, so can not run hierarchy validation');
    return true;
  }

  if (target.length !== 1) {
    log.warn('More than/less than 1 target found, can not move.');
    return true;
  }

  var targetModel = target[0];
  return source.some(function (sourceModel) {
    return splitOuPath(targetModel.path).indexOf(sourceModel.id) >= 0;
  });
}

function moveButtonDisabled(props) {
  return props.isProcessing || !props.selectedLeft.length || !props.selectedRight.length || hasEqualElement(props.selectedLeft, props.selectedRight, function (v) {
    return v && v.id;
  }) || sourceIsInPathOfTarget(props.selectedLeft, props.selectedRight);
}

function OrganisationUnitHierarchy(props, context) {
  var styles = {
    wrap: {
      flex: 1,
      display: 'flex',
      flexOrientation: 'row',
      margin: '1rem 0'
    },
    ouTreeLeft: {
      flex: 1,
      marginRight: '2rem',
      padding: '1rem'
    },
    ouTreeRight: {
      flex: 1,
      padding: '1rem'
    },
    moveButton: {
      width: '100%',
      marginBottom: '1rem',
      marginTop: '1rem'
    },
    pendingOperationsWrap: {
      padding: '1rem',
      margin: '1rem 0'
    },
    pendingOperationsListsWrap: {
      display: 'flex',
      flexDirection: 'row'
    },
    pendingOperationsList: {
      flex: 1,
      padding: '.5rem'
    },
    errorMessage: {
      color: 'orange',
      lineHeight: '1.5rem',
      padding: '1rem 0',
      display: 'flex',
      alignItems: 'flex-end'
    },
    errorIcon: {
      color: 'orange'
    }
  };

  if (!context.d2.currentUser.authorities.has('F_ORGANISATIONUNIT_MOVE')) {
    return /*#__PURE__*/react.createElement(AccessDenied, null);
  }

  var buttonLabel = context.d2.i18n.getTranslation('move_$$ouCount$$_organisation_units', {
    ouCount: props.selectedLeft && props.selectedLeft.length || 0
  });
  var headingTitle = context.d2.i18n.getTranslation('hierarchy_operations');
  var warningForMovingWithinSubtree = context.d2.i18n.getTranslation('you_can_not_move_higher_level_organisation_units_to_its_descendants');
  var initiallyExpandedRight = props.moveTargetPath ? [].concat(_toConsumableArray(props.initiallyExpanded), [props.moveTargetPath]) : props.initiallyExpanded;
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(Heading, null, headingTitle), /*#__PURE__*/react.createElement("div", {
    style: styles.wrap
  }, /*#__PURE__*/react.createElement(_default, {
    style: styles.ouTreeLeft
  }, /*#__PURE__*/react.createElement(OrganisationUnitTreeWithSingleSelectionAndSearch, {
    roots: props.leftRoots,
    initiallyExpanded: props.initiallyExpanded,
    selected: props.selectedLeft.map(function (model) {
      return model.path;
    }),
    onSelectClick: onClickLeft,
    onUpdateInput: function onUpdateInput(value) {
      return leftTreeSearch(value);
    },
    idsThatShouldBeReloaded: props.reload,
    noHitsLabel: context.d2.i18n.getTranslation('no_matching_organisation_units'),
    forceReloadChildren: true
  })), /*#__PURE__*/react.createElement(_default, {
    style: styles.ouTreeRight
  }, /*#__PURE__*/react.createElement(OrganisationUnitTreeWithSingleSelectionAndSearch, {
    roots: props.rightRoots,
    selected: props.selectedRight.map(function (model) {
      return model.path;
    }),
    initiallyExpanded: initiallyExpandedRight,
    onSelectClick: onClickRight,
    onUpdateInput: function onUpdateInput(value) {
      return rightTreeSearch(value);
    },
    idsThatShouldBeReloaded: props.reload,
    noHitsLabel: context.d2.i18n.getTranslation('no_matching_organisation_units'),
    hideCheckboxes: true,
    hideMemberCount: true,
    forceReloadChildren: true
  }))), /*#__PURE__*/react.createElement(_default, {
    style: styles.pendingOperationsWrap
  }, /*#__PURE__*/react.createElement("div", {
    style: styles.pendingOperationsListsWrap
  }, /*#__PURE__*/react.createElement(SelectedOrganisationUnitListWithContext, {
    style: styles.pendingOperationsList,
    organisationUnits: props.selectedLeft,
    noOrganisationUnitsMessage: "select_organisation_units_to_move_from_the_left_tree",
    title: "move"
  }), /*#__PURE__*/react.createElement(SelectedOrganisationUnitListWithContext, {
    style: styles.pendingOperationsList,
    organisationUnits: props.selectedRight,
    noOrganisationUnitsMessage: "select_new_parent_for_organisation_units_from_the_right_tree",
    title: "new_parent"
  }))), props.selectedLeft.length && props.selectedRight.length && sourceIsInPathOfTarget(props.selectedLeft || [], props.selectedRight || []) ? /*#__PURE__*/react.createElement("div", {
    style: styles.errorMessage
  }, /*#__PURE__*/react.createElement(_default$1, {
    style: styles.errorIcon,
    className: "material-icons"
  }, "warning"), warningForMovingWithinSubtree) : null, /*#__PURE__*/react.createElement(_default$2, {
    primary: true,
    style: styles.moveButton,
    label: buttonLabel,
    onClick: moveOrganisationUnit,
    disabled: moveButtonDisabled(props)
  }));
}

OrganisationUnitHierarchy.defaultProps = {
  selectedLeft: [],
  selectedRight: []
};
var OrganisationUnitHierarchy_component = withStateFrom(organisationUnitHierarchy$, addD2Context(OrganisationUnitHierarchy));

export { OrganisationUnitHierarchy_component as default };
