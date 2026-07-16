export const include = [
  { from: 'package.json', to: 'package.json' },
  { from: 'types/', to: 'types/' },
  { from: 'docs/', to: '.' }
]

export const plug = {
  copyStatic: true,
  injectCss: false,
  types: false
}
