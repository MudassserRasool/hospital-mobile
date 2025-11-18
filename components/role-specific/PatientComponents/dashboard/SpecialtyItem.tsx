import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PATIENT_ROUTES } from '@/constants';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styles from './dashboard.stye';

const SpecialtyItem = ({ item }) => {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity
      style={styles.specialtyCard}
      onPress={() =>
        item.name !== 'More' && router.push(PATIENT_ROUTES.BROWSE_DOCTORS)
      }
    >
      <ThemedView style={styles.specialtyIcon}>
        <MaterialIcons name={item.icon as any} size={28} color={primaryColor} />
      </ThemedView>
      <ThemedText style={styles.specialtyName} numberOfLines={1}>
        {item.name}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default SpecialtyItem;
