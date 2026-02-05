import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Exercise, useExerciseStore } from '../store/exerciseStore';

export const ExercisesScreen = () => {
  const navigation = useNavigation<any>();
  const { exercises, fetchExercises, loading } = useExerciseStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? ex.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(exercises.map(ex => ex.category)));

  const renderItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id })}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.thumbnail}
        defaultSource={{ uri: 'https://via.placeholder.com/150' }} // Fallback
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.chips}>
          <Text style={styles.chip}>{item.primaryMuscle}</Text>
          <Text style={[styles.chip, { color: '#9CA3AF' }]}>•</Text>
          <Text style={styles.chip}>{item.experienceLevel}</Text>
        </View>
      </View>
      <ChevronRight color="#6B7280" size={20} />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Exercises Libraries</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color="#9CA3AF" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercise, muscle..."
          placeholderTextColor="#6B7280"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View>
        <FlatList
          horizontal
          data={['All', ...uniqueCategories]}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isActive = item === 'All' ? selectedCategory === null : selectedCategory === item;
            return (
              <TouchableOpacity
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(item === 'All' ? null : item)}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No exercises found</Text>
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    height: '100%',
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  categoryPillActive: {
    backgroundColor: '#4ADE80',
    borderColor: '#4ADE80',
  },
  categoryText: {
    color: '#D1D5DB',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#064E3B',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80, // TabBar space
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#374151',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  chips: {
    flexDirection: 'row',
    gap: 4,
  },
  chip: {
    color: '#9CA3AF',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  }
});
