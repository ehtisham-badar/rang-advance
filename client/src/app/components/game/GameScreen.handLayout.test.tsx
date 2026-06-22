import { render, screen } from '@testing-library/react';
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

const hand: Card[] = [
  { suit: 'H', value: 2, id: 'H-2' },
  { suit: 'C', value: 3, id: 'C-3' },
  { suit: 'D', value: 4, id: 'D-4' },
  { suit: 'S', value: 5, id: 'S-5' },
  { suit: 'H', value: 6, id: 'H-6' },
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
    serverPhase: 'playing',
    players,
    myHand: hand,
    trickCards: players.map((player) => ({ playerId: player.id, card: null })),
    hiddenPile: [],
    currentPlayerIndex: 1,
    activeSuit: null,
    trumpSuit: null,
    trumpRevealed: false,
    revealedTrumpCard: null,
    currentTurn: 2,
    currentRound: 1,
    currentBatterIndex: 0,
    openMode: false,
    doubleOpenMode: false,
    openDeclaredByTeam: null,
    openDeclaredByPlayerId: null,
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

describe('GameScreen hand layout', () => {
  test('uses a mobile grid and keeps the desktop row layout classes', () => {
    renderGameScreen();

    const handScroll = screen.getByTestId('my-hand-scroll');
    const handLayout = screen.getByTestId('my-hand-layout');

    expect(handScroll.className).toContain('flex');
    expect(handScroll.className).toContain('justify-center');
    expect(handScroll.className).toContain('overflow-x-hidden');
    expect(handScroll.className).toContain('sm:overflow-x-auto');
    expect(handLayout.className).toContain('grid');
    expect(handLayout.className).toContain('grid-cols-4');
    expect(handLayout.className).toContain('sm:flex');
    expect(handLayout.className).toContain('sm:flex-nowrap');
  });
});