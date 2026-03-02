/**
 * Shared game constants and types.
 *
 * Single source of truth for values that must match between
 * the client game (index.ts HTML) and the server replay engine.
 */

export const XP_PER_WORD = 100;

export type GuessedInput = { round: number; guess: string };

export type GuessedGameConfig = {
  words: string[];
  maxGuesses: number;
  timeLimit: number;
};

export type GuessedReplayResult = {
  score: number;
  roundResults: { word: string; guessed: boolean }[];
};
