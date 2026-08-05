/**
 * Canonical identifier type used throughout the Engineering Platform.
 *
 * Concrete implementations may use UUID, ULID, Snowflake,
 * hashes, or other identifier strategies without changing
 * the public contracts.
 */
export type Identifier = string;