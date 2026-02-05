import { useNavigation, useRoute } from '@react-navigation/native';
import { Check, ChevronLeft, Pause, Play } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { historyCollection } from '../services/firestore'; // Import directly or use store
import { useAuthStore } from '../store/authStore';

interface SetData {
  setId: number;
  reps: string;
  weight: string;
  completed: boolean;
}

export const ActiveWorkoutScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { workout } = route.params || { workout: null };
  const { user } = useAuthStore();

  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  // State to track sets for each exercise
  // Map exerciseIndex -> SetData[]
  const [sessionData, setSessionData] = useState<{ [key: number]: SetData[] }>({});

  useEffect(() => {
    if (!workout) return;

    // Initialize session data based on workout
    const initialData: { [key: number]: SetData[] } = {};
    workout.exercises.forEach((ex: any, idx: number) => {
      initialData[idx] = Array.from({ length: ex.sets || 3 }).map((_, i) => ({
        setId: i,
        reps: (ex.reps || 10).toString(),
        weight: '0',
        completed: false
      }));
    });
    setSessionData(initialData);

    // Start Timer
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setDuration(d => d + 1);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [workout, isPaused]);

  if (!workout) {
    return (
      <ScreenContainer>
        <Text style={{ color: 'white' }}>No workout loaded</Text>
      </ScreenContainer>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleSetComplete = (exIdx: number, setIdx: number) => {
    setSessionData(prev => {
      const newData = { ...prev };
      const set = newData[exIdx][setIdx];
      set.completed = !set.completed;
      return newData;
    });
  };

  const updateSet = (exIdx: number, setIdx: number, field: 'reps' | 'weight', value: string) => {
    setSessionData(prev => {
      const newData = { ...prev };
      newData[exIdx][setIdx] = { ...newData[exIdx][setIdx], [field]: value };
      return newData;
    });
  };

  const finishWorkout = async () => {
    Alert.alert(
      "Finish Workout",
      "Are you sure you want to finish?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Finish",
          onPress: async () => {
            try {
              // Save to History
              await historyCollection.add({
                userId: user?.uid,
                workoutId: workout.id,
                workoutName: workout.name,
                startTime: Date.now() - (duration * 1000),
                endTime: Date.now(),
                duration: duration,
                exercises: workout.exercises.map((ex: any, idx: number) => ({
                  name: ex.name,
                  sets: sessionData[idx]
                })),
                createdAt: Date.now()
              });

              navigation.replace('MainTabs', { screen: 'HistoryTab' }); // Go to history
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to save workout');
            }
          }
        }
      ]
    );
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{workout.name}</Text>
          <Text style={styles.timer}>{formatTime(duration)}</Text>
        </View>
        <TouchableOpacity onPress={finishWorkout} style={styles.finishBtn}>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {workout.exercises.map((exercise: any, exIdx: number) => (
          <View key={exIdx} style={styles.exCard}>
            <Text style={styles.exName}>{exercise.name}</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.colHead, { width: 40 }]}>Set</Text>
              <Text style={styles.colHead}>Kg</Text>
              <Text style={styles.colHead}>Reps</Text>
              <Text style={[styles.colHead, { width: 40 }]}>Done</Text>
            </View>

            {sessionData[exIdx]?.map((set, setIdx) => (
              <View key={setIdx} style={[styles.setRow, set.completed && styles.setRowCompleted]}>
                <View style={styles.setNumBox}>
                  <Text style={styles.setNum}>{setIdx + 1}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={set.weight}
                  onChangeText={(v) => updateSet(exIdx, setIdx, 'weight', v)}
                  placeholder="0"
                  placeholderTextColor="#6B7280"
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={set.reps}
                  onChangeText={(v) => updateSet(exIdx, setIdx, 'reps', v)}
                  placeholder="0"
                  placeholderTextColor="#6B7280"
                />
                <TouchableOpacity
                  style={[styles.checkBtn, set.completed && styles.checkBtnActive]}
                  onPress={() => toggleSetComplete(exIdx, setIdx)}
                >
                  <Check color={set.completed ? '#FFF' : '#374151'} size={16} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addSetBtn}
              onPress={() => {
                setSessionData(prev => {
                  const newData = { ...prev };
                  const currentSets = newData[exIdx];
                  const lastSet = currentSets[currentSets.length - 1];
                  newData[exIdx] = [...currentSets, { ...lastSet, setId: currentSets.length, completed: false }];
                  return newData;
                });
              }}
            >
              <Text style={styles.addSetText}>+ Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Footer Controls (Pause/Resume) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play fill="#000" size={24} color="#000" /> : <Pause fill="#000" size={24} color="#000" />}
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backBtn: {
    padding: 8,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timer: {
    color: '#4ADE80',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  finishBtn: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  finishText: {
    color: '#064E3B',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  exCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  colHead: {
    color: '#9CA3AF',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  setRowCompleted: {
    opacity: 0.5,
  },
  setNumBox: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setNum: {
    color: '#6B7280',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 8,
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 8,
  },
  checkBtn: {
    width: 40,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBtnActive: {
    backgroundColor: '#4ADE80',
  },
  addSetBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  addSetText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // Gradient or solid background
    backgroundColor: 'transparent',
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  }
});
