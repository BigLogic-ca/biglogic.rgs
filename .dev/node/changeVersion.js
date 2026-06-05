const
  fs = require('node:fs'),
  path = require('node:path')

// UPDATE PACKAGE FILE
const updatePackageVersion = (newVersion, file) => {

  try {
    const packageData = JSON.parse(fs.readFileSync(file, 'utf8'))
    packageData.version = newVersion.trim()

    fs.writeFileSync(file, JSON.stringify(packageData, null, 2))
    console.debug(`---> Version updated in ${file}.json to ${newVersion}`)

    // UPDATE APP FILE
    const
      appPath = path.join(process.cwd(), `../../app.json`),
      appData = JSON.parse(fs.readFileSync(appPath, 'utf8'))

    appData.code = packageData.code?.trim()
    appData.version = packageData.version.trim()

    fs.writeFileSync(appPath, JSON.stringify(appData, null, 2))

    console.debug(`---> App code ${appData.code} ${appData.version} in app.json`)

  } catch (error) {

    console.error(`---> Error updating ${file}`, error)
    process.exit(1)

  }

}

const
  execSync = require("node:child_process").execSync,
  versionArg = execSync("git rev-parse --abbrev-ref HEAD").toString()

if (versionArg) {
  updatePackageVersion(versionArg, path.join(process.cwd(), `../../package.json`))
  updatePackageVersion(versionArg, path.join(process.cwd(), `../../tests/package.json`))
  updatePackageVersion(versionArg, path.join(process.cwd(), `../../extension/vscode/package.json`))
} else {
  console.debug('---> Please provide a new version number as an argument (e.g., 1.2.3)')
  process.exit(1)
}
