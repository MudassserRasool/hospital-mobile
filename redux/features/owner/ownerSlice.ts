/**
 * Owner Redux Slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StaffProfile, HospitalProfile } from '@/types';

interface OwnerState {
  selectedStaff: StaffProfile | null;
  hospitalProfile: HospitalProfile | null;
  dashboardFilters: {
    dateRange: 'today' | 'week' | 'month' | 'year';
    department?: string;
  };
}

const initialState: OwnerState = {
  selectedStaff: null,
  hospitalProfile: null,
  dashboardFilters: {
    dateRange: 'today',
  },
};

const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    setSelectedStaff: (state, action: PayloadAction<StaffProfile | null>) => {
      state.selectedStaff = action.payload;
    },
    setHospitalProfile: (state, action: PayloadAction<HospitalProfile | null>) => {
      state.hospitalProfile = action.payload;
    },
    setDashboardFilters: (
      state,
      action: PayloadAction<{
        dateRange?: 'today' | 'week' | 'month' | 'year';
        department?: string;
      }>
    ) => {
      state.dashboardFilters = { ...state.dashboardFilters, ...action.payload };
    },
    resetOwnerState: (state) => {
      state.selectedStaff = null;
      state.dashboardFilters = { dateRange: 'today' };
    },
  },
});

export const { setSelectedStaff, setHospitalProfile, setDashboardFilters, resetOwnerState } =
  ownerSlice.actions;

export default ownerSlice.reducer;

