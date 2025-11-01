/**
 * Browse Doctors Screen
 * Search and filter doctors by specialty
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, SearchBar } from '@/components/ui';
import { PATIENT_ROUTES } from '@/constants/routes';
import {
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { mockSpecialties } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useGetDoctorsQuery } from '@/redux/features/patient/patientApi';

export default function BrowseDoctorsScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // Fetch doctors with filters
  const { data: doctors = [], isLoading, refetch } = useGetDoctorsQuery({
    search: searchQuery,
    specialty: selectedSpecialty || undefined,
  });

  const onRefresh = async () => {
    await refetch();
  };

  const filteredDoctors = doctors;

  const renderDoctorCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => router.push(`${PATIENT_ROUTES.BOOK_APPOINTMENT}?doctorId=${item._id || item.id}`)}
    >
      <Image 
        source={{ uri: item.profilePicture || `https://i.pravatar.cc/150?u=${item._id}` }} 
        style={styles.doctorImage} 
      />
      <ThemedView style={styles.doctorInfo}>
        <ThemedView style={styles.doctorHeader}>
          <ThemedText style={styles.doctorName}>
            Dr. {item.firstName} {item.lastName}
          </ThemedText>
          <TouchableOpacity style={styles.favoriteButton}>
            <MaterialIcons
              name="favorite-border"
              size={20}
              color={NeutralColors.gray400}
            />
          </TouchableOpacity>
        </ThemedView>
        <ThemedText style={styles.specialty}>
          {item.specialty || item.department?.name || 'General Physician'}
        </ThemedText>
        <ThemedView style={styles.doctorMeta}>
          <ThemedView style={styles.rating}>
            <MaterialIcons name="star" size={16} color="#FD9644" />
            <ThemedText style={styles.ratingText}>
              {item.rating || '4.8'} ({item.reviewCount || '100'})
            </ThemedText>
          </ThemedView>
          <Badge
            label={`${item.experience || '5'}y exp`}
            variant="info"
            size="small"
          />
        </ThemedView>
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.fee}>Rs.{item.consultationFee || '1500'}</ThemedText>
          <ThemedText style={styles.perConsultation}>/ consultation</ThemedText>
        </ThemedView>
      </ThemedView>
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
      <ThemedView style={styles.searchSection}>
        <SearchBar
          placeholder="Search doctors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          showFilter
        />
      </ThemedView>

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
          <ThemedText
            style={[
              styles.specialtyText,
              !selectedSpecialty && styles.specialtyTextActive,
            ]}
          >
            All
          </ThemedText>
        </TouchableOpacity>
        {mockSpecialties.slice(0, -1).map((specialty) => (
          <TouchableOpacity
            key={specialty.id}
            style={[
              styles.specialtyChip,
              selectedSpecialty === specialty.name &&
                styles.specialtyChipActive,
            ]}
            onPress={() => setSelectedSpecialty(specialty.name)}
          >
            <ThemedText
              style={[
                styles.specialtyText,
                selectedSpecialty === specialty.name &&
                  styles.specialtyTextActive,
              ]}
            >
              {specialty.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Doctors List */}
      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          isLoading ? (
            <ThemedView style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={primaryColor} />
              <ThemedText style={styles.emptyText}>Loading doctors...</ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <MaterialIcons
                name="search-off"
                size={64}
                color={NeutralColors.gray300}
              />
              <ThemedText style={styles.emptyText}>No doctors found</ThemedText>
            </ThemedView>
          )
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
