# RGS Highlighter

VSCode extension for [RGS (Reactive Global State)](https://www.npmjs.com/package/rgs) - a powerful state management library with automatic persistence, atomic subscriptions, and built-in Immer support.

## What is RGS?

RGS is a React state management library that provides:
- ⚡ **Atomic subscriptions** - components only re-render when needed
- 💾 **Auto-persistence** - data saved to localStorage automatically
- 🛡️ **Input sanitization** - built-in XSS protection
- 📦 **Zero-config** - works out of the box

```typescript
import { gstate } from 'rgs'

const useAppStore = gstate({ user: {}, settings: {} }, { persist: true })

// In your component:
const [user] = useAppStore('user')
```

## Features

- 🎨 Highlights `rgs`, `gState` and `gstate` in code
- 💻 Code only - no highlighting in comments
- ⚡ Works with TypeScript, JavaScript, TSX, JSX files

## Installation

1. Download the `.vsix` file
2. Open VSCode
3. Extensions panel → ⋮ → Install from VSIX

## Usage

Open any `.ts`, `.tsx`, `.js`, or `.jsx` file - `rgs`, `gState` and `gstate` will be automatically highlighted.

## License

MIT License - see [LICENSE](LICENSE) file.
