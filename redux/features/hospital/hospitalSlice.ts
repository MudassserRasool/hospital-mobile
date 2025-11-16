/**
 * Hospital Redux Slice
 * Manages hospital state with AsyncStorage caching
 */

import { Hospital } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Application from 'expo-application';
import { hospitalApi } from './hospitalApi';

const HOSPITAL_STORAGE_KEY = '@hospital_info';

interface HospitalState {
  hospital: Hospital | null;
  isLoading: boolean;
  error: string | null;
  packageName: string | null;
}

const initialState: HospitalState = {
  hospital: null,
  isLoading: false,
  error: null,
  packageName: null,
};

/**
 * Load hospital info from AsyncStorage
 */
export const loadHospitalFromStorage = createAsyncThunk<
  { hospital: Hospital; packageName: string } | null,
  void
>('hospital/loadFromStorage', async () => {
  try {
    const storedData = await AsyncStorage.getItem(HOSPITAL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData) as {
        hospital: Hospital;
        packageName: string;
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading hospital from storage:', error);
    return null;
  }
});

/**
 * Fetch hospital by package name and save to AsyncStorage
 */
export const fetchHospitalByPackageName = createAsyncThunk<
  { hospital: Hospital; packageName: string },
  string,
  { rejectValue: string }
>(
  'hospital/fetchByPackageName',
  async (packageName: string, { rejectWithValue }) => {
    try {
      // Fetch from API
      const response =
        await hospitalApi.endpoints.getHospitalByPackageId.initiate(
          packageName
        );

      if ('data' in response && response.data) {
        console.log('response---HOSPITAL DETAILS---->', response.data);
        const hospital = response.data as Hospital;

        // Save to AsyncStorage
        await AsyncStorage.setItem(
          HOSPITAL_STORAGE_KEY,
          JSON.stringify({ hospital, packageName })
        );

        return { hospital, packageName };
      }

      throw new Error('Hospital not found');
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || error?.message || 'Failed to fetch hospital'
      );
    }
  }
);

/**
 * Initialize hospital on app load
 * Checks AsyncStorage first, then fetches from API if needed
 */
export const initializeHospital = createAsyncThunk<
  { hospital: Hospital; packageName: string },
  void,
  { rejectValue: string }
>('hospital/initialize', async (_, { dispatch, rejectWithValue }) => {
  try {
    // Get package name
    const packageName = Application.applicationId;

    if (!packageName) {
      throw new Error('Unable to get application package ID');
    }

    // First, try to load from AsyncStorage
    const storedData = await AsyncStorage.getItem(HOSPITAL_STORAGE_KEY);

    if (storedData) {
      const parsed = JSON.parse(storedData) as {
        hospital: Hospital;
        packageName: string;
      };
      // If stored package name matches current package name, use stored data
      if (parsed.packageName === packageName && parsed.hospital) {
        return { hospital: parsed.hospital, packageName };
      }
    }

    // If no stored data or package name mismatch, fetch from API
    const result = await dispatch(
      fetchHospitalByPackageName(packageName)
    ).unwrap();

    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to initialize hospital');
  }
});

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    setHospital: (state, action: PayloadAction<Hospital>) => {
      state.hospital = action.payload;
      state.error = null;
    },
    clearHospital: (state) => {
      state.hospital = null;
      state.packageName = null;
      state.error = null;
      // Clear AsyncStorage
      AsyncStorage.removeItem(HOSPITAL_STORAGE_KEY).catch(console.error);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Load from storage
    builder
      .addCase(loadHospitalFromStorage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadHospitalFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.hospital = action.payload.hospital;
          state.packageName = action.payload.packageName;
        }
      })
      .addCase(loadHospitalFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load hospital';
      });

    // Fetch by package name
    builder
      .addCase(fetchHospitalByPackageName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHospitalByPackageName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospital = action.payload.hospital;
        state.packageName = action.payload.packageName;
        state.error = null;
      })
      .addCase(fetchHospitalByPackageName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Initialize hospital
    builder
      .addCase(initializeHospital.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeHospital.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospital = action.payload.hospital;
        state.packageName = action.payload.packageName;
        state.error = null;
      })
      .addCase(initializeHospital.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setHospital, clearHospital, setError } = hospitalSlice.actions;
export default hospitalSlice.reducer;

// USEAGE
