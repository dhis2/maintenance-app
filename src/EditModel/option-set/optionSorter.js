import {Observable} from 'rxjs';

export default function optionSorter(options, sortProperty, sortOrder = 'ASC') {
    const sortedOptions = options.sort(function (left, right) {
        return (left[sortProperty] || '').localeCompare(right[sortProperty]);
    });

    return Observable
        .of(sortOrder === 'ASC' ? sortedOptions : sortedOptions.reverse());
}
