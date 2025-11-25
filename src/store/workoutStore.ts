import { create } from 'zustand';
import { WorkoutRoutine } from '../types';
import firestore from '@react-native-firebase/firestore';
import { useAuthStore } from './authStore';

interface WorkoutState {
  workouts: WorkoutRoutine[];
  loading: boolean;
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Omit<WorkoutRoutine, 'id'>) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  loading: false,
  fetchWorkouts: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('workouts')
        .orderBy('createdAt', 'desc')
        .get();

      const workouts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkoutRoutine[];

      set({ workouts });
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      set({ loading: false });
    }
  },
  addWorkout: async (workoutData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    // Optimistic update
    const tempId = Math.random().toString(36).substring(7);
    const newWorkout = { id: tempId, ...workoutData } as WorkoutRoutine;
    
    set(state => ({ workouts: [newWorkout, ...state.workouts] }));

    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('workouts')
        .add(workoutData);
        
      // Re-fetch to get the real ID and ensure sync
      // In a real app, we might just update the ID of the optimistic item
      useWorkoutStore.getState().fetchWorkouts();
    } catch (error) {
      console.error('Error adding workout:', error);
      // Rollback
      set(state => ({ workouts: state.workouts.filter(w => w.id !== tempId) }));
    }
  },
}));
