/**
 * @module model
 *
 * @description
 *
 * This page will give you an introduction on one of the largest and more complex parts of d2, the metadata models.
 *
 * Models are an abstraction on top of the dhis2 metadata api. We can use these models to interact with the dhis2 api.
 * The models are accessible on the `.models` property that is attached to the d2 instance (that is retrieved by calling
 * `getInstance()`).
 *
 * A schema is a description of a type of metadata object. To find out which schemas are available for you to use with
 * d2 take a look at https://play.dhis2.org/demo/api/schemas.json?fields=name,metadata. Any schema that is marked as
 * `metadata: true` can be used with d2.
 *
 * There are a few concepts that you should familiarise yourself with before you start. (More documentation on the following
 * concepts can be found on the classes that represent them.)
 *
 * ### ModelDefinitions
 *
 * A {@link module:model.ModelDefinition} is where it all starts. In d2 the schemas you have loaded are represented by a `ModelDefinition`.
 * A `ModelDefinition` is essentially a wrapper around the schemas that allows you to create `Model` instances for that
 * specific schema (e.g. the dataElementModelDefinition allows you to create dataElement Models).
 * ```js
 * d2.models.dataElement // This is the dataElement ModelDefinition
 *  .create()            // Creates a Model object based of the dataElement ModelDefinition
 * ```
 *
 * When working with the d2 object the `d2.models` object contains modelDefinitions for the schemas that you have loaded.
 * (by default that is all schemas). To get a modelDefinition for a specific schema you ask for it by the name of the schema.
 * A few examples other than the dataElement one from above would be:
 *
 * ```js
 * d2.models.user
 * d2.models.legendSet
 * d2.models.organisationUnit
 * ```
 *
 * The ModelDefinition allows you to load objects from the api. You can either load individual items or items in bulk.
 *
 * We can use it to get specific objects
 * ```js
 * d2.models.organisationUnit.get('ImspTQPwCqd')
 *  .then(organisationUnitModel => console.log(organisationUnitModel));
 * ```
 *
 * or to load a list of objects (by default paging is enabled and it will only load the first 50 entries).
 * ```js
 * d2.models.organisationUnit.list()
 *  .then(organisationUnitCollection => console.log(organisationUnitCollection));
 * ```
 *
 * The ModelDefinition also allows you to filter on properties using a programatic syntax. To find out which
 * filter methods are available you can a look at the {@link module:model.Filter|Filter} class.
 * ```js
 * d2.models.organisationUnit
 *  .filter().on('level').equals(2)
 *  .list()
 *  .then(organisationUnitCollection => console.log(organisationUnitCollection));
 * ```
 * Applying a filter like this will create a clone of the modelDefinition with the filter applied, so you can
 * store the reference to the cloned modelDefinition and use it later, without globally applying the filter everywhere.
 *
 * ```js
 * const organisationUnitsOnLevel3 = d2.models.organisationUnit
 *  .filter().on('level').equals(3);
 *
 * const organisationUnitsOnLevel3WithParent = organisationUnitsOnLevel3
 *  .filter().on('parent.id').equals('O6uvpzGd5pu);
 *
 * organisationUnitsOnLevel3
 *  .list({ paging: false }) // Loads all organisation units on level 3
 *  .then(organisationUnitCollection => console.log(organisationUnitCollection));
 *
 * organisationUnitsOnLevel3WithParent
 *  .list({ paging: false }) // Loads all organisation units on level 3 with O6uvpzGd5pu as their parent
*   .then(organisationUnitCollection => console.log(organisationUnitCollection));
 * ```
 *
 * As you might have noticed we passed `{ paging: false }` to the `.list` method. Any options passed to the list method
 * (with the exception of filter) will be passed through as regular query parameters.
 *
 * If you ran the above examples you would notice that the `.list` method returns a ModelCollection.
 *
 * ## ModelCollection
 * A {@link module:model.ModelCollection|ModelCollection} is simple a collection of Model objects. The ModelCollection is
 * sometimes somewhat cumbersome to work with and often you would like to transform the ModelCollection to an array using
 * the `.toArray()` method or spreading the values of the ModelCollection.
 *
 * ```js
 * d2.models.organisationUnit
 *  .filter().on('level').equals(2)
 *  .list()
 *  .then(organisationUnitCollection => {
 *    let organisationUnits = organisationUnitCollection.toArray();
 *    // or
 *    organisationUnits = [...organisationUnitCollection.values()];
 * });
 * ```
 *
 * The ModelCollection does not only contain the Models, it also gives you access to a {@link module:model.Pager|Pager}.
 * The pager objects keeps track of which page was loaded and how many pages there are.
 *
 * The following example will load the first page of organisation units and then keep loading a new page every second
 * until we run out of pages.
 * ```js
 * function loadNextPage(pager, callback) {
 *   if (pager.hasNextPage()) {
 *     pager.getNextPage()
 *       .then(organisationUnitCollection  => {
 *         setTimeout(() => {
 *           callback(organisationUnitCollection);
 *           loadNextPage(organisationUnitCollection.pager, callback);
 *         }, 1000);
 *       });
 *   }
 * }
 *
 * const printCollection = collection => console.log(collection.toArray());
 *
 * d2.models.organisationUnit
 *   .list()
 *   .then(organisationUnitCollection => {
 *     printCollection(organisationUnitCollection);
 *     loadNextPage(organisationUnitCollection.pager, printCollection);
 *   });
 * ```
 *
 * ## Model
 * TODO: :(
 */
import ModelBase from './ModelBase';
import Model from './Model';
import ModelDefinition from './ModelDefinition';
import ModelDefinitions from './ModelDefinitions';
import ModelValidation from './ModelValidation';

export default {
    ModelBase,
    Model,
    ModelDefinition,
    ModelDefinitions,
    ModelValidation,
};
