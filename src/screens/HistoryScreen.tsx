import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { useHistoryStore } from '../store/historyStore';
import { WorkoutSession } from '../types';

export const HistoryScreen = () => {
  const navigation = useNavigation();
  const { history, fetchHistory, loading } = useHistoryStore();

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderItem = ({ item }: { item: WorkoutSession }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.routineName}</Text>
        <Text style={styles.cardDate}>{formatDate(item.startTime)}</Text>
      </View>
      <Text style={styles.cardSubtitle}>
        {item.exercises.length} Exercises • {item.endTime ? Math.round((item.endTime - item.startTime) / 60000) + ' min' : 'Incomplete'}
      </Text>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Button 
          title="Back" 
          onPress={() => navigation.goBack()} 
          variant="outline"
          style={styles.backBtn}
          textStyle={{ fontSize: 14 }}
        />
        <Text style={styles.title}>History</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history yet.</Text>
            <Text style={styles.emptySubtext}>Complete a workout to see it here.</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchHistory}
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
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 0,
    minWidth: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cardDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
