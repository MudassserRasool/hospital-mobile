/**
 * Browse Doctors Screen
 * Search and filter doctors by specialty
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView, ThemedText } from '@/components';
import { SearchBar, Card, Badge } from '@/components/ui';
import { useThemeColor } from '@/hooks/use-theme-color';
import { mockDoctors, mockSpecialties } from '@/utils/mockData';
import { PATIENT_ROUTES } from '@/constants/routes';
import { Spacing, FontSizes, FontWeights, NeutralColors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export default function BrowseDoctorsScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const renderDoctorCard = ({ item }: { item: typeof mockDoctors[0] }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => router.push(PATIENT_ROUTES.BOOK_APPOINTMENT)}
    >
      <Image source={{ uri: item.avatar }} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <View style={styles.doctorHeader}>
          <ThemedText style={styles.doctorName}>{item.name}</ThemedText>
          <TouchableOpacity style={styles.favoriteButton}>
            <MaterialIcons name="favorite-border" size={20} color={NeutralColors.gray400} />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.specialty}>{item.specialty}</ThemedText>
        <View style={styles.doctorMeta}>
          <View style={styles.rating}>
            <MaterialIcons name="star" size={16} color="#FD9644" />
            <ThemedText style={styles.ratingText}>
              {item.rating} ({item.reviewCount})
            </ThemedText>
          </View>
          <Badge label={`${item.experience}y exp`} variant="info" size="small" />
        </View>
        <View style={styles.footer}>
          <ThemedText style={styles.fee}>Rs.{item.consultationFee}</ThemedText>
          <ThemedText style={styles.perConsultation}>/ consultation</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Browse Doctors',
          headerBackTitle: 'Back',
        }}
      />

      {/* Search */}
      <View style={styles.searchSection}>
        <SearchBar
          placeholder="Search doctors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          showFilter
        />
      </View>

      {/* Specialties Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.specialtyFilter}
        contentContainerStyle={styles.specialtyContent}
      >
        <TouchableOpacity
          style={[
            styles.specialtyChip,
            !selectedSpecialty && styles.specialtyChipActive,
          ]}
          onPress={() => setSelectedSpecialty(null)}
        >
          <ThemedText style={[
            styles.specialtyText,
            !selectedSpecialty && styles.specialtyTextActive,
          ]}>
            All
          </ThemedText>
        </TouchableOpacity>
        {mockSpecialties.slice(0, -1).map((specialty) => (
          <TouchableOpacity
            key={specialty.id}
            style={[
              styles.specialtyChip,
              selectedSpecialty === specialty.name && styles.specialtyChipActive,
            ]}
            onPress={() => setSelectedSpecialty(specialty.name)}
          >
            <ThemedText style={[
              styles.specialtyText,
              selectedSpecialty === specialty.name && styles.specialtyTextActive,
            ]}>
              {specialty.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Doctors List */}
      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={64} color={NeutralColors.gray300} />
            <ThemedText style={styles.emptyText}>No doctors found</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  specialtyFilter: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  specialtyContent: {
    paddingRight: Spacing.lg,
  },
  specialtyChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: NeutralColors.gray300,
    backgroundColor: NeutralColors.white,
  },
  specialtyChipActive: {
    backgroundColor: '#4B7BEC',
    borderColor: '#4B7BEC',
  },
  specialtyText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: NeutralColors.gray700,
  },
  specialtyTextActive: {
    color: NeutralColors.white,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: NeutralColors.white,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: Spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  doctorName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    flex: 1,
  },
  favoriteButton: {
    padding: Spacing.xs,
  },
  specialty: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: Spacing.sm,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  fee: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: '#4B7BEC',
  },
  perConsultation: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray500,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: NeutralColors.gray500,
    marginTop: Spacing.md,
  },
});
