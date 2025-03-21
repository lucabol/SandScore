// State Machine Definition
const stateMachine = {
    // Game rules metadata
    "__rules__": {
        "setWinConditions": {
            "pointsToWin": {
                "short": [3, 3, 3],
                "regular": [21, 21, 15]
            },
            "minPointDifference": 2,
            "setsToWin": 2
        },
        "initialState": "Serve",
        "setTransitions": {
            "firstServer": "winner", // winner of previous set serves first
            "nextState": "Serve",
            "resetScores": true,
            "matchEndCondition": {
                "setsToWin": 2
            }
        },
        "defaults": {
            "teamA": {
                "players": ["Player 1", "Player 2"],
                "isServing": true
            },
            "teamB": {
                "players": ["Player 3", "Player 4"],
                "isServing": false
            }
        },
        "actionStyles": {
            "error": "danger",
            "point": "success",
            "regular": "primary"
        }
    },
    // State definitions
    "Serve": {
        "displayName": "{servingTeam} Serve",
        "transitions": [
            { "action": "Ace", "nextState": "Point Server", "style": "point", "help": "Direct point from serve" },
            { "action": "SErr", "nextState": "Point Receiver", "style": "error", "help": "Service error" },
            { "action": "RE1", "nextState": "Point Server", "style": "error", "help": "Recept error by player 1" },
            { "action": "RE2", "nextState": "Point Server", "style": "error", "help": "Recept error by player 2" },
            { "action": "R-1", "nextState": "Reception", "style": "regular", "help": "Poor reception by player 1" },
            { "action": "R-2", "nextState": "Reception", "style": "regular", "help": "Poor reception by player 2" },
            { "action": "R=1", "nextState": "Reception", "style": "regular", "help": "Medium reception by player 1" },
            { "action": "R=2", "nextState": "Reception", "style": "regular", "help": "Medium reception by player 2" },
            { "action": "R+1", "nextState": "Reception", "style": "regular", "help": "Good reception by player 1" },
            { "action": "R+2", "nextState": "Reception", "style": "regular", "help": "Good reception by player 2" }
        ]
    },
    "Reception": {
        "displayName": "{receivingTeam} Received",
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Rec", "style": "regular", "help": "Attack by player 1" },
            { "action": "Atk2", "nextState": "Zone of Attack Rec", "style": "regular", "help": "Attack by player 2" },
            { "action": "SetE1", "nextState": "Point Server", "style": "point", "help": "Set err by player 1" },
            { "action": "SetE2", "nextState": "Point Server", "style": "point", "help": "Set err by player 2" }
        ]
    },
    "Zone of Attack Rec": {
        "displayName": "Attack Zone for {receivingTeam}",
        "transitions": [
            { "action": "V1", "nextState": "Trajectory Rec", "help": "High ball position 1" },
            { "action": "V2", "nextState": "Trajectory Rec", "help": "High ball position 2" },
            { "action": "V3", "nextState": "Trajectory Rec", "help": "High ball position 3" },
            { "action": "V4", "nextState": "Trajectory Rec", "help": "High ball position 4" },
            { "action": "V5", "nextState": "Trajectory Rec", "help": "High ball position 5" },
            { "action": "X1", "nextState": "Trajectory Rec", "help": "Low ball position 1" },
            { "action": "X2", "nextState": "Trajectory Rec", "help": "Low ball position 2" },
            { "action": "X3", "nextState": "Trajectory Rec", "help": "Low ball position 3" },
            { "action": "X4", "nextState": "Trajectory Rec", "help": "Low ball position 4" },
            { "action": "X5", "nextState": "Trajectory Rec", "help": "Low ball position 5" },
            { "action": "I1", "nextState": "Trajectory Rec", "help": "Around setter position 1" },
            { "action": "I2", "nextState": "Trajectory Rec", "help": "Around setter position 2" },
            { "action": "I3", "nextState": "Trajectory Rec", "help": "Around setter position 3" },
            { "action": "I4", "nextState": "Trajectory Rec", "help": "Around setter position 4" },
            { "action": "I5", "nextState": "Trajectory Rec", "help": "Around setter position 5" }
        ]
    },
    "Trajectory Rec": {
        "displayName": "Trajectory {receivingTeam}",
        "transitions": [
            { "action": "Diag", "nextState": "Attack by Receiving Team", "help": "Diagonal attack" },
            { "action": "DiagL", "nextState": "Attack by Receiving Team", "help": "Long diagonal attack" },
            { "action": "DiagS", "nextState": "Attack by Receiving Team", "help": "Short diagonal attack" },
            { "action": "Line", "nextState": "Attack by Receiving Team", "help": "Line attack" },
            { "action": "LineS", "nextState": "Attack by Receiving Team", "help": "Short line attack" },
            { "action": "Cut", "nextState": "Attack by Receiving Team", "help": "Cut shot" }
        ]
    },
    "Attack by Receiving Team": {
        "displayName": "Attack by {receivingTeam}",
        "transitions": [
            { "action": "Win", "nextState": "Point Receiver", "style": "point", "help": "Winning attack" },
            { "action": "Err", "nextState": "Point Server", "style": "error", "help": "Attack error" },
            { "action": "Blk1", "nextState": "Point Server", "style": "point", "help": "Blocked by player 1" },
            { "action": "Blk2", "nextState": "Point Server", "style": "point", "help": "Blocked by player 2" },
            { "action": "Def1", "nextState": "Defense By Serving Team", "style": "regular", "help": "Defended by player 1" },
            { "action": "Def2", "nextState": "Defense By Serving Team", "style": "regular", "help": "Defended by player 2" }
        ]
    },
    "Defense By Serving Team": {
        "displayName": "Defense by {servingTeam}",
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Srv", "help": "Attack by player 1" },
            { "action": "Atk2", "nextState": "Zone of Attack Srv", "help": "Attack by player 2" },
            { "action": "SetE1", "nextState": "Point Receiver", "style": "point", "help": "Set err by player 1" },
            { "action": "SetE2", "nextState": "Point Receiver", "style": "point", "help": "Set err by player 2" }
        ]
    },
    "Zone of Attack Srv": {
        "displayName": "Attack Zone for {servingTeam}",
        "transitions": [
            { "action": "V1", "nextState": "Trajectory Srv", "help": "High ball position 1" },
            { "action": "V2", "nextState": "Trajectory Srv", "help": "High ball position 2" },
            { "action": "V3", "nextState": "Trajectory Srv", "help": "High ball position 3" },
            { "action": "V4", "nextState": "Trajectory Srv", "help": "High ball position 4" },
            { "action": "V5", "nextState": "Trajectory Srv", "help": "High ball position 5" },
            { "action": "X1", "nextState": "Trajectory Srv", "help": "Low ball position 1" },
            { "action": "X2", "nextState": "Trajectory Srv", "help": "Low ball position 2" },
            { "action": "X3", "nextState": "Trajectory Srv", "help": "Low ball position 3" },
            { "action": "X4", "nextState": "Trajectory Srv", "help": "Low ball position 4" },
            { "action": "X5", "nextState": "Trajectory Srv", "help": "Low ball position 5" },
            { "action": "I1", "nextState": "Trajectory Srv", "help": "Around setter position 1" },
            { "action": "I2", "nextState": "Trajectory Srv", "help": "Around setter position 2" },
            { "action": "I3", "nextState": "Trajectory Srv", "help": "Around setter position 3" },
            { "action": "I4", "nextState": "Trajectory Srv", "help": "Around setter position 4" },
            { "action": "I5", "nextState": "Trajectory Srv", "help": "Around setter position 5" }
        ]
    },
    "Trajectory Srv": {
        "displayName": "Trajectory {servingTeam}",
        "transitions": [
            { "action": "Diag", "nextState": "Attack by Serving Team", "help": "Diagonal attack" },
            { "action": "DiagL", "nextState": "Attack by Serving Team", "help": "Long diagonal attack" },
            { "action": "DiagS", "nextState": "Attack by Serving Team", "help": "Short diagonal attack" },
            { "action": "Line", "nextState": "Attack by Serving Team", "help": "Line attack" },
            { "action": "LineS", "nextState": "Attack by Serving Team", "help": "Short line attack" },
            { "action": "Cut", "nextState": "Attack by Serving Team", "help": "Cut shot" }
        ]
    },
    "Attack by Serving Team": {
        "displayName": "Attack by {servingTeam}",
        "transitions": [
            { "action": "Win", "nextState": "Point Server", "style": "point", "help": "Winning attack" },
            { "action": "Err", "nextState": "Point Receiver", "style": "error", "help": "Attack error" },
            { "action": "Blk1", "nextState": "Point Receiver", "style": "regular", "help": "Blocked by player 1" },
            { "action": "Blk2", "nextState": "Point Receiver", "style": "regular", "help": "Blocked by player 2" },
            { "action": "Def1", "nextState": "Defense By Receiving Team", "style": "regular", "help": "Defended by player 1" },
            { "action": "Def2", "nextState": "Defense By Receiving Team", "style": "regular", "help": "Defended by player 2" }
        ]
    },
    "Defense By Receiving Team": {
        "displayName": "Defense by {receivingTeam}",
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Rec", "help": "Attack by player 1" },
            { "action": "Atk2", "nextState": "Zone of Attack Rec", "help": "Attack by player 2" },
            { "action": "SetE1", "nextState": "Point Server", "style": "point", "help": "Set err by player 1" },
            { "action": "SetE2", "nextState": "Point Server", "style": "point", "help": "Set err by player 2" }
        ]
    },
    "Point Server": {
        "displayName": "Point {servingTeam}",
        "isTerminal": true,
        "scoring": {
            "awardPoint": "server",
            "switchServer": true
        },
        "setTransition": {
            "nextServer": "winner"
        }
    },
    "Point Receiver": {
        "displayName": "Point {receivingTeam}",
        "isTerminal": true,
        "scoring": {
            "awardPoint": "receiver",
            "switchServer": true
        },
        "setTransition": {
            "nextServer": "winner"
        }
    }
};

// Add a statisticsTable to the stateMachine
stateMachine.__statisticsTable__ = [
    {
        key: 'pointsWon',
        label: 'Total Points',
        showInPlayerStats: false,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).filter(rally => rally.scoringTeam === team).length
    },
    {
        key: 'aces',
        label: 'Aces',
        showInPlayerStats: false,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action === 'Ace' && rally.scoringTeam === team).length;
        }, 0)
    },
    {
        key: 'serviceErrors',
        label: 'Service Errors',
        showInPlayerStats: false,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action === 'SErr' && rally.scoringTeam !== team).length;
        }, 0)
    },
    {
        key: 'attackPoints',
        label: 'Attack Points',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action === 'Win' && rally.scoringTeam === team).length;
        }, 0)
    },
    {
        key: 'attackErrors',
        label: 'Attack Errors',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action === 'Err' && rally.scoringTeam !== team).length;
        }, 0)
    },
    {
        key: 'totalAttacks',
        label: 'Total Attacks',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => {
            let count = 0;
            Object.values(rallyHistory).forEach(rally => {
                let isReceivingTeam = rally.actions[0].startsWith('R'); // Check if this team received first
                let isTeamsTurn = team === (isReceivingTeam ? 'b' : 'a'); // First attack is by receiving team
                
                rally.actions.forEach(action => {
                    if (action.startsWith('Atk')) {
                        if (isTeamsTurn) {
                            count++;
                        }
                        isTeamsTurn = !isTeamsTurn; // Switch turns after each attack
                    }
                });
            });
            return count;
        }
    },
    {
        key: 'attackEfficiency',
        label: 'Attack Efficiency',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => {
            const points = Object.values(rallyHistory).reduce((count, rally) => {
                return count + rally.actions.filter(action => action === 'Win' && rally.scoringTeam === team).length;
            }, 0);
            const errors = Object.values(rallyHistory).reduce((count, rally) => {
                return count + rally.actions.filter(action => action === 'Err' && rally.scoringTeam !== team).length;
            }, 0);
            
            let totalAttacks = 0;
            Object.values(rallyHistory).forEach(rally => {
                let isReceivingTeam = rally.actions[0].startsWith('R');
                let isTeamsTurn = team === (isReceivingTeam ? 'b' : 'a');
                
                rally.actions.forEach(action => {
                    if (action.startsWith('Atk')) {
                        if (isTeamsTurn) {
                            totalAttacks++;
                        }
                        isTeamsTurn = !isTeamsTurn;
                    }
                });
            });

            if (totalAttacks === 0) return 'NaN';
            let efficiency = Math.round(((points - errors) / totalAttacks) * 100);
            return efficiency; // Don't clamp to 0, allow negative values
        }
    },
    {
        key: 'blocks',
        label: 'Blocks',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action.startsWith('Blk') && rally.scoringTeam === team).length;
        }, 0)
    },
    {
        key: 'receptionErrors',
        label: 'Reception Errors',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action.startsWith('RE') && rally.scoringTeam !== team).length;
        }, 0)
    },
    {
        key: 'defenses',
        label: 'Defenses',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action.startsWith('Def') && rally.scoringTeam === team).length;
        }, 0)
    },
];

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const matchScreen = document.getElementById('match-screen');
const summaryScreen = document.getElementById('summary-screen');
const startMatchBtn = document.getElementById('start-match');
const actionButtonsEl = document.getElementById('action-buttons');
const undoBtn = document.getElementById('undo-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const restartBtn = document.getElementById('restart-btn');
const newMatchBtn = document.getElementById('new-match-btn');
const historyListEl = document.getElementById('history-list');
const legendModal = document.getElementById('legend-modal');
const infoButton = document.getElementById('info-button');
const infoButtonMatch = document.getElementById('info-button-match');
const closeModalButton = document.querySelector('.close-modal');

// Add these variables with the other DOM elements
const statisticsModal = document.getElementById('statistics-modal');
const statButton = document.getElementById('stat-button');
const statButtonMatch = document.getElementById('stat-button-match');

// Add these with the other DOM elements at the top
const set3ServerModal = document.getElementById('set3-server-modal');
const set3TeamAName = document.getElementById('set3-team-a-name');
const set3TeamBName = document.getElementById('set3-team-b-name');
const set3ServerConfirm = document.getElementById('set3-server-confirm');

// Application State
let appState = {
    teams: {
        a: {
            name: 'Team A',
            players: ['Luca', 'Matteo'],
            setScores: [0, 0, 0],
            currentScore: 0,
            isServing: true
        },
        b: {
            name: 'Team B',
            players: ['Mol', 'Sorum'],
            setScores: [0, 0, 0],
            currentScore: 0,
            isServing: false
        }
    },
    currentSet: 0,
    currentRally: 1,
    pointsPerSet: [3, 3, 3], // Default points per set (short game)
    currentState: 'Serve',
    history: [],
    // To track rally history by rally number and actions
    rallyActions: [], // Actions for current rally
    rallyHistory: {}, // Object with rally numbers as keys and action arrays as values
    firstServingTeam: 'a', // Track who served first in the match
};

// Simplified state management
const state = {
    states: [], // Stack of states
};

function saveState(newState) {
    // Push new state to stack
    state.states.push(JSON.stringify(newState));
    // Save to localStorage
    localStorage.setItem('sandscoreStates', JSON.stringify(state));
}

function loadFromStorage() {
    const savedState = localStorage.getItem('sandscoreStates');
    if (savedState) {
        const loadedState = JSON.parse(savedState);
        state.states = loadedState.states;
        if (state.states.length > 0) {
            loadState(JSON.parse(state.states[state.states.length - 1]));
            return true;
        }
    }
    return false;
}

// Save player preferences to localStorage
function savePlayerPreferences() {
    const preferences = {
        teamA: {
            player1: document.getElementById('team-a-player1').value,
            player2: document.getElementById('team-a-player2').value
        },
        teamB: {
            player1: document.getElementById('team-b-player1').value,
            player2: document.getElementById('team-b-player2').value
        },
        scoringFormat: document.querySelector('input[name="scoring"]:checked').value,
        servingTeam: document.querySelector('input[name="serving"]:checked').value
    };
    localStorage.setItem('sandScorePreferences', JSON.stringify(preferences));
}

// Load player preferences from localStorage
function loadPlayerPreferences() {
    const savedPreferences = localStorage.getItem('sandScorePreferences');
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        document.getElementById('team-a-player1').value = preferences.teamA.player1 || '';
        document.getElementById('team-a-player2').value = preferences.teamA.player2 || '';
        document.getElementById('team-b-player1').value = preferences.teamB.player1 || '';
        document.getElementById('team-b-player2').value = preferences.teamB.player2 || '';
        
        // Set scoring format
        const scoringInputs = document.querySelectorAll('input[name="scoring"]');
        scoringInputs.forEach(input => {
            if (input.value === preferences.scoringFormat) {
                input.checked = true;
            }
        });

        // Set serving team
        if (preferences.servingTeam) {
            const servingInputs = document.querySelectorAll('input[name="serving"]');
            servingInputs.forEach(input => {
                if (input.value === preferences.servingTeam) {
                    input.checked = true;
                }
            });
        }
    }
}

// Initialize application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load player preferences first
    loadPlayerPreferences();

    // Set up event listeners
    startMatchBtn.addEventListener('click', () => {
        startMatch();
        // Save preferences when starting a new match
        savePlayerPreferences();
    });

    // Add serving checkbox handlers
    const serveCheckboxes = document.querySelectorAll('input[name="serving"]');
    serveCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            // Uncheck the other checkbox
            serveCheckboxes.forEach(cb => {
                if (cb !== e.target) {
                    cb.checked = false;
                }
            });
            // Ensure at least one checkbox is always checked
            if (!e.target.checked) {
                e.target.checked = true;
            }
        });
    });

    undoBtn.addEventListener('click', undoLastAction);
    saveBtn.addEventListener('click', saveMatch);
    loadBtn.addEventListener('click', loadMatch);
    restartBtn.addEventListener('click', restartApp);
    newMatchBtn.addEventListener('click', restartApp);

    // Add file input change listener
    document.getElementById('load-file').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const parsedState = JSON.parse(e.target.result);
                    
                    // Restore the main parts of the state
                    appState.teams = parsedState.teams;
                    appState.currentSet = parsedState.currentSet;
                    appState.currentRally = parsedState.currentRally;
                    appState.pointsPerSet = parsedState.pointsPerSet;
                    appState.currentState = parsedState.currentState;
                    appState.history = parsedState.history || [];
                    appState.rallyActions = parsedState.rallyActions || [];
                    appState.rallyHistory = parsedState.rallyHistory || {};
                    appState.firstServingTeam = parsedState.firstServingTeam;
                    
                    // Save the loaded state once
                    saveStateForUndo();
                    
                    // Update UI
                    updateHistoryDisplay();
                    updateScoreboard();
                    updateActionButtons();
                    
                    // Show match screen
                    setupScreen.classList.add('hidden');
                    matchScreen.classList.remove('hidden');
                    summaryScreen.classList.add('hidden');
                    
                    // Reset file input
                    event.target.value = '';
                } catch (e) {
                    console.error('Error loading match:', e);
                    alert('Failed to load match file. The file might be corrupted or in wrong format.');
                }
            };
            reader.readAsText(file);
        }
    });

    // Try to load saved state
    if (loadFromStorage()) {
        // Update history display using the new format
        updateHistoryDisplay();
        
        // Update UI
        updateScoreboard();
        updateActionButtons();
        
        // Show match screen
        setupScreen.classList.add('hidden');
        matchScreen.classList.remove('hidden');
        summaryScreen.classList.add('hidden');
    }

    infoButton.addEventListener('click', showLegendModal);
    infoButtonMatch.addEventListener('click', showLegendModal);
    closeModalButton.addEventListener('click', hideLegendModal);
    legendModal.addEventListener('click', (e) => {
        if (e.target === legendModal) {
            hideLegendModal();
        }
    });

    // Add escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !legendModal.classList.contains('hidden')) {
            hideLegendModal();
        }
    });

    // Add these event listeners with the other initialization code
    statButton.addEventListener('click', showStatisticsModal);
    statButtonMatch.addEventListener('click', showStatisticsModal);
    statisticsModal.querySelector('.close-modal').addEventListener('click', hideStatisticsModal);
    statisticsModal.addEventListener('click', (e) => {
        if (e.target === statisticsModal) {
            hideStatisticsModal();
        }
    });

    // Add this to the existing key handler for escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideStatisticsModal();
            // ...existing escape key handlers...
        }
    });

    // Add Set 3 server modal handler
    set3ServerConfirm.addEventListener('click', () => {
        const selectedTeam = document.querySelector('input[name="set3-server"]:checked').value;
        appState.teams.a.isServing = selectedTeam === 'a';
        appState.teams.b.isServing = selectedTeam === 'b';
        appState.currentState = stateMachine.__rules__.setTransitions.nextState;
        hideSet3ServerModal();
        updateScoreboard();
        updateActionButtons();
        saveStateForUndo();
    });

    // Add escape key handler for set3 server modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!set3ServerModal.classList.contains('hidden')) {
                e.preventDefault(); // Prevent closing if this modal is open
            } else {
                hideStatisticsModal();
                hideLegendModal();
            }
        }
    });
});

// Start a new match with the entered player data
function startMatch() {
    // Clear previous state
    localStorage.removeItem('sandscoreStates');
    state.states = [];

    // Get player names from input fields
    const teamAPlayer1 = document.getElementById('team-a-player1').value || stateMachine.__rules__.defaults.teamA.players[0];
    const teamAPlayer2 = document.getElementById('team-a-player2').value || stateMachine.__rules__.defaults.teamA.players[1];
    const teamBPlayer1 = document.getElementById('team-b-player1').value || stateMachine.__rules__.defaults.teamB.players[0];
    const teamBPlayer2 = document.getElementById('team-b-player2').value || stateMachine.__rules__.defaults.teamB.players[1];

    // Set team names based on player names
    const teamAName = `${teamAPlayer1}/${teamAPlayer2}`;
    const teamBName = `${teamBPlayer1}/${teamBPlayer2}`;
    
    // Get scoring format and serving team
    const scoringFormat = document.querySelector('input[name="scoring"]:checked').value;
    const servingTeam = document.querySelector('input[name="serving"]:checked').value;
    
    // Initialize app state using state machine rules
    appState = {
        teams: {
            a: {
                name: teamAName,
                players: [teamAPlayer1, teamAPlayer2],
                setScores: [0, 0, 0],
                currentScore: 0,
                isServing: servingTeam === 'team-a'
            },
            b: {
                name: teamBName,
                players: [teamBPlayer1, teamBPlayer2],
                setScores: [0, 0, 0],
                currentScore: 0,
                isServing: servingTeam === 'team-b'
            }
        },
        currentSet: 0,
        currentRally: 1,
        pointsPerSet: stateMachine.__rules__.setWinConditions.pointsToWin[scoringFormat],
        currentState: stateMachine.__rules__.initialState,
        history: [],
        rallyActions: [],
        rallyHistory: {},
        firstServingTeam: servingTeam === 'team-a' ? 'a' : 'b'
    };

    // Update the scoreboard with initial values
    updateScoreboard();
    
    // Save initial state
    saveStateForUndo();
    
    // Clear the history display
    updateHistoryDisplay();
    
    // Show match screen
    setupScreen.classList.add('hidden');
    matchScreen.classList.remove('hidden');
    
    // Set up action buttons for initial state
    updateActionButtons();
}

// Update the scoreboard with current state
function updateScoreboard() {
    // Update team names
    document.getElementById('display-team-a-name').textContent = appState.teams.a.name;
    document.getElementById('display-team-b-name').textContent = appState.teams.b.name;
    
    // Update current scores
    document.getElementById('team-a-score').textContent = appState.teams.a.currentScore;
    document.getElementById('team-b-score').textContent = appState.teams.b.currentScore;
    
    // Update serving indicator
    document.getElementById('team-a-serving').classList.toggle('serving', appState.teams.a.isServing);
    document.getElementById('team-b-serving').classList.toggle('serving', appState.teams.b.isServing);
    
    // Update set scores
    for (let i = 0; i < 3; i++) {
        document.getElementById(`team-a-set${i+1}`).textContent = appState.teams.a.setScores[i];
        document.getElementById(`team-b-set${i+1}`).textContent = appState.teams.b.setScores[i];
    }
}

// Update action buttons based on current state
function updateActionButtons() {
    // Clear existing buttons
    actionButtonsEl.innerHTML = '';
    
    // Update the state display
    const currentStateEl = document.getElementById('current-state');
    currentStateEl.textContent = getStateDisplayName(appState.currentState);
    
    // Show action buttons for the current state
    const transitions = stateMachine[appState.currentState]?.transitions || [];
    const styles = stateMachine.__rules__.actionStyles;
    
    transitions.forEach(transition => {
        const button = document.createElement('button');
        button.textContent = transition.action;
        button.classList.add('action-button');
        if (transition.style && styles[transition.style]) {
            button.classList.add(`button-${styles[transition.style]}`);
        }
        button.addEventListener('click', () => {
            handleAction(transition.action, transition.nextState);
        });
        actionButtonsEl.appendChild(button);
    });
}

// Handle action button click
async function handleAction(action, nextState) {
    appState.rallyActions.push(action);
    appState.history.push({
        rally: appState.currentRally,
        state: appState.currentState,
        action: action,
        nextState: nextState,
        scoreA: appState.teams.a.currentScore,
        scoreB: appState.teams.b.currentScore
    });
    
    appState.currentState = nextState;
    
    // Use state machine metadata for scoring
    const stateConfig = stateMachine[nextState];
    if (stateConfig?.isTerminal) {
        const scoring = stateConfig.scoring;
        const scoringTeam = scoring.awardPoint === 'server' ? 
            (appState.teams.a.isServing ? 'a' : 'b') : 
            (appState.teams.a.isServing ? 'b' : 'a');
        
        // Award point
        appState.teams[scoringTeam].currentScore++;
        
        // Store rally history
        appState.rallyHistory[appState.currentRally] = {
            actions: [...appState.rallyActions],
            scoreA: appState.teams.a.currentScore,
            scoreB: appState.teams.b.currentScore,
            scoringTeam: scoringTeam
        };

        const oppositeTeam = scoringTeam === 'a' ? 'b' : 'a';
        const setIsOver = isSetComplete(scoringTeam, oppositeTeam);
        
        if (setIsOver) {
            handleSetCompletion(scoringTeam, oppositeTeam);
        } else {
            // Handle server changes based on state machine config
            if (scoring.switchServer) {
                appState.teams.a.isServing = scoringTeam === 'a';
                appState.teams.b.isServing = scoringTeam === 'b';
            }
            
            // Start next rally
            appState.currentRally++;
            appState.currentState = 'Serve';
            appState.rallyActions = [];
        }
    }
    
    updateScoreboard();
    updateActionButtons();
    updateHistoryDisplay();
    saveStateForUndo();
    updateCurrentPointDisplay();
}

// Helper function to check if a set is complete
function isSetComplete(scoringTeam, oppositeTeam) {
    const rules = stateMachine.__rules__.setWinConditions;
    const pointsToWin = appState.pointsPerSet[appState.currentSet];
    const hasEnoughPoints = appState.teams[scoringTeam].currentScore >= pointsToWin;
    const hasTwoPointLead = appState.teams[scoringTeam].currentScore - appState.teams[oppositeTeam].currentScore >= rules.minPointDifference;
    return hasEnoughPoints && hasTwoPointLead;
}

// Helper function to handle set completion
function handleSetCompletion(scoringTeam, oppositeTeam) {
    // Update set scores
    appState.teams[scoringTeam].setScores[appState.currentSet] = appState.teams[scoringTeam].currentScore;
    appState.teams[oppositeTeam].setScores[appState.currentSet] = appState.teams[oppositeTeam].currentScore;
    
    const rules = stateMachine.__rules__.setTransitions;
    
    // Store the final rally of the set before resetting rally counter
    if (appState.rallyActions.length > 0) {
        appState.rallyHistory[appState.currentRally] = {
            actions: [...appState.rallyActions],
            scoreA: appState.teams.a.currentScore,
            scoreB: appState.teams.b.currentScore,
            scoringTeam: scoringTeam
        };
    }
    
    // Reset current scores if configured
    if (rules.resetScores) {
        appState.teams.a.currentScore = 0;
        appState.teams.b.currentScore = 0;
    }
    
    // Move to next set
    appState.currentSet++;
    // Reset rally counter for new set
    appState.currentRally = (appState.currentSet * 1000) + 1; // Use different range for each set
    appState.rallyActions = [];
    
    // Check match end condition
    const setsWonA = appState.teams.a.setScores.filter((score, i) => 
        score > appState.teams.b.setScores[i]).length;
    const setsWonB = appState.teams.b.setScores.filter((score, i) => 
        score > appState.teams.a.setScores[i]).length;
    
    if (setsWonA >= rules.matchEndCondition.setsToWin || 
        setsWonB >= rules.matchEndCondition.setsToWin) {
        showMatchSummary();
        return;
    }
    
    if (appState.currentSet < 3) {
        // For set 2, serve goes to the opposite of the first serving team
        if (appState.currentSet === 1) { // This is the start of set 2
            const firstServingTeam = appState.firstServingTeam;
            appState.teams.a.isServing = firstServingTeam === 'b';
            appState.teams.b.isServing = firstServingTeam === 'a';
            appState.currentState = rules.nextState;
        } else if (appState.currentSet === 2) { // This is the start of set 3
            // Show dialog to choose serving team
            showSet3ServerModal();
            // The rest of the logic will be handled by the dialog confirmation
        }
    }

    updateScoreboard();
    updateActionButtons();
}

// Undo the last action
function undoLastAction() {
    if (state.states.length > 1) {
        // Remove current state
        state.states.pop();
        // Get previous state
        const previousState = JSON.parse(state.states[state.states.length - 1]);
        loadState(previousState);
        // Save updated stack to localStorage
        localStorage.setItem('sandscoreStates', JSON.stringify(state));
        updateScoreboard();
        updateActionButtons();
        updateHistoryDisplay();
        updateCurrentPointDisplay();
    }
}

// Save the match state to a file
function saveMatch() {
    try {
        // Create a streamlined version of the state to save
        const stateToSave = {
            teams: appState.teams,
            currentSet: appState.currentSet,
            currentRally: appState.currentRally,
            pointsPerSet: appState.pointsPerSet,
            currentState: appState.currentState,
            history: appState.history,
            rallyActions: appState.rallyActions,
            rallyHistory: appState.rallyHistory,
            firstServingTeam: appState.firstServingTeam
        };

        // Create file name with current date and player names
        const currentDate = new Date().toISOString().split('T')[0];
        const teamA = `${appState.teams.a.players[0]}-${appState.teams.a.players[1]}`;
        const teamB = `${appState.teams.b.players[0]}-${appState.teams.b.players[1]}`;
        const fileName = `${currentDate} ${teamA} vs ${teamB}.json`;

        // Create blob and download
        const blob = new Blob([JSON.stringify(stateToSave, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error('Error saving match:', e);
        alert('Failed to save match file.');
    }
}

// Load the match state from a file
function loadMatch() {
    const fileInput = document.getElementById('load-file');
    fileInput.click();
}

// Restart the app (go back to setup screen)
function restartApp() {
    if (confirm('Are you sure you want to start a new match? All current progress will be lost.')) {
        // Clear the saved states from localStorage
        localStorage.removeItem('sandscoreStates');
        
        // Clear the rally history display
        historyListEl.innerHTML = '';
        
        // Reset the app state
        appState = {
            teams: {
                a: {
                    name: 'Team A',
                    players: [stateMachine.__rules__.defaults.teamA.players[0], stateMachine.__rules__.defaults.teamA.players[1]],
                    setScores: [0, 0, 0],
                    currentScore: 0,
                    isServing: true
                },
                b: {
                    name: 'Team B',
                    players: [stateMachine.__rules__.defaults.teamB.players[0], stateMachine.__rules__.defaults.teamB.players[1]],
                    setScores: [0, 0, 0],
                    currentScore: 0,
                    isServing: false
                }
            },
            currentSet: 0,
            currentRally: 1,
            pointsPerSet: [3, 3, 3],
            currentState: 'Serve',
            history: [],
            rallyActions: [],
            rallyHistory: {},
            firstServingTeam: 'a'
        };

        // Reset the state stack
        state.states = [];
        
        // Load saved preferences
        loadPlayerPreferences();
        
        // Show setup screen
        setupScreen.classList.remove('hidden');
        matchScreen.classList.add('hidden');
        summaryScreen.classList.add('hidden');
    }
}

// Show match summary
function showMatchSummary() {
    // Update summary screen with final scores
    for (let i = 0; i < 3; i++) {
        document.getElementById(`summary-team-a-set${i+1}`).textContent = appState.teams.a.setScores[i];
        document.getElementById(`summary-team-b-set${i+1}`).textContent = appState.teams.b.setScores[i];
    }
    
    // Set team names
    document.getElementById('summary-team-a-name').textContent = appState.teams.a.name;
    document.getElementById('summary-team-b-name').textContent = appState.teams.b.name;
    
    // Correctly count sets won by each team
    let setsWonA = 0;
    let setsWonB = 0;
    
    for (let i = 0; i < appState.currentSet; i++) {
        if (appState.teams.a.setScores[i] > appState.teams.b.setScores[i]) {
            setsWonA++;
        } else if (appState.teams.b.setScores[i] > appState.teams.a.setScores[i]) {
            setsWonB++;
        }
    }
    
    let winner = setsWonA > setsWonB ? appState.teams.a.name : appState.teams.b.name;
    let score = `${setsWonA}-${setsWonB}`;
    
    document.getElementById('winner-announcement').textContent = `${winner} wins ${score}!`;
    
    // Show summary screen
    matchScreen.classList.add('hidden');
    summaryScreen.classList.remove('hidden');
}

// Update the history display function to use state machine styles
function updateHistoryDisplay() {
    // Clear existing history list first
    historyListEl.innerHTML = '';
    
    // Create a container for our history entries
    const historyContainer = document.createElement('div');
    historyContainer.classList.add('history-container');
    
    // Get all rally numbers from history and sort them
    const rallyNumbers = [...new Set(Object.keys(appState.rallyHistory).map(Number))];
    rallyNumbers.sort((a, b) => a - b);
    
    // Add current rally if it has actions but isn't in history yet
    if (appState.rallyActions.length > 0 && !rallyNumbers.includes(appState.currentRally)) {
        rallyNumbers.push(appState.currentRally);
    }
    
    // For each rally, create a history item showing actions and score
    rallyNumbers.forEach(rallyNum => {
        let actionsForRally = [];
        let rallyData = null;
        
        if (appState.rallyHistory[rallyNum]) {
            rallyData = appState.rallyHistory[rallyNum];
            actionsForRally = rallyData.actions;
        } else if (rallyNum === appState.currentRally) {
            actionsForRally = appState.rallyActions;
        }
        
        // Create a history item with the appropriate layout
        const rallyItem = document.createElement('div');
        rallyItem.classList.add('history-item');
        
        // Format actions with proper tag classes using state machine metadata
        const formattedActions = actionsForRally.map(action => {
            // Find the style of this action in any state's transitions
            let style = 'regular';  // default style
            for (const state in stateMachine) {
                const transitions = stateMachine[state].transitions || [];
                const transition = transitions.find(t => t.action === action);
                if (transition?.style) {
                    style = transition.style;
                    break;
                }
            }
            return `<span class="tag-${style}">${action}</span>`;
        }).join(' ');
        
        // For completed rallies, use the stored scores
        if (rallyData) {
            const scoreText = `${rallyData.scoreA}-${rallyData.scoreB}`;
            
            if (rallyData.scoringTeam === 'a') {
                rallyItem.innerHTML = `
                    <div class="history-actions home-scored">${formattedActions}</div>
                    <div class="history-score">${scoreText}</div>
                `;
            } else {
                rallyItem.innerHTML = `
                    <div class="history-score">${scoreText}</div>
                    <div class="history-actions away-scored">${formattedActions}</div>
                `;
            }
        } else if (actionsForRally.length > 0) {
            const scoreText = `${appState.teams.a.currentScore}-${appState.teams.b.currentScore}`;
            rallyItem.innerHTML = `
                <div class="history-actions current-rally">${formattedActions}</div>
                <div class="history-score current-rally">${scoreText}</div>
            `;
        }
        
        // Add event listeners to all history actions after adding to DOM
        const tooltip = document.getElementById('tooltip');
        rallyItem.querySelectorAll('.history-actions').forEach(actionDiv => {
            // Function to check if content is truncated (will show ellipsis)
            const isTextTruncated = (element) => {
                const computedStyle = window.getComputedStyle(element);
                
                // Create a temporary span to measure text width with exact same styling
                const span = document.createElement('span');
                span.style.visibility = 'hidden';
                span.style.position = 'absolute';
                span.style.fontSize = computedStyle.fontSize;
                span.style.fontFamily = computedStyle.fontFamily;
                span.style.fontWeight = computedStyle.fontWeight;
                span.style.letterSpacing = computedStyle.letterSpacing;
                span.style.textTransform = computedStyle.textTransform;
                span.style.whiteSpace = 'nowrap';
                span.style.padding = computedStyle.padding;
                span.textContent = element.textContent;
                
                document.body.appendChild(span);
                const textWidth = span.offsetWidth;
                document.body.removeChild(span);
                
                // Get the container width including any padding
                const availableWidth = element.clientWidth;
                
                return textWidth > availableWidth;
            };

            actionDiv.addEventListener('mouseenter', (e) => {
                if (isTextTruncated(actionDiv)) {
                    tooltip.textContent = actionsForRally.join(' ');
                    tooltip.classList.add('show');
                    
                    // Position the tooltip
                    const rect = actionDiv.getBoundingClientRect();
                    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                }
            });
            
            actionDiv.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
            
            actionDiv.addEventListener('click', (e) => {
                if (isTextTruncated(actionDiv)) {
                    e.stopPropagation();
                    tooltip.textContent = actionsForRally.join(' ');
                    tooltip.classList.add('show');
                    
                    // Position the tooltip
                    const rect = actionDiv.getBoundingClientRect();
                    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                    
                    // Add click outside listener
                    const closeTooltip = (event) => {
                        if (!actionDiv.contains(event.target)) {
                            tooltip.classList.remove('show');
                            document.removeEventListener('click', closeTooltip);
                        }
                    };
                    
                    // Small delay to avoid immediate closure
                    setTimeout(() => {
                        document.addEventListener('click', closeTooltip);
                    }, 0);
                }
            });
        });
        
        // Only add the rally item if we have actions
        if (actionsForRally.length > 0) {
            historyContainer.appendChild(rallyItem);
        }
    });
    
    // Add the container to the history list
    historyListEl.appendChild(historyContainer);
    
    // Scroll to the bottom to show the most recent rally
    historyListEl.scrollTop = historyListEl.scrollHeight;
    updateCurrentPointDisplay();
}

// Helper function to get state display name
function getStateDisplayName(state) {
    const stateConfig = stateMachine[state];
    if (!stateConfig?.displayName) return state;
    
    const ST = appState.teams.a.isServing ? appState.teams.a.name : appState.teams.b.name;
    const RT = appState.teams.a.isServing ? appState.teams.b.name : appState.teams.a.name;
    
    return stateConfig.displayName
        .replace('{servingTeam}', ST)
        .replace('{receivingTeam}', RT);
}

function loadState(loadedAppState) {
    Object.assign(appState, loadedAppState);
    // Note: we don't save state here anymore as it leads to duplicate states
}

function saveStateForUndo() {
    // This will also save to localStorage
    saveState(appState);
}

function saveStateToLocalStorage() {
    // This is now just an alias for saveStateForUndo
    saveStateForUndo();
}

// Add this function to generate the legend modal content dynamically
function generateLegendContent() {
    const legendContainer = document.getElementById('legend-container');
    legendContainer.innerHTML = ''; // Clear any existing content
    
    // Create category containers for different action types
    const categories = {
        'serve': { title: 'Serve Actions', actions: {} },
        'reception': { title: 'Reception Actions', actions: {} },
        'attack': { title: 'Attack Actions', actions: {} },
        'zone': { title: 'Attack Zones', actions: {} },
        'trajectory': { title: 'Attack Trajectories', actions: {} }
    };
    
    // Scan all transitions in the state machine and collect unique actions with their help text
    for (const stateName in stateMachine) {
        if (stateName.startsWith('__')) continue; // Skip metadata
        
        const state = stateMachine[stateName];
        if (!state.transitions) continue;
        
        state.transitions.forEach(transition => {
            if (!transition.help) return; // Skip actions without help text
            
            const action = transition.action;
            const help = transition.help;
            
            // Categorize actions based on patterns
            if (stateName === 'Serve') {
                categories.serve.actions[action] = help;
            } else if (action.startsWith('R') && (action.includes('+') || action.includes('-') || action.includes('='))) {
                categories.reception.actions[action] = help;
            } else if (action.match(/^(V|X|I)\d$/)) {
                categories.zone.actions[action] = help;
            } else if (action.match(/^(Diag|DiagL|DiagS|Line|LineS|Cut)$/)) {
                categories.trajectory.actions[action] = help;
            } else if (action.match(/^(Atk|Win|Err|Blk|Def)/)) {
                categories.attack.actions[action] = help;
            }
        });
    }
    
    // Create the HTML sections for each category
    for (const categoryKey in categories) {
        const category = categories[categoryKey];
        const actionEntries = Object.entries(category.actions);
        
        if (actionEntries.length === 0) continue; // Skip empty categories
        
        // Create section for this category
        const sectionEl = document.createElement('div');
        sectionEl.className = 'legend-section';
        
        // Add section title
        const titleEl = document.createElement('h4');
        titleEl.textContent = category.title;
        sectionEl.appendChild(titleEl);
        
        // Sort actions to ensure consistent display
        actionEntries.sort((a, b) => a[0].localeCompare(b[0]));
        
        // Add action descriptions
        for (const [action, help] of actionEntries) {
            const paraEl = document.createElement('p');
            paraEl.innerHTML = `<strong>${action}</strong> - ${help}`;
            sectionEl.appendChild(paraEl);
        }
        
        // Add the section to the container
        legendContainer.appendChild(sectionEl);
    }
}

function showLegendModal() {
    // Generate content before showing
    generateLegendContent();
    
    // Show the modal
    legendModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
}

function hideLegendModal() {
    legendModal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

function showStatisticsModal() {
    const stats = calculateMatchStatistics();
    const modalContent = statisticsModal.querySelector('.modal-content');
    
    // Create the HTML content for the statistics
    const html = `
        <h3>Match Statistics</h3>
        <div class="stats-container">
            <div class="stats-header">
                <div class="stats-team">${stats.teamA.name}</div>
                <div class="stats-metric">Stat</div>
                <div class="stats-team">${stats.teamB.name}</div>
            </div>
            
            <div class="stats-section">
                <h4>Team Stats</h4>
                ${stateMachine.__statisticsTable__.map(stat => `
                    <div class="stats-row">
                        <div class="stats-value">${stats.teamA[stat.key]}${stat.key === 'pointsWon' && stats.teamA.pointsPercentage ? ` (${stats.teamA.pointsPercentage}%)` : stat.key === 'attackEfficiency' ? '%' : ''}</div>
                        <div class="stats-label">${stat.label}</div>
                        <div class="stats-value">${stats.teamB[stat.key]}${stat.key === 'pointsWon' && stats.teamB.pointsPercentage ? ` (${stats.teamB.pointsPercentage}%)` : stat.key === 'attackEfficiency' ? '%' : ''}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h4>Player Stats - ${stats.teamA.name}</h4>
                <div class="stats-row">
                    <div class="stats-value">${stats.teamA.player1.name}</div>
                    <div class="stats-label">Player</div>
                    <div class="stats-value">${stats.teamA.player2.name}</div>
                </div>
                ${stateMachine.__statisticsTable__.filter(stat => stat.showInPlayerStats).map(stat => `
                    <div class="stats-row">
                        <div class="stats-value">${stats.teamA.player1[stat.key]}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                        <div class="stats-label">${stat.label}</div>
                        <div class="stats-value">${stats.teamA.player2[stat.key]}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h4>Player Stats - ${stats.teamB.name}</h4>
                <div class="stats-row">
                    <div class="stats-value">${stats.teamB.player1.name}</div>
                    <div class="stats-label">Player</div>
                    <div class="stats-value">${stats.teamB.player2.name}</div>
                </div>
                ${stateMachine.__statisticsTable__.filter(stat => stat.showInPlayerStats).map(stat => `
                    <div class="stats-row">
                        <div class="stats-value">${stats.teamB.player1[stat.key]}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                        <div class="stats-label">${stat.label}</div>
                        <div class="stats-value">${stats.teamB.player2[stat.key]}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h4>Match Info</h4>
                <div class="stats-row">
                    <div class="stats-value">${stats.totalRallies}</div>
                    <div class="stats-label">Total Rallies</div>
                    <div class="stats-value"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stats-value">${stats.longestRally.actions}</div>
                    <div class="stats-label">Longest Rally Actions</div>
                    <div class="stats-value"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stats-value stats-sequence">${stats.longestRally.sequence}</div>
                    <div class="stats-label">Longest Rally Sequence</div>
                    <div class="stats-value"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stats-value">Set ${stats.currentSet + 1}</div>
                    <div class="stats-label">Current Set</div>
                    <div class="stats-value"></div>
                </div>
            </div>
            
            <div class="stats-section">
                <h4>Set Scores</h4>
                ${stats.setScores.map(set => `
                    <div class="stats-row">
                        <div class="stats-value ${set.winner === 'a' ? 'winning-score' : ''}">${set.scoreA}</div>
                        <div class="stats-label">Set ${set.set}</div>
                        <div class="stats-value ${set.winner === 'b' ? 'winning-score' : ''}">${set.scoreB}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <button class="close-modal">×</button>
    `;
    
    modalContent.innerHTML = html;
    modalContent.querySelector('.close-modal').addEventListener('click', hideStatisticsModal);
    
    statisticsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Add this function near the other modal functions
function showSet3ServerModal() {
    set3ServerModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Set the team names in the dialog
    set3TeamAName.textContent = appState.teams.a.name;
    set3TeamBName.textContent = appState.teams.b.name;
}

function hideSet3ServerModal() {
    set3ServerModal.classList.add('hidden');
    document.body.style.overflow = '';
}

function updateCurrentPointDisplay() {
    const currentPointEl = document.getElementById('current-point');
    const currentRallyActions = appState.rallyActions.join(' ');
    
    // If we have actions in the current rally, display them
    if (currentRallyActions) {
        currentPointEl.textContent = currentRallyActions;
    } else if (appState.history.length > 0) {
        // If the rally just ended, get the complete history for that rally
        const rallyNumber = appState.history[appState.history.length - 1].rally;
        
        // Check if we have the rally in the rally history
        if (appState.rallyHistory[rallyNumber]) {
            const completeRallyActions = appState.rallyHistory[rallyNumber].actions.join(' ');
            currentPointEl.textContent = completeRallyActions;
        } else {
            // Fallback to the last action if we can't find the complete history
            const lastRally = appState.history[appState.history.length - 1];
            currentPointEl.textContent = lastRally.action;
        }
    }
}

// Calculate match statistics based on rally history
function calculateMatchStatistics() {
    const stats = {
        teamA: {
            name: appState.teams.a.name,
            player1: { 
                name: appState.teams.a.players[0],
                pointsWon: 0,
                aces: 0,
                serviceErrors: 0,
                attackPoints: 0,
                attackErrors: 0,
                totalAttacks: 0,
                blocks: 0,
                receptionErrors: 0,
                defenses: 0
            },
            player2: { 
                name: appState.teams.a.players[1],
                pointsWon: 0,
                aces: 0,
                serviceErrors: 0,
                attackPoints: 0,
                attackErrors: 0,
                totalAttacks: 0,
                blocks: 0,
                receptionErrors: 0,
                defenses: 0
            }
        },
        teamB: {
            name: appState.teams.b.name,
            player1: { 
                name: appState.teams.b.players[0],
                pointsWon: 0,
                aces: 0,
                serviceErrors: 0,
                attackPoints: 0,
                attackErrors: 0,
                totalAttacks: 0,
                blocks: 0,
                receptionErrors: 0,
                defenses: 0
            },
            player2: { 
                name: appState.teams.b.players[1],
                pointsWon: 0,
                aces: 0,
                serviceErrors: 0,
                attackPoints: 0,
                attackErrors: 0,
                totalAttacks: 0,
                blocks: 0,
                receptionErrors: 0,
                defenses: 0
            }
        },
        totalRallies: Object.keys(appState.rallyHistory).length,
        longestRally: {
            actions: 0,
            sequence: ''
        },
        setScores: []
    };

    // Calculate team stats first
    stateMachine.__statisticsTable__.forEach(stat => {
        stats.teamA[stat.key] = stat.calculate('a', appState.rallyHistory);
        stats.teamB[stat.key] = stat.calculate('b', appState.rallyHistory);
    });

    // Process rally history for player-specific stats
    Object.values(appState.rallyHistory).forEach(rally => {
        const scoringTeam = rally.scoringTeam;
        const teamKey = scoringTeam === 'a' ? 'teamA' : 'teamB';
        const opponentKey = scoringTeam === 'a' ? 'teamB' : 'teamA';

        // Track which team's turn it is to attack, starting with the receiving team
        let isReceivingTeam = rally.actions[0].startsWith('R');
        let isTeamATurn = isReceivingTeam ? false : true; // First attack is by receiving team

        rally.actions.forEach((action, index) => {
            if (action.startsWith('Atk')) {
                const playerNum = parseInt(action.charAt(action.length - 1));
                if (playerNum === 1 || playerNum === 2) {
                    // Add to total attacks for the correct team and player based on turn
                    const currentTeam = isTeamATurn ? 'teamA' : 'teamB';
                    stats[currentTeam]['player' + playerNum].totalAttacks++;
                }
                isTeamATurn = !isTeamATurn; // Switch turns after each attack
            }

            // Points won attribution
            if (index === rally.actions.length - 1) {
                const playerNum = getPlayerNumberFromLastAction(action);
                if (playerNum) {
                    stats[teamKey]['player' + playerNum].pointsWon++;
                }
            }

            // Handle specific actions
            if (action === 'Ace') {
                // Find the last serving player
                const lastServingPlayer = findLastServingPlayer(rally.actions);
                if (lastServingPlayer) {
                    stats[teamKey]['player' + lastServingPlayer].aces++;
                }
            } else if (action === 'SErr') {
                const lastServingPlayer = findLastServingPlayer(rally.actions);
                if (lastServingPlayer) {
                    stats[opponentKey]['player' + lastServingPlayer].serviceErrors++;
                }
            } else if (action.startsWith('RE')) {
                const playerNum = parseInt(action.charAt(action.length - 1));
                if (playerNum === 1 || playerNum === 2) {
                    stats[opponentKey]['player' + playerNum].receptionErrors++;
                }
            } else if (action.startsWith('Blk')) {
                const playerNum = parseInt(action.charAt(action.length - 1));
                if (playerNum === 1 || playerNum === 2) {
                    stats[teamKey]['player' + playerNum].blocks++;
                }
            } else if (action === 'Win') {
                const attackingPlayer = findLastAttackingPlayer(rally.actions);
                if (attackingPlayer) {
                    stats[teamKey]['player' + attackingPlayer].attackPoints++;
                }
            } else if (action === 'Err') {
                const attackingPlayer = findLastAttackingPlayer(rally.actions);
                if (attackingPlayer) {
                    // Attribution of error to the losing team (non-scoring team)
                    stats[opponentKey]['player' + attackingPlayer].attackErrors++;
                }
            } else if (action.startsWith('Def')) {
                const playerNum = parseInt(action.charAt(action.length - 1));
                if (playerNum === 1 || playerNum === 2) {
                    stats[teamKey]['player' + playerNum].defenses++;
                }
            }
        });
    });

    // Calculate percentages and efficiencies
    const totalPoints = stats.teamA.pointsWon + stats.teamB.pointsWon;
    
    // Team percentages
    stats.teamA.pointsPercentage = totalPoints > 0 ? Math.round((stats.teamA.pointsWon / totalPoints) * 100) : 'NaN';
    stats.teamB.pointsPercentage = totalPoints > 0 ? Math.round((stats.teamB.pointsWon / totalPoints) * 100) : 'NaN';
    
    // Player attack efficiencies
    ['player1', 'player2'].forEach(playerKey => {
        // Team A players
        const points = stats.teamA[playerKey].attackPoints || 0;
        const errors = stats.teamA[playerKey].attackErrors || 0;
        const totalAttacks = stats.teamA[playerKey].totalAttacks || 0;
        stats.teamA[playerKey].attackEfficiency = totalAttacks > 0 ? 
            Math.round(((points - errors) / totalAttacks) * 100) : 'NaN';
        
        // Team B players
        const pointsB = stats.teamB[playerKey].attackPoints || 0;
        const errorsB = stats.teamB[playerKey].attackErrors || 0;
        const totalAttacksB = stats.teamB[playerKey].totalAttacks || 0;
        stats.teamB[playerKey].attackEfficiency = totalAttacksB > 0 ? 
            Math.round(((pointsB - errorsB) / totalAttacksB) * 100) : 'NaN';
    });

    // Populate set scores
    for (let i = 0; i <= appState.currentSet; i++) {
        const scoreA = i < appState.currentSet ? appState.teams.a.setScores[i] : appState.teams.a.currentScore;
        const scoreB = i < appState.currentSet ? appState.teams.b.setScores[i] : appState.teams.b.currentScore;
        stats.setScores.push({
            set: i + 1,
            scoreA: scoreA,
            scoreB: scoreB,
            winner: scoreA > scoreB ? 'a' : scoreB > scoreA ? 'b' : null
        });
    }

    return stats;
}

// Helper function to find the last serving player from rally actions
function findLastServingPlayer(actions) {
    for (let i = actions.length - 1; i >= 0; i--) {
        if (actions[i].match(/^(Ace|SErr|R[\+\-=]\d)/)) {
            // If we find a serve-related action, get the player number from the reception
            const receptionMatch = actions[i].match(/R[\+\-=](\d)/);
            if (receptionMatch) {
                return receptionMatch[1];
            }
            // For Ace or SErr, it would be the opposite of the receiving player
            return '1'; // Default to player 1 if we can't determine
        }
    }
    return null;
}

// Helper function to find the last attacking player from rally actions
function findLastAttackingPlayer(actions) {
    for (let i = actions.length - 1; i >= 0; i--) {
        if (actions[i].startsWith('Atk')) {
            return actions[i].charAt(actions[i].length - 1);
        }
    }
    return null;
}

// Helper function to get player number from the final action of a rally
function getPlayerNumberFromLastAction(action) {
    if (action.match(/^(Win|Err|Blk|RE|Def)\d$/)) {
        return action.charAt(action.length - 1);
    }
    return null;
}

function hideStatisticsModal() {
    statisticsModal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}