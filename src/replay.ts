/**
 * Headless Guessed! Replay Engine
 *
 * Deterministically replays a Guessed! game given the words and input log.
 * Used by the contest-api to verify submitted scores.
 */

import {
  XP_PER_WORD,
  type GuessedInput,
  type GuessedReplayResult,
} from "./core";

export function replayGuessedGame({
  words,
  inputs,
  maxGuesses,
}: {
  words: string[];
  inputs: GuessedInput[];
  maxGuesses: number;
}): GuessedReplayResult {
  const roundResults: { word: string; guessed: boolean }[] = [];

  for (let round = 0; round < words.length; round++) {
    const word = words[round].toUpperCase();
    const roundInputs = inputs.filter((i) => i.round === round);

    let guessed = false;
    let guessCount = 0;
    // Track which positions have been revealed (correct letters)
    const revealedPositions = new Set<number>();

    for (const input of roundInputs) {
      if (guessCount >= maxGuesses) break;

      const guess = input.guess.toUpperCase();
      // Skip invalid-length guesses (client shouldn't send these)
      if (guess.length !== word.length) continue;

      guessCount++;

      // Check each character position
      for (let i = 0; i < word.length; i++) {
        if (guess[i] === word[i]) {
          revealedPositions.add(i);
        }
      }

      // Word is guessed when all positions are revealed
      if (revealedPositions.size === word.length) {
        guessed = true;
        break;
      }
    }

    roundResults.push({ word, guessed });
  }

  const score = roundResults.filter((r) => r.guessed).length * XP_PER_WORD;
  return { score, roundResults };
}
