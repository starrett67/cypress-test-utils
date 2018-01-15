# cypress-test-utils

[![Build Status](https://travis-ci.org/3Blades/cypress-test-utils.svg?branch=master)](https://travis-ci.org/3Blades/cypress-test-utils)
[![npm version](https://img.shields.io/npm/v/@3blades/cypress-test-utils.svg)](https://www.npmjs.com/package/@3blades/cypress-test-utils)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Organization

Code is organized into three directories:

- `browser/`: this directory contains code that should only be run in a browser context
- `server/`: this directory contains code that should only be run in a Node.js context
- `shared/`: this directory contains code that can be run in both a browser and Node.js context


## Tests

This repo uses `jest` for unit tests. Run `npm test` to run jest in watch mode during development. `npm run test:ci` runs the unit tests once and outputs coverage information.

## Releases

This repo uses `semantic-release` to handle all releases. On each push to the `master` branch, a new release is published to both GitHub and npm. To assist in maintaining changelogs, release notes, etc., `commitizen` is used to correctly format commit messages. Run `npm run cm` to commit changes.
