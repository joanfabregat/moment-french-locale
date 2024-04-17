# Moment.js French Locale

Provides French locale for [Moment.js](https://momentjs.com/). This package is based after [Moment's documentation](https://momentjscom.readthedocs.io/en/latest/moment/06-i18n/01-changing-locale/#/customization/).


## Installation

This package is available on [npm](https://www.npmjs.com/package/moment-french-locale). You can install it using the following command:

```sh
npm i moment-french-locale
```


## Usage

```js
import moment from 'moment';
import momentFrenchLocale from 'moment-french-locale';

moment.updateLocale('fr', momentFrenchLocale);
moment.locale('fr');
```