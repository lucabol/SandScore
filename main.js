document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // 1. Load Player Preferences (fills setup form)
    loadPlayerPreferences();

    // 2. Try to Load Previous Game State (from localStorage)
    if (loadFromStorage()) {
        console.log("Loaded previous session from localStorage.");
        // State loaded, update UI and show match screen
        updateScoreboard();
        updateActionButtons();
        updateHistoryDisplay();
        showScreen('match');
    } else {
        console.log("No previous session found, showing setup screen.");
        // No saved state, ensure setup screen is shown
        showScreen('setup');
    }

    // 3. Setup Event Listeners

    // Setup Screen Buttons
    if (startMatchBtn) startMatchBtn.addEventListener('click', startMatch);
    if (loadBtn) loadBtn.addEventListener('click', triggerLoadDialog); // Button triggers hidden file input
    if (infoButton) infoButton.addEventListener('click', showLegendModal);
    // Add listeners for stats/details buttons on setup screen if they exist/are needed

     // Serving Team Radio Buttons (ensure one is always checked)
     const serveCheckboxes = document.querySelectorAll('#setup-screen input[name="serving"]');
     if(serveCheckboxes.length > 0) { // Check if elements exist
         serveCheckboxes.forEach(radio => {
             radio.addEventListener('change', (e) => {
                  // This is basic radio button behavior, maybe not needed unless custom logic exists
                  console.log(`Serving team selected: ${e.target.value}`);
             });
         });
     } else {
         console.warn("Serving team radio buttons not found in setup screen.");
     }


    // Match Screen Buttons
    if (undoBtn) undoBtn.addEventListener('click', undoLastAction);
    if (saveBtn) saveBtn.addEventListener('click', saveMatch);
    if (restartBtn) restartBtn.addEventListener('click', restartApp);
    if (infoButtonMatch) infoButtonMatch.addEventListener('click', showLegendModal);
    if (statButtonMatch) statButtonMatch.addEventListener('click', showStatisticsModal);
    if (detailsButtonMatch) detailsButtonMatch.addEventListener('click', showAllStatsModal);

    // Summary Screen Buttons
    if (undoBtnSummary) undoBtnSummary.addEventListener('click', undoLastAction); // Undo works from summary too
    if (saveBtnSummary) saveBtnSummary.addEventListener('click', saveMatch);
    if (loadBtnSummary) loadBtnSummary.addEventListener('click', triggerLoadDialog);
    if (restartBtnSummary) restartBtnSummary.addEventListener('click', restartApp);
    if (statButtonSummary) statButtonSummary.addEventListener('click', showStatisticsModal);
    if (detailsButtonSummary) detailsButtonSummary.addEventListener('click', showAllStatsModal);

    // Modal Close Buttons (using querySelectorAll)
    closeModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Find the closest ancestor modal and hide it
            const modalToClose = e.target.closest('.modal');
            if (modalToClose) {
                hideModal(modalToClose); // Use generic hide function
            }
        });
    });

     // Click outside modal to close
     [legendModal, statisticsModal, allStatsModal, set3ServerModal].forEach(modal => {
         if (modal) {
             modal.addEventListener('click', (e) => {
                 // If the click target is the modal background itself
                 if (e.target === modal) {
                     hideModal(modal);
                 }
             });
         }
     });

     // Set 3 Server Modal Confirm Button
     if (set3ServerConfirm) {
        set3ServerConfirm.addEventListener('click', () => {
            const selectedTeamInput = document.querySelector('input[name="set3-server"]:checked');
            if (!selectedTeamInput) {
                 alert("Please select which team will serve first in Set 3.");
                 return;
             }
            const selectedTeam = selectedTeamInput.value; // 'a' or 'b'

             appState.teams.a.isServing = selectedTeam === 'a';
             appState.teams.b.isServing = selectedTeam === 'b';
             appState.currentState = stateMachine.__rules__.setTransitions.nextState || stateMachine.__rules__.initialState; // Go to serve state
             appState.rallyActions = []; // Clear actions for new set

             hideSet3ServerModal();
             updateScoreboard();
             updateActionButtons();

             // Save state after confirming Set 3 server
             saveState(JSON.parse(JSON.stringify(appState)));
             console.log(`Set 3 server confirmed: Team ${selectedTeam}`);
         });
     }


    // Load File Input Change Handler
    if (loadFileInput) {
        loadFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                 loadMatchFromFile(file); // Call function from persistence.js
                 // After loadMatchFromFile finishes (async file reading):
                 // Need to update UI based on the newly loaded state
                 setTimeout(() => { // Allow file reading to complete
                    updateScoreboard();
                    updateActionButtons();
                    updateHistoryDisplay();
                    showScreen('match'); // Show match screen after successful load
                    // Reset file input value to allow loading the same file again if needed
                    event.target.value = '';
                 }, 100); // Small delay might be needed for FileReader onload
             }
        });
    }

    // Global Keydown Listener (for Esc key to close modals)
    document.addEventListener('keydown', handleEscapeKey); // handleEscapeKey defined in modals.js

    console.log("SandScore Initialized!");
});