/**
 * Hospital Profile Screen
 * Edit hospital information
 */

import { ThemedView } from '@/components';
import { Button, Input } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { mockHospitalProfile } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

export default function HospitalProfileScreen() {
  const [name, setName] = useState(mockHospitalProfile.name);
  const [email, setEmail] = useState(mockHospitalProfile.email);
  const [phone, setPhone] = useState(mockHospitalProfile.phone);
  const [address, setAddress] = useState(mockHospitalProfile.address);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Hospital profile updated successfully');
    }, 1500);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Hospital Profile',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="Hospital Name"
          value={name}
          onChangeText={setName}
          leftIcon={<MaterialIcons name="local-hospital" size={20} />}
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon={<MaterialIcons name="email" size={20} />}
        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon={<MaterialIcons name="phone" size={20} />}
        />
        <Input
          label="Address"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
          leftIcon={<MaterialIcons name="location-on" size={20} />}
        />
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
          fullWidth
          style={{ marginTop: Spacing.lg }}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
});
