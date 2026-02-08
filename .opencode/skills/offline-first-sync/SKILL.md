# Local-First Synchronization Standard

Standardized protocol for bi-directional data replication between SQLite (Client) and PostgreSQL/SQLite (Server).

## 🛠 Identity Strategy
- **Client-Side UUIDs**: Every entity (Person, TimeEntry) MUST have its ID generated on the client using `crypto.randomUUID()` before syncing.
- **Collisions**: The server MUST accept client-generated UUIDs to allow immediate offline usage.

## 🔄 Synchronization Protocol
1. **The Sync Queue**: The client maintains a `sync_queue` table for all local mutations (CREATE, UPDATE, DELETE).
2. **Delta-Based Sync**: Only send changed records since the `last_sync_timestamp`.
3. **Soft Deletes (Tombstones)**: Records are never hard-deleted. Use `is_deleted = true` + `updated_at` timestamp to propagate deletions.
4. **7-Day Rolling Cache**: The client strictly keeps a "hot" window of the last 7 days of history. Older data is pruned from local storage after successful sync.

## ⚔️ Conflict Resolution (Last-Write-Wins)
1. **Clock Drift**: The server rejects any `client_timestamp` more than 5 minutes in the future.
2. **Tie-Breaker**: 
   - If `timestamp_a > timestamp_b`, A wins.
   - If `timestamp_a == timestamp_b`, the higher lexicographical Client ID wins.
3. **Payload**: The server returns the "Winner" version and any remote changes in the `SyncResponse`.

## 🎨 Optimistic UI Pattern
- **Step 1**: Update Local SQLite.
- **Step 2**: Update Zustand Store (UI reflects change < 50ms).
- **Step 3**: Queue Sync Job.
- **Step 4**: Background processor pushes to API.
- **Step 5**: If API fails with conflict, update local state with the server's version (Rollback).
