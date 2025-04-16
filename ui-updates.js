// Helper function to get state display name with team names substituted
function getStateDisplayName(stateKey) {
    const currentStateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
    const stateConfig = currentStateMachine[stateKey];
    if (!stateConfig?.displayName) return stateKey; // Return key if no display name

    const servingTeamName = appState.teams.a.isServing ? appState.teams.a.name : appState.teams.b.name;
    const receivingTeamName = appState.teams.a.isServing ? appState.teams.b.name : appState.teams.a.name;

    return stateConfig.displayName
        .replace('{servingTeam}', servingTeamName)
        .replace('{receivingTeam}', receivingTeamName);
}

// Update the main scoreboard display
function updateScoreboard() {
    if (!teamADisplayName || !teamBDisplayName || !teamAScoreDisplay || !teamBScoreDisplay || !teamAServingIndicator || !teamBServingIndicator) {
        console.error("Scoreboard DOM elements not found!");
        return;
    }
    // Update team names
    teamADisplayName.textContent = appState.teams.a.name;
    teamBDisplayName.textContent = appState.teams.b.name;

    // Update current scores
    teamAScoreDisplay.textContent = appState.teams.a.currentScore;
    teamBScoreDisplay.textContent = appState.teams.b.currentScore;

    // Update serving indicator
    teamAServingIndicator.classList.toggle('serving', appState.teams.a.isServing);
    teamBServingIndicator.classList.toggle('serving', appState.teams.b.isServing);

    // Update set scores
    for (let i = 0; i < 3; i++) {
        if (teamASetDisplays[i]) teamASetDisplays[i].textContent = appState.teams.a.setScores[i] ?? 0;
        if (teamBSetDisplays[i]) teamBSetDisplays[i].textContent = appState.teams.b.setScores[i] ?? 0;
    }
}

// Update the available action buttons based on the current state
function updateActionButtons() {
    if (!actionButtonsEl || !currentStateEl) {
        console.error("Action buttons or current state display element not found!");
        return;
    }
    actionButtonsEl.innerHTML = ''; // Clear existing buttons
    currentStateEl.textContent = getStateDisplayName(appState.currentState);

    const currentStateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
    const transitions = currentStateMachine[appState.currentState]?.transitions || [];
    const styles = currentStateMachine.__rules__.actionStyles;

    transitions.forEach(transition => {
        const button = document.createElement('button');
        button.textContent = transition.action;
        button.title = transition.help || transition.action; // Add tooltip
        button.classList.add('action-button');

        // Apply style class from actionStyles
        const styleKey = transition.style || 'regular'; // Default to 'regular' if no style defined
        const bootstrapClass = styles[styleKey] || 'primary'; // Default to 'primary' if styleKey invalid
        button.classList.add(`button-${bootstrapClass}`);

        // Attach event listener using a function declared in core/match-flow.js
        button.addEventListener('click', () => handleAction(transition.action));

        actionButtonsEl.appendChild(button);
    });
}

// Update the display showing the actions of the current rally/point
function updateCurrentPointDisplay() {
    if (!currentPointEl) return;
    const currentRallyNum = appState.currentRally;
    let displayActions = '';

    // Check if the current rally exists in rallyHistory (meaning it just ended)
    if (appState.rallyHistory[currentRallyNum]) {
         displayActions = appState.rallyHistory[currentRallyNum].actions.join(' ');
    }
    // Otherwise, display actions recorded so far for the *ongoing* rally
    else if (appState.rallyActions && appState.rallyActions.length > 0) {
         displayActions = appState.rallyActions.join(' ');
    }
    // If rallyActions is empty, check the absolute last rally recorded
    else if (Object.keys(appState.rallyHistory).length > 0){
        const lastRallyNum = Math.max(...Object.keys(appState.rallyHistory).map(Number));
        if(appState.rallyHistory[lastRallyNum]) {
            displayActions = appState.rallyHistory[lastRallyNum].actions.join(' ');
        }
    }

    currentPointEl.textContent = displayActions || "-"; // Show dash if no actions
    currentPointEl.title = displayActions || "No actions yet"; // Tooltip
}


// Function to check if an element's text content is overflowing
function isTextTruncated(element) {
     if (!element) return false;
     // Use scrollWidth for potentially multi-line elements or complex content
     // Use offsetWidth for visible width including padding/border
     return element.scrollWidth > element.offsetWidth;
}

// Update the rally history display
function updateHistoryDisplay() {
     if (!historyListEl) {
         console.error("History list element not found!");
         return;
     }
     historyListEl.innerHTML = ''; // Clear existing list

     const historyContainer = document.createElement('div');
     historyContainer.classList.add('history-container');

     // Get rally numbers, sort numerically
     const rallyNumbers = Object.keys(appState.rallyHistory).map(Number).sort((a, b) => a - b);

     const currentStateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
     const styles = currentStateMachine.__rules__.actionStyles;

     rallyNumbers.forEach(rallyNum => {
         const rallyData = appState.rallyHistory[rallyNum];
         if (!rallyData || !rallyData.actions) return; // Skip if data is malformed

         const rallyItem = document.createElement('div');
         rallyItem.classList.add('history-item');

         // Format actions with style tags
         const formattedActions = rallyData.actions.map(action => {
             let styleKey = 'regular'; // Default
             // Find the transition to get the style
             for (const stateName in currentStateMachine) {
                 if (stateName.startsWith('__')) continue;
                 const transitions = currentStateMachine[stateName]?.transitions || [];
                 const transition = transitions.find(t => t.action === action);
                 if (transition?.style) {
                     styleKey = transition.style;
                     break;
                 }
             }
             const bootstrapClass = styles[styleKey] || 'primary';
             // Find help text for title attribute
             let helpText = action;
              for (const stateName in currentStateMachine) {
                  if (stateName.startsWith('__')) continue;
                  const transitions = currentStateMachine[stateName]?.transitions || [];
                  const transition = transitions.find(t => t.action === action);
                  if (transition?.help) {
                      helpText = transition.help;
                      break;
                  }
              }

             return `${action}`;
         }).join(' ');

         const scoreText = `${rallyData.scoreA ?? '?'}-${rallyData.scoreB ?? '?'}`;
         const actionContainer = document.createElement('div');
         actionContainer.classList.add('history-actions');
         actionContainer.innerHTML = formattedActions;

         const scoreContainer = document.createElement('div');
         scoreContainer.classList.add('history-score');
         scoreContainer.textContent = scoreText;

         if (rallyData.scoringTeam === 'a') {
              actionContainer.classList.add('home-scored');
              rallyItem.appendChild(actionContainer);
              rallyItem.appendChild(scoreContainer);
          } else {
              actionContainer.classList.add('away-scored');
              rallyItem.appendChild(scoreContainer);
              rallyItem.appendChild(actionContainer);
          }

         historyContainer.appendChild(rallyItem);

         // Add tooltip listeners *after* appending
         actionContainer.addEventListener('mouseenter', (e) => {
             if (isTextTruncated(actionContainer) && tooltip) {
                 tooltip.textContent = rallyData.actions.join(' ');
                 tooltip.style.display = 'block'; // Use display instead of class for simplicity
                 const rect = actionContainer.getBoundingClientRect();
                 // Position above the element
                 tooltip.style.top = `${window.scrollY + rect.top - tooltip.offsetHeight - 5}px`;
                 tooltip.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
             }
         });

         actionContainer.addEventListener('mouseleave', () => {
            if (tooltip) tooltip.style.display = 'none';
         });
         // Optional: Click to keep tooltip open (requires more complex handling)
     });

     historyListEl.appendChild(historyContainer);
     // Scroll to the bottom
     historyListEl.scrollTop = historyListEl.scrollHeight;

     // Also update the current point display as history changes
     updateCurrentPointDisplay();
 }

// Shows the match summary screen
function showMatchSummary() {
    if (!summaryScreen || !matchScreen || !summaryTeamAName || !summaryTeamBName || !winnerAnnouncement) {
        console.error("Summary screen elements not found!");
        return;
    }
    // Update summary details
    summaryTeamAName.textContent = appState.teams.a.name;
    summaryTeamBName.textContent = appState.teams.b.name;

    let setsWonA = 0;
    let setsWonB = 0;
    // Display final set scores on summary screen
    for (let i = 0; i < 3; i++) {
        const scoreA = appState.teams.a.setScores[i] ?? 0;
        const scoreB = appState.teams.b.setScores[i] ?? 0;
        if (summaryTeamASetDisplays[i]) summaryTeamASetDisplays[i].textContent = scoreA;
        if (summaryTeamBSetDisplays[i]) summaryTeamBSetDisplays[i].textContent = scoreB;

        // Tally sets won (use only completed sets for winner check)
         if (i < appState.currentSet) { // Only count sets that were actually completed
             if (scoreA > scoreB) setsWonA++;
             else if (scoreB > scoreA) setsWonB++;
         }
    }

    const winner = setsWonA > setsWonB ? appState.teams.a.name : (setsWonB > setsWonA ? appState.teams.b.name : "It's a draw?"); // Handle draw case?
    const scoreString = `${setsWonA}-${setsWonB}`;
    winnerAnnouncement.textContent = `${winner} wins ${scoreString}!`;

    // Switch screens
    matchScreen.classList.add('hidden');
    setupScreen.classList.add('hidden');
    summaryScreen.classList.remove('hidden');
}

// Switches UI view between setup, match, and summary
function showScreen(screenName) {
    setupScreen?.classList.add('hidden');
    matchScreen?.classList.add('hidden');
    summaryScreen?.classList.add('hidden');

    if (screenName === 'setup' && setupScreen) setupScreen.classList.remove('hidden');
    else if (screenName === 'match' && matchScreen) matchScreen.classList.remove('hidden');
    else if (screenName === 'summary' && summaryScreen) summaryScreen.classList.remove('hidden');
}