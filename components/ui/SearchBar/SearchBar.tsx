/**
 * SearchBar Component
 * Search input with icon and clear button
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './SearchBar.style';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface SearchBarProps extends TextInputProps {
  onClear?: () => void;
  onFilter?: () => void;
  showFilter?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  onFilter,
  showFilter = false,
  placeholder = 'Search',
  ...props
}: SearchBarProps) {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={iconColor} style={styles.searchIcon} />
        
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
        
        {value && value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <MaterialIcons name="close" size={18} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {showFilter && (
        <TouchableOpacity onPress={onFilter} style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={20} color={primaryColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

