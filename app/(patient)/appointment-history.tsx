/**
 * Appointment History Screen
 * View past and upcoming appointments
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui';
import { PATIENT_ROUTES } from '@/constants/routes';
import {
  BorderRadius,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { mockAppointments } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AppointmentHistoryScreen() {
  const [selectedTab, setSelectedTab] = useState<
    'upcoming' | 'completed' | 'cancelled'
  >('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredAppointments = mockAppointments.filter((apt) => {
    if (selectedTab === 'upcoming')
      return apt.status === 'confirmed' || apt.status === 'pending';
    if (selectedTab === 'completed') return apt.status === 'completed';
    if (selectedTab === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  const renderAppointmentCard = ({
    item,
  }: {
    item: (typeof mockAppointments)[0];
  }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => router.push(PATIENT_ROUTES.APPOINTMENT_DETAILS)}
    >
      <View style={styles.appointmentHeader}>
        <Image
          source={{ uri: item.doctor.avatar }}
          style={styles.doctorImage}
        />
        <View style={styles.appointmentInfo}>
          <View style={styles.infoHeader}>
            <ThemedText style={styles.doctorName}>
              {item.doctor.name}
            </ThemedText>
            <Badge
              label={item.status}
              variant={getStatusVariant(item.status)}
              size="small"
            />
          </View>
          <ThemedText style={styles.specialty}>
            {item.doctor.specialty}
          </ThemedText>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTime}>
              <MaterialIcons
                name="calendar-today"
                size={14}
                color={NeutralColors.gray500}
              />
              <ThemedText style={styles.dateTimeText}>{item.date}</ThemedText>
            </View>
            <View style={styles.dateTime}>
              <MaterialIcons
                name="access-time"
                size={14}
                color={NeutralColors.gray500}
              />
              <ThemedText style={styles.dateTimeText}>{item.time}</ThemedText>
            </View>
          </View>
        </View>
      </View>
      {item.reason && (
        <View style={styles.reasonContainer}>
          <ThemedText style={styles.reasonLabel}>Reason: </ThemedText>
          <ThemedText style={styles.reasonText}>{item.reason}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Appointments',
          headerBackTitle: 'Back',
        }}
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <ThemedText
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Appointments List */}
      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="event-busy"
              size={64}
              color={NeutralColors.gray300}
            />
            <ThemedText style={styles.emptyText}>
              No appointments found
            </ThemedText>
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    backgroundColor: NeutralColors.gray100,
  },
  tabActive: {
    backgroundColor: '#4B7BEC',
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: NeutralColors.gray600,
  },
  tabTextActive: {
    color: NeutralColors.white,
  },
  listContent: {
    padding: Spacing.lg,
  },
  appointmentCard: {
    backgroundColor: NeutralColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: Spacing.md,
  },
  appointmentInfo: {
    flex: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    flex: 1,
  },
  specialty: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: Spacing.sm,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTimeText: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
  },
  reasonContainer: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray100,
  },
  reasonLabel: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  reasonText: {
    fontSize: FontSizes.sm,
    flex: 1,
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
