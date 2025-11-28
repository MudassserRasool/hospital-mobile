/**
 * File Upload Input Component
 * Handles image selection and upload to server
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui';
import {
  BrandColors,
  NeutralColors
} from '@/constants/theme';
import { useUploadFileMutation } from '@/redux/features/files/fileApi';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import styles from './FileUploadInput.style';

interface FileUploadInputProps {
  label?: string;
  value?: string; // Current image URL
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
  helperText?: string;
  error?: string;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  value,
  onUploadSuccess,
  onUploadError,
  disabled = false,
  helperText,
  error,
}) => {
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to upload images.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (disabled || isUploading) return;

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setLocalImageUri(asset.uri);
        await uploadImage(asset.uri);
      }
    } catch (error: any) {
      const errorMessage =
        error?.message || 'Failed to pick image. Please try again.';
      Alert.alert('Error', errorMessage);
      onUploadError?.(errorMessage);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      // Create FormData
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri,
        name: filename,
        type,
      } as any);

      // Upload file
      const response = await uploadFile(formData).unwrap();
      
      // Call success callback with the URL
      onUploadSuccess?.(response.data.url);
      setLocalImageUri(null); // Clear local URI after successful upload
    } catch (error: any) {
      console.log('error', error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Failed to upload image. Please try again.';
      Alert.alert('Upload Error', errorMessage);
      onUploadError?.(errorMessage);
      setLocalImageUri(null);
    }
  };

  const displayImage = localImageUri || value;

  return (
    <ThemedView style={styles.container}>
      {label && (
        <ThemedText style={styles.label}>
          {label}
          {helperText && (
            <ThemedText style={styles.helperText}> {helperText}</ThemedText>
          )}
        </ThemedText>
      )}

      <ThemedView style={styles.uploadSection}>
        {/* Image Preview */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={pickImage}
          disabled={disabled || isUploading}
          activeOpacity={0.7}
        >
          {displayImage ? (
            <Image source={{ uri: displayImage }} style={styles.image} />
          ) : (
            <ThemedView style={styles.placeholder}>
              <MaterialIcons
                name="add-photo-alternate"
                size={48}
                color={NeutralColors.gray400}
              />
              <ThemedText style={styles.placeholderText}>
                Tap to select image
              </ThemedText>
            </ThemedView>
          )}

          {/* Upload Overlay */}
          {isUploading && (
            <ThemedView style={styles.uploadOverlay}>
              <ActivityIndicator size="large" color={BrandColors.primary} />
              <ThemedText style={styles.uploadText}>Uploading...</ThemedText>
            </ThemedView>
          )}
        </TouchableOpacity>

        {/* Upload Button */}
        <Button
          title={displayImage ? 'Change Image' : 'Select Image'}
          variant="outline"
          onPress={pickImage}
          disabled={disabled || isUploading}
          leftIcon={
            <MaterialIcons
              name={displayImage ? 'edit' : 'add-photo-alternate'}
              size={20}
              color={BrandColors.primary}
            />
          }
          style={styles.uploadButton}
        />
      </ThemedView>

      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
    </ThemedView>
  );
};

export default FileUploadInput;
