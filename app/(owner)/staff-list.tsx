/**
 * Staff List Screen
 * View and manage all hospital staff
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, SearchBar } from '@/components/ui';
import { OWNER_ROUTES } from '@/constants/routes';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { mockAllStaff } from '@/utils/mockData';
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

export default function StaffListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const roles = ['All', 'doctor', 'nurse', 'receptionist'];

  const filteredStaff = mockAllStaff.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      !selectedRole || selectedRole === 'All' || staff.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderStaffCard = ({ item }: { item: (typeof mockAllStaff)[0] }) => (
    <TouchableOpacity
      style={styles.staffCard}
      onPress={() => router.push(OWNER_ROUTES.STAFF_DETAILS)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.staffInfo}>
        <ThemedText style={styles.staffName}>{item.name}</ThemedText>
        <ThemedText style={styles.staffRole}>
          {item.role} • {item.department}
        </ThemedText>
        <ThemedText style={styles.employeeId}>{item.employeeId}</ThemedText>
      </View>
      <Badge
        label={item.isActive ? 'Active' : 'Inactive'}
        variant={item.isActive ? 'success' : 'default'}
        size="small"
      />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Staff Management',
          headerBackTitle: 'Back',
        }}
      />

      {/* Search */}
      <View style={styles.searchSection}>
        <SearchBar
          placeholder="Search staff..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          showFilter
        />
      </View>

      {/* Role Filters */}
      <View style={styles.filtersSection}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.filterChip,
              (selectedRole === role || (role === 'All' && !selectedRole)) &&
                styles.filterChipActive,
            ]}
            onPress={() => setSelectedRole(role === 'All' ? null : role)}
          >
            <ThemedText
              style={[
                styles.filterText,
                (selectedRole === role || (role === 'All' && !selectedRole)) &&
                  styles.filterTextActive,
              ]}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Staff List */}
      <FlatList
        data={filteredStaff}
        renderItem={renderStaffCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(OWNER_ROUTES.ADD_STAFF)}
      >
        <MaterialIcons name="add" size={28} color={NeutralColors.white} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filtersSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: NeutralColors.gray300,
    backgroundColor: NeutralColors.white,
  },
  filterChipActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  filterText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: NeutralColors.gray700,
  },
  filterTextActive: {
    color: NeutralColors.white,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: 2,
  },
  staffRole: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: 2,
  },
  employeeId: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray500,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
