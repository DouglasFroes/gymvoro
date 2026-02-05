import { Calendar, Clock, Dumbbell, Trophy } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useHistoryStore } from '../store/historyStore';

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

export const HistoryScreen = () => {
  // const navigation = useNavigation();
  const { history, fetchHistory, loading } = useHistoryStore();

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateDay}>{new Date(item.startTime).getDate()}</Text>
        <Text style={styles.dateMonth}>{new Date(item.startTime).toLocaleDateString('en-US', { month: 'short' })}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.workoutName}>{item.workoutName}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Clock size={12} color="#9CA3AF" />
            <Text style={styles.statText}>{formatDuration(item.duration)}</Text>
          </View>
          <View style={styles.stat}>
            <Dumbbell size={12} color="#9CA3AF" />
            <Text style={styles.statText}>{item.exercises?.length || 0} Exercises</Text>
          </View>
          <View style={styles.stat}>
            <Trophy size={12} color="#FBBF24" />
            <Text style={[styles.statText, { color: '#FBBF24' }]}>PR!</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar color="#374151" size={64} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>No workout history yet.</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  dateBadge: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  dateDay: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateMonth: {
    color: '#9CA3AF',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  workoutName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    fontStyle: 'italic',
  }
});
