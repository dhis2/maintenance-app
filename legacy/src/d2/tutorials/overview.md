## D2

The d2 library is a javascript library that abstacts away the dhis2 api and lets you use javascript models to communicate with your dhis2 server.

At the moment it allows you to work with:
- The metadata endpoints
- A selection of the "other" endpoints (non-metadata/data related endpoints)

The "other" endpoints are:
- system {@link module:system/System~System|System}
    - info
    - settings ({@link module:system.SystemSettings|SystemSettings})
    - configuration ({@link module:system.SystemConfiguration|SystemConfiguration})
- me (currentUser) ({@link module:current-user.CurrentUser|CurrentUser})
    - authorization ({@link module:current-user.UserAuthorities|UserAuthorities})
- i18n
- data store

## Initialisation

d2 requires an initialisation step to be able to use some the functionality. To initialise
the library one calls the {@link module:d2.init|init} function.

The most basic usage of the init function would look like.
```js
import { init } from 'd2/lib/d2';

init({ baseUrl: 'https://play.dhis2.org/demo/api' });
```
We import the {@link module:d2.init|init} function from the d2 library and call it with a config object.

The config object takes the following properties

| option  | type   | description                                                                   |
|---------|--------|-------------------------------------------------------------------------------|
| baseUrl | string | The location of the dhis2 api. Note that this always needs to end with `/api` |
| schemas | array  | Pass a list of [schema](https://play.dhis2.org/demo/api/schemas.json?fields=name,metadata) names. (only metadata schemas are supported.) Passing an empty array will result into no schemas being loaded. The default is to load all schemas.
| headers | object | A map of default headers that should be set on each http request. This is passed into `setDefaultHeaders` on the Api class |

## The d2 object and `getInstance`

During the initialisation the {@link module:d2.init~d2|d2} object is created. The {@link module:d2.init|init} function returns a promise
that returns the {@link module:d2.init~d2|d2} object. However you might want to get a hold of the same object in other places in your application
You could store the instance somewhere and keep track of it, however that does not guarantee that it's available.

To be able to get a hold of the instance, when it is ready, you can use the {@link module:d2.getInstance|getInstance} function.

```js
// File init.js
import { init } from 'd2/lib/d2';

init({ baseUrl: 'https://play.dhis2.org/demo/api' });

// File myOtherFile.js
import { getInstance } from 'd2/lib/d2';

getInstance()
    .then(d2 => {
        console.log(d2.currentUser.name); // Will log when the init() function is done initialising the instance
    });
```

For a more elaborate description on whats available on the d2 object see the {@link module:d2.init~d2|d2 namespace}
