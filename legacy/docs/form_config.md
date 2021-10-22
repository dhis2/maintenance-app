# Form config

### Fields and field order
The [field orders](../src/config/field-config/field-order.js)
determine which field should be shown for a given form.

### Form fields creation
The `createFieldConfigForModelTypes` function, found in
[src/EditModel/formHelpers.js](../src/EditModel/formHelpers.js),
creates the form field components and config for a set of field names.

### Override styles for specific forms
Here field components and their configs can be [overriden](../src/config/field-overrides/index.js) if a form needs sth different.
