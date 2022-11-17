# Maintenance app

These docs are about the refactoring of the maintenance app. We're actually not
refactoring any code, we'll rewrite the app section by section.

On Nov 14, 2022 we decided that from the various options, we'll have a
side-by-side app, that's the MVP. We think it'd be nice to have manual
interlinking (the user has to navigate explicitly to the new app; we thought
about having automatic interlinking from the new app to the old one when
clicking on a link to a section that hasn't been implemented yet. This option
has yet to be explored by the entire team).

## General strategy

There are several challenges when it comes to the maintenance app:

* We want to be able to rely as little as possible on config
* We want generic pages/sections to be componsed from the same functionality
* We want the different frontend teams at DHIS2 to be able to work on
  particular sections

We've decided that we'll create a skeleton app with a functional navigation
first. Then we can tackle the first section.

As some of the challenges are new and the app is complex (and a few sections
are complicated as well), we:

* regard everything as an experiment that can be rolled back in case we realize
  that we've taken a wrong direction
* try to adhere to proper composition patterns, so that when a particular
  section / piece of code is somehow different from the rest, we can co-locate
  that difference with that particular section without having to complicate

## Open ToDos

* Create a new repository
  * What should the name be?
* Copy this doc into the new repository

## Open discussions

We'll use this document for now to document question that have to be answered
and the decision that we'll end up with.

For now we have to answer the following question, not necessarily before
working on the project though but before it's relevant to make a decision:

### state management

#### How do we manage client-side state?

- **open questions**
  - Do we have a per-route state or global, re-usable state?
- **stack options**
  - redux
  - zustand

#### How do we manage server-side state?

- **stack options**
  - tanstack-query + app-runtime
  - app-runtime

#### How do we manage form state?

- **stack options**
  - [react-final-form](https://final-form.org/react)
  - [react-hook-form](https://react-hook-form.com/)

#### How do we handle url state?

- **stack options**
  - [react-router](https://reactrouter.com/en/main) +
    [use-query-params](https://github.com/pbeshai/use-query-params)
  - [tanstack-router](https://tanstack.com/router/v1)

### How do we set up **routes**?

- We have a **config** with all routes
  - Makes it easier to infer whether the user has authority to view a certain
    section, as that can depend on whether the user has the auhority to view
    child sections (e.g. is the user allowed to view the "Data Element"
    overview page with links to the list view and the add-new form)
    - Although that'd a be better UX, for now we could sacrifice that
      completeness for simplicity. The user might end up on a page with no
      links (and ideally a message that the user doesn't have the authority to
      view any child sections)
- We declare routes **in JSX**
  - Much better overview, less config, easier to reason about

### How do we set up folder structure?

We've previously decided to have
[this](https://github.com/dhis2/notes/discussions/248) folder structure.
There's one point I (@Mohammer5) wouldd like to stress, which I think is quite
important:

> The src/components and src/pages distinction. I find this really helps
> with organisation. You can start building in pages without caring about
> abstractions, and then if reusable patterns emerge, they can be
> abstracted to generic components. **This saves you from abstracting too
> early.** You can just starting building out pages for the app, and then
> only when a proper pattern has emerged do you abstract it. Code that is
> page specific can just be left in pages.

The last time we've talked about this is more than a year ago. Should we
talk about this again? I suppose we've learned a couple of things from
working on the sms-config- & data-entry-app.

### Do we use TypeScript?

This simply needs to be discussed properly. Regardless of whether we adopt TS
at DHIS2, adopting it in the maintenance app has its own set of ad- and
disadvantages. A far reaching decision like that should be exploren thoroughly.

### Do we want to copy anything from ["mar-y"](https://github.com/dhis2/mar-y)?

* [`<RedirectToOld/>`](https://github.com/dhis2/mar-y/blob/780633baf1f575abda9adaae4cd8770dec9a772d/src/views/RedirectToOld.js)?
* [`<ProtectedRoute/>`](https://github.com/dhis2/mar-y/blob/master/src/modules/Navigation/ProtectedRoute.js)?

### How do we capture decisions?

We thought about using ADRs. Should we proceed with that? Do we even need that?
Or is it enough to have a proper folder structure and respective README.md
files in the `/docs` folder? If we rely on our own docs structure, what should
that structure look like?
