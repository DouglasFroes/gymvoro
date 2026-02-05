import { useNavigation } from '@react-navigation/native';
import { Activity, Droplets, Flame, History as HistoryIcon, Play, Plus, TrendingUp } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuthStore } from '../store/authStore';
import { useWaterStore } from '../store/waterStore';
import { useWorkoutStore } from '../store/workoutStore';

const { width } = Dimensions.get('window');

export const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { workouts, fetchWorkouts } = useWorkoutStore();
  const { current: waterCurrent, goal: waterGoal, addWater, removeWater } = useWaterStore();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Mock data for the chart
  const barData = [
    { value: 2, label: 'M', frontColor: '#4ADE80' },
    { value: 1, label: 'T', frontColor: '#4ADE80' },
    { value: 3, label: 'W', frontColor: '#4ADE80' },
    { value: 0, label: 'T', frontColor: '#374151' },
    { value: 2, label: 'F', frontColor: '#4ADE80' },
    { value: 4, label: 'S', frontColor: '#4ADE80' },
    { value: 1, label: 'S', frontColor: '#374151' },
  ];

  const WaterWidget = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Droplets color="#60A5FA" size={20} />
          <Text style={styles.cardTitle}>Water Tracker</Text>
        </View>
        <Text style={styles.waterValue}>{waterCurrent} / {waterGoal}ml</Text>
      </View>

      <View style={styles.waterProgressContainer}>
        <View style={[styles.waterProgressBar, { width: `${Math.min((waterCurrent / waterGoal) * 100, 100)}%` }]} />
      </View>

      <View style={styles.waterControls}>
        <TouchableOpacity style={styles.waterBtn} onPress={() => removeWater(250)}>
          <Text style={styles.waterBtnText}>-250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.waterBtn, styles.waterBtnAdd]} onPress={() => addWater(250)}>
          <Plus color="#FFF" size={16} />
          <Text style={[styles.waterBtnText, { color: '#FFF' }]}>250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.waterBtn} onPress={() => addWater(500)}>
          <Text style={styles.waterBtnText}>+500ml</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const QuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Workouts')}
      >
        <View style={[styles.iconBox, { backgroundColor: 'rgba(74, 222, 128, 0.1)' }]}>
          <Play color="#4ADE80" size={24} fill="#4ADE80" />
        </View>
        <Text style={styles.actionText}>Start Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('CreateWorkout')}
      >
        <View style={[styles.iconBox, { backgroundColor: 'rgba(96, 165, 250, 0.1)' }]}>
          <Plus color="#60A5FA" size={24} />
        </View>
        <Text style={styles.actionText}>New Routine</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('History')}
      >
        <View style={[styles.iconBox, { backgroundColor: 'rgba(167, 139, 250, 0.1)' }]}>
          <HistoryIcon color="#A78BFA" size={24} />
        </View>
        <Text style={styles.actionText}>History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {}} // TODO: Navigate to Gamification/Streak
      >
        <View style={[styles.iconBox, { backgroundColor: 'rgba(251, 146, 60, 0.1)' }]}>
          <Flame color="#FB923C" size={24} />
        </View>
        <Text style={styles.actionText}>Streak</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{user?.email?.split('@')[0]}</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats / Streak */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.statLabel}>Weekly Volume</Text>
            <Text style={styles.statValue}>12.5 T</Text>
            <View style={styles.statTrend}>
              <TrendingUp size={12} color="#4ADE80" />
              <Text style={styles.statTrendText}>+12%</Text>
            </View>
          </View>
          <View style={[styles.statCard, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.statLabel}>Active Streak</Text>
            <Text style={styles.statValue}>5 Days</Text>
            <View style={styles.statTrend}>
              <Flame size={12} color="#FB923C" />
              <Text style={[styles.statTrendText, { color: '#FB923C' }]}>Keep it up!</Text>
            </View>
          </View>
        </View>

        <QuickActions />

        {/* Weekly Progress Chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Activity color="#A78BFA" size={20} />
              <Text style={styles.cardTitle}>Activity</Text>
            </View>
            <Text style={styles.labelSub}>This Week</Text>
          </View>
          <View style={{ overflow: 'hidden', marginLeft: -10 }}>
            {/* marginLeft negative to align chart better because of internal padding */}
            {/* <BarChart
              data={barData}
              width={width - 80}
              height={150}
              barWidth={22}
              spacing={20}
              barBorderRadius={4}
              frontColor="#4ADE80"
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              hideYAxisText
              xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
            /> */}
          </View>
        </View>

        <WaterWidget />

        {/* Recent Workouts */}
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No workouts found. Start one today!</Text>
          </View>
        ) : (
          workouts.slice(0, 3).map(workout => (
            <TouchableOpacity key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutIcon}>
                <Dumbbell color="#4ADE80" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDetails}>{workout.exercises.length} Exercises • 45m estim.</Text>
              </View>
              <Play color="#6B7280" size={16} />
            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100, // Space for TabBar
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileBtn: {
    //
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  labelSub: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statTrendText: {
    fontSize: 10,
    color: '#4ADE80',
    fontWeight: '600',
  },
  // Water Widget
  waterValue: {
    fontSize: 14,
    color: '#60A5FA',
    fontWeight: '600',
  },
  waterProgressContainer: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  waterProgressBar: {
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: 4,
  },
  waterControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  waterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  waterBtnAdd: {
    backgroundColor: '#60A5FA',
    flexDirection: 'row',
    gap: 4,
    flex: 1.5,
  },
  waterBtnText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '500',
  },
  // Workout List
  workoutCard: {
    backgroundColor: '#1F2937',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 12,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  workoutDetails: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontStyle: 'italic',
  }
});

// Need to import Dumbbell again since it's used inside
import { Dumbbell } from 'lucide-react-native';

