# How do i? (FAQ)

## Figure out which models i can use?

The types of models to use include almost all the available endpoint points in DHIS2. The ones available are the _generic_ endpoints.
A more practical way to get the list is to use either the schemas endpoint, or use `d2` itself.

A request to the following url will get you all the names of schemas available. `http://play.dhis2.org/demo/api/schemas.json?fields=name`

If you already have `d2` available you can do the following.

```js
import { getInstance } from 'd2/lib/d2';

getInstance(d2 => {
    console.log(Object.keys(d2.models));
});
```

## How do i add translation sources and strings and get rid of `** name **`

Before calling the `init` we might want to register some sources for translations. The translation sources could be either specified by adding a file source
(in the form of a `.properties` file) or by adding individual strings.

### Adding file sources

To add a file source you simply add it to the set of files to load by using the `i18n.sources.add` method.

In a more real world example this would look something like the following.
```js
const userLanguage = window.navigator.language.slice(0, 2);

if (userLanguage !== 'en') {
    config.i18n.sources.add(`./i18n/i18n_module_${userLanguage}.properties`);
}

config.i18n.sources.add('./i18n/i18n_module_en.properties');
```

### Adding individual strings

To add strings/keys that you would like to get translated by the dhis2 api (These are the translation keys that you do not specify in your `.properties` files)
you need to register them before calling the `init` method. Registration of the keys is done by caling `i18n.strings.add`.
The `init` method will then ask the `/api/i18n` endpoint for the translations of all the registered strings.

```js
import { init, config } from 'd2/lib/d2';

config.i18n.strings.add('log_out');
config.i18n.strings.add('account');
config.i18n.strings.add('profile');
config.i18n.strings.add('settings');

init({ baseUrl: 'https://play.dhis2.org/demo/api' });
```
