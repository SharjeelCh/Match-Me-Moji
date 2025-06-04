import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function StartMenu() {
  const router = useRouter();
  const titleScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start a continuous floating animation for the title
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleScale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(titleScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.85,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePlayPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/memory-game');
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.background}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </View>

      {/* Game title */}
      <Animated.View style={[styles.titleContainer, { transform: [{ scale: titleScale }] }]}>
        <MaterialCommunityIcons name="cards-playing-outline" size={80} color="#FFD700" />
        <Text style={styles.title}>Memory Match</Text>
        <Text style={styles.subtitle}>Test Your Memory!</Text>
      </Animated.View>

      {/* Play button */}
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePlayPress}
      >
        <Animated.View style={[styles.playButton, { transform: [{ scale: buttonScale }] }]}>
          <MaterialCommunityIcons name="play-circle" size={40} color="#fff" />
          <Text style={styles.playButtonText}>Play Game</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Decorative elements */}
      <View style={styles.decorations}>
        <MaterialCommunityIcons name="star" size={24} color="#FFD700" style={styles.star1} />
        <MaterialCommunityIcons name="star" size={20} color="#FFD700" style={styles.star2} />
        <MaterialCommunityIcons name="star" size={28} color="#FFD700" style={styles.star3} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: '#16213e',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: '#0f3460',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: height * 0.15,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 24,
    color: '#FFD700',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  playButton: {
    backgroundColor: '#e94560',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    marginTop: height * 0.1,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  decorations: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  star1: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.2,
    opacity: 0.8,
  },
  star2: {
    position: 'absolute',
    top: height * 0.3,
    right: width * 0.2,
    opacity: 0.6,
  },
  star3: {
    position: 'absolute',
    bottom: height * 0.3,
    left: width * 0.3,
    opacity: 0.7,
  },
}); 