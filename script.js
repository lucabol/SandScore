// State Machine Definition
const stateMachine = {
    "Serve": {
        "transitions": [
            { "action": "Ace", "nextState": "Point Server" },
            { "action": "Err", "nextState": "Point Receiver" },
            { "action": "R! Rec1", "nextState": "Point Server" },
            { "action": "R- Rec1", "nextState": "Reception" },
            { "action": "R= Rec1", "nextState": "Reception" },
            { "action": "R+ Rec1", "nextState": "Reception" },
            { "action": "R! Rec2", "nextState": "Point Server" },
            { "action": "R- Rec2", "nextState": "Reception" },
            { "action": "R= Rec2", "nextState": "Reception" },
            { "action": "R+ Rec2", "nextState": "Reception" }
        ]
    },
    "Reception": {
        "transitions": [
            { "action": "Atk Rec1", "nextState": "Zone of Attack Rec" },
            { "action": "Atk Rec2", "nextState": "Zone of Attack Rec" }
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
            { "action": "Win Atk", "nextState": "Point Receiver" },
            { "action": "Err Atk", "nextState": "Point Server" },
            { "action": "Blk Srv1", "nextState": "Point Server" },
            { "action": "Blk Srv2", "nextState": "Point Server" },
            { "action": "Def Srv1", "nextState": "Defense By Serving Team" },
            { "action": "Def Srv2", "nextState": "Defense By Serving Team" }
        ]
    },
    "Defense By Serving Team": {
        "transitions": [
            { "action": "Atk Srv1", "nextState": "Zone of Attack Srv" },
            { "action": "Atk Srv2", "nextState": "Zone of Attack Srv" }
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
            { "action": "Win Atk", "nextState": "Point Server" },
            { "action": "Err Atk", "nextState": "Point Receiver" },
            { "action": "Blk Rec1", "nextState": "Point Receiver" },
            { "action": "Blk Rec2", "nextState": "Point Receiver" },
            { "action": "Def Rec1", "nextState": "Defense By Receiving Team" },
            { "action": "Def Rec2", "nextState": "Defense By Receiving Team" }
        ]
    },
    "Defense By Receiving Team": {
        "transitions": [
            { "action": "Atk Rec1", "nextState": "Zone of Attack Rec" },
            { "action": "Atk Rec2", "nextState": "Zone of Attack Rec" }
        ]
    }
};

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const matchScreen = document.getElementById('match-screen');
const summaryScreen = document.getElementById('summary-screen');
const startMatchBtn = document.getElementById('start-match');
const currentStateEl = document.getElementById('current-state');
const actionButtonsEl = document.getElementById('action-buttons');
const undoBtn = document.getElementById('undo-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const resetBtn = document.getElementById('reset-btn');
const restartBtn = document.getElementById('restart-btn');
const newMatchBtn = document.getElementById('new-match-btn');
const rallyCountEl = document.getElementById('rally-count');
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
    // Instead of storing full state history, we'll store a limited number of snapshots
    stateHistory: [],
    maxHistorySize: 20 // Limit the number of state snapshots to avoid memory issues
};

// Save the current state for undo functionality with memory optimization
function saveStateForUndo() {
    // Create a lightweight copy of the state
    const stateSnapshot = {
        teams: {
            a: { ...appState.teams.a, players: [...appState.teams.a.players] },
            b: { ...appState.teams.b, players: [...appState.teams.b.players] }
        },
        currentSet: appState.currentSet,
        currentRally: appState.currentRally,
        pointsPerSet: [...appState.pointsPerSet],
        currentState: appState.currentState,
        // Don't include history in the snapshot - it's already tracked separately
    };
    
    // Add to state history
    appState.stateHistory.push(stateSnapshot);
    
    // Limit the size of the history array to avoid memory issues
    if (appState.stateHistory.length > appState.maxHistorySize) {
        appState.stateHistory.shift(); // Remove the oldest state
    }
}

// Initialize application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if there's a saved match in local storage
    if (localStorage.getItem('sandScoreMatch')) {
        loadBtn.disabled = false;
    } else {
        loadBtn.disabled = true;
    }

    // Set up event listeners
    startMatchBtn.addEventListener('click', startMatch);
    undoBtn.addEventListener('click', undoLastAction);
    saveBtn.addEventListener('click', saveMatch);
    loadBtn.addEventListener('click', loadMatch);
    resetBtn.addEventListener('click', resetMatch);
    restartBtn.addEventListener('click', restartApp);
    newMatchBtn.addEventListener('click', restartApp);
});

// Start a new match with the entered player data
function startMatch() {
    // Get player names from input fields
    const teamAPlayer1 = document.getElementById('team-a-player1').value || 'Player 1';
    const teamAPlayer2 = document.getElementById('team-a-player2').value || 'Player 2';
    const teamBPlayer1 = document.getElementById('team-b-player1').value || 'Player 1';
    const teamBPlayer2 = document.getElementById('team-b-player2').value || 'Player 2';

    // Set team names based on player names
    const teamAName = `${teamAPlayer1}/${teamAPlayer2}`;
    const teamBName = `${teamBPlayer1}/${teamBPlayer2}`;
    
    // Get scoring format
    const scoringFormat = document.querySelector('input[name="scoring"]:checked').value;
    
    // Initialize app state
    appState = {
        teams: {
            a: {
                name: teamAName,
                players: [teamAPlayer1, teamAPlayer2],
                setScores: [0, 0, 0],
                currentScore: 0,
                isServing: true
            },
            b: {
                name: teamBName,
                players: [teamBPlayer1, teamBPlayer2],
                setScores: [0, 0, 0],
                currentScore: 0,
                isServing: false
            }
        },
        currentSet: 0,
        currentRally: 1,
        pointsPerSet: scoringFormat === 'short' ? [3, 3, 3] : [21, 21, 15],
        currentState: 'Serve',
        history: [],
        stateHistory: [],
        maxHistorySize: 20
    };

    // Update the scoreboard with initial values
    updateScoreboard();
    
    // Instead of saving the full state history, just save the initial state
    saveStateForUndo();
    
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
    
    // Update player names
    document.getElementById('display-team-a-player1').textContent = appState.teams.a.players[0];
    document.getElementById('display-team-a-player2').textContent = appState.teams.a.players[1];
    document.getElementById('display-team-b-player1').textContent = appState.teams.b.players[0];
    document.getElementById('display-team-b-player2').textContent = appState.teams.b.players[1];
    
    // Update set scores
    for (let i = 0; i < 3; i++) {
        document.getElementById(`team-a-set${i+1}`).textContent = appState.teams.a.setScores[i];
        document.getElementById(`team-b-set${i+1}`).textContent = appState.teams.b.setScores[i];
    }
    
    // Update current scores
    document.getElementById('team-a-score').textContent = appState.teams.a.currentScore;
    document.getElementById('team-b-score').textContent = appState.teams.b.currentScore;
    
    // Update serving indicator
    document.getElementById('team-a-serving').classList.toggle('serving', appState.teams.a.isServing);
    document.getElementById('team-b-serving').classList.toggle('serving', appState.teams.b.isServing);
    
    // Update current set indicator
    document.getElementById('current-set').textContent = `Set ${appState.currentSet + 1}`;
    
    // Update rally counter
    rallyCountEl.textContent = appState.currentRally;
    
    // Update current state
    currentStateEl.textContent = appState.currentState;
}

// Update action buttons based on current state
function updateActionButtons() {
    // Clear existing buttons
    actionButtonsEl.innerHTML = '';
    
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
function handleAction(action, nextState) {
    // Save current state for undo
    saveStateForUndo();
    
    // Add to history
    appState.history.push({
        rally: appState.currentRally,
        state: appState.currentState,
        action: action,
        nextState: nextState
    });
    
    // Limit the size of the history array to avoid memory issues
    if (appState.history.length > 100) {
        appState.history.shift(); // Remove the oldest history item
        
        // Also update the UI if needed
        if (historyListEl.children.length > 100) {
            historyListEl.removeChild(historyListEl.firstChild);
        }
    }
    
    // Update UI history
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.textContent = `Rally ${appState.currentRally}: ${appState.currentState} → ${action} → ${nextState}`;
    historyListEl.appendChild(historyItem);
    historyListEl.scrollTop = historyListEl.scrollHeight;
    
    // Update current state
    appState.currentState = nextState;
    
    // Handle point scoring if we've reached a terminal state
    if (nextState === 'Point Server' || nextState === 'Point Receiver') {
        const scoringTeam = nextState === 'Point Server' ? 
            (appState.teams.a.isServing ? 'a' : 'b') : 
            (appState.teams.a.isServing ? 'b' : 'a');
        
        // Award a point
        appState.teams[scoringTeam].currentScore++;
        
        // Check if the set is over
        const pointsToWin = appState.pointsPerSet[appState.currentSet];
        const oppositeTeam = scoringTeam === 'a' ? 'b' : 'a';
        
        if (appState.teams[scoringTeam].currentScore >= pointsToWin && 
            (appState.teams[scoringTeam].currentScore - appState.teams[oppositeTeam].currentScore) >= 2) {
            
            // Update set score
            appState.teams[scoringTeam].setScores[appState.currentSet] = appState.teams[scoringTeam].currentScore;
            appState.teams[oppositeTeam].setScores[appState.currentSet] = appState.teams[oppositeTeam].currentScore;
            
            // Reset current scores
            appState.teams.a.currentScore = 0;
            appState.teams.b.currentScore = 0;
            
            // Move to next set or end the match
            appState.currentSet++;
            appState.currentRally = 1;
            
            // Check if match is over
            let setsWonA = appState.teams.a.setScores.filter(score => score > 0).length;
            let setsWonB = appState.teams.b.setScores.filter(score => score > 0).length;
            
            if (appState.currentSet >= 3 || setsWonA >= 2 || setsWonB >= 2) {
                showMatchSummary();
                return;
            }
        }
        
        // Server changes when point is scored
        appState.teams.a.isServing = scoringTeam === 'a';
        appState.teams.b.isServing = scoringTeam === 'b';
        
        // Automatically start next rally
        appState.currentRally++;
        appState.currentState = 'Serve';
    }
    
    // Update UI
    updateScoreboard();
    updateActionButtons();
}

// Undo the last action
function undoLastAction() {
    if (appState.stateHistory.length > 1) {
        // Remove current state
        const currentState = appState.stateHistory.pop();
        
        // Go back to previous state
        const previousState = appState.stateHistory[appState.stateHistory.length - 1];
        
        // Update the app state with the previous state values
        appState.teams.a = { ...previousState.teams.a };
        appState.teams.b = { ...previousState.teams.b };
        appState.currentSet = previousState.currentSet;
        appState.currentRally = previousState.currentRally;
        appState.pointsPerSet = [...previousState.pointsPerSet];
        appState.currentState = previousState.currentState;
        
        // Also remove the last history item if it exists
        if (appState.history.length > 0) {
            appState.history.pop();
        }
        
        // Update UI
        updateScoreboard();
        updateActionButtons();
        
        // Update history list
        // Remove the last history item from DOM
        if (historyListEl.lastChild) {
            historyListEl.removeChild(historyListEl.lastChild);
        }
    }
}

// Save the match state to local storage
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
            // We don't need to save the whole state history for persistence
            // Just save the current state
            stateHistory: [appState.stateHistory[appState.stateHistory.length - 1] || null]
        };
        
        localStorage.setItem('sandScoreMatch', JSON.stringify(stateToSave));
        alert('Match saved successfully!');
    } catch (e) {
        console.error('Error saving match:', e);
        alert('Failed to save match. The data might be too large for local storage.');
    }
}

// Load the match state from local storage
function loadMatch() {
    try {
        const savedState = localStorage.getItem('sandScoreMatch');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            
            // Restore the main parts of the state
            appState.teams = parsedState.teams;
            appState.currentSet = parsedState.currentSet;
            appState.currentRally = parsedState.currentRally;
            appState.pointsPerSet = parsedState.pointsPerSet;
            appState.currentState = parsedState.currentState;
            appState.history = parsedState.history || [];
            
            // Initialize the state history with the current state
            appState.stateHistory = [parsedState.stateHistory[0] || {
                teams: {
                    a: { ...appState.teams.a },
                    b: { ...appState.teams.b }
                },
                currentSet: appState.currentSet,
                currentRally: appState.currentRally,
                pointsPerSet: [...appState.pointsPerSet],
                currentState: appState.currentState
            }];
            
            // Reset the history display
            historyListEl.innerHTML = '';
            
            // Populate history display
            // Limit to the last 50 entries to avoid browser slowdowns
            const historyToShow = appState.history.slice(-50);
            historyToShow.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.classList.add('history-item');
                historyItem.textContent = `Rally ${item.rally}: ${item.state} → ${item.action} → ${item.nextState}`;
                historyListEl.appendChild(historyItem);
            });
            
            // Update UI
            updateScoreboard();
            updateActionButtons();
            
            // Show match screen
            setupScreen.classList.add('hidden');
            matchScreen.classList.remove('hidden');
            summaryScreen.classList.add('hidden');
            
            alert('Match loaded successfully!');
        }
    } catch (e) {
        console.error('Error loading match:', e);
        alert('Failed to load match data.');
    }
}

// Reset the current match to initial state
function resetMatch() {
    if (confirm('Are you sure you want to reset the match? All progress will be lost.')) {
        // Keep player names and scoring format, but reset everything else
        const teamAName = appState.teams.a.name;
        const teamAPlayers = [...appState.teams.a.players];
        const teamBName = appState.teams.b.name;
        const teamBPlayers = [...appState.teams.b.players];
        const pointsPerSet = [...appState.pointsPerSet];
        
        appState = {
            teams: {
                a: {
                    name: teamAName,
                    players: teamAPlayers,
                    setScores: [0, 0, 0],
                    currentScore: 0,
                    isServing: true
                },
                b: {
                    name: teamBName,
                    players: teamBPlayers,
                    setScores: [0, 0, 0],
                    currentScore: 0,
                    isServing: false
                }
            },
            currentSet: 0,
            currentRally: 1,
            pointsPerSet: pointsPerSet,
            currentState: 'Serve',
            history: [],
            stateHistory: [],
            maxHistorySize: 20
        };
        
        // Save initial state for undo
        saveStateForUndo();
        
        // Clear history display
        historyListEl.innerHTML = '';
        
        // Update UI
        updateScoreboard();
        updateActionButtons();
    }
}

// Restart the app (go back to setup screen)
function restartApp() {
    if (confirm('Are you sure you want to start a new match? All current progress will be lost.')) {
        // Clear input fields
        document.getElementById('team-a-player1').value = '';
        document.getElementById('team-a-player2').value = '';
        document.getElementById('team-b-player1').value = '';
        document.getElementById('team-b-player2').value = '';
        
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
    
    // Determine the winner
    let setsWonA = appState.teams.a.setScores.filter(score => score > 0).length;
    let setsWonB = appState.teams.b.setScores.filter(score => score > 0).length;
    
    let winner = setsWonA > setsWonB ? appState.teams.a.name : appState.teams.b.name;
    let score = `${setsWonA}-${setsWonB}`;
    
    document.getElementById('winner-announcement').textContent = `${winner} wins ${score}!`;
    
    // Show summary screen
    matchScreen.classList.add('hidden');
    summaryScreen.classList.remove('hidden');
}