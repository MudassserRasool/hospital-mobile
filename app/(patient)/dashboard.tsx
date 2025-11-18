/**
 * Patient Dashboard
 * Main screen for patient module with modern UI
 */

import Banner from '@/components/role-specific/PatientComponents/dashboard/Banner';
import DoctorCard from '@/components/role-specific/PatientComponents/dashboard/DoctorCard';
import SpecialtyItem from '@/components/role-specific/PatientComponents/dashboard/SpecialtyItem';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from '@/components/ui';
import { PATIENT_ROUTES } from '@/constants/routes';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetDoctorsQuery,
  useGetMyAppointmentsQuery,
} from '@/redux/features/patient/patientApi';
import { mockSpecialties } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { styles } from './styles/dashboard.style';

export default function PatientDashboard() {
  const { user } = useAuth();
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Fetch doctors from API
  const {
    data: doctors = [],
    isLoading: loadingDoctors,
    refetch: refetchDoctors,
  } = useGetDoctorsQuery({});

  // Fetch appointments for quick access
  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    refetch: refetchAppointments,
  } = useGetMyAppointmentsQuery();

  const filters = ['All', 'General', 'Dentist', 'Nutritionist'];

  const onRefresh = async () => {
    await Promise.all([refetchDoctors(), refetchAppointments()]);
  };

  const refreshing = loadingDoctors || loadingAppointments;

  // const renderBanner = () => (

  // );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerTop}>
          <ThemedView style={styles.userInfo}>
            <Image
              source={{
                uri: user?.avatar || 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.avatar}
            />
            <ThemedView style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>Good Morning 👋</ThemedText>
              <ThemedText style={styles.userName}>
                {user?.name || 'Andrew Ainsley'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons
                name="notifications-none"
                size={24}
                color={textColor}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons
                name="favorite-border"
                size={24}
                color={textColor}
              />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search */}
        <ThemedView style={styles.searchSection}>
          <SearchBar
            placeholder="Search doctor, specialist..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            showFilter
            onFilter={() => {}}
          />
        </ThemedView>

        {/* Banner */}

        <Banner
          activeBannerIndex={activeBannerIndex}
          setActiveBannerIndex={setActiveBannerIndex}
        />

        {/* Doctor Specialty */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Doctor Speciality</ThemedText>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => router.push(PATIENT_ROUTES.BROWSE_DOCTORS)}
          >
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <FlatList
          data={mockSpecialties}
          renderItem={({ item }) => <SpecialtyItem item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={4}
          columnWrapperStyle={styles.specialtyRow}
          scrollEnabled={false}
          style={styles.specialtyGrid}
        />

        {/* Top Doctors */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Top Doctors</ThemedText>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => router.push(PATIENT_ROUTES.BROWSE_DOCTORS)}
          >
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.doctorFilters}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Doctors List */}
        <ThemedView style={styles.doctorsList}>
          {loadingDoctors ? (
            <ThemedView style={{ padding: 32, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={primaryColor} />
              <ThemedText style={{ marginTop: 16, color: '#6B7280' }}>
                Loading doctors...
              </ThemedText>
            </ThemedView>
          ) : doctors.length === 0 ? (
            <ThemedView style={{ padding: 32, alignItems: 'center' }}>
              <MaterialIcons
                name="medical-services"
                size={64}
                color="#D1D5DB"
              />
              <ThemedText style={{ marginTop: 16, color: '#6B7280' }}>
                No doctors available
              </ThemedText>
            </ThemedView>
          ) : (
            doctors.slice(0, 5).map((doctor: any) => (
              <ThemedView key={doctor._id || doctor.id}>
                {/* {renderDoctorCard({ item: doctor })} */}
                <DoctorCard item={doctor} />
              </ThemedView>
            ))
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
