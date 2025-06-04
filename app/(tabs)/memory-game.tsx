import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { EmojiCard } from '../../components/EmojiCard';
import { useMemoryGame } from '../../hooks/useMemoryGame';

export default function MemoryGame() {
  const { cards, moves, isGameComplete, initializeGame, flipCard } = useMemoryGame();
  const newGameScale = useRef(new Animated.Value(1)).current;
  const restartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardPress = (cardId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flipCard(cardId);
  };

  const handlePressIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.85,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emoji Memory Match</Text>
        <Text style={styles.moves}>Moves: {moves}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gameContainer}>
        <View style={styles.cardsGrid}>
          {cards.map((card) => (
            <EmojiCard
              key={card.id}
              emoji={card.emoji}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={() => handleCardPress(card.id)}
            />
          ))}
        </View>
      </ScrollView>

      {isGameComplete && (
        <View style={styles.completeOverlay}>
          <View style={styles.completeContent}>
            <MaterialCommunityIcons
              name="trophy"
              size={60}
              color="#FFD700"
            />
            <Text style={styles.completeText}>Congratulations!</Text>
            <Text style={styles.completeSubtext}>
              You completed the game in {moves} moves
            </Text>
            <TouchableWithoutFeedback
              onPressIn={() => handlePressIn(newGameScale)}
              onPressOut={() => handlePressOut(newGameScale)}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                initializeGame();
              }}
            >
              <Animated.View style={[styles.newGameButton, { transform: [{ scale: newGameScale }] }]}>
                <Text style={styles.newGameButtonText}>New Game</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}

      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(restartScale)}
        onPressOut={() => handlePressOut(restartScale)}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          initializeGame();
        }}
      >
        <Animated.View style={[styles.restartButton, { transform: [{ scale: restartScale }] }]}>
          <MaterialCommunityIcons name="restart" size={24} color="#fff" />
          <Text style={styles.restartButtonText}>Restart</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  moves: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  gameContainer: {
    flexGrow: 1,
    padding: 10,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  completeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  completeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  completeSubtext: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  newGameButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
}); 