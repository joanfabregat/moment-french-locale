import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {mkdtemp, mkdir, readFile, rm, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {test} from "node:test";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

function run(command, args, cwd) {
    return execFileSync(command, args, {cwd, encoding: "utf8", timeout: 60_000});
}

function pack(directory, destination) {
    const result = JSON.parse(run("npm", [
        "pack", "--json", "--ignore-scripts", "--pack-destination", destination,
    ], directory));
    // npm 11 returns an array; npm 12 keys the result by package name.
    return Array.isArray(result) ? result[0] : Object.values(result)[0];
}

test("installs the published package and supports JavaScript and TypeScript consumers", async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), "moment-french-locale-"));
    try {
        const packed = pack(projectRoot, temporaryRoot);
        const files = packed.files.map(({path}) => path);
        for (const path of files) {
            assert.ok(
                path.startsWith("dist/") || path.startsWith("src/") ||
                ["package.json", "README.md", "LICENCE"].includes(path),
                `Unexpected published file: ${path}`,
            );
        }

        const consumer = join(temporaryRoot, "consumer");
        const packedMoment = pack(join(projectRoot, "node_modules/moment"), temporaryRoot);
        await mkdir(consumer);
        await writeFile(join(consumer, "package.json"), JSON.stringify({name: "locale-consumer", private: true}));
        run("npm", [
            "install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund",
            "--cache", join(temporaryRoot, "empty-cache"),
            join(temporaryRoot, packedMoment.filename),
            join(temporaryRoot, packed.filename),
        ], consumer);

        for (const [filename, imports] of [
            ["consumer.mjs", 'import moment from "moment";\nimport locale from "moment-french-locale";'],
            ["consumer.cjs", 'const moment = require("moment");\nconst locale = require("moment-french-locale").default;'],
        ]) {
            await writeFile(join(consumer, filename), `${imports}
moment.defineLocale("fr-consumer", locale);
console.log(moment.utc("2025-07-14T13:45:00Z").locale("fr-consumer").format("LLLL"));
`);
            assert.equal(run(process.execPath, [filename], consumer).trim(), "lundi 14 juillet 2025 13:45");
        }

        const typescriptExample = `import moment from "moment";
import locale from "moment-french-locale";
const specification: moment.LocaleSpecification = locale;
moment.defineLocale("fr-typescript", specification);
`;
        for (const extension of ["mts", "cts"]) {
            await writeFile(join(consumer, `consumer.${extension}`), typescriptExample);
            run(process.execPath, [
                join(projectRoot, "node_modules/typescript/bin/tsc"),
                "--noEmit", "--strict", "--esModuleInterop", "--target", "es2020",
                "--module", "nodenext", "--moduleResolution", "nodenext", `consumer.${extension}`,
            ], consumer);
        }
        const manifest = JSON.parse(await readFile(join(consumer, "node_modules/moment-french-locale/package.json"), "utf8"));
        for (const entryPoint of [manifest.main, manifest.module, manifest.types]) {
            await readFile(join(consumer, "node_modules/moment-french-locale", entryPoint));
        }
    } finally {
        await rm(temporaryRoot, {recursive: true, force: true});
    }
});
