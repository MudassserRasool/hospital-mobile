/**
 * Wallet Screen
 * View wallet balance and transaction history
 */

import React, { useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView, ThemedText } from '@/components';
import { Card } from '@/components/ui';
import { mockWallet } from '@/utils/mockData';
import { StyleSheet } from 'react-native';
import { Spacing, FontSizes, FontWeights, NeutralColors, BrandColors, BorderRadius, StatusColors } from '@/constants/theme';

export default function WalletScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const wallet = mockWallet;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const renderTransaction = ({ item }: { item: typeof wallet.transactions[0] }) => (
    <View style={styles.transactionCard}>
      <View style={[
        styles.transactionIcon,
        { backgroundColor: item.type === 'credit' ? '#E8F5E9' : '#FFEBEE' },
      ]}>
        <MaterialIcons
          name={item.type === 'credit' ? 'arrow-downward' : 'arrow-upward'}
          size={20}
          color={item.type === 'credit' ? StatusColors.success : StatusColors.error}
        />
      </View>
      <View style={styles.transactionInfo}>
        <ThemedText style={styles.transactionDescription}>{item.description}</ThemedText>
        <View style={styles.transactionMeta}>
          <ThemedText style={styles.transactionDate}>{formatDate(item.createdAt)}</ThemedText>
          <ThemedText style={styles.transactionTime}>{formatTime(item.createdAt)}</ThemedText>
        </View>
      </View>
      <View style={styles.transactionAmount}>
        <ThemedText style={[
          styles.amount,
          { color: item.type === 'credit' ? StatusColors.success : StatusColors.error },
        ]}>
          {item.type === 'credit' ? '+' : '-'} Rs.{item.amount}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Wallet',
          headerBackTitle: 'Back',
        }}
      />

      <FlatList
        data={wallet.transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View>
            {/* Balance Card */}
            <Card style={styles.balanceCard}>
              <View style={styles.balanceContent}>
                <View>
                  <ThemedText style={styles.balanceLabel}>Available Balance</ThemedText>
                  <ThemedText style={styles.balanceAmount}>Rs.{wallet.balance}</ThemedText>
                  <ThemedText style={styles.balanceHint}>
                    Use for appointments and get 10% back on cancellations
                  </ThemedText>
                </View>
                <View style={styles.walletIconContainer}>
                  <MaterialIcons name="account-balance-wallet" size={48} color={BrandColors.primary} />
                </View>
              </View>
            </Card>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <MaterialIcons name="arrow-downward" size={24} color={StatusColors.success} />
                <ThemedText style={styles.statValue}>
                  Rs.{wallet.transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0)}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Total Credits</ThemedText>
              </Card>
              <Card style={styles.statCard}>
                <MaterialIcons name="arrow-upward" size={24} color={StatusColors.error} />
                <ThemedText style={styles.statValue}>
                  Rs.{wallet.transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Total Debits</ThemedText>
              </Card>
            </View>

            {/* Transaction History Title */}
            <ThemedText style={styles.sectionTitle}>Transaction History</ThemedText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="receipt-long" size={64} color={NeutralColors.gray300} />
            <ThemedText style={styles.emptyText}>No transactions yet</ThemedText>
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
  listContent: {
    padding: Spacing.lg,
  },
  balanceCard: {
    marginBottom: Spacing.lg,
    backgroundColor: BrandColors.primary,
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: FontSizes['4xl'],
    fontWeight: FontWeights.bold,
    color: NeutralColors.white,
    marginBottom: 8,
  },
  balanceHint: {
    fontSize: FontSizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  walletIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: NeutralColors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  transactionDate: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray500,
  },
  transactionTime: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray500,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
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
