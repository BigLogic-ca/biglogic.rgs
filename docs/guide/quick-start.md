# Quick Start

Get up and running with RGS in minutes.

## Basic Store Setup

Create a store file to initialize your state:

```typescript
// store.ts
import { initState } from '@biglogic/rgs'

// Initialize with initial state
const store = initState({
  counter: 0,
  user: { name: 'John', role: 'admin' },
  settings: { theme: 'dark' }
})

export default store
```

## Using in React Components

The primary way to interact with RGS in components is through the `useStore` hook:

```tsx
// Counter.tsx
import React from 'react'
import { useStore } from '@biglogic/rgs'

export const Counter: React.FC = () => {
  // useStore returns [value, setter] tuple
  const [count, setCount] = useStore<number>('counter')
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  )
}
```

## Computed Values

Create derived state that automatically updates when dependencies change:

```typescript
import { gstate } from '@biglogic/rgs'

const store = gstate({ counter: 0 })

// Create a computed value that reacts to state changes
store.compute('doubled', (get) => get('counter') * 2)

// Use in component
const [doubled] = useStore<number>('doubled')
```

## Reading State Without Subscription

Use `store.get()` to read state without subscribing to changes:

```typescript
import { gstate } from '@biglogic/rgs'

const store = gstate({ user: null })

// Read state anywhere in your code
const currentUser = store.get<User>('user')
console.log('Current user:', currentUser)
```

## Updating State

Update state with the setter or direct store methods:

```typescript
import { gstate } from '@biglogic/rgs'

const store = gstate({ name: 'Guest' })

// Using the setter from useStore
const [name, setName] = useStore<string>('name')
setName('Alice')

// Using store directly
store.set('name', 'Bob')

// Using updater function (Immer)
store.set('name', draft => { draft = 'Charlie' })
```

## Watching for Changes

Subscribe to state changes with `store.watch`:

```typescript
import { gstate } from '@biglogic/rgs'

const store = gstate({ counter: 0 })

// Watch a key
const unsubscribe = store.watch('counter', (newValue) => {
  console.log(`Counter changed to: ${newValue}`)
})

// Stop watching
unsubscribe()
```

## Complete Example

Here's a complete working example:

```tsx
// App.tsx
import React from 'react'
import { gstate, useStore } from '@biglogic/rgs'

// Create store with initial state
const useAppStore = gstate({
  todos: [] as string[],
  filter: 'all' as 'all' | 'active' | 'completed'
})

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useAppStore('todos')
  const [filter, setFilter] = useAppStore<'all' | 'active' | 'completed'>('filter')
  
  const addTodo = (text: string) => {
    setTodos([...todos, text])
  }
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return true // Simplified
    return true
  })
  
  return (
    <div>
      <h1>Todo App</h1>
      <ul>
        {filteredTodos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Next Steps

- [Core Concepts](core-concepts.md) - Deep dive into RGS concepts
- [API Reference](api-reference.md) - Complete API documentation
- [Advanced Usage](advanced-usage.md) - Transactions, plugins, persistence
