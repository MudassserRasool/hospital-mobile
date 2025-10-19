/**
 * Patient Dashboard
 * Main screen for patient module with modern UI
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from '@/components/ui';
import { PATIENT_ROUTES } from '@/constants/routes';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/hooks/useAuth';
import { mockDoctors, mockSpecialties } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './styles/dashboard.style';

export default function PatientDashboard() {
  const { user } = useAuth();
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const filters = ['All', 'General', 'Dentist', 'Nutritionist'];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderBanner = () => (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={340 + 16} // width + margin
        decelerationRate="fast"
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / 356);
          setActiveBannerIndex(index);
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerTitle}>Medical Checks!</Text>
              <Text style={styles.bannerDescription}>
                Check your health condition regularly to minimize the incidence
                of disease in the future.
              </Text>
            </View>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Check Now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://i.pravatar.cc/300?img=doctor' }}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.banner, { backgroundColor: '#5F27CD' }]}>
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerTitle}>Book Appointment</Text>
              <Text style={styles.bannerDescription}>
                Schedule appointments with top doctors at your convenience.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => router.push(PATIENT_ROUTES.BROWSE_DOCTORS)}
            >
              <Text style={[styles.bannerButtonText, { color: '#5F27CD' }]}>
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bannerDots}>
        {[0, 1].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeBannerIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderSpecialtyItem = ({
    item,
  }: {
    item: (typeof mockSpecialties)[0];
  }) => (
    <TouchableOpacity
      style={styles.specialtyCard}
      onPress={() =>
        item.name !== 'More' && router.push(PATIENT_ROUTES.BROWSE_DOCTORS)
      }
    >
      <View style={styles.specialtyIcon}>
        <MaterialIcons name={item.icon as any} size={28} color={primaryColor} />
      </View>
      <ThemedText style={styles.specialtyName} numberOfLines={1}>
        {item.name}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderDoctorCard = ({ item }: { item: (typeof mockDoctors)[0] }) => (
    <TouchableOpacity
      style={{ marginBottom: 16 }}
      onPress={() => router.push(PATIENT_ROUTES.BOOK_APPOINTMENT)}
    >
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Image
          source={{ uri: item.avatar }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            marginRight: 12,
          }}
        />
        <View style={{ flex: 1 }}>
          <ThemedText
            style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}
          >
            {item.name}
          </ThemedText>
          <ThemedText
            style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}
          >
            {item.specialty}
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="star" size={16} color="#FD9644" />
            <Text style={{ fontSize: 14, marginLeft: 4, color: '#6B7280' }}>
              {item.rating} ({item.reviewCount})
            </Text>
          </View>
        </View>
        <View
          style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}
        >
          <MaterialIcons name="favorite-border" size={22} color="#9CA3AF" />
          <Text
            style={{ fontSize: 16, fontWeight: '600', color: primaryColor }}
          >
            Rs.{item.consultationFee}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: user?.avatar || 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.avatar}
            />
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Good Morning 👋</Text>
              <ThemedText style={styles.userName}>
                {user?.name || 'Andrew Ainsley'}
              </ThemedText>
            </View>
          </View>
          <View style={styles.headerIcons}>
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
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search */}
        <View style={styles.searchSection}>
          <SearchBar
            placeholder="Search doctor, specialist..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            showFilter
            onFilter={() => {}}
          />
        </View>

        {/* Banner */}
        <View style={styles.bannerSection}>{renderBanner()}</View>

        {/* Doctor Specialty */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Doctor Speciality</ThemedText>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => router.push(PATIENT_ROUTES.BROWSE_DOCTORS)}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockSpecialties}
          renderItem={renderSpecialtyItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          columnWrapperStyle={styles.specialtyRow}
          scrollEnabled={false}
          style={styles.specialtyGrid}
        />

        {/* Top Doctors */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Top Doctors</ThemedText>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => router.push(PATIENT_ROUTES.BROWSE_DOCTORS)}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

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
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Doctors List */}
        <View style={styles.doctorsList}>
          {mockDoctors.map((doctor) => (
            <View key={doctor.id}>{renderDoctorCard({ item: doctor })}</View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
