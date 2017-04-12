import Store from 'd2-ui/lib/store/Store';

/**
 * Contains all the event related d2 models.
 * We can't store these in the redux store since they are mutable objects :(
 *
 * The store contains the following keys
 * program: The event program itself.
 */
const eventProgramStore = Store.create();

export default eventProgramStore;
