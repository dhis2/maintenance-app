import mapPropsStream from 'recompose/mapPropsStream';
import { noop } from 'lodash/fp';
import { getAllObjectsWithFields } from '@dhis2/d2-ui-expression-manager/data-helpers';
import { Observable } from 'rxjs';
import CollapsibleList from './CollapsibleList';

const withConstantProps = mapPropsStream(props$ => props$
    .combineLatest(
        Observable.fromPromise(getAllObjectsWithFields('constant'))
            .startWith([]),
        ({ onSelect = noop, ...props }, constants) => ({
            ...props,
            items: constants
                .map(constant => ({
                    value: `C{${constant.id}}`,
                    label: constant.displayName,
                })),
            onItemClick: onSelect,
        })
    )
);

const ConstantSelector = withConstantProps(CollapsibleList);

export default ConstantSelector;
