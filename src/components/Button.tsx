import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle
}: ButtonProps) => {

  const getBackgroundColor = () => {
    if (disabled) return '#9CA3AF';
    switch (variant) {
      case 'primary': return '#4ADE80'; // Green
      case 'secondary': return '#374151'; // Dark Gray
      case 'danger': return '#EF4444'; // Red
      case 'outline': return 'transparent';
      default: return '#4ADE80';
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return '#4ADE80';
    if (variant === 'primary') return '#111827';
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor(), borderColor: variant === 'outline' ? '#4ADE80' : 'transparent', borderWidth: variant === 'outline' ? 1 : 0 },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
