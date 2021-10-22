# D2 Changelog

## 30.1.0
###### _February 15th 2019_

**Breaking changes:**

- `d2.Api` Api methods will reject with an error when passing urls with an encoded query-string, or when passing urls with a malformed query string. The existing query string and anything that will be appended will be encoded for you by d2.Api's methods.

## 28.3.0
###### _October 26th 2017_

**Breaking changes:**

- `d2.dataStore` API has changed in order to be more streamlined and easier to use:
    - `d2.dataStore.create()` has been added to be able to ensure a new (empty) namespace.
    - `d2.dataStore.get()` now rejects if the namespace does not exist.
    - `d2.dataStore.getKeys()` now always fetches from the server, use `d2.dataStore.keys`-member to get a list of 
    internal-keys in a synchronous way.
    
##### Added

- `d2.currentUser.dataStore` has been added, and is a wrapper around UserDataStore. The API shares most functionality with `d2.dataStore`.

## 28.0.0
###### _September 19th 2017_

**Breaking changes:**

- `d2.system.loadAppStore` has changed in order to support the new [central app store](https://play.dhis2.org/appstore).
- Support for `dataType` and `contentType` options on API requests have been removed. These were added for
  compatibility with jQuery, and have been deprecated since version 2.25. To migrate, manipulate the request headers
  directly instead:
  - `dataType` corresponds to the `Accept` header:
    - Before: `api.get(url, { dataType: 'text' })`
    - Now: `api.get(url, { headers: { 'Accept': 'text/plain' }})`
  - `contentType` corresponds to the `Content-Type` header:
    - Before: `api.post(url, data, { contentType: 'text' })`
    - Now: `api.post(url, data, { headers: { 'Content-Type': 'text/plain' }})`


## 27.0.0
###### _February 20th 2016_

**Breaking changes:**

- `d2.currentUser.uiLocale` has been removed, `d2.currentUser.userSettings.get` should be used instead.
- `userSettings.get` will now now always return a Promise (This therefore also applies to `d2.currentUser.userSettings.get`)
- `systemSettings.get` will now always return a Promise.


## 25.2.0
###### _November 18th 2016_

**Breaking change:**

- Calling `save()` on an instance of `d2.Model` or `d2.ModelCollectionProperty`
that has no changes will now return a promise that immediately resolves to an
empty object, in stead of a promise that's rejected with an error message

## 25.0.1
###### _August 1st 2016_

##### Added

- [feat] `clone()` can now be used on a model instance to clone an object 
