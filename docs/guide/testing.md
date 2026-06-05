# Testing

Comprehensive testing strategies for RGS applications.

## Unit Testing with Jest

### Basic Test Setup

```typescript
// store.test.ts
import { gstate, destroyAllStores } from '@biglogic/rgs'
import { renderHook, act } from '@testing-library/react'

describe('Store', () => {
  const store = gstate({ counter: 0 })
  
  afterEach(() => {
    destroyAllStores()
  })

  test('should initialize with initial state', () => {
    expect(store.get('counter')).toBe(0)
  })

  test('should update state', () => {
    act(() => {
      store.set('counter', 5)
    })
    expect(store.get('counter')).toBe(5)
  })

  test('hook should update component', () => {
    const { result } = renderHook(() => store('counter'))
    
    expect(result.current[0]).toBe(0)
    
    act(() => {
      result.current[1](10)
    })
    
    expect(result.current[0]).toBe(10)
  })
})
```

### Testing with Different Initial States

```typescript
test('should handle complex state', () => {
  const store = gstate({
    user: { name: 'John', role: 'admin' },
    settings: { theme: 'dark' }
  })
  
  const user = store.get('user')
  expect(user.name).toBe('John')
  expect(user.role).toBe('admin')
})
```

### Testing Computed Values

```typescript
import { gstate } from '@biglogic/rgs'

test('should compute derived values', () => {
  const store = gstate({ price: 100, quantity: 2 })
  
  store.compute('total', (get) => get('price') * get('quantity'))
  
  const [total] = store('total')
  expect(total).toBe(200)
})
```

## Integration Testing

### Testing Transactions

```typescript
// integration.test.ts
import { gstate, destroyAllStores } from '@biglogic/rgs'

test('transaction should batch updates', () => {
  const store = gstate({ a: 0, b: 0, c: 0 })
  
  const changes: string[] = []
  store._subscribe(() => {
    changes.push('changed')
  })
  
  store.transaction(() => {
    store.set('a', 1)
    store.set('b', 2)
    store.set('c', 3)
  })
  
  // Should only trigger one change notification
  expect(changes.length).toBe(1)
})
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { gstate } from '@biglogic/rgs'

const useStore = gstate({ counter: 0 })

const TestComponent = () => {
  const [count, setCount] = useStore('counter')
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}

test('component should update on state change', () => {
  render(<TestComponent />)
  
  expect(screen.getByTestId('count')).toHaveTextContent('0')
  
  fireEvent.click(screen.getByText('Increment'))
  
  expect(screen.getByTestId('count')).toHaveTextContent('1')
})
```

## Stress Testing

### High-Frequency Updates

```typescript
// stress.test.ts
test('handles high-frequency updates', () => {
  const store = gstate({})
  
  const start = performance.now()
  
  // 10,000 rapid updates
  for (let i = 0; i < 10000; i++) {
    store.set(`key_${i % 100}`, i)
  }
  
  const elapsed = performance.now() - start
  console.log(`10k updates: ${elapsed}ms`)
  
  expect(elapsed).toBeLessThan(1000) // Should complete under 1 second
})
```

### Large State Objects

```typescript
test('handles large objects', () => {
  const store = gstate({})
  
  const largeObject: Record<string, string> = {}
  for (let i = 0; i < 1000; i++) {
    largeObject[`key_${i}`] = 'value'.repeat(100)
  }
  
  const start = performance.now()
  store.set('large', largeObject)
  const elapsed = performance.now() - start
  
  expect(elapsed).toBeLessThan(500)
})
```

### Concurrent Updates

```typescript
import { gstate } from '@biglogic/rgs'

test('handles concurrent updates', async () => {
  const store = gstate({ counter: 0 })
  
  // Simulate concurrent updates
  const updates = Array(100).fill(null).map((_, i) => {
    return new Promise(resolve => {
      setTimeout(() => {
        store.transaction(() => {
          const current = store.get<number>('counter')
          store.set('counter', current + 1)
        })
        resolve(null)
      }, Math.random() * 10)
    })
  })
  
  await Promise.all(updates)
  expect(store.get('counter')).toBe(100)
})
```

## Performance Benchmarks

Run these tests to establish performance baselines:

| Operation | Expected Time | Notes |
|-----------|---------------|-------|
| 10k key sets | ~690ms | Individual updates |
| 10k key gets | ~1559ms | Individual reads |
| 1,000 transactions (50 updates each) | ~297ms | Batched updates |
| 100-level deep object (set+get) | ~12ms | Nested object access |
| 50 namespaces x 100 keys | ~55ms | Namespaced state |
| 1,000 updates with 100 listeners | ~17ms | High listener count |

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts']
}
```

### Test Utilities

```typescript
// test-utils.ts
import { gstate, destroyAllStores } from '@biglogic/rgs'

export const setupTestStore = <S extends Record<string, unknown>>(initialState: S) => {
  return gstate(initialState)
}

export const cleanup = () => {
  destroyAllStores()
}
```

## Next Steps

- [Performance](performance.md) - Optimization tips
- [Best Practices](best-practices.md) - Testing best practices
