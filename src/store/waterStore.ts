import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './useStore';

interface WaterState {
  current: number; // in ml
  goal: number; // in ml
  addWater: (amount: number) => void;
  removeWater: (amount: number) => void;
  reset: () => void;
  setGoal: (goal: number) => void;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set) => ({
      current: 0,
      goal: 2000, // Default 2L
      addWater: (amount) => set((state) => ({ current: state.current + amount })),
      removeWater: (amount) => set((state) => ({ current: Math.max(0, state.current - amount) })),
      reset: () => set({ current: 0 }),
      setGoal: (goal) => set({ goal }),
    }),
    {
      name: 'water-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
