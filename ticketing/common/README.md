# Common

To release a new minor version

- yarn run pub

Will do a few things:

- yarn version --patch: increments the package.json by 0.0.1, commits and creates a tag
- yarn postversion: pushes tag and tag commit
- yarn run build: Builds the package
- npm run publish: Publishes the package to npm using the latest tag (i.e. the one just created)
