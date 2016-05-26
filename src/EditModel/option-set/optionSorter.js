import {Observable} from 'rx';

export default function optionSorter(options, sortProperty, sortOrder = 'ASC') {
    const sortedOptions = options.sort(function (left, right) {
        return (left[sortProperty] || '').localeCompare(right[sortProperty]);
    });

    return Observable
        .just(sortOrder === 'ASC' ? sortedOptions : sortedOptions.reverse());
}
