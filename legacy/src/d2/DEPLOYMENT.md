![alt text](https://a.slack-edge.com/7bf4/img/services/travis_128.png "Travis")

## Automagic builds and deployments

Tags are deployed to npm automatically. A tag is created by travis when the src folder has changed on one
of the following branches:
- v24
- v25

## What happens exactly?
- When pushed to v24 or a pull request is merged
- Travis goes through the normal CI stuff
- When this passes it'll do the following deployment steps
    - Update the npm `patch` version
    - Run the build script specified in the `package.json`
    - Push the newly created tag to github


