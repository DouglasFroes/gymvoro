import { useNavigation } from '@react-navigation/native';
import { Calendar, Clock, Dumbbell, Play, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useWorkoutStore } from '../store/workoutStore';

export const WorkoutsScreen = () => {
  const navigation = useNavigation<any>();
  const { workouts, fetchWorkouts, deleteWorkout } = useWorkoutStore();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleStartWorkout = (workout: any) => {
    navigation.navigate('ActiveWorkout', { workout });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Dumbbell color="#4ADE80" size={24} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.workoutName}>{item.name}</Text>
          <Text style={styles.workoutMeta}>{item.exercises.length} Exercises</Text>
        </View>
        <TouchableOpacity onPress={() => deleteWorkout(item.id)} style={styles.deleteBtn}>
          <Trash2 color="#EF4444" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Clock size={14} color="#9CA3AF" />
          <Text style={styles.statText}>45 min</Text>
        </View>
        <View style={styles.stat}>
          <Calendar size={14} color="#9CA3AF" />
          <Text style={styles.statText}>Last: 2 days ago</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => handleStartWorkout(item)}
      >
        <Play fill="#000" color="#000" size={16} />
        <Text style={styles.startBtnText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>My Workouts</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateWorkout')}
        >
          <Plus color="#000" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Dumbbell color="#374151" size={64} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>You haven't created any workouts yet.</Text>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => navigation.navigate('CreateWorkout')}
            >
              <Text style={styles.createBtnText}>Create New Routine</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  workoutMeta: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  deleteBtn: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  startBtn: {
    backgroundColor: '#4ADE80',
    borderRadius: 12,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  startBtnText: {
    color: '#064E3B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 24,
  },
  createBtn: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createBtnText: {
    color: '#064E3B',
    fontWeight: 'bold',
  }

});
