/**
 * Staff Redux Slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckInRecord, LeaveRequest } from '@/types';

interface StaffState {
  currentCheckIn: CheckInRecord | null;
  isCheckedIn: boolean;
  todayHours: number;
  selectedLeave: LeaveRequest | null;
}

const initialState: StaffState = {
  currentCheckIn: null,
  isCheckedIn: false,
  todayHours: 0,
  selectedLeave: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setCurrentCheckIn: (state, action: PayloadAction<CheckInRecord | null>) => {
      state.currentCheckIn = action.payload;
      state.isCheckedIn = !!action.payload && !action.payload.checkOutTime;
    },
    setCheckedIn: (state, action: PayloadAction<boolean>) => {
      state.isCheckedIn = action.payload;
    },
    setTodayHours: (state, action: PayloadAction<number>) => {
      state.todayHours = action.payload;
    },
    setSelectedLeave: (state, action: PayloadAction<LeaveRequest | null>) => {
      state.selectedLeave = action.payload;
    },
    resetStaffState: (state) => {
      state.currentCheckIn = null;
      state.isCheckedIn = false;
      state.todayHours = 0;
      state.selectedLeave = null;
    },
  },
});

export const {
  setCurrentCheckIn,
  setCheckedIn,
  setTodayHours,
  setSelectedLeave,
  resetStaffState,
} = staffSlice.actions;

export default staffSlice.reducer;

