import { useState, useEffect } from 'react';

/**
 * Drop-in replacement for useState that automatically persists to localStorage.
 * Survives page refreshes and browser tab reopens.
 * Cleared only on hard-refresh with cleared storage (Ctrl+Shift+Del).
 *
 * @param {string} key       - localStorage key
 * @param {*}      initial   - default value if nothing is stored yet
 * @param {object} [opts]    - options
 * @param {Function} [opts.serialize]   - custom serializer (default JSON.stringify)
 * @param {Function} [opts.deserialize] - custom deserializer (default JSON.parse)
 */
export function useLocalStorage(key, initial, opts = {}) {
  const { serialize = JSON.stringify, deserialize = JSON.parse } = opts;

  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return deserialize(stored);
    } catch {
      // corrupted storage — fall through to initial
    }
    return typeof initial === 'function' ? initial() : initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      // storage full or private mode — ignore silently
    }
  }, [key, value, serialize]);

  return [value, setValue];
}

/**
 * Like useLocalStorage but for Set values (serialized as Array).
 */
export function useLocalStorageSet(key, initial = new Set()) {
  const [value, setValue] = useLocalStorage(
    key,
    initial,
    {
      serialize: (s) => JSON.stringify(Array.from(s)),
      deserialize: (raw) => new Set(JSON.parse(raw)),
    }
  );
  return [value, setValue];
}
