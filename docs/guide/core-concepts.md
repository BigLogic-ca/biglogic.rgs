# Core Concepts

Understanding these core concepts will help you effectively use RGS in your applications.

## Store Initialization

The `gstate()` function creates a new store with a typed hook simultaneously.

### Basic Initialization

```typescript
import { gstate } from '@biglogic/rgs'

// Basic initialization with hook
const useStore = gstate({
  key: 'value'
})
```

### Initialization with Configuration

```typescript
import { gstate } from '@biglogic/rgs'

const useStore = gstate(
  { user: null, theme: 'light' },
  {
    namespace: 'my-app',      // Namespace for persistence
    encryptionKey: keyData   // Encryption key (see Security section)
  }
)
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `namespace` | `string` | Isolates state in a namespace |
| `storage` | `Storage` | Storage backend (localStorage, sessionStorage, custom) |
| `encryptionKey` | `EncryptionKey` | Key for encryption (see Security) |
| `persistByDefault` | `boolean` | Auto-persist all keys |
| `auditEnabled` | `boolean` | Enable audit logging |
| `userId` | `string` | User ID for audit/RBAC |
| `accessRules` | `Array` | RBAC rules for security |
| `immer` | `boolean` | Enable Immer (default: true) |

## Reactive State

State in RGS is reactive - components automatically re-render when subscribed state changes.

### How Reactivity Works

1. **Subscription**: When a component uses `useStore('key')`, it subscribes to that key
2. **Update**: When state changes via `store.set('key', value)`, all subscribers are notified
3. **Re-render**: Subscribed components re-render with the new value

```typescript
import { gstate } from '@biglogic/rgs'

const store = gstate({ counter: 0 })

// Subscribe to state changes
const unsubscribe = store.watch('counter', (newValue) => {
  console.log(`Counter changed to: ${newValue}`)
})

// Stop watching
unsubscribe()
```

## Namespaces

Namespaces allow you to isolate state for different parts of your application or different users.

### Creating Namespaced State

```typescript
// Initialize with namespace
const useStore = gstate({ theme: 'dark' }, 'user-preferences')

// Access namespaced state
const [theme] = useStore('theme')
```

### Use Cases for Namespaces

- **User preferences**: Isolate each user's settings
- **Multi-tenant apps**: Separate state per tenant
- **Feature flags**: Group feature-specific state
- **Temporary state**: Separate ephemeral from persistent state

## State Shape

RGS supports flexible state shapes:

### Flat State (Recommended)

```typescript
const useStore = gstate({
  counter: 0,
  user: null,
  theme: 'dark'
})
```

### Nested State

```typescript
const useStore = gstate({
  user: {
    profile: { name: 'John', email: 'john@example.com' },
    settings: { theme: 'dark', notifications: true }
  }
})

// Access nested values
const [name] = useStore('user.profile.name')
```

## Equality and Updates

RGS uses deep equality by default. Objects/arrays are compared by value.

### Automatic Immutability

Immer is enabled by default - you can write mutations that are automatically converted to immutable updates:

```typescript
const useStore = gstate({ user: { name: 'John' } })

// This is safe - Immer handles immutability
const [name, setName] = useStore('user.name')
setName('Alice') // Creates new object internally
```

## Next Steps

- [API Reference](api-reference.md) - Detailed API documentation
- [Advanced Usage](advanced-usage.md) - Transactions, plugins, persistence
- [Security Features](security-features.md) - Enterprise security features
