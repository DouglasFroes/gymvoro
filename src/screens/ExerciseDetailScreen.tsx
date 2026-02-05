import { useNavigation, useRoute } from '@react-navigation/native';
import { AlertTriangle, ChevronLeft, Info } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useExerciseStore } from '../store/exerciseStore';

const { width } = Dimensions.get('window');

export const ExerciseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { exerciseId } = route.params;
  const { getExerciseById } = useExerciseStore();
  const exercise = getExerciseById(exerciseId);

  if (!exercise) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF' }}>Exercise not found.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft color="#FFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{exercise.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Media / Image */}
        <View style={styles.mediaContainer}>
          {exercise.imageUrl ? (
            <Image source={{ uri: exercise.imageUrl }} style={styles.media} resizeMode="cover" />
          ) : (
            <View style={[styles.media, { backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center' }]}>
              <Info color="#9CA3AF" size={48} />
            </View>
          )}
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{exercise.experienceLevel}</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{exercise.category}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: 'rgba(74, 222, 128, 0.2)' }]}>
            <Text style={[styles.tagText, { color: '#4ADE80' }]}>Target: {exercise.primaryMuscle}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.text}>{exercise.description}</Text>
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {exercise.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.text}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Cues */}
        {exercise.cues && exercise.cues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pro Tips</Text>
            {exercise.cues.map((cue, index) => (
              <View key={index} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={[styles.text, { color: '#60A5FA' }]}>{cue}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Mistakes */}
        {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
          <View style={[styles.section, styles.mistakesSection]}>
            <Text style={[styles.sectionTitle, { color: '#F87171' }]}>Common Mistakes</Text>
            {exercise.commonMistakes.map((mistake, index) => (
              <View key={index} style={styles.mistakeRow}>
                <AlertTriangle color="#F87171" size={16} />
                <Text style={[styles.text, { color: '#FCA5A5' }]}>{mistake}</Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  mediaContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#1F2937',
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  levelText: {
    color: '#FFF',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  tag: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: '#D1D5DB',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  text: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: '#064E3B',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#60A5FA',
  },
  mistakesSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderBottomWidth: 0,
  },
  mistakeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
});
