import { createStore as baseCreateStore } from "./core/store";
import { useStore as baseUseStore } from "./core/hooks";
import * as Security from "./core/security";
import type { IStore, StoreConfig } from "./core/types";
export declare const gstate: <S extends Record<string, unknown>>(initialState: S, configOrNamespace?: string | StoreConfig<S>) => IStore<S> & (<K extends keyof S>(key: K) => readonly [S[K] | undefined, (val: S[K] | ((draft: S[K]) => S[K]), options?: unknown) => boolean]);
export { baseCreateStore as createStore };
export { useStore, useIsStoreReady, initState, getStore, destroyState, useStore as useGState, useStore as useSimpleState } from "./core/hooks";
export { createAsyncStore } from "./core/async";
export { SyncEngine, createSyncEngine } from "./core/sync";
export type { SyncConfig, SyncState, SyncResult, SyncStrategy, ConflictInfo, ConflictResolution } from "./core/sync";
export { initSync, destroySync, useSyncedState, useSyncStatus, triggerSync } from "./core/hooks";
export * from "./plugins/index";
export { generateEncryptionKey, exportKey, importKey, isCryptoAvailable, setAuditLogger, logAudit, validateKey, sanitizeValue, deriveKeyFromPassword, generateSalt } from "./core/security";
export declare const addAccessRule: (pattern: string | ((key: string, userId?: string) => boolean), perms: Security.Permission[]) => void | undefined;
export declare const hasPermission: (key: string, action: Security.Permission, uid?: string) => boolean;
export declare const recordConsent: (uid: string, p: string, g: boolean) => Security.ConsentRecord;
export declare const hasConsent: (uid: string, p: string) => boolean;
export declare const getConsents: (uid: string) => Security.ConsentRecord[];
export declare const revokeConsent: (uid: string, p: string) => Security.ConsentRecord | null | undefined;
export declare const exportUserData: (uid: string) => {
    userId: string;
    exportedAt: number;
    consents: import("./core/security").ConsentRecord[];
};
export declare const deleteUserData: (uid: string) => {
    success: boolean;
    deletedConsents: number;
};
export declare const clearAccessRules: () => void;
export declare const clearAllConsents: () => void;
export type { EncryptionKey, AuditEntry, Permission, AccessRule, ConsentRecord } from "./core/security";
export type { IStore, StoreConfig, PersistOptions, StateUpdater, ComputedSelector, WatcherCallback } from "./core/types";
declare global {
    var createStore: typeof baseCreateStore;
    var gstate: <S extends Record<string, unknown>>(initialState: S, configOrNamespace?: string | StoreConfig<S>) => IStore<S> & ((key: string) => unknown);
    var initState: typeof import("./core/hooks").initState;
    var destroyState: typeof import("./core/hooks").destroyState;
    var gState: IStore<Record<string, unknown>>;
    var rgs: IStore<Record<string, unknown>>;
    var useStore: typeof baseUseStore;
}
