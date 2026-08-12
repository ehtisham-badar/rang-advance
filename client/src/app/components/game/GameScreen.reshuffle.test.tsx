import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import type { Card, GameState, Player } from '../../context/GameContext';
import { GameScreen } from './GameScreen';

const mocks = vi.hoisted(() => ({
  useGameMock: vi.fn(),
  playCardMock: vi.fn(),
  declareOpenMock: vi.fn(),
  declareDoubleOpenMock: vi.fn(),
  requestReshuffleMock: vi.fn(),
  dismissTrickWinnerMock: vi.fn(),
  dismissRoundResultMock: vi.fn(),
  clearErrorMock: vi.fn(),
  leaveRoomMock: vi.fn(),
}));

vi.mock('../../context/GameContext', () => ({
  useGame: () => mocks.useGameMock(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const players: Player[] = [
  { id: 'p0', name: 'P1', teamIndex: 0, playerIndex: 0, connected: true },
  { id: 'p1', name: 'P2', teamIndex: 1, playerIndex: 1, connected: true },
  { id: 'p2', name: 'P3', teamIndex: 0, playerIndex: 2, connected: true },
  { id: 'p3', name: 'P4', teamIndex: 1, playerIndex: 3, connected: true },
];

const safeHand: Card[] = [
  { suit: 'H', value: 2, id: 'H-2' },
  { suit: 'D', value: 3, id: 'D-3' },
  { suit: 'S', value: 10, id: 'S-10' },
];

function buildState(overrides: Partial<GameState> = {}): GameState {
  return {
    socketConnected: true,
    myPlayerId: 'p1',
    myPlayerName: 'P2',
    roomCode: 'ROOM01',
    isHost: false,
    hostSocketId: 'p0',
    screen: 'game',
    serverPhase: 'open_window',
    players,
    myHand: safeHand,
    trickCards: players.map((player) => ({ playerId: player.id, card: null })),
    hiddenPile: [],
    currentPlayerIndex: 1,
    activeSuit: null,
    trumpSuit: null,
    trumpRevealed: false,
    revealedTrumpCard: null,
    currentTurn: 1,
    currentRound: 1,
    currentBatterIndex: 0,
    openMode: true,
    doubleOpenMode: false,
    openDeclaredByTeam: 0,
    openDeclaredByPlayerId: 'p0',
    openCountForBatter: 0,
    consecutiveBowlingWins: 0,
    tossWinnerId: null,
    roundScores: [],
    totalScores: [0, 0],
    lastError: null,
    lastErrorCode: null,
    lastTrickWinner: null,
    roundResult: null,
    pausedForPlayerId: null,
    lastTossCard: null,
    isHiddenBatter: false,
    ...overrides,
  };
}

function renderGameScreen(overrides: Partial<GameState> = {}) {
  mocks.useGameMock.mockReturnValue({
    state: buildState(overrides),
    playCard: mocks.playCardMock,
    declareOpen: mocks.declareOpenMock,
    declareDoubleOpen: mocks.declareDoubleOpenMock,
    requestReshuffle: mocks.requestReshuffleMock,
    dismissTrickWinner: mocks.dismissTrickWinnerMock,
    dismissRoundResult: mocks.dismissRoundResultMock,
    clearError: mocks.clearErrorMock,
    leaveRoom: mocks.leaveRoomMock,
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    startGame: vi.fn(),
    selectBatter: vi.fn(),
  } as any);

  return render(<GameScreen />);
}

describe('GameScreen reshuffle UI', () => {
  test.each([
    { label: 'open mode', state: { openMode: true, doubleOpenMode: false } },
    { label: 'double-open mode', state: { openMode: false, doubleOpenMode: true } },
  ])('shows the reshuffle button during $label', ({ state }) => {
    renderGameScreen(state);

    const button = screen.getByRole('button', { name: /request reshuffle/i });

    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test.each([
    { label: 'open mode', state: { openMode: true, doubleOpenMode: false } },
    { label: 'double-open mode', state: { openMode: false, doubleOpenMode: true } },
  ])('clicking reshuffle emits the request during $label', ({ state }) => {
    renderGameScreen(state);

    fireEvent.click(screen.getByRole('button', { name: /request reshuffle/i }));

    expect(mocks.requestReshuffleMock).toHaveBeenCalledTimes(1);
  });
  test('enables reshuffle for batter when opposing team declared open and batter has no face cards', () => {
    renderGameScreen({
      myPlayerId: 'p0',
      currentPlayerIndex: 0,
      currentBatterIndex: 0,
      openMode: true,
      doubleOpenMode: false,
      openDeclaredByTeam: 1,
      openDeclaredByPlayerId: 'p1',
    });

    const button = screen.getByRole('button', { name: /request reshuffle/i });

    expect(button).toBeEnabled();

    fireEvent.click(button);

    expect(mocks.requestReshuffleMock).toHaveBeenCalledTimes(1);
  });

  test('disables reshuffle for batter during double-open even if opposing team declared open', () => {
    renderGameScreen({
      myPlayerId: 'p0',
      currentPlayerIndex: 0,
      currentBatterIndex: 0,
      openMode: true,
      doubleOpenMode: true,
      openDeclaredByTeam: 1,
      openDeclaredByPlayerId: 'p1',
    });

    expect(screen.getByRole('button', { name: /request reshuffle/i })).toBeDisabled();
    expect(screen.getByText('Batter cannot reshuffle')).toBeInTheDocument();
  });
});