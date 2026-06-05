# Plugin SDK - Extending RGS

Complete guide to creating custom plugins for RGS.

## Plugin Interface

Every RGS plugin must implement the `IPlugin` interface:

```typescript
import type { IPlugin } from '@biglogic/rgs'

interface IPlugin<S extends Record<string, unknown>> {
  name: string
  hooks: {
    onInit?: (context: PluginContext<S>) => void | Promise<void>
    onInstall?: (context: PluginContext<S>) => void | Promise<void>
    onSet?: (context: PluginContext<S>) => void | Promise<void>
    onGet?: (context: PluginContext<S>) => void | Promise<void>
    onRemove?: (context: PluginContext<S>) => void | Promise<void>
    onDestroy?: (context: PluginContext<S>) => void | Promise<void>
    onTransaction?: (context: PluginContext<S>) => void | Promise<void>
    onBeforeSet?: (context: PluginContext<S>) => void | Promise<void>
    onAfterSet?: (context: PluginContext<S>) => void | Promise<void>
  }
}
```

## Creating Your First Plugin

### Logger Plugin Example

```typescript
import type { IPlugin } from '@biglogic/rgs'

const loggerPlugin: IPlugin = {
  name: 'logger',
  
  hooks: {
    onInstall: ({ store }) => {
      console.log('[Logger] Plugin installed')
    },
    
    onSet: ({ key, value }) => {
      console.log(`[Logger] Setting ${key} to:`, value)
    },
    
    onRemove: ({ key }) => {
      console.log(`[Logger] Removing ${key}`)
    }
  }
}

// Install the plugin
const store = gstate({ data: null })
store._addPlugin(loggerPlugin)
```

## Advanced Plugin: Analytics Tracker

Track state changes for analytics purposes:

```typescript
import type { IPlugin } from '@biglogic/rgs'

const analyticsPlugin: IPlugin = {
  name: 'analytics',
  
  hooks: {
    onSet: async ({ key, value, store }) => {
      // Send analytics data
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'state_update',
            key,
            value,
            namespace: store.namespace,
            timestamp: Date.now()
          })
        })
      } catch (error) {
        console.error('Analytics send failed:', error)
      }
    }
  }
}
```

## Plugin Context

The `PluginContext` provides useful information:

```typescript
interface PluginContext<S extends Record<string, unknown>> {
  store: IStore<S>       // Store instance
  key?: string           // Key being accessed (if applicable)
  value?: unknown        // Value being set (if applicable)
  version?: number       // Version number
}
```

## Official Plugins Reference

### Undo/Redo Plugin

```typescript
import { undoRedoPlugin } from '@biglogic/rgs'

const store = gstate({ counter: 0 })
store._addPlugin(undoRedoPlugin({ limit: 50 }))

// Access methods
store.plugins.undoRedo.undo()
store.plugins.undoRedo.canUndo() // boolean
```

### Cloud Sync Plugin

```typescript
import { cloudSyncPlugin, createMongoAdapter } from '@biglogic/rgs'

const store = gstate({ documents: [] })
const adapter = createMongoAdapter('https://api.example.com', 'api-key')

store._addPlugin(cloudSyncPlugin({
  adapter,
  autoSyncInterval: 30000
}))

// Access methods
await store.plugins.cloudSync.sync()
const stats = store.plugins.cloudSync.getStats()
```

### Schema Validation Plugin

```typescript
import { schemaPlugin } from '@biglogic/rgs'
import { z } from 'zod'

const store = gstate({
  price: 0,
  email: ''
})

store._addPlugin(schemaPlugin({
  price: z.number().positive(),
  email: z.string().email()
}))

// Invalid values will throw errors
store.set('price', -50) // Error: Validation failed
```

### IndexedDB Plugin

```typescript
import { indexedDBPlugin } from '@biglogic/rgs'

const store = gstate({ largeData: [] })
store._addPlugin(indexedDBPlugin({
  dbName: 'my-app-db',
  storeName: 'states',
  version: 1
}))
```

## Registering Custom Methods

Plugins can register custom methods on the store:

```typescript
import type { IPlugin } from '@biglogic/rgs'

const myPlugin: IPlugin = {
  name: 'my-plugin',
  
  hooks: {
    onInstall: ({ store }) => {
      store._registerMethod('myPlugin', 'customAction', () => {
        console.log('Custom action executed!')
      })
    }
  }
}

// Usage
store._addPlugin(myPlugin)
store.plugins.myPlugin.customAction()
```

## Plugin Best Practices

1. **Unique Names**: Always give your plugin a unique name
2. **Error Handling**: Handle errors gracefully in plugin hooks
3. **Cleanup**: Implement `onDestroy` for cleanup if needed
4. **TypeScript**: Use generics for type safety with store state

## Next Steps

- [Advanced Usage](advanced-usage.md) - More plugin examples
- [Best Practices](best-practices.md) - Plugin architecture guidelines