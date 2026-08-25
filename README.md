# Moment.js French Locale

`moment-french-locale` provides a French locale specification for [Moment.js](https://momentjs.com/). It can be registered under any locale name with `moment.defineLocale()` or used to update an existing locale with `moment.updateLocale()`.

The package supports both ECMAScript modules and CommonJS and includes TypeScript declarations.

## Installation

```sh
npm install moment-french-locale
```

Moment.js is installed as a package dependency.

## Usage

### ECMAScript modules

```js
import moment from "moment";
import momentFrenchLocale from "moment-french-locale";

moment.updateLocale("fr", momentFrenchLocale);
moment.locale("fr");

console.log(moment("2025-07-14T13:45:00Z").format("LLLL"));
// lundi 14 juillet 2025 13:45
```

### CommonJS

```js
const moment = require("moment");
const momentFrenchLocale = require("moment-french-locale").default;

moment.updateLocale("fr", momentFrenchLocale);
moment.locale("fr");
```

## Included locale behavior

The locale defines:

- Full, abbreviated, and minimal French month and weekday names.
- French date and time formats.
- Calendar phrases such as “Aujourd’hui à”, “Demain à”, and “Hier à”.
- Past and future relative-time expressions.
- French ordinals such as `1er` and `2e`.
- Monday as the first day of the week, with the first week determined by January 4.

The specification is based on [Moment.js locale customization](https://momentjs.com/docs/#/customization/).

## Development

Install the locked dependencies and run the test suite:

```sh
npm ci
npm test
```

`npm test` builds the CommonJS, ESM, source-map, and TypeScript declaration outputs before running the tests with Node.js’s built-in test runner.

To build without running tests:

```sh
npm run build
```

## Publishing

Publishing is automated through GitHub Actions. Publishing a GitHub release runs a clean install, security audit, build, and test suite before publishing the matching version to npm using trusted publishing with OpenID Connect. No long-lived npm publishing token is stored in the repository.

## License

This project is available under the [MIT License](LICENCE).
