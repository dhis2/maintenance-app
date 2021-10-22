# maintenance-app

[![Build Status](https://travis-ci.com/dhis2/maintenance-app.svg)](https://travis-ci.com/dhis2/maintenance-app)


## App config

The maintenance app is largely driven by the app config and the schemas from the API. The schemas are read directly
from the API (by D2). The following documents the app config: 

- within `src/config/` ...
    - `maintenance-models.js` defines the model types that are shown in the app
    - `field-config/` contains configuration for each model type
        - `field-order.js` defines the order of fields within the form for each model type
        - `field-groups.js` defines field grouping for the form for each model. This is currently only used for
           programRules, but it might be a good idea to expand it to other model types as well.
    - `field-overrides/` contains extra configuration for fields that require non-standard behavior. Most commonly this
      means fields that require special components.
        - `index.js` lists all models that have one or more field overrides
        - The actual field overrides are specified in files named after each model type, which in turn are imported into
          `index.js`. Some model types or fields that require a lot of logic are separated into sub folders.
    - `inlinehelp-mapping.json` specifies mapping from each section/model-type to pages in the documentation.
    - `field-rules.js` contains conditional logic that can be used to show or hide fields or set field values based on
      the value of other fields.
    - `periodTypes.json` contains the list of period types that are supported by the current version of the API.
    - `disabled-on-edit/` contains files that list fields that will always be displayed as read-only when an object is
      being edited.
        - `index.js` imports lists of field names from files named after each relevant model

For the record, "schemas" and "model types" are essentially the same thing and these terms are used interchangeably
both in the maintenance app and elsewhere. Schemas are exposed by the API, but not every model type is listed in the
schemas. To add to the confusion "models" are also some times referred to as "objects".


## Sections, model types and fields

In order for a model type to show up in the maintenance app, the following conditions need to be met:

- The model type is listed under a section in `src/config/maintenance-models.js`
- The model type exists in the schemas endpoint in the API

Once these conditions are met, the model type will show up in the maintenance app under the section specified in
`maintenance-models.js`. When creating or editing models of the new type, the form will by default only contain a
handful of predefined fields. In order for additional fields to be shown in the form, the following conditions need to
be met:

- The field is listed under the model type in `src/config/field-config/field-order.js`
- The field exists in the schemas endpoint for the specific model type in the API. 


## Adding a new model type

Adding a new model to the maintenance typically involves the following steps:

1. Add the model type to `src/config/maintenance-models.js`
2. Add the model type and the list of fields that should be shown in the form to
   `src/config/field-config/field-order.js`
   1. (Optional) If the fields should be separated into separate groups in the form, the groups can be specified in
      `src/config/field-config/field-groups.js`.
3. The new model type should now be listed in the maintenance app. Navigate to the new model type and check the form
   both when creating a new instance of the model type and when editing an existing instance. If you're lucky,
   everything will just work at this point. More likely there will be one or more fields that require further
   customization.
4. Create a new file named after the new model type in `src/config/field-overrides/`.
   Open `src/config/field-overrides/index.js`, import the newly created file and add it to the `overridesByType` object.
5. Inside the new field override file (`src/config/field-overrides/newType.js`), start adding customizations for the
   fields that require it. This typically involves creating new components and/or overriding certain field properties.
   Look at the existing field overrides for examples.
6. Strings that show up as `** string **` in the UI lack translations. These will need to be added to the translations
   files located in `src/i18n/`. Some strings are generated dynamically and may only show up in certain situations, for
   example when trying to delete a model. _Note:_ the translation workflow should at some point change to using
   [i18next](https://www.i18next.com/) in favor of `d2.i18n`.


#### Extra special cases

Certain models require customization beyond what's possible using the config and field overrides. In those cases it may
be necessary to create a new top level component and associate that component with a special route in `src/router.js`

Examples of this approach includes:

- Event program editor: `src/EditModel/event-program/EditEventProgram.component.js`
- Custom form editor: `src/EditModel/EditDataEntryForm.component.js`
