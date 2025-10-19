/**
 * Card Component
 * Modern card container with shadow
 */

import React from 'react';
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { styles } from './Card.style';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  pressable?: boolean;
}

export function Card({
  children,
  variant = 'elevated',
  padding = 'medium',
  onPress,
  pressable = false,
  style,
  ...props
}: CardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'default':
        return styles.defaultCard;
      case 'elevated':
        return styles.elevatedCard;
      case 'outlined':
        return styles.outlinedCard;
      default:
        return styles.elevatedCard;
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return styles.noPadding;
      case 'small':
        return styles.smallPadding;
      case 'medium':
        return styles.mediumPadding;
      case 'large':
        return styles.largePadding;
      default:
        return styles.mediumPadding;
    }
  };

  const content = (
    <View style={[styles.card, getVariantStyle(), getPaddingStyle(), style]} {...props}>
      {children}
    </View>
  );

  if (onPress || pressable) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

