import { create } from 'zustand';
import { exercisesCollection } from '../services/firestore';

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string[];
  experienceLevel: 'iniciante' | 'intermediário' | 'avançado';
  description: string;
  cues: string[];
  steps: string[];
  commonMistakes: string[];
  category: 'força' | 'cardio' | 'mobilidade' | 'potência';
  imageUrl?: string;
  videoUrl?: string;
  createdAt: number;
}

interface ExerciseState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  fetchExercises: () => Promise<void>;
  getExerciseById: (id: string) => Exercise | undefined;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  loading: false,
  error: null,
  fetchExercises: async () => {
    // If already loaded, don't fetch again (simple cache)
    if (get().exercises.length > 0) return;

    set({ loading: true, error: null });
    try {
      const snapshot = await exercisesCollection.get();
      const exercises = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Exercise[];

      set({ exercises, loading: false });
    } catch (error: any) {
      console.error('Error fetching exercises:', error);
      set({ error: error.message, loading: false });
    }
  },
  getExerciseById: (id: string) => {
    return get().exercises.find(ex => ex.id === id);
  }
}));
