const execSync = require("node:child_process").execSync

execSync("cd ../.. && npx npm-check-updates -u && npm i", { stdio: [0, 1, 2] })

execSync("cd ../../extension/vscode && npx npm-check-updates -u && npm i", { stdio: [0, 1, 2] })

execSync("cd ../../tests && npx npm-check-updates -u && npm i -f", { stdio: [0, 1, 2] })

// execSync("cd ../.. && npm i -D browserslist caniuse-lite baseline-browser-mapping", { stdio: [0, 1, 2] })
// execSync("cd ../.. && npx socket patch scan && npx socket optimize && npx update-browserslist-db@latest", { stdio: [0, 1, 2] })

execSync("node changeVersion.js", { stdio: [0, 1, 2] })
