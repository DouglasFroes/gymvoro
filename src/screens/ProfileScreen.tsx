import { useNavigation } from '@react-navigation/native';
import { Activity, ChevronRight, LogOut, Settings, Trophy, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuthStore } from '../store/authStore';

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuthStore();

  const MenuOption = ({ icon: Icon, label, onPress, color = '#FFF' }: any) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
        <Icon color={color} size={20} />
      </View>
      <Text style={[styles.menuText, { color }]}>{label}</Text>
      <ChevronRight color="#4B5563" size={20} />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity>
            <Settings color="#FFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.email?.split('@')[0]}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>5h</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <MenuOption icon={User} label="Personal Details" onPress={() => {}} />
          <MenuOption icon={Trophy} label="Achievements" onPress={() => {}} />
          <MenuOption icon={Activity} label="Statistics" onPress={() => {}} />
          <MenuOption icon={Settings} label="About" onPress={() => navigation.navigate('About')} />
          <View style={styles.divider} />
          <MenuOption icon={LogOut} label="Log Out" color="#EF4444" onPress={signOut} />
        </View>

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ADE80',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1F2937',
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 12,
  }
});
