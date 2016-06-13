import React from 'react';
import Legend from 'd2-ui/lib/legend/Legend.component';
import { getInstance } from 'd2/lib/d2';
import Store from 'd2-ui/lib/store/Store';
import LinearProgress from 'material-ui/lib/linear-progress';
import modelToEditStore from '../../EditModel/modelToEditStore';
import log from 'loglevel';

const legendStore = Store.create();

// TODO: Integrate these validation functions before saving.
// validateLegends = function() {
//     var items = tmpLegendStore.data.items,
//         item,
//         prevItem;
//
//     if (items.length === 0) {
//         gis.alert('At least one legend is required');
//         return false;
//     }
//
//     for (var i = 1; i < items.length; i++) {
//         item = items[i].data;
//         prevItem = items[i - 1].data;
//
//         if (item.startValue < prevItem.endValue) {
//             var msg = 'Overlapping legends not allowed!\n\n' +
//                 prevItem.name + ' (' + prevItem.startValue + ' - ' + prevItem.endValue + ')\n' +
//                 item.name + ' (' + item.startValue + ' - ' + item.endValue + ')';
//             gis.alert(msg);
//             return false;
//         }
//
//         if (prevItem.endValue < item.startValue) {
//             var msg = 'Legend gaps detected!\n\n' +
//                 prevItem.name + ' (' + prevItem.startValue + ' - ' + prevItem.endValue + ')\n' +
//                 item.name + ' (' + item.startValue + ' - ' + item.endValue + ')\n\n' +
//                 'Proceed anyway?';
//
//             if (!confirm(msg)) {
//                 return false;
//             }
//         }
//     }
//
//     return true;
// };

export default new Map([
    ['legends', {
        component: class extends React.Component {
            constructor(props, context) {
                super(props, context);

                this.state = {
                    isLoading: true,
                    legends: [],
                };
            }

            componentDidMount() {
                this.initLegends(this.props);
            }

            componentWillReceiveProps(props) {
                this.initLegends(props);
            }

            initLegends(props) {
                this.setState({
                    legends: props.value.toArray(),
                    isLoading: false,
                });
            }

            render() {
                if (this.state.isLoading) {
                    return (<LinearProgress indetermined />);
                }

                return <Legend items={this.state.legends} onItemsChange={this.updateLegends} />
            }

            updateLegends = (newLegends) => {
                getInstance()
                    .then(d2 => d2.Api.getApi())
                    .then(api => api.get('system/uid', { limit: newLegends.length }))
                    .then(response => response.codes)
                    .then(codes => {
                        return newLegends.map((legend, index) => {
                            legend.id = codes[index];
                            return legend;
                        });
                    })
                    .then(legends => {
                        const model = modelToEditStore.getState();
                        model[this.props.referenceProperty].clear();

                        legends.forEach(legend => model[this.props.referenceProperty].add(legend));

                        this.props.onChange({
                            target: {
                                value: model[this.props.referenceProperty],
                            }
                        });
                    })
                    .catch(log.error);
            }
        },
        fieldOptions: {},
    }],
]);
