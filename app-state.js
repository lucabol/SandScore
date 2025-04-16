let appState = {
    teams: {
        a: {
            name: 'Team A',
            players: ['Player 1', 'Player 2'], // Default if not overridden
            setScores: [0, 0, 0],
            currentScore: 0,
            isServing: true
        },
        b: {
            name: 'Team B',
            players: ['Player 3', 'Player 4'], // Default if not overridden
            setScores: [0, 0, 0],
            currentScore: 0,
            isServing: false
        }
    },
    currentSet: 0,
    currentRally: 1,
    pointsPerSet: [3, 3, 3], // Default points per set (short game) - will be overridden
    currentState: 'Serve', // Default initial state - will be overridden
    history: [], // Log of individual state transitions
    rallyActions: [], // Actions recorded within the current rally
    rallyHistory: {}, // Stores complete action list & outcome per rally number { rallyNum: { actions: [], scoreA: X, scoreB: Y, scoringTeam: 'a'|'b', servingTeam: 'a'|'b' } }
    firstServingTeam: 'a', // Track who served first in the match
    gameMode: 'advanced' // Default mode, can be 'beginner'
};

// Simplified state management for undo/redo
const state = {
    states: [], // Stack of stringified appState snapshots
};

// Set default active state machine (can be changed in main.js)
let stateMachine = advancedStateMachine;