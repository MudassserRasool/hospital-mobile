import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PATIENT_ROUTES } from '@/constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styles from './dashboard.stye';

const Banner = ({ setActiveBannerIndex, activeBannerIndex }) => {
  return (
    <ThemedView style={styles.bannerSection}>
      <ThemedView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={340 + 16} // width + margin
          decelerationRate="fast"
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / 356);
            setActiveBannerIndex(index);
          }}
          scrollEventThrottle={16}
        >
          <ThemedView style={styles.banner}>
            <ThemedView style={styles.bannerContent}>
              <ThemedView>
                <ThemedText style={styles.bannerTitle}>
                  Medical Checks!
                </ThemedText>
                <ThemedText style={styles.bannerDescription}>
                  Check your health condition regularly to minimize the
                  incidence of disease in the future.
                </ThemedText>
              </ThemedView>
              <TouchableOpacity style={styles.bannerButton}>
                <ThemedText style={styles.bannerButtonText}>
                  Check Now
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?img=doctor' }}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </ThemedView>

          <ThemedView style={[styles.banner, { backgroundColor: '#5F27CD' }]}>
            <ThemedView style={styles.bannerContent}>
              <ThemedView>
                <ThemedText style={styles.bannerTitle}>
                  Book Appointment
                </ThemedText>
                <ThemedText style={styles.bannerDescription}>
                  Schedule appointments with top doctors at your convenience.
                </ThemedText>
              </ThemedView>
              <TouchableOpacity
                style={styles.bannerButton}
                onPress={() => router.push(PATIENT_ROUTES.BROWSE_DOCTORS)}
              >
                <ThemedText
                  style={[styles.bannerButtonText, { color: '#5F27CD' }]}
                >
                  Book Now
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>

        <ThemedView style={styles.bannerDots}>
          {[0, 1].map((index) => (
            <ThemedView
              key={index}
              style={[
                styles.dot,
                activeBannerIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default Banner;
