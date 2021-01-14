# Common

To release a new minor version

- yarn run pub

Will do a few things:

- yarn version --patch: increments the package.json, commits and pushes a tag to github
- yarn run build: Builds the package
- npm run publish: Publishes the package to npm using the latest tag (i.e. the one just created)
