// src/moment-french-locale.ts
var MomentFrenchLocale = {
    _invalidDate: null,
    months: "janvier_f\xe9vrier_mars_avril_mai_juin_juillet_ao\xfbt_septembre_octobre_novembre_d\xe9cembre".split("_"),
    monthsShort: "janv._f\xe9vr._mars_avr._mai_juin_juil._ao\xfbt_sept._oct._nov._d\xe9c.".split("_"),
    monthsParseExact: true,
    weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: "HH:mm",
        LTS: "HH:mm:ss",
        L: "DD/MM/YYYY",
        LL: "D MMMM YYYY",
        LLL: "D MMMM YYYY HH:mm",
        LLLL: "dddd D MMMM YYYY HH:mm"
    },
    calendar: {
        sameDay: "[Aujourd’hui \xe0] LT",
        nextDay: "[Demain \xe0] LT",
        nextWeek: "dddd [\xe0] LT",
        lastDay: "[Hier \xe0] LT",
        lastWeek: "dddd [dernier \xe0] LT",
        sameElse: "L"
    },
    relativeTime: {
        future: "dans %s",
        past: "il y a %s",
        s: "quelques secondes",
        m: "une minute",
        mm: "%d minutes",
        h: "une heure",
        hh: "%d heures",
        d: "un jour",
        dd: "%d jours",
        M: "un mois",
        MM: "%d mois",
        y: "un an",
        yy: "%d ans"
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal: function ordinal(number) {
        return number + (number === 1 ? "er" : "e");
    },
    meridiemParse: /PD|MD/,
    isPM: function isPM(input) {
        return input.charAt(0) === "M";
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem: function meridiem(hours, minutes, isLower) {
        return hours < 12 ? "PD" : "MD";
    },
    week: {
        dow: 1,
        // Monday is the first day of the week.
        doy: 4
    }
};
var moment_french_locale_default = MomentFrenchLocale;
export { moment_french_locale_default as default };
//# sourceMappingURL=moment-french-locale.mjs.map