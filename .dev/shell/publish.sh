
# UPDATE USE OFFICIAL NPM

cd ../..
npm run build

cd ../../extension/vscode
npm run build-dist

npm publish ./dist --access public
