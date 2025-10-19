/**
 * Doctor Appointments Screen
 * View doctor-wise appointments
 */

import React, { useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView, ThemedText } from '@/components';
import { Card, Badge } from '@/components/ui';
import { mockAppointments, mockDoctors } from '@/utils/mockData';
import { StyleSheet } from 'react-native';
import { Spacing, FontSizes, FontWeights, NeutralColors, BorderRadius } from '@/constants/theme';

export default function DoctorAppointmentsScreen() {
  const doctor = mockDoctors[0];
  const appointments = mockAppointments.filter(a => a.doctorId === doctor.id);

  const renderAppointment = ({ item }: { item: typeof mockAppointments[0] }) => (
    <Card style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.patientName}>Patient: {item.patientId}</ThemedText>
        <Badge label={item.status} variant="success" size="small" />
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <MaterialIcons name="calendar-today" size={16} color={NeutralColors.gray500} />
          <ThemedText style={styles.infoText}>{item.date}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={16} color={NeutralColors.gray500} />
          <ThemedText style={styles.infoText}>{item.time}</ThemedText>
        </View>
      </View>
      {item.reason && <ThemedText style={styles.reason}>Reason: {item.reason}</ThemedText>}
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Doctor Appointments', headerBackTitle: 'Back' }} />
      
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Card style={styles.doctorCard}>
            <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
            <View style={styles.doctorInfo}>
              <ThemedText style={styles.doctorName}>{doctor.name}</ThemedText>
              <ThemedText style={styles.specialty}>{doctor.specialty}</ThemedText>
            </View>
          </Card>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: Spacing.lg },
  doctorCard: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: Spacing.md },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
  specialty: { fontSize: FontSizes.sm, color: NeutralColors.gray600 },
  appointmentCard: { marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  patientName: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  cardInfo: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: FontSizes.sm, color: NeutralColors.gray600 },
  reason: { fontSize: FontSizes.sm, color: NeutralColors.gray600 },
});
