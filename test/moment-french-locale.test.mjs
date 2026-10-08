import assert from "node:assert/strict";
import {access, readFile} from "node:fs/promises";
import {createRequire} from "node:module";
import {test} from "node:test";

import moment from "moment";
import momentFrenchLocale from "../dist/moment-french-locale.mjs";

const require = createRequire(import.meta.url);
const localeName = "fr-moment-french-locale-test";
const previousLocale = moment.locale();
moment.defineLocale(localeName, {...momentFrenchLocale});
moment.locale(previousLocale);

function frenchDate(input) {
    return moment.utc(input).locale(localeName);
}

test("builds every declared package entry point", async () => {
    const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
    const entryPoints = new Set([
        packageJson.main,
        packageJson.module,
        packageJson.types,
        ...Object.values(packageJson.exports),
    ]);

    await Promise.all([...entryPoints].map((entryPoint) => {
        return access(new URL(`../${entryPoint.replace(/^\.\//, "")}`, import.meta.url));
    }));
});

test("exports the same locale from ESM and CommonJS", () => {
    const commonJsLocale = require("../dist/moment-french-locale.js").default;

    assert.deepEqual(Object.keys(commonJsLocale).sort(), Object.keys(momentFrenchLocale).sort());
    assert.deepEqual(commonJsLocale.months, momentFrenchLocale.months);
    assert.equal(commonJsLocale.ordinal(1), momentFrenchLocale.ordinal(1));
});

test("defines every French month and weekday", () => {
    assert.deepEqual(momentFrenchLocale.months, [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ]);
    assert.deepEqual(momentFrenchLocale.weekdays, [
        "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi",
    ]);
});

test("formats dates through Moment using the locale", () => {
    const date = frenchDate("2025-07-14T13:45:00Z");

    assert.equal(date.format("LLLL"), "lundi 14 juillet 2025 13:45");
    assert.equal(date.format("Do"), "14e");
});

test("defines French relative-time grammar", () => {
    assert.equal(momentFrenchLocale.relativeTime.future, "dans %s");
    assert.equal(momentFrenchLocale.relativeTime.past, "il y a %s");
    assert.equal(momentFrenchLocale.relativeTime.m, "une minute");
    assert.equal(momentFrenchLocale.relativeTime.hh, "%d heures");
});

test("uses French ordinal and week rules", () => {
    assert.equal(momentFrenchLocale.ordinal(1), "1er");
    assert.equal(momentFrenchLocale.ordinal(2), "2e");
    assert.deepEqual(momentFrenchLocale.week, {dow: 1, doy: 4});
});

test("parses full and abbreviated French month names strictly", () => {
    for (const [input, format, expected] of [
        ["14 juillet 2025", "D MMMM YYYY", "2025-07-14"],
        ["2 février 2025", "D MMMM YYYY", "2025-02-02"],
        ["2 févr. 2025", "D MMM YYYY", "2025-02-02"],
        ["15 août 2025", "D MMMM YYYY", "2025-08-15"],
    ]) {
        const date = moment.utc(input, format, localeName, true);
        assert.equal(date.isValid(), true, input);
        assert.equal(date.format("YYYY-MM-DD"), expected);
    }
    for (const input of ["2 févr 2025", "2 février-invalide 2025", "30 février 2025"]) {
        assert.equal(moment.utc(input, "D MMM YYYY", localeName, true).isValid(), false, input);
    }
});

test("renders French calendar phrases relative to a fixed date", () => {
    const reference = frenchDate("2025-07-14T12:00:00Z");
    for (const [input, expected] of [
        ["2025-07-14T13:45:00Z", "Aujourd’hui à 13:45"],
        ["2025-07-15T13:45:00Z", "Demain à 13:45"],
        ["2025-07-16T13:45:00Z", "mercredi à 13:45"],
        ["2025-07-13T13:45:00Z", "Hier à 13:45"],
        ["2025-07-12T13:45:00Z", "samedi dernier à 13:45"],
        ["2025-07-24T13:45:00Z", "24/07/2025"],
    ]) {
        assert.equal(frenchDate(input).calendar(reference), expected);
    }
});

test("renders French relative time through Moment", () => {
    const reference = frenchDate("2025-07-14T12:00:00Z");
    for (const [amount, unit, expected] of [
        [1, "minute", "dans une minute"],
        [2, "hours", "dans 2 heures"],
        [-1, "day", "il y a un jour"],
        [-3, "months", "il y a 3 mois"],
    ]) {
        assert.equal(reference.clone().add(amount, unit).from(reference), expected);
    }
});

test("assigns ISO-style week numbers across New Year", () => {
    for (const [input, week, weekYear] of [
        ["2020-12-28", 53, 2020],
        ["2021-01-01", 53, 2020],
        ["2021-01-03", 53, 2020],
        ["2021-01-04", 1, 2021],
    ]) {
        const date = frenchDate(input);
        assert.equal(date.week(), week, input);
        assert.equal(date.weekYear(), weekYear, input);
        assert.equal(date.clone().startOf("week").day(), 1);
    }
});

test("preserves this package's weekday, ordinal, and meridiem conventions", () => {
    assert.equal(frenchDate("2025-07-14T09:00:00Z").format("dd Do A"), "Lu 14e PD");
    assert.equal(frenchDate("2025-07-14T13:00:00Z").format("A"), "MD");
    assert.equal(frenchDate("2021-01-04").format("wo"), "1er");
});
