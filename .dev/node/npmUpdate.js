const execSync = require("node:child_process").execSync

execSync("cd ../.. && npx npm-check-updates -u && npm i", { stdio: [0, 1, 2] })
execSync("cd ../.. && socket patch scan && socket optimize && npx update-browserslist-db@latest -D", { stdio: [0, 1, 2] })

execSync("node changeVersion.js", { stdio: [0, 1, 2] })
