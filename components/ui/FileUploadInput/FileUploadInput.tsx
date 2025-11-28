import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import styles from './FileUploadInput.style';

const FileUploadInput = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>FileUploadInput</ThemedText>
    </ThemedView>
  )
}
export default FileUploadInput
