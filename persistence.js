// --- LocalStorage State (Undo Stack) ---

function saveState(newState) {
    // Avoid saving duplicate states
    const lastState = state.states[state.states.length - 1];
    if (lastState && JSON.stringify(newState) === lastState) {
        // console.log("State identical, not saving."); // Optional debug
        return; // Do not save if the state is identical to the last one
    }

    // Push new state to stack
    state.states.push(JSON.stringify(newState));
    // console.log(`State saved. Stack size: ${state.states.length}`); // Optional debug

    // Optional: Limit stack size to prevent excessive memory usage
    // const MAX_UNDO_STATES = 50;
    // if (state.states.length > MAX_UNDO_STATES) {
    //     state.states.shift(); // Remove the oldest state
    // }

    // Save to localStorage
    try {
        localStorage.setItem('sandscoreStates', JSON.stringify(state));
    } catch (e) {
        console.error("Error saving state to localStorage:", e);
        // Handle potential storage full errors
        if (e.name === 'QuotaExceededError') {
             alert('Could not save game state. Storage might be full. Try clearing some history or saving the match to a file.');
        }
    }
}

function loadFromStorage() {
    const savedState = localStorage.getItem('sandscoreStates');
    if (savedState) {
        try {
            const loadedState = JSON.parse(savedState);
            state.states = loadedState.states || [];
            if (state.states.length > 0) {
                const lastStateString = state.states[state.states.length - 1];
                const lastAppState = JSON.parse(lastStateString);

                // Load the application state
                loadState(lastAppState, false); // Don't replace stack, just load appState

                // Restore the correct state machine based on saved game mode
                stateMachine = lastAppState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
                console.log(`Loaded state from localStorage. Game mode: ${lastAppState.gameMode}. Stack size: ${state.states.length}`);

                return true; // Indicate successful load
            }
        } catch (e) {
            console.error("Error parsing state from localStorage:", e);
            localStorage.removeItem('sandscoreStates'); // Clear corrupted data
        }
    }
    console.log("No valid state found in localStorage.");
    return false; // Indicate nothing was loaded
}


function loadState(loadedAppState, isInitialLoad = false) {
    // Restore appState from the loaded state object
    // Use Object.assign for top-level properties, consider deep clone if needed
    Object.assign(appState, loadedAppState);

    // Ensure nested objects are also properly assigned (simple case here)
    appState.teams = JSON.parse(JSON.stringify(loadedAppState.teams));
    appState.history = loadedAppState.history ? [...loadedAppState.history] : [];
    appState.rallyActions = loadedAppState.rallyActions ? [...loadedAppState.rallyActions] : [];
    appState.rallyHistory = loadedAppState.rallyHistory ? JSON.parse(JSON.stringify(loadedAppState.rallyHistory)) : {};


    // If it's the initial load from storage, the state.states stack is already loaded.
    // If it's an undo/redo operation, the stack is managed elsewhere (in undoLastAction).
    // If loading from file, the stack might be replaced.

    console.log("App state loaded:", appState.currentState, appState.teams.a.currentScore, appState.teams.b.currentScore);
}


// --- Player Preferences ---

function savePlayerPreferences() {
    try {
        const preferences = {
            teamA: {
                player1: document.getElementById('team-a-player1').value,
                player2: document.getElementById('team-a-player2').value
            },
            teamB: {
                player1: document.getElementById('team-b-player1').value,
                player2: document.getElementById('team-b-player2').value
            },
            scoringFormat: document.querySelector('input[name="scoring"]:checked')?.value,
            servingTeam: document.querySelector('input[name="serving"]:checked')?.value,
            gameMode: document.querySelector('input[name="mode"]:checked')?.value
        };
        localStorage.setItem('sandScorePreferences', JSON.stringify(preferences));
    } catch (e) {
        console.error("Error saving preferences:", e);
    }
}

function loadPlayerPreferences() {
    const savedPreferences = localStorage.getItem('sandScorePreferences');
    if (savedPreferences) {
        try {
            const preferences = JSON.parse(savedPreferences);
            document.getElementById('team-a-player1').value = preferences.teamA?.player1 || '';
            document.getElementById('team-a-player2').value = preferences.teamA?.player2 || '';
            document.getElementById('team-b-player1').value = preferences.teamB?.player1 || '';
            document.getElementById('team-b-player2').value = preferences.teamB?.player2 || '';

            // Set scoring format
            if (preferences.scoringFormat) {
                const scoringInput = document.querySelector(`input[name="scoring"][value="${preferences.scoringFormat}"]`);
                if (scoringInput) scoringInput.checked = true;
            }

            // Set serving team
            if (preferences.servingTeam) {
                const servingInput = document.querySelector(`input[name="serving"][value="${preferences.servingTeam}"]`);
                 if (servingInput) servingInput.checked = true;
            }

             // Set game mode
             if (preferences.gameMode) {
                const modeInput = document.querySelector(`input[name="mode"][value="${preferences.gameMode}"]`);
                 if (modeInput) modeInput.checked = true;
             }
        } catch (e) {
            console.error("Error loading/parsing preferences:", e);
            localStorage.removeItem('sandScorePreferences'); // Clear corrupted data
        }
    }
}

// --- File Save/Load ---

function saveMatch() {
    try {
        // Explicitly include the current appState and the undo stack
        const stateToSave = {
            appState: appState, // The current live state
            undoStack: state.states  // The stack of historical states (strings)
        };

        // Create file name
        const currentDate = new Date().toISOString().split('T')[0];
        // Ensure player names exist before creating filename
        const playerA1 = appState.teams?.a?.players?.[0] || 'P1';
        const playerA2 = appState.teams?.a?.players?.[1] || 'P2';
        const playerB1 = appState.teams?.b?.players?.[0] || 'P3';
        const playerB2 = appState.teams?.b?.players?.[1] || 'P4';
        const teamA = `${playerA1}-${playerA2}`;
        const teamB = `${playerB1}-${playerB2}`;
        const fileName = `SandScore ${currentDate} ${teamA} vs ${teamB}.json`;

        // Create blob and download link
        const blob = new Blob([JSON.stringify(stateToSave, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("Match saved to file:", fileName);
    } catch (e) {
        console.error('Error saving match:', e);
        alert('Failed to save match file.');
    }
}

function loadMatchFromFile(file) {
     if (!file) return;

     const reader = new FileReader();
     reader.onload = function(e) {
         try {
             const parsedData = JSON.parse(e.target.result);

             // Validate the loaded data structure
             if (!parsedData || !parsedData.appState || !parsedData.undoStack) {
                 throw new Error("Invalid file format: Missing required state data.");
             }
             if (!Array.isArray(parsedData.undoStack)) {
                throw new Error("Invalid file format: undoStack is not an array.");
             }


             // Restore the main application state from the loaded file
             loadState(parsedData.appState, false); // Load appState, don't modify stack yet

              // Restore the undo stack directly from the file
             state.states = parsedData.undoStack;

             // Ensure the latest state in the stack matches the loaded appState
             // (It should, if saved correctly, but good to double-check/resync if needed)
              const lastStateFromStack = state.states.length > 0 ? JSON.parse(state.states[state.states.length - 1]) : null;
              if (!lastStateFromStack || JSON.stringify(lastStateFromStack) !== JSON.stringify(parsedData.appState) ) {
                 console.warn("Loaded appState differs from the last state in the loaded undo stack. Resynchronizing stack.");
                 // If they don't match, push the loaded appState onto the stack.
                 // This might happen if the save happened mid-action or if file is slightly off.
                 state.states.push(JSON.stringify(parsedData.appState));
              }


             // Set the correct state machine
             stateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;

             // Save the restored state (including stack) to localStorage
             localStorage.setItem('sandscoreStates', JSON.stringify(state));

             console.log(`Match loaded from file. Game mode: ${appState.gameMode}. Stack size: ${state.states.length}`);

             // Update UI accordingly (handled in main.js event listener)

         } catch (err) {
             console.error('Error loading match from file:', err);
             alert(`Failed to load match file. Error: ${err.message}`);
             // Reset file input value in case of error
             document.getElementById('load-file').value = '';
         }
     };
     reader.onerror = function() {
         console.error('Error reading file:', reader.error);
         alert('Failed to read the selected file.');
         document.getElementById('load-file').value = '';
     }
     reader.readAsText(file);
}

// Trigger the file input dialog
function triggerLoadDialog() {
    const fileInput = document.getElementById('load-file');
    fileInput.click();
}