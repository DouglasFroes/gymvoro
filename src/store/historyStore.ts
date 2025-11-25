import firestore from '@react-native-firebase/firestore';
import { create } from 'zustand';
import { WorkoutSession } from '../types';
import { useAuthStore } from './authStore';

interface HistoryState {
  history: WorkoutSession[];
  loading: boolean;
  fetchHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  loading: false,
  fetchHistory: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('history')
        .orderBy('startTime', 'desc')
        .limit(20) // Pagination would be better
        .get();

      const history = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkoutSession[];

      set({ history });
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
