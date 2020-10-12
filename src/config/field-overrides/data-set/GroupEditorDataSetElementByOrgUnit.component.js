import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Paper from 'material-ui/Paper/Paper';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

// D2
import { config } from 'd2/lib/d2';

// D2-UI
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress';

import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox/Checkbox';

import { selectedRight$ } from '../../../App/appStateStore';
import modelToEditStore from '../../../EditModel/modelToEditStore';
import { Observable } from 'rxjs';
import { copyOwnProperties } from 'd2/lib/lib/utils';

// TODO: TOAST!
// TODO: Undo support (in TOAST?)

config.i18n.strings.add('selected');
config.i18n.strings.add('assign_all');
config.i18n.strings.add('remove_all');
config.i18n.strings.add('hidden_by_filters');

const styles = {
    th: {
        whiteSpace: 'nowrap',
        textAlign: 'center',
        border: '1px solid #e0e0e0',
        padding: 6,
    },
    thDataElements: {
        whiteSpace: 'nowrap',
        border: '1px solid #e0e0e0',
        background: '#f0f0f0',
        textAlign: 'left',
        padding: 6,
    },
    td: {
        whiteSpace: 'nowrap',
        padding: 2,
        border: '1px solid #e0e0e0',
        minWidth: 105,
    },
    tdDataElement: {
        whiteSpace: 'nowrap',
        padding: 6,
        border: '1px solid #e0e0e0',
    },
    //new
    paper: {
        overflow: 'auto',
    },
    container: {
        display: 'flex',
        marginTop: 16,
        marginBottom: 32,
        height: '250px',
    },
    left: {
        flex: '1 0 120px',
    },
    middle: {
        flex: '0 0 120px',
        alignSelf: 'center',
        textAlign: 'center',
    },
    right: {
        flex: '1 0 120px',
    },
    select: {
        width: '100%',
        minHeight: '50px',
        height: '250px',
        border: 'none',
        fontFamily: 'Roboto',
        fontSize: 13,
        outline: 'none',
    },
    options: {
        padding: '.25rem .5rem',
    },
    buttons: {
        minWidth: '100px',
        maxWidth: '100px',
        marginTop: '8px',
    },
    selected: {
        fontSize: 13,
        minHeight: '15px',
        marginTop: '45px',
        padding: '0 8px',
    },
    status: {
        marginTop: '8px',
        minHeight: '60px',
    },
    hidden: {
        fontSize: 13,
        color: '#404040',
        fontStyle: 'italic',
        textAlign: 'center',
        width: '100%',
        background: '#d0d0d0',
        maxHeight: '15px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    ///
    dialogContent: {
        maxWidth: 'none',
    },
    dialogDiv: {
        overflowX: 'auto',
        overflowY: 'hidden',
    },
    table: {
        borderSpacing: 0,
        borderCollapse: 'collapse',
        margin: '32px auto',
    },
    th: {
        whiteSpace: 'nowrap',
        textAlign: 'center',
        border: '1px solid #e0e0e0',
        padding: 6,
    },
    thDataElements: {
        whiteSpace: 'nowrap',
        border: '1px solid #e0e0e0',
        background: '#f0f0f0',
        textAlign: 'left',
        padding: 6,
    },
    td: {
        whiteSpace: 'nowrap',
        padding: 2,
        border: '1px solid #e0e0e0',
        minWidth: 105,
    },
    tdDataElement: {
        whiteSpace: 'nowrap',
        padding: 6,
        border: '1px solid #e0e0e0',
    },
    button: {
        position: 'relative',
        top: 3,
        marginLeft: 16,
    },
};

class GroupEditor extends Component {
    constructor(props, context) {
        super(props, context);

        const i18n = this.context.d2.i18n;
        this.getTranslation = i18n.getTranslation.bind(i18n);
    }

    state = {
        // Number of items selected in the left/right columns
        selectedLeft: 0,
        selectedRight: 0,

        // Loading
        loading: true,
        selectAll: false,
        deselectAll: false,
        isDailyDS : false,
        toggleBoggleRowDE: false,

        selectedRightOrgUnit: [],      
        authorizations: [],  
    };
    

    componentDidMount() {
        this.disposables = [];

        this.disposables.push(this.props.itemStore.subscribe(state => this.setState({ loading: !state })));
        this.disposables.push(this.props.assignedItemStore.subscribe(() => this.forceUpdate()));
        this.disposables.push(this.props.greyedFieldStore.subscribe(() => this.forceUpdate()));
       
        this.disposables.push(selectedRight$.subscribe(selectedRightOu => {           

            if (selectedRightOu.length > 0) {
                const dataSetModel = modelToEditStore.getState();
                const greyedFields = dataSetModel.greyedFields.reduce((prev, gf) => {
                    if (prev.hasOwnProperty(gf.dataElement.id)) {
                        if (gf.organisationUnit.id === selectedRightOu[0].id) {
                            prev[gf.dataElement.id].push(gf.categoryOptionCombo.id);
                        }                        
                        return prev;
                    }

                    const out = prev;
                    if (gf.organisationUnit.id === selectedRightOu[0].id){
                        out[gf.dataElement.id] = [gf.categoryOptionCombo.id];
                    }

                    return out;
                }, {});

                this.setState({
                    ...this.state,
                    currentCategoryCombo: this.state.categoryCombos.toArray()[0].id,
                    //categoryCombos,
                    optionCount: this.state.categoryCombos.toArray()
                        .reduce((oc, cc) => {
                            oc[cc.id] = cc.categories.toArray().map(c => c.categoryOptions.size);
                            return oc;
                        }, {}),
                    //cocMap,
                    greyedFields,                    
                    selectedRightOrgUnit: selectedRightOu,                    
                });
            }else {
                this.setState({
                    ...this.state,
                    selectedRightOrgUnit: selectedRightOu,
                });
            }

        }));
        
    }

    componentWillReceiveProps(props) {
        if (props.hasOwnProperty('filterText') && this.leftSelect && this.rightSelect) {
            this.setState({
                selectedLeft: [].filter.call(this.leftSelect.selectedOptions, item => item.text.toLowerCase().indexOf((`${props.filterText}`).trim().toLowerCase()) !== -1).length,
                selectedRight: [].filter.call(this.rightSelect.selectedOptions, item => item.text.toLowerCase().indexOf((`${props.filterText}`).trim().toLowerCase()) !== -1).length,
            });
        }

        const d2 = this.context.d2;

        if (props.dataSetElements) {
            const dataElements = props.dataSetElements;
            if (dataElements.length < 1) {
                log.info(`DataSet contains no data elements`);
                snackActions.show({ message: this.getTranslation('tthis_dataset_has_no_data_elements	'), action: 'ok' });
                this.props.onRequestClose();
                return;
            }

            if (dataElements.length > 10) {
                styles.paper.height = '600px';
                styles.container.height = '600px';
            }else{
                styles.paper.height = '250px';
                styles.container.height = '250px';
            }

            let cocMap = {};

            const categoryArrayToMap = (categories) => {
                let appendage = null;

                const reduceAppendage = (prev, categoryOption) => {
                    const out = prev;
                    out[categoryOption.id] = appendage;
                    return out;
                };

                while (categories.length > 0) {
                    appendage = categories.pop().categoryOptions.toArray().reduce(reduceAppendage, {});
                }
                return appendage;
            };

            const assignCocs = (cocMap, options, coc) => {
                if (options.length > 0) {
                    return Object.keys(cocMap).reduce((prev, key) => {
                        const out = prev;
                        const keyPos = options.indexOf(key);
                        if (keyPos !== -1) {
                            options.splice(keyPos, 1);
                            out[key] = assignCocs(cocMap[key], options, coc);
                            return out;
                        }
                        out[key] = cocMap[key];
                        return out;
                    }, {});
                }
                return coc;
            };

            // Use the categoryCombos associated with the section to get categories and their category options
            d2.models.categoryCombos.list({
                //filter: `id:in:[${props.dataSetElements[0].dataElement.categoryCombo.id}]`,
                filter: `id:in:[${props.dataSetElements[0].categoryCombo.id}]`,
                paging: false,
                fields: [
                    'id,displayName',
                    'categories[id,displayName,categoryOptions[id,displayName]]',
                    'categoryOptionCombos[id,displayName',
                    'categoryOptions[id,displayName]]',
                ].join(','),
            })
                .then((categoryCombos) => {
                    categoryCombos.forEach((categoryCombo) => {
                        // Build a nested map of categories:
                        // { cat1_opt1 : { cat2_opt1: { cat3_opt1: null, cat3_opt2: null }, cat2_opt2: {...}, ... }, ... }
                        //
                        // Then convert to JSON and back as a fast way to remove any references within the structure
                        Object.assign(
                            cocMap,
                            JSON.parse(JSON.stringify(categoryArrayToMap(categoryCombo.categories.toArray())))
                        );

                        // Fill in the leaf nodes in the cocMap with the actual coc's
                        categoryCombo.categoryOptionCombos.toArray().forEach((coc) => {
                            const optionPath = coc.categoryOptions.toArray().map(o => o.id);
                            cocMap = assignCocs(cocMap, optionPath, { id: coc.id, displayName: coc.displayName });
                        });
                    });

                    this.setState({
                        //currentCategoryCombo: categoryCombos.toArray()[0].id,
                        categoryCombos,
                        /*optionCount: categoryCombos.toArray()
                            .reduce((oc, cc) => {
                                oc[cc.id] = cc.categories.toArray().map(c => c.categoryOptions.size);
                                return oc;
                            }, {}),*/
                        cocMap,
                    });
                });
        }

    }

    componentWillUnmount() {
        this.disposables.forEach((disposable) => {
            disposable.unsubscribe();
        });
    }

    //
    // Event handlers
    //
    onAssignItems = () => {
        this.setState({ loading: true });
        this.props.onAssignItems([].map.call(this.leftSelect.selectedOptions, item => item.value))
            .then(() => {
                this.clearSelection();
                this.setState({ loading: false });
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    onRemoveItems = () => {
        this.setState({ loading: true });
        this.props.onRemoveItems([].map.call(this.rightSelect.selectedOptions, item => item.value))
            .then(() => {
                this.clearSelection();
                this.setState({ loading: false });
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    //new
    onGreyedFields = () => {
        this.setState({ loading: true });
        this.props.onGreyedFields([].map.call(this.leftSelect.selectedOptions, item => item.value))
            .then(() => {
                this.clearSelection();
                this.setState({ loading: false });
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    // onAssignAll = () => {
    //     this.setState({ loading: true });
    //     this.props.onAssignItems([].map.call(this.leftSelect.options, item => item.value))
    //         .then(() => {
    //             this.clearSelection();
    //             this.setState({ loading: false });
    //         }).catch(() => {
    //             this.setState({ loading: false });
    //         });
    // }

    onRemoveAll = () => {
        this.setState({ loading: true });
        this.props.onRemoveItems([].map.call(this.rightSelect.options, item => item.value))
            .then(() => {
                this.clearSelection();
                this.setState({ loading: false });
            }).catch(() => {
                this.setState({ loading: false });
            });
    }

    //
    // Data handling utility functions
    //
    getItemStoreIsCollection() {
        return this.props.itemStore.state !== undefined && (typeof this.props.itemStore.state.values === 'function' && typeof this.props.itemStore.state.has === 'function');
    }
    getItemStoreIsArray() {
        return this.props.itemStore.state !== undefined && this.props.itemStore.state.constructor.name === 'Array';
    }
    getAssignedItemStoreIsCollection() {
        return this.props.assignedItemStore.state !== undefined && (typeof this.props.assignedItemStore.state.values === 'function' && typeof this.props.assignedItemStore.state.has === 'function');
    }
    getAssignedItemStoreIsArray() {
        return this.props.assignedItemStore.state !== undefined && this.props.assignedItemStore.state.constructor.name === 'Array';
    }
    getAllItems() {
        return this.getItemStoreIsCollection()
            ? Array.from(this.props.itemStore.state.values()).map(item => ({ value: item.id, text: item.name }))
            : (this.props.itemStore.state || []);
    }
    getItemCount() {
        return this.getItemStoreIsCollection() && this.props.itemStore.state.size || this.getItemStoreIsArray() && this.props.itemStore.state.length || 0;
    }
    getIsValueAssigned(value) {
        return this.getAssignedItemStoreIsCollection() ? this.props.assignedItemStore.state.has(value) : this.props.assignedItemStore.state && this.props.assignedItemStore.state.indexOf(value) !== -1;
    }
    getAssignedItems() {
        return this.getAllItems().filter(item => this.getIsValueAssigned(item.value));
    }
    getAvailableItems() {
        return this.getAllItems().filter(item => !this.getIsValueAssigned(item.value));
    }
    getAllItemsFiltered() {
        return this.filterItems(this.getAllItems());
    }
    getAssignedItemsFiltered() {
        return this.filterItems(this.getAssignedItems());
    }
    getAvailableItemsFiltered() {
        return this.filterItems(this.getAvailableItems());
    }
    getAssignedItemsCount() {
        return this.getAssignedItems().length;
    }
    getAvailableItemsCount() {
        return this.getAvailableItems().length;
    }
    getAssignedItemsFilterCount() {
        return this.getFilterText().length === 0 ? 0 : this.getAssignedItems().length - this.getAssignedItemsFiltered().length;
    }
    getAvailableItemsFilterCount() {
        return this.getFilterText().length === 0 ? 0 : this.getAvailableItems().length - this.getAvailableItemsFiltered().length;
    }
    getAssignedItemsUnfilteredCount() {
        return this.getFilterText().length === 0 ? this.getAssignedItemsCount() : this.getAssignedItemsCount() - this.getAssignedItemsFilterCount();
    }
    getAvailableItemsUnfilteredCount() {
        return this.getFilterText().length === 0 ? this.getAvailableItemsCount() : this.getAvailableItemsCount() - this.getAvailableItemsFilterCount();
    }
    getFilterText() {
        return this.props.filterText ? this.props.filterText.trim().toLowerCase() : '';
    }
    getAvailableSelectedCount() {
        return Math.max(this.state.selectedLeft, 0);
    }
    getAssignedSelectedCount() {
        return Math.max(this.state.selectedRight, 0);
    }
    getSelectedCount() {
        return Math.max(this.getAvailableSelectedCount(), this.getAssignedSelectedCount());
    }

    getSelectedItems() {
        return [].map.call(this.rightSelect.selectedOptions, item => item.value);
    }

    byAssignedItemsOrder = (left, right) => {
        const assignedItemStore = this.props.assignedItemStore.state;

        // Don't order anything if the assignedItemStore is not an array
        // TODO: Support sorting for a ModelCollectionProperty
        if (!Array.isArray(assignedItemStore)) {
            return 0;
        }

        return assignedItemStore.indexOf(left.value) > assignedItemStore.indexOf(right.value) ? 1 : -1;
    };

    clearSelection(left = true, right = true) {
        if (left) {
            this.leftSelect.selectedIndex = -1;
        }

        if (right) {
            this.rightSelect.selectedIndex = -1;
        }

        this.setState(state => ({
            selectedLeft: left ? 0 : state.selectedLeft,
            selectedRight: right ? 0 : state.selectedRight,
        }));
    }

    filterItems(items) {
        return items.filter(item => this.getFilterText().length === 0 || item.text.trim().toLowerCase().indexOf(this.getFilterText()) !== -1);
    }

    renderTableHeader() {
        let prevRowColCount = 1;
        let isDailyDS = false;
 
        return this.state.currentCategoryCombo && (
            this.state.categoryCombos.get(this.state.currentCategoryCombo).categories.toArray().map((cat, catNum) => {
                const colSpan = this.state.optionCount[this.state.currentCategoryCombo]
                    .slice(catNum + 1)
                    .reduce((product, optionCount) => optionCount * product, 1);

                const isLastHeader = catNum === this.state.categoryCombos.get(this.state.currentCategoryCombo).categories.size - 1;
                isDailyDS = cat.displayName === "DaysInMonth" ? true : false;
                const row = (
                    <tr key={catNum}>
                        <th style={styles.thDataElements}>{isLastHeader && this.getTranslation('data_element')}</th>
                        {/* <th style={styles.th}>{isLastHeader && this.getTranslation('check_row')}</th> */}
                        {isDailyDS
                        ?
                        <th style={styles.th}>{isLastHeader && this.getTranslation('daily_row')}</th>
                        :
                        //{
                            // For each column in the previous row...
                            Array(...Array(prevRowColCount)).map((e, rep) =>
                                // ... render the columns for this row
                                cat.categoryOptions.toArray().map((opt, optNum) => (
                                    <th
                                        key={`${optNum}.${rep}`}
                                        colSpan={colSpan}
                                        style={styles.th}
                                    >{opt.displayName === 'default' ? '' : opt.displayName}</th>
                                )))
                        //}
                        }
                    </tr>
                );
                prevRowColCount *= cat.categoryOptions.size;
                return row;
            })
        );
    }

    renderCheckbox(dataElement, fieldArray, fieldNum) {
        const resolveCoc = (cocMap, fields) => {
            if (fields.length === 0) {
                return cocMap;
            }

            const field = fields.shift();
            return resolveCoc(cocMap[field], fields);
        };

        const coc = resolveCoc(this.state.cocMap, fieldArray);

        let setGreyed;
        if (this.state.selectAll && !this.state.toggleBoggleRowDE ){
            setGreyed = false;
        } else if (this.state.deselectAll && !this.state.toggleBoggleRowDE ) {
            setGreyed = true;
        }else{
            setGreyed =
                this.state.greyedFields.hasOwnProperty(dataElement.value) &&
                this.state.greyedFields[dataElement.value].indexOf(coc.id) !== -1;   
        }

        const isGreyed = setGreyed;

        const toggleBoggle = ((dataElementId, categoryOptionComboId, event, disable) => {
            this.state.toggleBoggleRowDE = true; 

            this.setState((state) => {
                const greyedCocs = (state.greyedFields[dataElementId] || []).slice();
                if (disable) {
                    if (greyedCocs.includes(categoryOptionComboId)) {
                        greyedCocs.splice(greyedCocs.indexOf(categoryOptionComboId), 1);
                    }
                } else if (!greyedCocs.includes(categoryOptionComboId)) {
                    greyedCocs.push(categoryOptionComboId);
                }

                const greyedFields = Object.keys(state.greyedFields)
                    .reduce((prev, deId) => {
                        const out = prev;
                        out[deId] = deId === dataElementId ? greyedCocs : state.greyedFields[deId];
                        return out;
                    }, {});

                if (greyedCocs.length > 0 && !greyedFields.hasOwnProperty(dataElementId)) {
                    greyedFields[dataElementId] = greyedCocs;
                }

                this.props.onGreyedFields(greyedFields, this.state.selectedRightOrgUnit)
                    .then(() => {
                        this.setState({ loading: false });
                    }).catch(() => {
                        this.setState({ loading: false });
                    });

                return { greyedFields };
            });
        }).bind(this, dataElement.value, coc.id);

        return (
            <td key={fieldNum} style={styles.td}>
                <Checkbox
                    checked={!isGreyed}
                    label={isGreyed ? this.getTranslation('disabled') : this.getTranslation('enabled')}
                    labelPosition="right"
                    labelStyle={{ whiteSpace: 'nowrap' }}
                    onCheck={toggleBoggle}
                />
            </td>
        );
    }

    renderDailyCheckbox(dataElement) {

        const getCocFields = () => this.state.categoryCombos.get(this.state.currentCategoryCombo).categories
            .toArray()
            .reduce((prev, cat) => {
                if (prev.length > 0) {
                    const out = [];
                    prev.forEach((p) => {
                        cat.categoryOptions.toArray().forEach((opt) => {
                            const pout = p.slice();
                            pout.push(opt.id);
                            out.push(pout);
                        });
                    });
                    return out;
                }

                cat.categoryOptions.toArray().forEach((opt) => {
                    prev.push([opt.id]);
                });
                return prev;
            }, []);

        const cocFields = getCocFields();

        let setGreyedFieldArray = [];

        const setGreyedField = (greyedFields) => {

            cocFields.forEach((fieldArray) => {
                const resolveCoc = (cocMap, fields) => {
                    if (fields.length === 0) {
                        return cocMap;
                    }

                    const field = fields.shift();
                    return resolveCoc(cocMap[field], fields);
                };

                const coc = resolveCoc(this.state.cocMap, fieldArray);

                if (greyedFields.hasOwnProperty(dataElement.value) &&
                    greyedFields[dataElement.value].indexOf(coc.id) !== -1) {
                    setGreyedFieldArray.push(true);
                } else {
                    setGreyedFieldArray.push(false);
                }

            });

        };

        setGreyedField(this.state.greyedFields);

        let setGreyed;
        if (this.state.selectAll && !this.state.toggleBoggleRowDE) {
            setGreyed = false;
        } else if (this.state.deselectAll && !this.state.toggleBoggleRowDE ) {
            setGreyed = true;
        } else {
            if (setGreyedFieldArray.indexOf(false) !== -1) {
                setGreyed = false;
            } else {
                setGreyed = true;
            }
        }

        const isGreyed = setGreyed;    
          
        const toggleBoggleRow = ((dataElementId, event, disable) => {
            this.state.toggleBoggleRowDE = true; 

            const cocFields = getCocFields();

            cocFields.forEach((fieldArray) => {
                const resolveCoc = (cocMap, fields) => {
                    if (fields.length === 0) {
                        return cocMap;
                    }

                    const field = fields.shift();
                    return resolveCoc(cocMap[field], fields);
                };

                const coc = resolveCoc(this.state.cocMap, fieldArray);

                let categoryOptionComboId = coc.id;

                this.setState((state) => {

                    const greyedCocs = (state.greyedFields[dataElementId] || []).slice();
                    if (disable) {
                        if (greyedCocs.includes(categoryOptionComboId)) {
                            greyedCocs.splice(greyedCocs.indexOf(categoryOptionComboId), 1);
                        }
                    } else if (!greyedCocs.includes(categoryOptionComboId)) {
                        greyedCocs.push(categoryOptionComboId);
                    }

                    const greyedFields = Object.keys(state.greyedFields)
                        .reduce((prev, deId) => {
                            const out = prev;
                            out[deId] = deId === dataElementId ? greyedCocs : state.greyedFields[deId];
                            return out;
                        }, {});

                    if (greyedCocs.length > 0 && !greyedFields.hasOwnProperty(dataElementId)) {
                        greyedFields[dataElementId] = greyedCocs;
                    }

                    this.props.onGreyedFields(greyedFields, this.state.selectedRightOrgUnit)
                        .then(() => {
                            this.setState({ loading: false });
                        }).catch(() => {
                            this.setState({ loading: false });
                        });


                    return { greyedFields };
                });
            });


        }).bind(this, dataElement.value);



        return (
            <td key={dataElement.value} style={styles.td}>
                <Checkbox
                    checked={!isGreyed}
                    label={isGreyed ? this.getTranslation('disabled') : this.getTranslation('enabled')}
                    //label={isGreyed ? this.getTranslation('deselect_row') : this.getTranslation('select_row')}
                    labelPosition="right"
                    labelStyle={{ whiteSpace: 'nowrap' }}
                    onCheck={toggleBoggleRow}
                    onChange={e=> {
                        console.log("target checked? - ", e.target.checked);
                      }}
                />
            </td>
        );


    }

    renderDataElements() {
        const getCocFields = () => this.state.categoryCombos.get(this.state.currentCategoryCombo).categories
            .toArray()
            .reduce((prev, cat) => {
                if (prev.length > 0) {
                    const out = [];
                    prev.forEach((p) => {
                        cat.categoryOptions.toArray().forEach((opt) => {
                            const pout = p.slice();
                            pout.push(opt.id);
                            out.push(pout);
                        });
                    });
                    return out;
                }

                cat.categoryOptions.toArray().forEach((opt) => {
                    prev.push([opt.id]);
                });
                return prev;
            }, []);

        let isDaily = false;

        this.state.categoryCombos.get(this.state.currentCategoryCombo).categories.toArray().map((cat, catNum) => {
            isDaily = cat.displayName === "DaysInMonth" ? true : false;
        });

        this.state.isDailyDS = isDaily;

        return this.getAssignedItemsFiltered().sort(this.byAssignedItemsOrder)
            .map((item, deNum) => {
                const dataElement = item;
                const cocFields = getCocFields();                
                
                return (
                    <tr key={deNum} style={{ background: deNum % 2 === 0 ? 'none' : '#f0f0f0' }}>
                        <td style={styles.tdDataElement}>{dataElement.text}</td>
                        {isDaily
                        ?
                        this.renderDailyCheckbox(dataElement)
                        :
                        cocFields.map((fields, fieldNum) => this.renderCheckbox(dataElement, fields, fieldNum))
                        }
                    </tr>
                );
            });
    }

    handleSelectAll() {
        this.state.selectAll = true;
        this.state.deselectAll = false;        
        this.forceUpdate();

        const greyedFields = {};

        this.setState((state) => {
            this.props.onGreyedFields(greyedFields, this.state.selectedRightOrgUnit)
                .then(() => {
                    this.setState({ loading: false });
                }).catch(() => {
                    this.setState({ loading: false });
                });
            return { greyedFields };
        });
        
    }

    handleDeselectAll() {        
        this.state.selectAll = false;
        this.state.deselectAll = true;
        this.state.toggleBoggleRowDE = false;

        const getCocFields = () => this.state.categoryCombos.get(this.state.currentCategoryCombo).categories
        .toArray()
        .reduce((prev, cat) => {
            if (prev.length > 0) {
                const out = [];
                prev.forEach((p) => {
                    cat.categoryOptions.toArray().forEach((opt) => {
                        const pout = p.slice();
                        pout.push(opt.id);
                        out.push(pout);
                    });
                });
                return out;
            }

            cat.categoryOptions.toArray().forEach((opt) => {
                prev.push([opt.id]);
            });
            return prev;
        }, []);

        const greyedFields = {};

        this.getAssignedItemsFiltered().sort(this.byAssignedItemsOrder)
        .map((item, deNum) => {
            const dataElementId = item.value;
            const cocFields = getCocFields(); 

            cocFields.map((fieldArray) => {
                const resolveCoc = (cocMap, fields) => {
                    if (fields.length === 0) {
                        return cocMap;
                    }

                    const field = fields.shift();
                    return resolveCoc(cocMap[field], fields);
                };

                const coc = resolveCoc(this.state.cocMap, fieldArray);

                let categoryOptionComboId = coc.id;

                const greyedCocs = (greyedFields[dataElementId] || []).slice();
                if (greyedCocs.includes(categoryOptionComboId)) {
                    greyedCocs.splice(greyedCocs.indexOf(categoryOptionComboId), 1);
                } else if (!greyedCocs.includes(categoryOptionComboId)) {
                    greyedCocs.push(categoryOptionComboId);
                }

                if (greyedCocs.length > 0) {
                    greyedFields[dataElementId] = greyedCocs;
                }
            });

        });

        this.setState((state) => {
            this.props.onGreyedFields(greyedFields, this.state.selectedRightOrgUnit)
                .then(() => {
                    this.setState({ loading: false });
                }).catch(() => {
                    this.setState({ loading: false });
                });
            return { greyedFields };
        });

        this.forceUpdate();
    }

    //////

    //
    // Rendering
    //
    render() {
        const filterHeight = this.getFilterText().length > 0 ? 15 : 0;
        styles.select.height = `${this.props.height - filterHeight}px`;
        styles.button1 = Object.assign({}, styles.button, { marginLeft: 0 });

        const onChangeLeft = (e) => {
            this.clearSelection(false, true);
            this.setState({
                selectedLeft: e.target.selectedOptions.length,
            });
        };

        const onChangeRight = (e) => {
            this.clearSelection(true, false);
            this.setState({
                selectedRight: e.target.selectedOptions.length,
            });
        };

        const hiddenLabel = itemCount => (this.getItemCount() > 0 && this.getFilterText().length > 0 ? `${itemCount} ${this.getTranslation('hidden_by_filters')}` : '');

        const selectedLabel = () => (this.getSelectedCount() > 0 ? `${this.getSelectedCount()} ${this.getTranslation('selected')}` : '');

        return (
            <div style={styles.container}>
                <div style={styles.right}>
                    <Paper style={styles.paper}>
                        <div style={styles.hidden}>{hiddenLabel(this.getAssignedItemsFilterCount())}</div>
                        <div style={styles.dialogDiv}>
                            <table style={styles.table}>
                                <tbody>
                                    {this.renderTableHeader()}
                                    {this.state.currentCategoryCombo && this.renderDataElements()}
                                    {/* {this.state.currentCategoryCombo && this.props.sectionModel && this.renderDataElements()} */}
                                </tbody>
                            </table>
                        </div>
                    </Paper>
                    <div style={{ float: 'right', marginTop: '1rem' }}>
                        <RaisedButton
                            style={styles.button1}
                            label={this.getTranslation('select_all')}
                            onClick={() => this.handleSelectAll()}
                            disabled={this.state.loading}
                        />
                        <RaisedButton
                            style={styles.button}
                            label={this.getTranslation('deselect_all')}
                            onClick={() => this.handleDeselectAll()}
                            disabled={this.state.loading}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

GroupEditor.propTypes = {
    // itemStore: d2-ui store containing all available items, either as a D2 ModelCollection,
    // or an array on the following format: [{value: 1, text: '1'}, {value: 2, text: '2'}, ...]
    itemStore: PropTypes.object.isRequired,

    // assignedItemStore: d2-ui store containing all items assigned to the current group, either
    // as a D2 ModelCollectionProperty or an array of ID's that match values in the itemStore
    assignedItemStore: PropTypes.object.isRequired,

    // greyedFieldStore: d2-ui store containing all items assigned to the current group, either
    // as a D2 ModelCollectionProperty or an array of ID's that match values in the itemStore
    greyedFieldStore: PropTypes.object.isRequired,

    // filterText: A string that will be used to filter items in both columns
    filterText: PropTypes.string,

    // Note: Callbacks should return a promise that will resolve when the operation succeeds
    // and is rejected when it fails. The component will be in a loading state until the promise
    // resolves or is rejected.

    // assign items callback, called with an array of values to be assigned to the group
    onAssignItems: PropTypes.func.isRequired,

    // remove items callback, called with an array of values to be removed from the group
    onRemoveItems: PropTypes.func.isRequired,

    // remove items callback, called with an array of values to be removed from the group
    onMoveItems: PropTypes.func,

    // The height of the component, defaults to 500px
    height: PropTypes.number,

    // assign greyed fields callback, called with an array of values to be assigned to the group
    onGreyedFields: PropTypes.func.isRequired,

};

GroupEditor.contextTypes = {
    d2: PropTypes.object,
};

GroupEditor.defaultProps = {
    height: 500,
    filterText: '',
    onMoveItems: () => {},
};

export default GroupEditor;
