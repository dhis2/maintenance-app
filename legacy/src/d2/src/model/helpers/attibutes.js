import { areDefinedAndEqual, isNullUndefinedOrEmptyString } from '../../lib/check';
import { pick } from '../../lib/utils';

const getValue = pick('value');
const getAttributeValueAttributeName = pick('attribute.name');

function createPropertyDefinitionsForAttributes(attributeProperties, getAttributeValues, setAttributeValues, setDirty) {
    return Object
        .keys(attributeProperties)
        .reduce((propertyDefinitions, attributeName) => {
            propertyDefinitions[attributeName] = { // eslint-disable-line no-param-reassign
                enumerable: true,
                get() {
                    const attributeValues = getAttributeValues();

                    return attributeValues
                        .filter(attributeValue => getAttributeValueAttributeName(attributeValue) === attributeName)
                        .reduce((current, attributeValue) => attributeValue.value, undefined);
                },
                set(value) {
                    const attributeValue = getAttributeValues()
                        .filter(av => av.attribute.name === attributeName)
                        .reduce((current, av) => av, undefined);

                    if (areDefinedAndEqual(getValue(attributeValue), value)) {
                        return; // Don't do anything if the value stayed the same
                    }

                    if (attributeValue) {
                        // Remove the attributeValue from the array of attributeValues on the object
                        // This is done because the server can not handle them properly when empty strings
                        // as values are sent. It will properly remove the attributeValue
                        // on the server side when they are not being send to the server at all.
                        if (isNullUndefinedOrEmptyString(value)) {
                            const remainingAttributeValues = getAttributeValues().filter(av => av !== attributeValue);
                            setAttributeValues(remainingAttributeValues);
                        }

                        attributeValue.value = value;
                    } else {
                        // Add the new attribute value to the attributeValues collection
                        setAttributeValues(getAttributeValues().concat({
                            value,
                            attribute: {
                                id: attributeProperties[attributeName].id,
                                name: attributeProperties[attributeName].name,
                            },
                        }));
                    }

                    // Set the model to be dirty
                    setDirty();
                },
            };

            return propertyDefinitions;
        }, {});
}

export default createPropertyDefinitionsForAttributes;
