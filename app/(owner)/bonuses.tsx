/**
 * Bonuses Screen
 * Manage staff bonuses
 */

// import { ThemedText, ThemedView from '@/components/themed-text';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, Input } from '@/components/ui';
import {
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { mockBonuses } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

export default function BonusesScreen() {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGrantBonus = () => {
    if (!amount || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Bonus granted successfully');
      setAmount('');
      setReason('');
    }, 1500);
  };

  const renderBonus = ({ item }: { item: (typeof mockBonuses)[0] }) => (
    <Card style={styles.bonusCard}>
      <View style={styles.bonusHeader}>
        <ThemedText style={styles.staffName}>{item.staff?.name}</ThemedText>
        <ThemedText style={styles.amount}>Rs.{item.amount}</ThemedText>
      </View>
      <ThemedText style={styles.reason}>{item.reason}</ThemedText>
      <ThemedText style={styles.date}>{item.date}</ThemedText>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Staff Bonuses',
          headerBackTitle: 'Back',
        }}
      />

      <FlatList
        data={mockBonuses}
        renderItem={renderBonus}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Card style={styles.formCard}>
            <ThemedText style={styles.formTitle}>Grant Bonus</ThemedText>
            <Input
              label="Amount (Rs.)"
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              leftIcon={<MaterialIcons name="attach-money" size={20} />}
            />
            <Input
              label="Reason"
              placeholder="Enter reason"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={2}
              leftIcon={<MaterialIcons name="description" size={20} />}
            />
            <Button
              title="Grant Bonus"
              onPress={handleGrantBonus}
              loading={loading}
              fullWidth
            />
          </Card>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: Spacing.lg },
  formCard: { marginBottom: Spacing.lg },
  formTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  bonusCard: { marginBottom: Spacing.md },
  bonusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  staffName: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  amount: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: BrandColors.primary,
  },
  reason: { fontSize: FontSizes.sm, marginBottom: Spacing.xs },
  date: { fontSize: FontSizes.xs, color: NeutralColors.gray500 },
});
