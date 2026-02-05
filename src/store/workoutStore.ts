import { create } from 'zustand';
import { workoutsCollection } from '../services/firestore';
import { Exercise } from './exerciseStore';

export interface WorkoutExercise extends Exercise {
  sets: number;
  reps: number;
  rest: number; // seconds
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  createdAt: number;
  tags?: string[];
}

interface WorkoutState {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  fetchWorkouts: () => Promise<void>;
  createWorkout: (workout: Omit<Workout, 'id' | 'createdAt'>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  loading: false,
  error: null,
  fetchWorkouts: async () => {
    set({ loading: true, error: null });
    try {
      const snapshot = await workoutsCollection.orderBy('createdAt', 'desc').get();
      const workouts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];
      set({ workouts, loading: false });
    } catch (error: any) {
      console.error('Error fetching workouts:', error);
      set({ error: error.message, loading: false });
    }
  },
  createWorkout: async (workoutData) => {
    set({ loading: true, error: null });
    try {
      const newWorkout = {
        ...workoutData,
        createdAt: Date.now(),
      };
      await workoutsCollection.add(newWorkout);
      // Refresh workouts
      await get().fetchWorkouts();
    } catch (error: any) {
      console.error('Error creating workout:', error);
      set({ error: error.message, loading: false });
    }
  },
  deleteWorkout: async (id) => {
    try {
      await workoutsCollection.doc(id).delete();
      // Optimistic update
      set(state => ({
        workouts: state.workouts.filter(w => w.id !== id)
      }));
    } catch (error: any) {
      console.error('Error deleting workout:', error);
    }
  }
}));
