/**
 * Input Component
 * Modern text input with label and error states
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { styles } from './Input.style';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  containerStyle?: any;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText style={[styles.label, { color: textColor }]}>
          {label}
        </ThemedText>
      )}

      <ThemedView style={[styles.inputContainer, error && styles.inputError]}>
        {leftIcon && (
          <ThemedView style={styles.leftIcon}>{leftIcon}</ThemedView>
        )}

        <TextInput
          style={[
            styles.input,
            { color: textColor, borderColor },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor="#9CA3AF"
          {...props}
        />

        {rightIcon && (
          <ThemedView style={styles.rightIcon}>{rightIcon}</ThemedView>
        )}
      </ThemedView>

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      {helperText && !error && (
        <ThemedText style={styles.helperText}>{helperText}</ThemedText>
      )}
    </ThemedView>
  );
}
