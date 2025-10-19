/**
 * Add Staff Screen
 * Add new staff member
 */

import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function AddStaffScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !role || !department) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Staff added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1500);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Add Staff',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="Full Name"
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
          leftIcon={<MaterialIcons name="person" size={20} />}
        />
        <Input
          label="Email"
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon={<MaterialIcons name="email" size={20} />}
        />
        <Input
          label="Role"
          placeholder="e.g., doctor, nurse"
          value={role}
          onChangeText={setRole}
          leftIcon={<MaterialIcons name="work" size={20} />}
        />
        <Input
          label="Department"
          placeholder="Enter department"
          value={department}
          onChangeText={setDepartment}
          leftIcon={<MaterialIcons name="business" size={20} />}
        />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Add Staff Member"
          onPress={handleSubmit}
          loading={loading}
          fullWidth
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});
