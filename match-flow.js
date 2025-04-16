function startMatch() {
    // 1. Clear previous state (localStorage and in-memory undo stack)
    localStorage.removeItem('sandscoreStates');
    state.states = []; // Reset undo stack

    // 2. Read setup options from DOM
     const teamAPlayer1 = document.getElementById('team-a-player1').value || 'Player 1'; // Provide defaults
     const teamAPlayer2 = document.getElementById('team-a-player2').value || 'Player 2';
     const teamBPlayer1 = document.getElementById('team-b-player1').value || 'Player 3';
     const teamBPlayer2 = document.getElementById('team-b-player2').value || 'Player 4';
     const teamAName = `${teamAPlayer1}/${teamAPlayer2}`;
     const teamBName = `${teamBPlayer1}/${teamBPlayer2}`;
     const scoringFormat = document.querySelector('input[name="scoring"]:checked')?.value || 'regular'; // Default format
     const servingTeamChoice = document.querySelector('input[name="serving"]:checked')?.value || 'team-a'; // Default server
     const gameMode = document.querySelector('input[name="mode"]:checked')?.value || 'advanced'; // Default mode

    // 3. Set the active state machine
    stateMachine = gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;

    // 4. Initialize appState
    appState = {
        teams: {
            a: {
                name: teamAName,
                players: [teamAPlayer1, teamAPlayer2],
                setScores: [0, 0, 0],
                currentScore: 0,
                isServing: servingTeamChoice === 'team-a'
            },
            b: {
                name: teamBName,
                players: [teamBPlayer1, teamBPlayer2],
                setScores: [0, 0, 0],
                currentScore: 0,
                isServing: servingTeamChoice === 'team-b'
            }
        },
        currentSet: 0,
        currentRally: 1,
        pointsPerSet: stateMachine.__rules__.setWinConditions.pointsToWin[scoringFormat] || [21, 21, 15], // Fallback points
        currentState: stateMachine.__rules__.initialState,
        history: [], // Reset history log
        rallyActions: [], // Reset current rally actions
        rallyHistory: {}, // Reset detailed rally history
        firstServingTeam: servingTeamChoice === 'team-a' ? 'a' : 'b',
        gameMode: gameMode // Store selected game mode
    };

    console.log(`Starting new match. Mode: ${gameMode}, Format: ${scoringFormat}, First Server: ${appState.firstServingTeam}`);

    // 5. Initial UI Update
    updateScoreboard();
    updateActionButtons();
    updateHistoryDisplay(); // Clear history display
    showScreen('match'); // Show the match screen

    // 6. Save the very initial state for potential undo
    saveState(JSON.parse(JSON.stringify(appState))); // Save a deep copy

     // 7. Save preferences for next time
     savePlayerPreferences();
}


function restartApp() {
    if (confirm('Are you sure you want to start a new match setup? All current progress will be lost.')) {
        // Clear storage and state
        localStorage.removeItem('sandscoreStates');
        state.states = [];
        // Reset appState to a default structure (or reload preferences)
        // Re-initializing appState fully is safer than trying to partially reset
        appState = { /* Initial default structure from app-state.js could go here */ };

        // Clear potential UI artifacts
         historyListEl.innerHTML = '';
         actionButtonsEl.innerHTML = '';
         currentStateEl.textContent = '';
         currentPointEl.textContent = '';


        // Load preferences for the setup screen
        loadPlayerPreferences();

        // Show the setup screen
         showScreen('setup');
    }
}

// --- Core Action Handling and Scoring ---

function handleAction(action) {
    const currentStateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
    const currentStateConfig = currentStateMachine[appState.currentState];
    if (!currentStateConfig || !currentStateConfig.transitions) {
        console.error(`Error: No transitions defined for current state "${appState.currentState}"`);
        return;
    }

    const transition = currentStateConfig.transitions.find(t => t.action === action);
    if (!transition) {
        console.error(`Error: No transition found for action "${action}" from state "${appState.currentState}"`);
        return;
    }

    const nextState = transition.nextState;

    // --- State Update ---
    // 1. Record action for current rally
    appState.rallyActions.push(action);

    // 2. Log the step (optional, useful for debugging but history is rebuilt from rallyHistory)
    // appState.history.push({ ... });

    // 3. Transition to the next state
    appState.currentState = nextState;

    // --- Check for Terminal State (Point Scored) ---
    const nextStateConfig = currentStateMachine[nextState];
    if (nextStateConfig?.isTerminal) {
        // Point is finished, process scoring and potential set/match end
        processPointEnd(nextStateConfig);
    }

    // --- UI Update ---
    updateActionButtons(); // Update buttons for the new state (or hide if point ended)
    updateCurrentPointDisplay(); // Show the action just taken

    // --- Save State AFTER all updates ---
    // Create a deep copy to save, preventing mutations after saving
    saveState(JSON.parse(JSON.stringify(appState)));
}

function processPointEnd(terminalStateConfig) {
     // 1. Determine Scoring Team based on terminal state definition
     const rules = terminalStateConfig.scoring; // e.g., { awardPoint: 'server', switchServer: true }
     let scoringTeamKey = null;
     if (rules.awardPoint === 'server') {
         scoringTeamKey = appState.teams.a.isServing ? 'a' : 'b';
     } else if (rules.awardPoint === 'receiver') {
         scoringTeamKey = appState.teams.a.isServing ? 'b' : 'a';
     } else {
         console.error("Invalid scoring rule in terminal state:", terminalStateConfig.displayName);
         return; // Cannot proceed without scorer
     }

     // 2. Award Point
     appState.teams[scoringTeamKey].currentScore++;

     // 3. Store Completed Rally Data
     appState.rallyHistory[appState.currentRally] = {
         actions: [...appState.rallyActions], // Copy actions
         scoreA: appState.teams.a.currentScore,
         scoreB: appState.teams.b.currentScore,
         scoringTeam: scoringTeamKey,
         servingTeam: appState.teams.a.isServing ? 'a' : 'b' // Team that served at the START of the rally
     };

     // 4. Check for Set Completion
     const opponentTeamKey = scoringTeamKey === 'a' ? 'b' : 'a';
     if (isSetComplete(scoringTeamKey, opponentTeamKey)) {
         // Handle set end (updates scores, checks match end, prepares next set)
         handleSetCompletion(scoringTeamKey, opponentTeamKey);
         // Don't proceed to normal point/server switch logic if set/match ended
     } else {
          // Set not over, continue normal flow:
         // 5. Handle Server Switch based on rules
         const originalServingTeam = appState.teams.a.isServing ? 'a' : 'b';
         if (rules.switchServer) {
             // Check if server should change based on who won
             // Standard side-out: Receiver winning point gets serve
             // Rally point: Server keeps serve if they score, loses if receiver scores
             if (scoringTeamKey !== originalServingTeam) {
                 appState.teams.a.isServing = !appState.teams.a.isServing;
                 appState.teams.b.isServing = !appState.teams.b.isServing;
             }
         }
         // Add logic here if terminal state has specific 'nextServer' rules ('winner', 'loser')

         // 6. Prepare for Next Rally
         appState.currentRally++;
         appState.currentState = stateMachine.__rules__.initialState; // Reset state for serve
         appState.rallyActions = []; // Clear actions for the new rally

         // 7. Update UI for next point start
         updateScoreboard(); // Show new score and server
         updateHistoryDisplay(); // Show the completed rally
         updateActionButtons(); // Show buttons for the 'Serve' state
     }
     // State is automatically saved by the caller (handleAction) after this function returns
 }

function isSetComplete(scoringTeamKey, opponentTeamKey) {
    const rules = stateMachine.__rules__.setWinConditions;
    // Ensure pointsPerSet is an array and currentSet is within bounds
     if (!Array.isArray(appState.pointsPerSet) || appState.currentSet >= appState.pointsPerSet.length) {
        console.error("Invalid pointsPerSet or currentSet index.");
        // Use default points as a fallback
        const defaultPoints = (appState.currentSet < 2) ? 21 : 15;
        appState.pointsPerSet = appState.pointsPerSet || [defaultPoints, defaultPoints, defaultPoints];
     }

    const pointsToWinThisSet = appState.pointsPerSet[appState.currentSet] || ((appState.currentSet < 2) ? 21 : 15); // Fallback logic
    const score = appState.teams[scoringTeamKey].currentScore;
    const opponentScore = appState.teams[opponentTeamKey].currentScore;
    const minDiff = rules.minPointDifference;

    const hasMinPoints = score >= pointsToWinThisSet;
    const hasMinDifference = (score - opponentScore) >= minDiff;

    return hasMinPoints && hasMinDifference;
}

function handleSetCompletion(winningTeamKey, losingTeamKey) {
     console.log(`Set ${appState.currentSet + 1} completed. Winner: Team ${winningTeamKey}`);

    // 1. Record Final Set Scores
    appState.teams[winningTeamKey].setScores[appState.currentSet] = appState.teams[winningTeamKey].currentScore;
    appState.teams[losingTeamKey].setScores[appState.currentSet] = appState.teams[losingTeamKey].currentScore;

    // 2. Check for Match Completion
    const setRules = stateMachine.__rules__.setTransitions;
    const setsToWinMatch = setRules.matchEndCondition.setsToWin;
    let setsWonA = 0;
    let setsWonB = 0;
    for(let i=0; i <= appState.currentSet; i++){
        if(appState.teams.a.setScores[i] > appState.teams.b.setScores[i]) setsWonA++;
        if(appState.teams.b.setScores[i] > appState.teams.a.setScores[i]) setsWonB++;
    }


    if (setsWonA >= setsToWinMatch || setsWonB >= setsToWinMatch) {
         console.log("Match completed!");
         updateScoreboard(); // Update final set score display
         updateHistoryDisplay(); // Show final rally
         showMatchSummary(); // Transition to summary screen
         // State is saved by the calling function (handleAction)
         return; // Stop further processing
     }

    // --- Match Not Over, Prepare Next Set ---
    // 3. Reset Scores for Next Set (if configured)
    if (setRules.resetScores) {
        appState.teams.a.currentScore = 0;
        appState.teams.b.currentScore = 0;
    }

    // 4. Increment Set Counter
    appState.currentSet++;
     // Handle rally numbering for the new set (e.g., reset or use prefix)
     appState.currentRally = (appState.currentSet * 1000) + 1; // Simple scheme: Set 0: 1-999, Set 1: 1001-1999 etc.


    // 5. Determine Server for Next Set
     if (appState.currentSet === 1) { // Start of Set 2
         const teamWhoServedSet1 = appState.firstServingTeam;
         appState.teams.a.isServing = (teamWhoServedSet1 === 'b'); // Opposite serves Set 2
         appState.teams.b.isServing = (teamWhoServedSet1 === 'a');
         appState.currentState = setRules.nextState || stateMachine.__rules__.initialState; // Go to serve state
          appState.rallyActions = []; // Clear actions
          updateScoreboard();
          updateHistoryDisplay(); // Show previous set's last rally
          updateActionButtons();

     } else if (appState.currentSet === 2) { // Start of Set 3 (Decider)
         console.log("Triggering Set 3 server selection.");
         updateScoreboard(); // Show set scores before modal
         updateHistoryDisplay();
         // Show modal to choose server - logic continues in modal confirmation callback (in main.js/modal handler)
         showSet3ServerModal();
          // Don't update state/buttons here yet, wait for modal confirmation
     } else {
         // Should not happen in a best-of-3 sets scenario
         console.error("Unexpected set number:", appState.currentSet);
     }
     // State is saved by the calling function (handleAction) after this returns
 }


// --- Undo Functionality ---

function undoLastAction() {
     console.log(`Undo requested. Stack size before: ${state.states.length}`);
     if (state.states.length <= 1) {
         console.log("Cannot undo initial state.");
         // Optionally provide feedback to the user
         alert("Cannot undo further.");
         return;
     }

     // 1. Remove the current state from the stack
     state.states.pop();
     console.log(`Stack size after pop: ${state.states.length}`);


     // 2. Get the previous state string
     const previousStateString = state.states[state.states.length - 1];

     // 3. Parse and load the previous state
     try {
         const previousAppState = JSON.parse(previousStateString);
         // Use loadState to update the main appState object
         loadState(previousAppState);

         // Ensure the correct state machine is active after undo
         stateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;

         // 4. Update LocalStorage with the popped stack
         localStorage.setItem('sandscoreStates', JSON.stringify(state));

         // 5. Update UI to reflect the restored state
         updateScoreboard();
         updateActionButtons();
         updateHistoryDisplay(); // This should now show the state before the undone action
         updateCurrentPointDisplay(); // Reflect the actions of the restored state's current point

         // If undo caused us to leave the summary screen, switch back to match screen
         if (summaryScreen && !summaryScreen.classList.contains('hidden')) {
             // Check if the match is actually over in the restored state
              const setRules = stateMachine.__rules__.setTransitions;
              const setsToWinMatch = setRules.matchEndCondition.setsToWin;
              let setsWonA = 0;
              let setsWonB = 0;
              for(let i=0; i < appState.currentSet; i++){ // Only count fully completed sets
                  if(appState.teams.a.setScores[i] > appState.teams.b.setScores[i]) setsWonA++;
                  if(appState.teams.b.setScores[i] > appState.teams.a.setScores[i]) setsWonB++;
              }
              if (setsWonA < setsToWinMatch && setsWonB < setsToWinMatch) {
                   console.log("Undoing action resulted in returning to match screen.");
                   showScreen('match');
              } else {
                     // Update summary screen content if still showing summary
                      showMatchSummary(); // Re-render summary with restored scores
              }
         }

          console.log("Undo successful. Restored state:", appState.currentState, appState.teams.a.currentScore, appState.teams.b.currentScore);

     } catch (e) {
         console.error("Error parsing or loading previous state during undo:", e);
         // Handle potential corruption? Maybe revert the pop? Risky.
         // For now, just log the error. The state might be inconsistent.
         alert("Error during undo. State might be inconsistent.");
     }
 }