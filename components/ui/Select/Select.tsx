/**
 * Select Component
 * Dropdown select input for mobile
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  BrandColors,
  FontSizes,
  NeutralColors,
  Spacing,
  StatusColors,
} from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export function Select({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
}: SelectProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      {label && (
        <ThemedText style={styles.label}>
          {label}
          {helperText && (
            <ThemedText style={styles.helperText}> {helperText}</ThemedText>
          )}
        </ThemedText>
      )}

      <TouchableOpacity
        style={[
          styles.selectContainer,
          { borderColor: error ? StatusColors.error : borderColor },
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <ThemedText
          style={[
            styles.selectText,
            { color: selectedOption ? textColor : NeutralColors.gray500 },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </ThemedText>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={NeutralColors.gray400}
        />
      </TouchableOpacity>

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      {helperText && !error && (
        <ThemedText style={styles.helperText}>{helperText}</ThemedText>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {label || 'Select Option'}
              </ThemedText>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={textColor}
                />
              </TouchableOpacity>
            </ThemedView>

            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    value === option.value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      value === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                  {value === option.value && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={BrandColors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 48,
  },
  selectText: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  disabled: {
    opacity: 0.5,
  },
  errorText: {
    color: StatusColors.error,
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray500,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: NeutralColors.gray200,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: NeutralColors.gray100,
  },
  selectedOption: {
    backgroundColor: '#EFF3FF',
  },
  optionText: {
    fontSize: FontSizes.md,
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: BrandColors.primary,
  },
});

