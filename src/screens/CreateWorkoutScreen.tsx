import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Plus, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Exercise, useExerciseStore } from '../store/exerciseStore';
import { useWorkoutStore } from '../store/workoutStore';

export const CreateWorkoutScreen = () => {
  const navigation = useNavigation();
  const { exercises, fetchExercises } = useExerciseStore();
  const { createWorkout } = useWorkoutStore();

  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSave = async () => {
    if (!workoutName.trim() || selectedExercises.length === 0) return;

    // Map selected exercises to WorkoutExercise (add default sets/reps)
    const workoutExercises = selectedExercises.map(ex => ({
      ...ex,
      sets: 3,
      reps: 10,
      rest: 60,
    }));

    await createWorkout({
      name: workoutName,
      exercises: workoutExercises,
    });

    navigation.goBack();
  };

  const toggleSelection = (exercise: Exercise) => {
    if (selectedExercises.find(e => e.id === exercise.id)) {
      setSelectedExercises(prev => prev.filter(e => e.id !== exercise.id));
    } else {
      setSelectedExercises(prev => [...prev, exercise]);
    }
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.primaryMuscle.toLowerCase().includes(search.toLowerCase())
  );

  const renderExerciseItem = ({ item }: { item: Exercise }) => {
    const isSelected = !!selectedExercises.find(e => e.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.exerciseCard, isSelected && styles.exerciseCardSelected]}
        onPress={() => toggleSelection(item)}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.thumbnail}
          defaultSource={{ uri: 'https://via.placeholder.com/150' }}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.exName, isSelected && { color: '#064E3B' }]}>{item.name}</Text>
          <Text style={styles.exMuscle}>{item.primaryMuscle}</Text>
        </View>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Plus color="#FFF" size={16} style={{ transform: [{ rotate: '45deg' }] }} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnIcon}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>New Routine</Text>
        <TouchableOpacity
          disabled={!workoutName || selectedExercises.length === 0}
          onPress={handleSave}
        >
          <Text style={[styles.saveText, (!workoutName || selectedExercises.length === 0) && { color: '#374151' }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Routine Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Leg Day Destruction"
          placeholderTextColor="#6B7280"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.label}>Exercises ({selectedExercises.length})</Text>
        <TouchableOpacity style={styles.addExBtn} onPress={() => setIsSelecting(!isSelecting)}>
          <Plus color="#4ADE80" size={16} />
          <Text style={styles.addExText}>{isSelecting ? 'Done' : 'Add Exercises'}</Text>
        </TouchableOpacity>
      </View>

      {isSelecting ? (
        <View style={{ flex: 1 }}>
          <View style={styles.searchBox}>
            <Search color="#9CA3AF" size={20} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="#6B7280"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <FlatList
            data={filteredExercises}
            renderItem={renderExerciseItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        </View>
      ) : (
        <FlatList
          data={selectedExercises}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <View style={styles.selectedRow}>
              <Text style={styles.index}>{index + 1}</Text>
              <Text style={styles.selectedName}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleSelection(item)}>
                <X color="#EF4444" size={20} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No exercises added yet.</Text>
            </View>
          }
        />
      )}

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  btnIcon: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  saveText: {
    color: '#4ADE80',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    padding: 20,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  addExBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addExText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  exerciseCardSelected: {
    backgroundColor: '#4ADE80',
    borderColor: '#4ADE80',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#374151',
    marginRight: 12,
  },
  exName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  exMuscle: {
    color: '#9CA3AF',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  index: {
    color: '#9CA3AF',
    fontSize: 14,
    width: 24,
  },
  selectedName: {
    color: '#FFF',
    flex: 1,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#6B7280',
    fontStyle: 'italic',
  }
});
