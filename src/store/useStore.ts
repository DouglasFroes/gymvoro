import { create } from 'zustand';
import { StateStorage } from 'zustand/middleware';

export const storage = new MMKV();

export const mmkvStorage: StateStorage = {
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.delete(name);
  },
};

interface AppState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
