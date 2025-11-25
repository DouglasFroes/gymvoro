import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { useWorkoutStore } from '../store/workoutStore';
import { WorkoutRoutine } from '../types';

export const WorkoutsScreen = () => {
  const navigation = useNavigation<any>();
  const { workouts, fetchWorkouts, loading } = useWorkoutStore();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const renderItem = ({ item }: { item: WorkoutRoutine }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.id })}
    >
      <View>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.exercises.length} Exercises</Text>
      </View>
      <Button
        title="Start"
        onPress={() => navigation.navigate('ActiveWorkout', { workoutId: item.id })}
        style={styles.startBtn}
        textStyle={{ fontSize: 14 }}
      />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>My Workouts</Text>
        <Button
          title="+ New"
          onPress={() => navigation.navigate('CreateWorkout')}
          style={styles.newBtn}
        />
      </View>

      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No workouts found.</Text>
            <Text style={styles.emptySubtext}>Create a new routine to get started!</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchWorkouts}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  newBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 0,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  startBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 0,
    minWidth: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
