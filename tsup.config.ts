import { defineConfig } from 'tsup'
import { sassPlugin } from 'esbuild-sass-plugin'

import copyStatic from './tsup.plugin.copyStatic'
//! import injectCss from './tsup.plugin.injectCss'
//! import types from './tsup.plugin.types'

import pk from "./package.json"

const include = [
  { from: '.github/COPYRIGHT.md', to: 'COPYRIGHT.md' },
  { from: '.github/LICENSE.md', to: 'LICENSE.md' },
  { from: '.github/SECURITY.md', to: 'SECURITY.md' },
  { from: '.github/FUNDING.yml', to: 'FUNDING.yml' },
  { from: 'docs/README.md', to: 'README.md' },
  { from: 'package.json', to: 'package.json' },
  { from: 'types/', to: 'types/' },
  //! { from: 'index.d.ts', to: 'index.d.ts' },
  { from: 'docs/**/*', to: 'docs/' }
]

export default defineConfig(
  {
    //! minifyWhitespace: true,
    //! minifyIdentifiers: true,
    //! minifySyntax: true,
    //! minify: true,
    globalName: pk.code,
    format: ['cjs', 'esm'],
    entry: ['index.ts'],
    platform: "node",
    target: "es2024",
    outDir: 'dist',
    minify: 'terser',
    legacyOutput: false,
    injectStyle: true,
    keepNames: false,
    splitting: false,
    sourcemap: false,
    treeshake: true,
    bundle: true,
    clean: true,
    dts: false,
    external: [
      // ...Object.keys(pk.dependencies),
      ...Object.keys(pk.devDependencies),
      ...Object.keys(pk.peerDependencies),
      ...Object.keys(pk.peerDependenciesMeta)
    ],
    noExternal: [
      "immer"
    ],
    swc: {
      swcrc: true
    },
    esbuildPlugins: [
      sassPlugin()
    ],
    esbuildOptions(options) {
      options.legalComments = 'none'
      // options.minify = true
    },
    terserOptions: {
      mangle: true,
      format: {
        beautify: true,
        comments: false
      },
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx',
      '.js': 'js',
      '.jsx': 'jsx',
      '.css': 'css'
    },
    async onSuccess() {
      await copyStatic(include)
      // await injectCss()
      // await types()
      console.debug("Compilation: OK")
    }
  }
)
