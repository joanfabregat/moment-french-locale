import assert from "node:assert/strict";
import {access, readFile} from "node:fs/promises";
import {createRequire} from "node:module";
import {test} from "node:test";

import moment from "moment";
import momentFrenchLocale from "../dist/moment-french-locale.mjs";

const require = createRequire(import.meta.url);

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
    moment.defineLocale("fr-moment-french-locale-test", momentFrenchLocale);

    const date = moment.utc("2025-07-14T13:45:00Z").locale("fr-moment-french-locale-test");

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
