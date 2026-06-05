# API Reference

Complete reference for all RGS hooks and functions.

## Store Creation

### `gstate<S>(initialState, config?)`

Creates a store and returns a typed hook simultaneously - "The Magnetar Way".

```typescript
import { gstate } from '@biglogic/rgs'

// Create store with hook
const useStore = gstate({
  counter: 0,
  user: { name: 'John' }
}, 'my-namespace') // namespace enables persistence

// Use the hook
const [count, setCount] = useStore<number>('counter')
const [user] = useStore('user')
```

### `createStore(config?)`

Creates a store instance for advanced configuration.

```typescript
import { createStore } from '@biglogic/rgs'

const store = createStore({
  namespace: 'my-app',
  version: 1,
  auditEnabled: true,
  userId: 'user-123'
})

store.set('key', 'value')
```

## React Hooks

### `useStore<T>(key: string)`

Primary hook for reading and writing state. Returns `[value, setter]` tuple.

```typescript
import { useStore } from '@biglogic/rgs'

// Key mode - returns [value, setter]
const [count, setCount] = useStore<number>('counter')

// Update state
setCount(count + 1)

// Selector mode - returns value directly (read-only)
const count = useStore(state => state.counter)
```

### `useSyncedState(key, store?)`

Hook for offline-first synchronized state management.

```typescript
import { useSyncedState } from '@biglogic/rgs'

const [data, setData, syncState] = useSyncedState('data')

// syncState contains: isOnline, isSyncing, pendingChanges, conflicts
```

### `useIsStoreReady(store?)`

Check if the store has finished hydration.

```typescript
import { useIsStoreReady } from '@biglogic/rgs'

const isReady = useIsStoreReady()
```

## Store Methods

### `store.get<T>(key: string): T | null`

Get state value by key.

```typescript
const value = store.get('counter')
const user = store.get<User>('user')
```

### `store.set<T>(key: string, value: T | StateUpdater<T>, options?): boolean`

Set state value. Returns `true` if value changed.

```typescript
// Direct value
store.set('counter', 10)

// Updater function (Immer)
store.set('user', draft => { draft.name = 'Alice' })

// With persistence options
store.set('temp', value, { persist: false })
```

### `store.compute<T>(key: string, selector: ComputedSelector<T>): T`

Create computed/derived state.

```typescript
store.compute('fullName', (get) => {
  return `${get('firstName')} ${get('lastName')}`
})

const fullName = store.get('fullName')
```

### `store.watch(key: string, callback: WatcherCallback<T>): () => void`

Subscribe to state changes for a specific key.

```typescript
const unsubscribe = store.watch('counter', (newValue) => {
  console.log('Counter changed:', newValue)
})

// Stop watching
unsubscribe()
```

### `store.transaction(fn: () => void): void`

Batch multiple updates into a single re-render.

```typescript
store.transaction(() => {
  store.set('a', 1)
  store.set('b', 2)
  store.set('c', 3)
})
```

### `store.remove(key: string): boolean` / `store.delete(key: string): boolean`

Remove a key from state.

```typescript
store.remove('counter')
```

### `store.deleteAll(): boolean`

Clear all state.

```typescript
store.deleteAll()
```

## Plugin Methods

### `store._addPlugin(plugin: IPlugin): void`

Install a plugin.

```typescript
import { undoRedoPlugin } from '@biglogic/rgs'

store._addPlugin(undoRedoPlugin({ limit: 50 }))
```

### `store._registerMethod(pluginName, methodName, fn)`

Register custom plugin methods.

```typescript
store._registerMethod('myPlugin', 'customMethod', () => { /* ... */ })
```

## Security Methods

### `store.addAccessRule(pattern, permissions): void`

Add RBAC rule.

```typescript
store.addAccessRule(/^admin_/, ['admin'])
store.addAccessRule(/^user_/, ['read', 'write'])
```

### `store.hasPermission(key, action, userId?): boolean`

Check if user has permission.

```typescript
if (store.hasPermission('admin_panel', 'write', 'user-123')) {
  store.set('admin_panel', data)
}
```

### `store.recordConsent(userId, purpose, granted): ConsentRecord`

Record GDPR consent.

```typescript
store.recordConsent('user-123', 'analytics', true)
```

### `store.exportUserData(userId)` / `store.deleteUserData(userId)`

GDPR compliance methods.

## Utility Functions

### `initState(config?)` / `destroyState(namespace?)`

Global store management.

```typescript
import { initState, destroyState, destroyAllStores } from '@biglogic/rgs'

// Initialize default store
initState({ namespace: 'app' })

// Destroy specific store
destroyState('app')

// Destroy all stores
destroyAllStores()
```

### `getStore()` / `getStoreByNamespace(namespace)`

Get store instances.

```typescript
const store = getStore()
const appStore = getStoreByNamespace('app')
```

## TypeScript Types

```typescript
interface StoreConfig<S> {
  namespace?: string
  version?: number
  silent?: boolean
  debounceTime?: number
  storage?: Storage
  migrate?: (oldState: Record, oldVersion: number) => S
  persistByDefault?: boolean
  maxObjectSize?: number
  maxTotalSize?: number
  encryptionKey?: EncryptionKey
  auditEnabled?: boolean
  userId?: string
  validateInput?: boolean
  accessRules?: Array<{ pattern: string | Function, permissions: Permission[] }>
  immer?: boolean
  sync?: SyncConfig
}

interface IStore<S> {
  set<K extends keyof S>(key: K, val: S[K], options?: PersistOptions): boolean
  get<K extends keyof S>(key: K): S[K] | null
  compute<T>(key: string, selector: ComputedSelector<T>): T
  watch<K extends keyof S>(key: K, callback: WatcherCallback<S[K]>): () => void
  remove(key: keyof S | string): boolean
  deleteAll(): boolean
  list(): Record<string, unknown>
  transaction(fn: () => void): void
  destroy(): void
  _subscribe(cb: StoreSubscriber, key?: string): () => void
}
```

## Next Steps

- [Core Concepts](core-concepts.md) - Understanding the fundamentals
- [Advanced Usage](advanced-usage.md) - Transactions, plugins, persistence
- [Security Features](security-features.md) - Enterprise security