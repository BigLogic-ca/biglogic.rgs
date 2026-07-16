# Security Features

RGS includes enterprise-grade security features out of the box.

## Role-Based Access Control (RBAC)

Restrict state access based on user roles and permissions.

### Setting Up RBAC

```typescript
import { gstate } from '@biglogic/rgs'

// Define access rules in store config
const store = gstate({ admin_data: null, user_data: null }, {
  userId: 'user-123',
  accessRules: [
    { pattern: /^admin_/, permissions: ['admin'] },
    { pattern: /^user_/, permissions: ['read', 'write'] }
  ]
})

// Check permission before access
if (store.hasPermission('admin_data', 'write', 'user-123')) {
  store.set('admin_data', newSettings)
} else {
  console.warn('Access denied: insufficient permissions')
}
```

### Permission Types

| Permission | Description |
|------------|-------------|
| `read` | Can read the state key |
| `write` | Can modify the state key |
| `delete` | Can delete the state key |
| `admin` | Full access (implies all others) |

### Function-Based Rules

```typescript
// Dynamic rule based on user attributes
const store = gstate({ user_data: null }, {
  accessRules: [
    {
      pattern: (key: string, userId?: string) => {
        // Only allow access to user's own data
        return key.startsWith(`user_${userId}_`)
      },
      permissions: ['read', 'write']
    }
  ]
})
```

## AES-256-GCM Encryption

Encrypt sensitive state data at rest.

### Generating Encryption Keys

```typescript
import { 
  generateEncryptionKey, 
  encrypt, 
  decrypt,
  deriveKeyFromPassword,
  generateSalt,
  exportKey,
  importKey
} from '@biglogic/rgs'

// Generate encryption key
const encryptionKey = await generateEncryptionKey()

// Export key for storage (store securely!)
const { key, iv } = await exportKey(encryptionKey)

// Later, import the key
const importedKey = await importKey(key, iv)

// Store encrypted data
const store = gstate({ sensitive: null }, {
  encryptionKey: importedKey
})

// Or encrypt manually
const encrypted = await encrypt(sensitiveData, importedKey)
store.set('sensitive', encrypted, { encrypted: true })

// Retrieve and decrypt
const stored = store.get('sensitive')
const decrypted = await decrypt(stored, importedKey)
```

**Note:** AES-GCM requires a unique IV for each encryption with the same key. RGS automatically generates a fresh random IV per encryption operation for maximum security.

### Key Derivation from Password

Derive encryption keys from user passwords using PBKDF2 (NIST SP 800-132 compliant).

```typescript
import { deriveKeyFromPassword, generateSalt } from '@biglogic/rgs'

// User provides password
const password = 'user-password'

// Generate salt (store alongside encrypted data)
const salt = generateSalt(32)

// Derive key (NIST SP 800-132 compliant: 600,000+ iterations)
const encryptionKey = await deriveKeyFromPassword(password, salt, 600000)
```

### Key Derivation from Password

Derive encryption keys from user passwords using PBKDF2 (NIST SP 800-132 compliant).

```typescript
import { deriveKeyFromPassword, generateSalt } from '@biglogic/rgs'

// User provides password
const password = 'user-password'

// Generate salt (store alongside encrypted data)
const salt = generateSalt(32)

// Derive key (NIST SP 800-132 compliant: 600,000+ iterations)
const encryptionKey = await deriveKeyFromPassword(password, salt, 600000)

// Export keys for storage
import { exportKey } from '@biglogic/rgs'
const { key, iv } = await exportKey(encryptionKey)
// Store key and iv securely (e.g., in httpOnly cookie or secure storage)
```

### Key Management

- **Never store keys in client-side code**
- **Use httpOnly cookies** for web applications
- **Rotate keys periodically**
- **Use PBKDF2** for password-based key derivation
- **Follow NIST guidelines** (600,000+ iterations minimum)

## Audit Logging

Track all state access and modifications for compliance.

### Configuring Audit Logger

```typescript
import { setAuditLogger, AuditEntry } from '@biglogic/rgs'

// Configure audit logger
setAuditLogger((entry: AuditEntry) => {
  // Send to your audit service
  fetch('/api/audit', {
    method: 'POST',
    body: JSON.stringify({
      timestamp: entry.timestamp,
      action: entry.action,
      key: entry.key,
      userId: entry.userId,
      success: entry.success,
      error: entry.error
    })
  })
})
```

### Audit Entry Structure

```typescript
interface AuditEntry {
  timestamp: number
  action: 'set' | 'get' | 'delete' | 'hydrate'
  key: string
  userId?: string
  success: boolean
  error?: string
}
```

### Automatic Audit Entries

Audit entries are automatically created for:
- `setState` (action: 'set')
- `getState` (action: 'get')
- `hydrate` (action: 'hydrate')
- `delete` (action: 'delete')

## GDPR Compliance

Manage user consent and data rights (GDPR Articles 17, 20).

### Managing Consent

```typescript
import { gstate } from '@biglogic/rgs'

const store = gstate({ data: null }, {
  userId: 'user-123'
})

// Record user consent
store.recordConsent('user-123', 'analytics', true)
store.recordConsent('user-123', 'marketing', false)

// Check consent before processing
if (store.hasConsent('user-123', 'analytics')) {
  // Process analytics
}
```

### Data Portability (Article 20)

```typescript
import { gstate } from '@biglogic/rgs'

const store = gstate({ user: null })

// Export user data (GDPR Article 20 - Right to data portability)
const userData = store.exportUserData('user-123')
```

### Right to Be Forgotten (Article 17)

```typescript
import { gstate } from '@biglogic/rgs'

const store = gstate({ user: null })

// Delete user data (GDPR Article 17 - Right to be forgotten)
const result = store.deleteUserData('user-123')
```

## Input Sanitization

Prevent XSS attacks with built-in sanitization.

### Automatic Sanitization

```typescript
import { gstate, sanitizeValue } from '@biglogic/rgs'

const store = gstate({ content: null }, {
  validateInput: true // Enables automatic sanitization
})

// Automatically sanitizes when setting state
store.set('content', userInput)

// Or use manually
store.set('content', sanitizeValue(untrustedHTML))
```

### What Gets Sanitized

- Script tags (`<script>`)
- Event handlers (`onclick=`, `onload=`, etc.)
- Dangerous URL schemes (`javascript:`, `vbscript:`)
- Malicious HTML elements (`<iframe>`, `<object>`, `<embed>`)
- Encoded XSS attacks (HTML entities, URL encoding)

## Security Checklist

- [ ] Enable RBAC for sensitive state keys
- [ ] Use AES-256-GCM encryption for PII
- [ ] Configure audit logging
- [ ] Implement GDPR consent management
- [ ] Sanitize all user inputs
- [ ] Use HTTPS in production
- [ ] Store encryption keys securely (httpOnly cookies)
- [ ] Regularly rotate encryption keys
- [ ] Monitor for suspicious access patterns
- [ ] Follow NIST password guidelines (600,000+ iterations)

## Next Steps

- [Testing](testing.md) - Testing strategies
- [Performance](performance.md) - Optimization tips
- [Best Practices](best-practices.md) - Security best practices
