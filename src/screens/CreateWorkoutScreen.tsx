import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useWorkoutStore } from '../store/workoutStore';

export const CreateWorkoutScreen = () => {
  const navigation = useNavigation();
  const { addWorkout } = useWorkoutStore();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    setLoading(true);
    try {
      await addWorkout({
        name: name.trim(),
        exercises: [], // TODO: Add exercise selection logic
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Button 
          title="Cancel" 
          onPress={() => navigation.goBack()} 
          variant="outline"
          style={styles.backBtn}
          textStyle={{ fontSize: 14 }}
        />
        <Text style={styles.title}>New Workout</Text>
        <View style={{ width: 60 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="Workout Name"
          placeholder="e.g., Upper Body Power"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          <Text style={styles.placeholderText}>
            Exercise selection will be implemented in the next step.
            For now, create the routine and add exercises later.
          </Text>
        </View>

        <Button 
          title="Save Workout" 
          onPress={handleSave} 
          loading={loading}
          style={styles.saveBtn}
        />
      </ScrollView>
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
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 0,
    minWidth: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    paddingBottom: 20,
  },
  exercisesSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  saveBtn: {
    marginTop: 'auto',
  },
});
