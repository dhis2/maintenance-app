# d2

[![Build Status](https://travis-ci.org/dhis2/d2.svg?branch=v25)](https://travis-ci.org/dhis2/d2)
[![Test Coverage](https://codeclimate.com/github/dhis2/d2/badges/coverage.svg)](https://codeclimate.com/github/dhis2/d2/coverage)
[![Code Climate](https://codeclimate.com/github/dhis2/d2/badges/gpa.svg)](https://codeclimate.com/github/dhis2/d2)
[![npm version](https://badge.fury.io/js/d2.svg)](https://badge.fury.io/js/d2)

----

# Documentation
The full api documentation is available at [full api documentation](https://dhis2.github.io/d2)

# Quickstart  guide

## Install

Start with adding d2 to your project.

`yarn add d2` or `npm install d2`

After installing you will be able to import the library into your project by using the files in the `lib` folder.

```js
// Using ES2015 imports
import d2 from 'd2/lib/d2';

// Using CommonJS imports
var d2 = require('d2/lib/d2');
```

If you want to use `d2` as just a global variable on the window object you can include one of the following scripts in
your page `d2/lib/d2-browser.js` or `d2/lib/d2-browser.min.js`


## Initialise the library
To be able to use d2 you will first need to initialise the library. This is required to let the library know
where it should load data from (e.g. the schemas, currentUser, authorities). The schemas are the definitions of the data model as it is used in DHIS2.

To do this you have can provide d2 with a `baseUrl`. (If you don't provide any the default of `../api` will be used)

```js
import { init } from 'd2/lib/d2';

init({ baseUrl: 'http://apps.dhis2.org/dev/api' })
  .then(d2 => {
    //Your d2 is initialised and ready to use.
  });
```

## Get first page of users and print their name
```js
d2.models.user.list()
  .then(userCollection => {
    userCollection.forEach(user => console.log(user.name)));
  });
```

# Getting started

To get started we suggest you read the [Overview](https://dhis2.github.io/d2/tutorial-overview.html)

If you are already fairly familiar what you are probably looking for would be the reference material on what is available
on the instance of [d2](https://dhis2.github.io/d2/module-d2.init-d2.html).

For more information on how the Models work the `model` [module documentation](https://dhis2.github.io/d2/module-model.html) and
the classes in the module are the current go to reference material.

For other questions see the [FAQ](https://dhis2.github.io/d2/tutorial-FAQ.html) or the [full api documentation](https://dhis2.github.io/d2).
