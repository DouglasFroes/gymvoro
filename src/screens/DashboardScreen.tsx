import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuthStore } from '../store/authStore';
import { useWorkoutStore } from '../store/workoutStore';

export const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuthStore();
  const { workouts, fetchWorkouts } = useWorkoutStore();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.username}>{user?.email?.split('@')[0]}</Text>
          </View>
          <Button
            title="Sign Out"
            onPress={signOut}
            variant="outline"
            style={styles.signOutBtn}
            textStyle={{ fontSize: 12 }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Button
              title="Start Workout"
              onPress={() => navigation.navigate('Workouts')}
              style={styles.actionBtn}
            />
            <Button
              title="Log History"
              onPress={() => navigation.navigate('History')}
              variant="secondary"
              style={styles.actionBtn}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {workouts.length === 0 ? (
            <Text style={styles.emptyText}>No workouts created yet.</Text>
          ) : (
            workouts.slice(0, 3).map(workout => (
              <View key={workout.id} style={styles.workoutCard}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDetails}>{workout.exercises.length} Exercises</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  signOutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  workoutDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
