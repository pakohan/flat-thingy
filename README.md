# flat-thingy

## Getting Started

- `npm install`
- `gulp watch`

## Platforms

This build process supports web (default) and mobile platform.

## Dependencies

To add new libraries, follow these steps:

- install library through npm, e.g. `npn install --save angular-bootstrap`
- add angular module dependency in *app.js* file
- add file dependency/-ies in *build.config.js* in the array `paths.vendor`
	- e.g. `'node_modules/angular-toArrayFilter/toArrayFilter.js'`
	- doesn't have to be minified, will be minified later anyway

## Testing

- create *.spec.js file
- type in console:
    - `gulp test` for interactive mode (reloads when test files changed)
    - `testem ci` for one time tests
