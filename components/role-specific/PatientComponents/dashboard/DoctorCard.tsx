import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PATIENT_ROUTES } from '@/constants';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';

const DoctorCard = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity
      style={{ marginBottom: 16 }}
      onPress={() =>
        router.push(
          `${PATIENT_ROUTES.BOOK_APPOINTMENT}?doctorId=${item._id || item.id}`
        )
      }
    >
      <ThemedView
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
          source={{
            uri:
              item.profilePicture || `https://i.pravatar.cc/150?u=${item._id}`,
          }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            marginRight: 12,
          }}
        />
        <ThemedView style={{ flex: 1 }}>
          <ThemedText
            style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}
          >
            Dr. {item.firstName} {item.lastName}
          </ThemedText>
          <ThemedText
            style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}
          >
            {item.specialty || item.department?.name || 'General Physician'}
          </ThemedText>
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="star" size={16} color="#FD9644" />
            <ThemedText
              style={{ fontSize: 14, marginLeft: 4, color: '#6B7280' }}
            >
              {item.rating || '4.8'} ({item.reviewCount || '100'})
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView
          style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}
        >
          <MaterialIcons name="favorite-border" size={22} color="#9CA3AF" />
          <ThemedText
            style={{ fontSize: 16, fontWeight: '600', color: primaryColor }}
          >
            Rs.{item.consultationFee || '1500'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default DoctorCard;
