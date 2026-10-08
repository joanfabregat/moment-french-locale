# Moment.js French Locale

[![npm version](https://img.shields.io/npm/v/moment-french-locale)](https://www.npmjs.com/package/moment-french-locale)
[![npm downloads](https://img.shields.io/npm/dm/moment-french-locale)](https://www.npmjs.com/package/moment-french-locale)
[![Tests](https://github.com/joanfabregat/moment-french-locale/actions/workflows/test.yaml/badge.svg?branch=main)](https://github.com/joanfabregat/moment-french-locale/actions/workflows/test.yaml)
[![MIT License](https://img.shields.io/npm/l/moment-french-locale)](LICENCE)

`moment-french-locale` provides a French locale specification for [Moment.js](https://momentjs.com/). It can be registered under any locale name with `moment.defineLocale()` or used to update an existing locale with `moment.updateLocale()`.

The package supports both ECMAScript modules and CommonJS and includes TypeScript declarations.

## Why use this package?

Moment.js already includes a [French locale](https://github.com/moment/moment/blob/develop/src/locale/fr.js). Use this package when you want a separately exported locale specification that you can register under your own name or apply to an existing locale.

Compared with Moment 2.31.0's built-in French locale, this specification uses `2e`, `3e`, and so on for day-of-month ordinals, capitalizes minimal weekday names (`Di`, `Lu`, etc.), and uses `PD` / `MD` for meridiem formatting. Its ordinal function uses `1er` for every formatting token, including week numbers; the built-in locale distinguishes masculine and feminine ordinals. Month parsing also differs: this specification uses exact month-name parsing, while the built-in locale accepts abbreviated month names with or without a trailing period.

## Installation

```sh
npm install moment-french-locale
```

Moment.js 2.31.0 or newer within the 2.x series is installed as a package dependency. TypeScript declarations are included; no separate types package is needed for this package.

## Usage

### ECMAScript modules

```js
import moment from "moment";
import momentFrenchLocale from "moment-french-locale";

moment.updateLocale("fr", momentFrenchLocale);
moment.locale("fr");

console.log(moment.utc("2025-07-14T13:45:00Z").format("LLLL"));
// lundi 14 juillet 2025 13:45
```

### CommonJS

```js
const moment = require("moment");
const momentFrenchLocale = require("moment-french-locale").default;

moment.updateLocale("fr", momentFrenchLocale);
moment.locale("fr");
```

The default export is a locale specification object. Importing it does not register or select a locale; call `updateLocale()` or `defineLocale()` before using it. The CommonJS export requires `.default`, as shown above.

The example uses UTC so its output is the same in every time zone. Use `moment(...)` for your system's local time.

### Register a custom locale

To keep the existing `fr` locale configuration, register this specification under a separate name:

```js
import moment from "moment";
import momentFrenchLocale from "moment-french-locale";

moment.defineLocale("fr-custom", momentFrenchLocale);

const date = moment.utc("2025-07-14T13:45:00Z").locale("fr-custom");
console.log(date.format("LLLL"));
// lundi 14 juillet 2025 13:45
```

Both `defineLocale()` and `updateLocale()` also select the locale globally. To preserve your application's previous default, save `moment.locale()` before registration and restore it afterward. Calling `.locale("fr-custom")` on a date selects the locale for that instance. Changing the global locale does not change existing Moment instances. See [Moment.js locale selection](https://momentjs.com/docs/#/i18n/changing-locale/).

## Included locale behavior

The locale defines:

- Full and abbreviated French month names, plus full, abbreviated, and minimal weekday names.
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

`npm test` builds the CommonJS, ESM, source-map, and TypeScript declaration outputs before running the tests with Node.js’s built-in test runner. The tests cover locale behavior and install a packed tarball into a temporary consumer project to verify package contents, ESM and CommonJS imports, and TypeScript declarations. The consumer installation runs offline using npm's cache populated by `npm ci`.

To build without running tests:

```sh
npm run build
```

## Publishing

Publishing is automated through GitHub Actions. Publishing a GitHub release runs a clean install, security audit, build, and test suite before publishing the matching version to npm using trusted publishing with OpenID Connect. No long-lived npm publishing token is stored in the repository.

## License

This project is available under the [MIT License](LICENCE).
