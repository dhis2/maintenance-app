import { throwError } from './utils';
import { isString } from './check';

class SchemaTypes {
    getTypes() { // eslint-disable-line class-methods-use-this
        return [
            'TEXT',
            'NUMBER',
            'INTEGER',
            'BOOLEAN',
            'EMAIL',
            'PASSWORD',
            'URL',
            'PHONENUMBER',
            'GEOLOCATION', // TODO: Geo location could be an advanced type of 2 numbers / strings?
            'COLOR',
            'COMPLEX',
            'COLLECTION',
            'REFERENCE',
            'DATE',
            'COMPLEX',
            'IDENTIFIER',
            'CONSTANT',
        ];
    }

    typeLookup(propertyType) {
        if (this.getTypes().indexOf(propertyType) >= 0 && isString(propertyType)) {
            return propertyType;
        }

        return throwError(['Type from schema "', propertyType, '" not found available type list.'].join(''));
    }
}

export default new SchemaTypes();
