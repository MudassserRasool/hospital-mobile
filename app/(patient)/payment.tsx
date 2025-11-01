/**
 * Payment Screen
 * Process payment for appointment
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card } from '@/components/ui';
import { PATIENT_ROUTES } from '@/constants/routes';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
  StatusColors,
} from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useGetMyWalletBalanceQuery, useProcessPaymentMutation } from '@/redux/features/patient/patientApi';
import { useAuth } from '@/hooks/useAuth';

export default function PaymentScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const { appointmentId, amount } = useLocalSearchParams();
  const { user } = useAuth();
  
  const consultationFee = parseInt(amount as string) || 1500;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('easypaisa');
  const [useWallet, setUseWallet] = useState(false);

  // Fetch wallet balance
  const { data: walletData, isLoading: loadingWallet } = useGetMyWalletBalanceQuery();
  const [processPayment, { isLoading: processing }] = useProcessPaymentMutation();

  const walletBalance = walletData?.balance || 0;
  const walletAmount = useWallet ? Math.min(walletBalance, consultationFee) : 0;
  const totalPayable = consultationFee - walletAmount;

  const paymentMethods = [
    { id: 'easypaisa', name: 'EasyPaisa', icon: 'account-balance-wallet' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 'cash', name: 'Pay at Hospital', icon: 'payments' },
  ];

  const handlePayment = async () => {
    try {
      const result = await processPayment({
        appointmentId: appointmentId as string,
        patientId: user?.patientId || '',
        amount: consultationFee,
        walletAmountToUse: walletAmount,
      }).unwrap();

      if (result.requiresEasyPaisaAction && result.easyPaisaCheckoutUrl) {
        // Open EasyPaisa checkout
        Alert.alert(
          'Complete Payment',
          'You will be redirected to EasyPaisa to complete payment',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Continue',
              onPress: () => {
                Linking.openURL(result.easyPaisaCheckoutUrl);
                // Navigate to success screen
                setTimeout(() => {
                  router.replace(PATIENT_ROUTES.APPOINTMENT_HISTORY);
                }, 1000);
              },
            },
          ]
        );
      } else {
        // Payment completed (wallet only)
        Alert.alert(
          'Success!',
          'Your appointment has been booked and paid successfully.',
          [
            {
              text: 'View Appointments',
              onPress: () => router.replace(PATIENT_ROUTES.APPOINTMENT_HISTORY),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.data?.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Payment',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Wallet Card */}
        <Card style={styles.walletCard}>
          <ThemedView style={styles.walletHeader}>
            <ThemedView>
              <ThemedText style={styles.walletLabel}>Wallet Balance</ThemedText>
              {loadingWallet ? (
                <ActivityIndicator size="small" color={BrandColors.primary} />
              ) : (
                <ThemedText style={styles.walletBalance}>
                  Rs.{walletBalance}
                </ThemedText>
              )}
            </ThemedView>
            <TouchableOpacity
              style={[styles.checkbox, useWallet && styles.checkboxActive]}
              onPress={() => setUseWallet(!useWallet)}
              disabled={walletBalance === 0}
            >
              {useWallet && (
                <MaterialIcons
                  name="check"
                  size={20}
                  color={NeutralColors.white}
                />
              )}
            </TouchableOpacity>
          </ThemedView>
          {useWallet && (
            <ThemedText style={styles.walletInfo}>
              Rs.{walletAmount} will be used from your wallet
            </ThemedText>
          )}
        </Card>

        {/* Payment Methods */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method.id &&
                  styles.paymentMethodActive,
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <ThemedView style={styles.paymentMethodContent}>
                <ThemedView style={styles.paymentMethodIcon}>
                  <MaterialIcons
                    name={method.icon as any}
                    size={24}
                    color={
                      selectedPaymentMethod === method.id
                        ? primaryColor
                        : NeutralColors.gray600
                    }
                  />
                </ThemedView>
                <ThemedText style={styles.paymentMethodName}>
                  {method.name}
                </ThemedText>
              </ThemedView>
              <ThemedView
                style={[
                  styles.radio,
                  selectedPaymentMethod === method.id && styles.radioActive,
                ]}
              >
                {selectedPaymentMethod === method.id && (
                  <ThemedView style={styles.radioDot} />
                )}
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Payment Summary */}
        <Card style={styles.summaryCard}>
          <ThemedText style={styles.summaryTitle}>Payment Summary</ThemedText>
          <ThemedView style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>
              Consultation Fee
            </ThemedText>
            <ThemedText style={styles.summaryValue}>
              Rs.{consultationFee}
            </ThemedText>
          </ThemedView>
          {useWallet && (
            <ThemedView style={styles.summaryRow}>
              <ThemedText
                style={[styles.summaryLabel, { color: StatusColors.success }]}
              >
                Wallet Amount
              </ThemedText>
              <ThemedText
                style={[styles.summaryValue, { color: StatusColors.success }]}
              >
                - Rs.{walletAmount}
              </ThemedText>
            </ThemedView>
          )}
          <ThemedView style={[styles.summaryRow, styles.summaryTotal]}>
            <ThemedText style={styles.totalLabel}>Total Payable</ThemedText>
            <ThemedText style={styles.totalAmount}>
              Rs.{totalPayable}
            </ThemedText>
          </ThemedView>
        </Card>
      </ScrollView>

      {/* Bottom Button */}
      <ThemedView style={styles.bottomBar}>
        <ThemedView style={styles.bottomInfo}>
          <ThemedText style={styles.bottomLabel}>Total Payable</ThemedText>
          <ThemedText style={styles.bottomAmount}>Rs.{totalPayable}</ThemedText>
        </ThemedView>
        <Button
          title={processing ? "Processing..." : "Confirm & Pay"}
          onPress={handlePayment}
          loading={processing}
          fullWidth
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 150,
  },
  walletCard: {
    marginBottom: Spacing.lg,
    backgroundColor: '#EFF3FF',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: BrandColors.primary,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NeutralColors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  walletInfo: {
    fontSize: FontSizes.sm,
    color: StatusColors.success,
    marginTop: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: NeutralColors.white,
    borderWidth: 2,
    borderColor: NeutralColors.gray200,
    marginBottom: Spacing.md,
  },
  paymentMethodActive: {
    borderColor: BrandColors.primary,
    backgroundColor: '#EFF3FF',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NeutralColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  paymentMethodName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: NeutralColors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: BrandColors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BrandColors.primary,
  },
  summaryCard: {
    marginTop: Spacing.md,
  },
  summaryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSizes.md,
    color: NeutralColors.gray600,
  },
  summaryValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  summaryTotal: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray200,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  totalAmount: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: BrandColors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: NeutralColors.white,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray200,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  bottomLabel: {
    fontSize: FontSizes.md,
    color: NeutralColors.gray600,
  },
  bottomAmount: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: BrandColors.primary,
  },
});
