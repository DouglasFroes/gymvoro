import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Github, Globe, Mail } from 'lucide-react-native';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
// import { version } from '../../package.json'; // Importing package.json can be tricky with metro sometimes without config, hardcoding for now or using a constant.

export const AboutScreen = () => {
  const navigation = useNavigation();
  const appVersion = "0.0.1"; // Placeholder

  const handleLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* Placeholder for App Logo */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>GV</Text>
          </View>
          <Text style={styles.appName}>GymVoro</Text>
          <Text style={styles.version}>Version {appVersion}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionText}>
            GymVoro is your ultimate companion for tracking workouts, monitoring progress, and staying consistent with your fitness goals.
            Built with performance and user experience in mind.
          </Text>
        </View>

        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.linkRow} onPress={() => handleLink('https://github.com/DouglasFroes/gymvoro')}>
            <Github color="#FFF" size={20} />
            <Text style={styles.linkText}>GitHub Repository</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow} onPress={() => handleLink('https://douglassantos.com.br')}>
            <Globe color="#FFF" size={20} />
            <Text style={styles.linkText}>Developer Website</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow} onPress={() => handleLink('mailto:contact@gymvoro.com')}>
            <Mail color="#FFF" size={20} />
            <Text style={styles.linkText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 GymVoro. All rights reserved.</Text>
        </View>
      </View>
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
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#064E3B',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 40,
  },
  sectionText: {
    color: '#D1D5DB',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  linksContainer: {
    width: '100%',
    gap: 16,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  linkText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 12,
  }
});
