import { Observable } from 'rxjs';

export default function optionSorter(options, sortProperty, sortOrder = 'ASC') {
    const sortAsNumbers = options.every(option =>
        isFinite(option[sortProperty])
    );
    const sortedOptions = sortAsNumbers
        ? options.sort(
              (left, right) => left[sortProperty] - right[sortProperty]
          )
        : options.sort((left, right) =>
              (left[sortProperty] || '').localeCompare(right[sortProperty])
          );

    return Observable.of(
        sortOrder === 'ASC' ? sortedOptions : sortedOptions.reverse()
    );
}
