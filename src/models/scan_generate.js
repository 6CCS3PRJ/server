const fs = require("fs");
const faker = require("faker");
const yargs = require("yargs");
const cliProgress = require("cli-progress");
const getRandomScan = () => {
    return JSON.stringify({
        d: true,
        t: faker.date.recent(),
        b: faker.internet.mac(),
        l: faker.random.number(20),
    });
};

const generate = (count, filename = "test.json") => {
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(count, 0);

    const start = " [";
    fs.writeFileSync(filename, start);
    for (i = 1; i < count; i++) {
        fs.appendFileSync(filename, getRandomScan() + ",");
        progressBar.increment();
    }
    fs.appendFileSync(filename, getRandomScan() + "]");
    progressBar.increment();

    progressBar.stop();
    console.info(`Done. Generated ${count} rows.`);
};

const argv = yargs
    .option("rows", {
        alias: "r",
        description: "The number of rows to generate",
        type: "number",
    })
    .option("filename", {
        alias: "f",
        description:
            "The name of the file to generate (can also take path relative to where command is run)",
        type: "string",
    })
    .help()
    .alias("help", "h")
    .alias("version", "v").argv;

if (argv.rows) {
    if (!isNaN(argv.rows) && parseInt(argv.rows) > 0) {
        if (argv.filename) {
            generate(argv.rows, argv.filename);
        } else {
            generate(argv.rows);
        }
    } else {
        console.log("Invalid input. Only positive integers");
    }
} else {
    console.log("Specify a value for rows with -r or rows");
}
