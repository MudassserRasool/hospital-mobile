/**
 * Badge Component
 * Small status indicator badge
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { styles } from './Badge.style';
// import { styles } from './Badge.style';

export interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  label,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return styles.successBadge;
      case 'warning':
        return styles.warningBadge;
      case 'error':
        return styles.errorBadge;
      case 'info':
        return styles.infoBadge;
      case 'default':
        return styles.defaultBadge;
      default:
        return styles.defaultBadge;
    }
  };

  const getTextVariantStyle = () => {
    switch (variant) {
      case 'success':
        return styles.successText;
      case 'warning':
        return styles.warningText;
      case 'error':
        return styles.errorText;
      case 'info':
        return styles.infoText;
      case 'default':
        return styles.defaultText;
      default:
        return styles.defaultText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallBadge;
      case 'medium':
        return styles.mediumBadge;
      case 'large':
        return styles.largeBadge;
      default:
        return styles.mediumBadge;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <ThemedView
      style={[styles.badge, getVariantStyle(), getSizeStyle(), style]}
    >
      <ThemedText
        style={[
          styles.text,
          getTextVariantStyle(),
          getTextSizeStyle(),
          textStyle,
        ]}
      >
        {label}
      </ThemedText>
    </ThemedView>
  );
}
