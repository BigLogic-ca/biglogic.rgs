# Advanced Usage

Advanced patterns and features for production applications.

## Transactions

Batch multiple state updates into a single transaction for performance and consistency.

### Basic Transaction

```typescript
import { gstate } from '@biglogic/rgs'

const store = gstate({ user: null, permissions: [] })

// All updates happen atomically
store.transaction(() => {
  store.set('user', { name: 'Bob', role: 'admin' })
  store.set('permissions', ['read', 'write', 'delete'])
  store.set('lastLogin', Date.now())
})
// Components re-render once after transaction completes
```

### Nested Transactions

```typescript
store.transaction(() => {
  store.set('a', 1)
  
  // Nested transaction (flattens to parent)
  store.transaction(() => {
    store.set('b', 2)
    store.set('c', 3)
  })
})
```

### Use Cases

- **Form submissions**: Update multiple fields atomically
- **Batch operations**: Update many items at once
- **State consistency**: Ensure related updates happen together

## Middleware and Plugins

RGS supports a plugin system for extending functionality.

### Creating a Plugin

```typescript
import type { IPlugin } from '@biglogic/rgs'

// Define a custom plugin
const loggerPlugin: IPlugin = {
  name: 'logger',
  
  hooks: {
    onInstall: ({ store }) => {
      console.log('Logger plugin installed')
    },
    
    onSet: ({ key, value }) => {
      console.log(`Setting ${key} to:`, value)
    }
  }
}

// Install the plugin
const store = gstate({ data: null })
store._addPlugin(loggerPlugin)
```

### Built-in Plugin Hooks

| Hook | Description |
|------|-------------|
| `onInit` | Called when store is initialized |
| `onInstall` | Called when plugin is installed |
| `onSet` | Called before state is updated |
| `onGet` | Called before state is read |
| `onRemove` | Called before state is removed |
| `onDestroy` | Called when store is destroyed |
| `onTransaction` | Called at start/end of transaction |
| `onBeforeSet` | Called before state is updated |
| `onAfterSet` | Called after state is updated |

### Plugin Use Cases

- **Logging**: Log all state changes
- **Analytics**: Track state mutations
- **Validation**: Validate state before updates
- **Persistence**: Auto-persist on changes

## Persistent State

Persist state to localStorage, sessionStorage, or custom storage.

### Basic Persistence

```typescript
import { gstate } from '@biglogic/rgs'

const useStore = gstate(
  { cart: [], user: null },
  {
    namespace: 'ecommerce',
    persistByDefault: true
  }
)
```

### Manual Persistence

```typescript
// Per-key persistence override
store.set('temp', value, { persist: false })

// With encryption
store.set('sensitive', encryptedValue, { encrypted: true })
```

### Custom Storage Adapters

Create custom storage adapters for different backends.

```typescript
// Custom AsyncStorage adapter (React Native example)
const asyncStorageAdapter: Storage = {
  getItem: async (key: string) => {
    const value = await AsyncStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  
  setItem: async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  },
  
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key)
  },
  
  key: (index: number) => AsyncStorage.getKey(index),
  get length() { return AsyncStorage.getLength() }
}

const store = gstate({ data: null }, { storage: asyncStorageAdapter })
```

## SSR Compatibility

RGS supports server-side rendering with proper hydration.

### SSR Setup

```typescript
// Server-side
import { createSSRStore } from '@biglogic/rgs'

const store = createSSRStore({
  namespace: 'my-app',
  initialState: { user: null }
})

// Get serialized state
const serializedState = JSON.stringify(store.getSnapshot())

// Client-side
import { useHydrated } from '@biglogic/rgs'

function App() {
  const isHydrated = useHydrated()
  
  if (!isHydrated) return <Loading />
  
  return <AppContent />
}
```

## Next Steps

- [Security Features](security-features.md) - Enterprise security features
- [Testing](testing.md) - Testing strategies
- [Performance](performance.md) - Optimization tips