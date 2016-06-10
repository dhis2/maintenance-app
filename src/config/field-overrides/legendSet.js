import React from 'react';
import Legend from 'd2-ui/lib/legend/Legend.component';
import { getInstance } from 'd2/lib/d2';
import Store from 'd2-ui/lib/store/Store';
import CircularProgress from 'material-ui/lib/circular-progress';

const legendStore = Store.create();

async function loadLegendsForLegendSet(legends) {
    const d2 = await getInstance();

    const loadedLegends = await Promise.all(
        legends.map(legend => d2.models.legend.get(legend.id))
    );

    return loadedLegends;
}

export default new Map([
    ['legends', {
        component: class extends React.Component {
            constructor() {
                super();

                this.state = {
                    isLoading: true,
                    legends: [],
                };
            }

            componentDidMount() {
                loadLegendsForLegendSet(this.props.value.toArray())
                    .then((legends) => legendStore.setState(legends));

                legendStore
                    .take(1)
                    .subscribe(legends => this.setState({
                        legends,
                        isLoading: false,
                    }));
            }

            render() {
                if (this.state.isLoading) {
                    return (<CircularProgress indetermined />);
                }

                return <Legend items={this.state.legends} />
            }
        },
        fieldOptions: {},
    }],
]);
