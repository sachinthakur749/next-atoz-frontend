import { useCallback } from "react";

type StorableValue = string | number | boolean | object | null;

const useLocalStorage = () => {
  const addItem = useCallback((key: string, value: StorableValue) => {
    if (typeof window !== "undefined") {
      const stringified =
        typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, stringified);
    }
  }, []);

  const removeItem = useCallback((key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }, []);

  const getItem = useCallback((key: string) => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(key);
      return value ? value : null;
    }
    return null;
  }, []);

  const getParsedItem = useCallback((key: string) => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  }, []);

  return { addItem, removeItem, getItem, getParsedItem };
};

export default useLocalStorage;
