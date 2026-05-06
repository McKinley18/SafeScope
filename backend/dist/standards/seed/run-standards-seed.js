"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const data_source_1 = require("../../database/data-source");
const standards_seed_1 = require("./standards.seed");
async function main() {
    await data_source_1.dataSource.initialize();
    await (0, standards_seed_1.seedStandards)(data_source_1.dataSource);
    await data_source_1.dataSource.destroy();
    console.log('Standards seed complete');
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=run-standards-seed.js.map