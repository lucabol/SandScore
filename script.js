// State Machine Definition
const stateMachine = {
    "Serve": {
        "transitions": [
            { "action": "Ace", "nextState": "Point Server" },
            { "action": "Err", "nextState": "Point Receiver" },
            { "action": "RE1", "nextState": "Point Server" },
            { "action": "RE2", "nextState": "Point Server" },
            { "action": "R-1", "nextState": "Reception" },
            { "action": "R-2", "nextState": "Reception" },
            { "action": "R=1", "nextState": "Reception" },
            { "action": "R=2", "nextState": "Reception" },
            { "action": "R+1", "nextState": "Reception" },
            { "action": "R+2", "nextState": "Reception" }
        ]
    },
    "Reception": {
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Rec" },
            { "action": "Atk2", "nextState": "Zone of Attack Rec" }
        ]
    },
    "Zone of Attack Rec": {
        "transitions": [
            { "action": "V1", "nextState": "Trajectory Rec" },
            { "action": "V2", "nextState": "Trajectory Rec" },
            { "action": "V3", "nextState": "Trajectory Rec" },
            { "action": "V4", "nextState": "Trajectory Rec" },
            { "action": "V5", "nextState": "Trajectory Rec" },
            { "action": "X1", "nextState": "Trajectory Rec" },
            { "action": "X2", "nextState": "Trajectory Rec" },
            { "action": "X3", "nextState": "Trajectory Rec" },
            { "action": "X4", "nextState": "Trajectory Rec" },
            { "action": "X5", "nextState": "Trajectory Rec" },
            { "action": "I1", "nextState": "Trajectory Rec" },
            { "action": "I2", "nextState": "Trajectory Rec" },
            { "action": "I3", "nextState": "Trajectory Rec" },
            { "action": "I4", "nextState": "Trajectory Rec" },
            { "action": "I5", "nextState": "Trajectory Rec" }
        ]
    },
    "Trajectory Rec": {
        "transitions": [
            { "action": "Diag", "nextState": "Attack by Receiving Team" },
            { "action": "DiagL", "nextState": "Attack by Receiving Team" },
            { "action": "DiagS", "nextState": "Attack by Receiving Team" },
            { "action": "Line", "nextState": "Attack by Receiving Team" },
            { "action": "LineS", "nextState": "Attack by Receiving Team" },
            { "action": "Cut", "nextState": "Attack by Receiving Team" }
        ]
    },
    "Attack by Receiving Team": {
        "transitions": [
            { "action": "Win", "nextState": "Point Receiver" },
            { "action": "Err", "nextState": "Point Server" },
            { "action": "Blk1", "nextState": "Point Server" },
            { "action": "Blk2", "nextState": "Point Server" },
            { "action": "Def1", "nextState": "Defense By Serving Team" },
            { "action": "Def2", "nextState": "Defense By Serving Team" }
        ]
    },
    "Defense By Serving Team": {
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Srv" },
            { "action": "Atk2", "nextState": "Zone of Attack Srv" }
        ]
    },
    "Zone of Attack Srv": {
        "transitions": [
            { "action": "V1", "nextState": "Trajectory Srv" },
            { "action": "V2", "nextState": "Trajectory Srv" },
            { "action": "V3", "nextState": "Trajectory Srv" },
            { "action": "V4", "nextState": "Trajectory Srv" },
            { "action": "V5", "nextState": "Trajectory Srv" },
            { "action": "X1", "nextState": "Trajectory Srv" },
            { "action": "X2", "nextState": "Trajectory Srv" },
            { "action": "X3", "nextState": "Trajectory Srv" },
            { "action": "X4", "nextState": "Trajectory Srv" },
            { "action": "X5", "nextState": "Trajectory Srv" },
            { "action": "I1", "nextState": "Trajectory Srv" },
            { "action": "I2", "nextState": "Trajectory Srv" },
            { "action": "I3", "nextState": "Trajectory Srv" },
            { "action": "I4", "nextState": "Trajectory Srv" },
            { "action": "I5", "nextState": "Trajectory Srv" }
        ]
    },
    "Trajectory Srv": {
        "transitions": [
            { "action": "Diag", "nextState": "Attack by Serving Team" },
            { "action": "DiagL", "nextState": "Attack by Serving Team" },
            { "action": "DiagS", "nextState": "Attack by Serving Team" },
            { "action": "Line", "nextState": "Attack by Serving Team" },
            { "action": "LineS", "nextState": "Attack by Serving Team" },
            { "action": "Cut", "nextState": "Attack by Serving Team" }
        ]
    },
    "Attack by Serving Team": {
        "transitions": [
            { "action": "Win", "nextState": "Point Server" },
            { "action": "Err", "nextState": "Point Receiver" },
            { "action": "Blk1", "nextState": "Point Receiver" },
            { "action": "Blk2", "nextState": "Point Receiver" },
            { "action": "Def1", "nextState": "Defense By Receiving Team" },
            { "action": "Def2", "nextState": "Defense By Receiving Team" }
        ]
    },
    "Defense By Receiving Team": {
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Rec" },
            { "action": "Atk2", "nextState": "Zone of Attack Rec" }
        ]
    }
};

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

// Application State
let appState = {
    teams: {
        a: {
            name: 'Team A',
            players: ['Player 1', 'Player 2'],
            setScores: [0, 0, 0],
            currentScore: 0,
            isServing: true
        },
        b: {
            name: 'Team B',
            players: ['Player 1', 'Player 2'],
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
});

// Start a new match with the entered player data
function startMatch() {
    // Clear previous state
    localStorage.removeItem('sandscoreStates');
    state.states = [];

    // Get player names from input fields
    const teamAPlayer1 = document.getElementById('team-a-player1').value || 'Player 1';
    const teamAPlayer2 = document.getElementById('team-a-player2').value || 'Player 2';
    const teamBPlayer1 = document.getElementById('team-b-player1').value || 'Player 1';
    const teamBPlayer2 = document.getElementById('team-b-player2').value || 'Player 2';

    // Set team names based on player names
    const teamAName = `${teamAPlayer1}/${teamAPlayer2}`;
    const teamBName = `${teamBPlayer1}/${teamBPlayer2}`;
    
    // Get scoring format and serving team
    const scoringFormat = document.querySelector('input[name="scoring"]:checked').value;
    const servingTeam = document.querySelector('input[name="serving"]:checked').value;
    
    // Initialize app state
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
        pointsPerSet: scoringFormat === 'short' ? [3, 3, 3] : [21, 21, 15],
        currentState: 'Serve',
        history: [], // Reset history
        rallyActions: [], // Reset actions for current rally
        rallyHistory: {}, // Reset rally history
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
    
    transitions.forEach(transition => {
        const button = document.createElement('button');
        button.textContent = transition.action;
        button.classList.add('action-button');
        button.addEventListener('click', () => {
            handleAction(transition.action, transition.nextState);
        });
        actionButtonsEl.appendChild(button);
    });
}

// Handle action button click
async function handleAction(action, nextState) {
    // Add action to the current rally actions
    appState.rallyActions.push(action);
    
    // Add to history
    appState.history.push({
        rally: appState.currentRally,
        state: appState.currentState,
        action: action,
        nextState: nextState,
        scoreA: appState.teams.a.currentScore,
        scoreB: appState.teams.b.currentScore
    });
    
    // Update current state
    appState.currentState = nextState;
    
    // Handle point scoring if we've reached a terminal state
    if (nextState === 'Point Server' || nextState === 'Point Receiver') {
        const scoringTeam = nextState === 'Point Server' ? 
            (appState.teams.a.isServing ? 'a' : 'b') : 
            (appState.teams.a.isServing ? 'b' : 'a');
        
        // Award a point
        appState.teams[scoringTeam].currentScore++;
        
        const oppositeTeam = scoringTeam === 'a' ? 'b' : 'a';
        const pointsToWin = appState.pointsPerSet[appState.currentSet];
        const hasEnoughPoints = appState.teams[scoringTeam].currentScore >= pointsToWin;
        const hasTwoPointLead = appState.teams[scoringTeam].currentScore - appState.teams[oppositeTeam].currentScore >= 2;
        const setIsOver = hasEnoughPoints && hasTwoPointLead;
        
        // Store the completed rally actions in the rally history
        appState.rallyHistory[appState.currentRally] = {
            actions: [...appState.rallyActions],
            scoreA: appState.teams.a.currentScore,
            scoreB: appState.teams.b.currentScore,
            scoringTeam: scoringTeam
        };
        
        // Check if the set is over
        if (setIsOver) {
            // Update set score
            appState.teams[scoringTeam].setScores[appState.currentSet] = appState.teams[scoringTeam].currentScore;
            appState.teams[oppositeTeam].setScores[appState.currentSet] = appState.teams[oppositeTeam].currentScore;
            
            // Reset current scores
            appState.teams.a.currentScore = 0;
            appState.teams.b.currentScore = 0;
            
            // Move to next set
            appState.currentSet++;
            
            // Count sets won
            let setsWonA = 0;
            let setsWonB = 0;
            for (let i = 0; i < appState.currentSet; i++) {
                if (appState.teams.a.setScores[i] > appState.teams.b.setScores[i]) {
                    setsWonA++;
                } else if (appState.teams.b.setScores[i] > appState.teams.a.setScores[i]) {
                    setsWonB++;
                }
            }
            
            // End match if a team has won 2 sets
            if (setsWonA >= 2 || setsWonB >= 2) {
                showMatchSummary();
                return;
            }
            
            // Continue to next set if match isn't over
            if (appState.currentSet < 3) {
                appState.currentRally++;
                
                // For set 2, swap serving from first set
                if (appState.currentSet === 1) {
                    const secondSetServer = appState.firstServingTeam === 'a' ? 'b' : 'a';
                    appState.teams.a.isServing = secondSetServer === 'a';
                    appState.teams.b.isServing = secondSetServer === 'b';
                }
                // For set 3, prompt for serving team if match is tied 1-1
                else if (appState.currentSet === 2) {
                    if (setsWonA === 1 && setsWonB === 1) {
                        promptThirdSetService().then(servingTeam => {
                            appState.teams.a.isServing = servingTeam === 'a';
                            appState.teams.b.isServing = servingTeam === 'b';
                            updateScoreboard();
                            updateActionButtons();
                        });
                    } else {
                        appState.teams.a.isServing = scoringTeam === 'a';
                        appState.teams.b.isServing = scoringTeam === 'b';
                    }
                }
                
                // Reset to Serve state
                appState.currentState = 'Serve';
                appState.rallyActions = [];
                
                updateScoreboard();
                updateActionButtons();
            }
        } else {
            // Server changes when point is scored
            appState.teams.a.isServing = scoringTeam === 'a';
            appState.teams.b.isServing = scoringTeam === 'b';
            
            // Start next rally
            appState.currentRally++;
            appState.currentState = 'Serve';
            appState.rallyActions = [];
        }
    }
    
    // Update UI
    updateScoreboard();
    updateActionButtons();
    updateHistoryDisplay();
    
    // Save current state for undo after all changes are complete
    saveStateForUndo();
}

// Function to prompt for third set service
function promptThirdSetService() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        `;

        content.innerHTML = `
            <h3>Choose Serving Team for Set 3</h3>
            <div style="margin: 20px 0;">
                <button id="team-a-serve" style="margin: 5px;">${appState.teams.a.name}</button>
                <button id="team-b-serve" style="margin: 5px;">${appState.teams.b.name}</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        const teamABtn = content.querySelector('#team-a-serve');
        const teamBBtn = content.querySelector('#team-b-serve');

        teamABtn.onclick = () => {
            document.body.removeChild(modal);
            resolve('a');
        };

        teamBBtn.onclick = () => {
            document.body.removeChild(modal);
            resolve('b');
        };
    });
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
                    players: ['Player 1', 'Player 2'],
                    setScores: [0, 0, 0],
                    currentScore: 0,
                    isServing: true
                },
                b: {
                    name: 'Team B',
                    players: ['Player 1', 'Player 2'],
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

// Update the history display function to handle sets properly
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
        // Get all actions for this rally
        let actionsForRally = [];
        let rallyData = null;
        
        // If it's a completed rally, use the stored rally history
        if (appState.rallyHistory[rallyNum]) {
            rallyData = appState.rallyHistory[rallyNum];
            actionsForRally = rallyData.actions;
        }
        // For the current rally, use current actions
        else if (rallyNum === appState.currentRally) {
            actionsForRally = appState.rallyActions;
        }
        
        // Create a history item with the appropriate layout
        const rallyItem = document.createElement('div');
        rallyItem.classList.add('history-item');
        
        const actionsText = actionsForRally.join(' ');
        
        // For completed rallies, use the stored scores
        if (rallyData) {
            const scoreText = `${rallyData.scoreA}-${rallyData.scoreB}`;
            
            if (rallyData.scoringTeam === 'a') {
                // Home team scored
                rallyItem.innerHTML = `
                    <div class="history-actions home-scored">${actionsText}</div>
                    <div class="history-score">${scoreText}</div>
                `;
            } else {
                // Away team scored
                rallyItem.innerHTML = `
                    <div class="history-score">${scoreText}</div>
                    <div class="history-actions away-scored">${actionsText}</div>
                `;
            }
        }
        // For current rally, show current score
        else if (actionsForRally.length > 0) {
            const scoreText = `${appState.teams.a.currentScore}-${appState.teams.b.currentScore}`;
            rallyItem.innerHTML = `
                <div class="history-actions current-rally">${actionsText}</div>
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
                    tooltip.textContent = actionsText;
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
                    tooltip.textContent = actionsText;
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
}

// Helper function to get state display name
function getStateDisplayName(state) {
    const ST = appState.teams.a.isServing ? appState.teams.a.name : appState.teams.b.name;
    const RT = appState.teams.a.isServing ? appState.teams.b.name : appState.teams.a.name;
    
    switch(state) {
        case 'Serve': return `${ST} Serve`;
        case 'Reception': return `${RT} Received`;
        case 'Zone of Attack Rec': return `Attack Zone for ${RT}`;
        case 'Trajectory Rec': return `Trajectory ${RT}`;
        case 'Attack by Receiving Team': return `Attack by ${RT}`;
        case 'Defense By Serving Team': return `Defense by ${ST}`;
        case 'Zone of Attack Srv': return `Attack Zone for ${ST}`;
        case 'Trajectory Srv': return `Trajectory ${ST}`;
        case 'Attack by Serving Team': return `Attack by ${ST}`;
        case 'Defense By Receiving Team': return `Defense by ${RT}`;
        case 'Point Server': return `Point ${ST}`;
        case 'Point Receiver': return `Point ${RT}`;
        default: return state;
    }
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