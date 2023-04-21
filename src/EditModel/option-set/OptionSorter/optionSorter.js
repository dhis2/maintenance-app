import { Observable } from 'rxjs';

export default function optionSorter(options, sortProperty, sortOrder = 'ASC') {
    const sortedOptions = options.sort((left, right) =>
        (left[sortProperty] || '')
            .localeCompare(right[sortProperty], 'en', {numeric: true}));

    return Observable
        .of(sortOrder === 'ASC'
            ? sortedOptions
            : sortedOptions.reverse());
}
