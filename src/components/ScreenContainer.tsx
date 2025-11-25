import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withSafeArea?: boolean;
}

export const ScreenContainer = ({ children, style, withSafeArea = true }: ScreenContainerProps) => {
  const Wrapper = withSafeArea ? SafeAreaView : View;

  return (
    <Wrapper style={[styles.container, style]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
  },
});
