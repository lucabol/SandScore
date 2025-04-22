
function showModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function hideModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.add('hidden');
    // Only restore scrolling if no other modals are open
    const anyModalOpen = document.querySelector('.modal:not(.hidden)');
    if (!anyModalOpen) {
        document.body.style.overflow = '';
    }
}

// --- Legend Modal ---
function generateLegendContent() {
    if (!legendContainer) return;
    legendContainer.innerHTML = ''; // Clear existing content

    const currentStateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;

    // Structure to hold actions by category
    const actionsByCategory = {};

    // Scan all transitions to gather actions and help text
    for (const stateName in currentStateMachine) {
        if (stateName.startsWith('__')) continue;
        const state = currentStateMachine[stateName];
        if (!state.transitions) continue;

        state.transitions.forEach(transition => {
             const category = transition.category || 'other'; // Default category if missing
             const action = transition.action;
             const help = transition.help || 'No description available.';

             if (!actionsByCategory[category]) {
                 actionsByCategory[category] = {};
             }
             // Avoid duplicates, store action and help text
             if (!actionsByCategory[category][action]) {
                 actionsByCategory[category][action] = help;
             }
         });
    }

    // Sort categories alphabetically (optional)
    const sortedCategories = Object.keys(actionsByCategory).sort();

    // Create HTML elements for each category section
    sortedCategories.forEach(categoryKey => {
         const categoryActions = actionsByCategory[categoryKey];
         const sortedActions = Object.keys(categoryActions).sort(); // Sort actions within category

         const sectionEl = document.createElement('div');
         sectionEl.className = 'legend-section';

         const titleEl = document.createElement('h4');
         titleEl.textContent = getCategoryDisplayName(categoryKey); // Use helper
         sectionEl.appendChild(titleEl);

         sortedActions.forEach(action => {
             const help = categoryActions[action];
             const paraEl = document.createElement('p');
             paraEl.innerHTML = `${action} - ${help}`;
             sectionEl.appendChild(paraEl);
         });

         legendContainer.appendChild(sectionEl);
    });
}

function showLegendModal() {
    generateLegendContent();
    showModal(legendModal);
}

function hideLegendModal() {
    hideModal(legendModal);
}

// --- Statistics Modal ---
function generateStatisticsModalContent(stats) {
     if (!statsContainer) { console.error("Stats modal content container not found"); return ''; }

     const currentStateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
     const statsTable = currentStateMachine.__statisticsTable__;

     // Determine player keys dynamically
     const player1Key = 'player1'; // Assuming player keys are consistent if generalizing
     const player2Key = 'player2'; // Or potentially derive from stats object structure if needed

     let html = `<div class="stats-modal-content">
          <h2>Match Statistics</h2>
          <div class="stats-section">
              <div class="stats-row stats-header">
                  <div>${stats.teamA.name}</div>
                  <div>Stat</div>
                  <div>${stats.teamB.name}</div>
              </div>
              <div class="stats-block">
              <h3>Team Stats</h3>
                  ${statsTable.map(statDef => `
                      <div class="stats-row">
                          <div>${stats.teamA[statDef.key] ?? '-'}${statDef.key === 'attackEfficiency' ? '%' : ''}${statDef.key === 'pointsWon' ? ` (${stats.teamA.pointsPercentage}%)` : ''}</div>
                          <div>${statDef.label}</div>
                          <div>${stats.teamB[statDef.key] ?? '-'}${statDef.key === 'attackEfficiency' ? '%' : ''}${statDef.key === 'pointsWon' ? ` (${stats.teamB.pointsPercentage}%)` : ''}</div>
                      </div>
                  `).join('')}
              </div>
              <div class="stats-block">
              <h3>Player Stats - ${stats.teamA.name}</h3>
                  ${stats.teamA.players && stats.teamA.players.length === 2 ? `
                  <div class="stats-row player-header">
                      <div>${stats.teamA.players[0]?.name || 'Player 1'}</div>
                      <div></div>
                      <div>${stats.teamA.players[1]?.name || 'Player 2'}</div>
                  </div>
                  ${statsTable.filter(sd => sd.showInPlayerStats).map(statDef => `
                      <div class="stats-row">
                          <div>${stats.teamA.players[0]?.[statDef.key] ?? '-'}${statDef.key === 'attackEfficiency' ? '%' : ''}</div>
                          <div>${statDef.label}</div>
                          <div>${stats.teamA.players[1]?.[statDef.key] ?? '-'}${statDef.key === 'attackEfficiency' ? '%' : ''}</div>
                      </div>
                  `).join('')}` : `<div class="no-data">Player stats not available.</div>`}
              </div>
              <div class="stats-block">
               <h3>Player Stats - ${stats.teamB.name}</h3>
                  ${stats.teamB.players && stats.teamB.players.length === 2 ? `
                   <div class="stats-row player-header">
                       <div>${stats.teamB.players[0]?.name || 'Player 1'}</div>
                       <div></div>
                       <div>${stats.teamB.players[1]?.name || 'Player 2'}</div>
                   </div>
                   ${statsTable.filter(sd => sd.showInPlayerStats).map(statDef => `
                       <div class="stats-row">
                           <div>${stats.teamB.players[0]?.[statDef.key] ?? '-'}${statDef.key === 'attackEfficiency' ? '%' : ''}</div>
                           <div>${statDef.label}</div>
                           <div>${stats.teamB.players[1]?.[statDef.key] ?? '-'}${statDef.key === 'attackEfficiency' ? '%' : ''}</div>
                       </div>
                   `).join('')}` : `<div class="no-data">Player stats not available.</div>`}
              </div>
              <div class="stats-block">
              <h3>Match Info</h3>
                  <div class="info-item">
                      <div>${stats.totalRallies ?? 0}</div>
                      <div>Total Rallies Completed</div>
                  </div>
                  <div class="info-item">
                       <div>${stats.longestRally?.actions ?? 0}</div>
                       <div>Longest Rally (Actions)</div>
                  </div>
                  <div class="info-item">
                        <div>Longest Rally Sequence</div>
                        <div>${stats.longestRally?.sequence || '-'}</div>
                  </div>
                  <div class="info-item">
                      <div>Set ${stats.currentSet + 1}</div>
                      <div>Current Set</div>
                  </div>
              </div>
              <div class="stats-block">
              <h3>Set Scores</h3>
                  ${stats.setScores?.map(set => `
                      <div class="stats-row">
                          <div>${set.scoreA}</div>
                          <div>Set ${set.set}</div>
                          <div>${set.scoreB}</div>
                      </div>
                  `).join('') || `<div class="no-data">No sets completed yet.</div>`}
              </div>
          </div>
      </div>`;
     statsContainer.innerHTML = html;

      // Re-attach listener for the new close button
     const closeBtn = statsContainer.querySelector('.close-modal');
     if (closeBtn) {
         closeBtn.addEventListener('click', hideStatisticsModal);
     }
}

function showStatisticsModal() {
    try {
         const stats = calculateMatchStatistics(appState.gameMode);
         generateStatisticsModalContent(stats);
         showModal(statisticsModal);
     } catch (error) {
         console.error("Error generating or showing statistics modal:", error);
         alert("Could not display statistics. Please check the console for errors.");
     }
}

function hideStatisticsModal() {
    hideModal(statisticsModal);
}

// --- All Stats Modal (Category Stats) ---
function generateCategoryTeamStatsRows(categoryStats, categoryKey) {
    if (!categoryStats || Object.keys(categoryStats).length === 0) {
        return `<div class="no-data">No data</div>`;
    }

    let html = '';
    let totalA = 0;
    let totalB = 0;
    Object.values(categoryStats).forEach(counts => {
        totalA += counts.a || 0;
        totalB += counts.b || 0;
    });

    // Sort actions alphabetically
    const sortedActions = Object.keys(categoryStats).sort();

    sortedActions.forEach(action => {
        const counts = categoryStats[action];
        const countA = counts.a || 0;
        const countB = counts.b || 0;
        const percentA = totalA > 0 ? Math.round((countA / totalA) * 100) : 0;
        const percentB = totalB > 0 ? Math.round((countB / totalB) * 100) : 0;

        let helpText = getActionHelpText(action); // Get help text

        html += `
            <div class="stats-row">
                <div>${countA} (${percentA}%)</div>
                <div>${action}</div>
                <div>${countB} (${percentB}%)</div>
            </div>
        `;
    });


    // Add total row with simplified label
    html += `
        <div class="stats-row total">
            <div>${totalA}</div>
            <div>Total</div>
            <div>${totalB}</div>
        </div>
    `;
    

    return html;
}

function generateCategoryPlayerStatsRows(playerStats, categoryKey, playerNames) {
    if (!playerStats || Object.keys(playerStats).length === 0) {
        return `<div class="no-data">No ${getCategoryDisplayName(categoryKey)} data</div>`;
    }

    let html = '';
    let totalP1 = 0;
    let totalP2 = 0;
    Object.values(playerStats).forEach(counts => {
        totalP1 += counts['1'] || 0;
        totalP2 += counts['2'] || 0;
    });

    // Player header row
    html += `
         <div class="stats-row player-header">
             <div>${playerNames[0]}</div>
             <div></div>
             <div>${playerNames[1]}</div>
         </div>
     `;

    // Sort actions alphabetically
    const sortedActions = Object.keys(playerStats).sort();

    sortedActions.forEach(action => {
        const counts = playerStats[action];
        const countP1 = counts['1'] || 0;
        const countP2 = counts['2'] || 0;
        const percentP1 = totalP1 > 0 ? Math.round((countP1 / totalP1) * 100) : 0;
        const percentP2 = totalP2 > 0 ? Math.round((countP2 / totalP2) * 100) : 0;

        let helpText = getActionHelpText(action); // Get help text

        html += `
            <div class="stats-row">
                <div>${countP1} (${percentP1}%)</div>
                <div>${action}</div>
                <div>${countP2} (${percentP2}%)</div>
            </div>
        `;
    });


    // Add total row with simplified label
    html += `
        <div class="stats-row total">
            <div>${totalP1}</div>
            <div>Total</div>
            <div>${totalP2}</div>
        </div>
    `;
    

    return html;
}

function getActionHelpText(action) {
    const currentStateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
    for (const stateName in currentStateMachine) {
         if (stateName.startsWith('__')) continue;
         const transitions = currentStateMachine[stateName]?.transitions || [];
         const transition = transitions.find(t => t.action === action);
         if (transition?.help) {
             return transition.help;
         }
     }
     return action; // Return action itself if no help text found
}

function showAllStatsModal() {
    if (!allStatsContainer || !allStatsModal) {
         console.error("All Stats modal elements not found."); return;
     }

    const categoryStats = generateCategoryStats(); // Assumes generateCategoryStats is available (from stats/stats-reporting.js)

let html = `
    <div class="all-stats-content">
        <h1>All Stats</h1>
        <div class="stats-section">
    
    `;

    const categories = getAllCategories(); // Get categories dynamically
    const sortedCategories = Object.keys(categories).sort();

    sortedCategories.forEach(categoryKey => {
        const categoryName = getCategoryDisplayName(categoryKey);
        const teamCatStats = categoryStats.team[categoryKey];
        const playerACatStats = categoryStats.playerA[categoryKey];
        const playerBCatStats = categoryStats.playerB[categoryKey];

        // Only show sections if there's data
        const hasTeamData = teamCatStats && Object.keys(teamCatStats).length > 0;
        const hasPlayerAData = playerACatStats && Object.keys(playerACatStats).length > 0;
        const hasPlayerBData = playerBCatStats && Object.keys(playerBCatStats).length > 0;
        
        // Check if this category is marked as team-only
        const isTeamOnlyCategory = categoryStats.teamOnlyCategories && categoryStats.teamOnlyCategories[categoryKey];

        if (hasTeamData) {
            html += `
                 <div class="stats-block">
                      <h3>${categoryName} - Team</h3>
                       ${generateCategoryTeamStatsRows(teamCatStats, categoryKey)}
                 </div>
             `;
        }
        
        // Only show player statistics if the category is not team-only
        if (hasPlayerAData && !isTeamOnlyCategory) {
              html += `
                 <div class="stats-block">
                      <h3>${categoryName} - ${appState.teams.a.name}</h3>
                       ${generateCategoryPlayerStatsRows(playerACatStats, categoryKey, appState.teams.a.players)}
                  </div>
              `;
          }
          
        if (hasPlayerBData && !isTeamOnlyCategory) {
               html += `
                  <div class="stats-block">
                      <h3>${categoryName} - ${appState.teams.b.name}</h3>
                     ${generateCategoryPlayerStatsRows(playerBCatStats, categoryKey, appState.teams.b.players)}
                 </div>
             `;
         }
    });

    html += `</div></div>`; // Close stats-container
    allStatsContainer.innerHTML = html;

    // Re-attach listener for the new close button
    const closeBtn = allStatsContainer.querySelector('.close-modal');
    if (closeBtn) {
         closeBtn.addEventListener('click', hideAllStatsModal);
     }

    showModal(allStatsModal);
}

function hideAllStatsModal() {
    hideModal(allStatsModal);
}

// --- Set 3 Server Modal ---
function showSet3ServerModal() {
    if (!set3TeamAName || !set3TeamBName) return;
    // Set team names in the dialog before showing
    set3TeamAName.textContent = appState.teams.a.name;
    set3TeamBName.textContent = appState.teams.b.name;
    // Default selection (optional)
    const firstRadio = set3ServerModal.querySelector('input[type="radio"]');
    if(firstRadio) firstRadio.checked = true;

    showModal(set3ServerModal);
}

function hideSet3ServerModal() {
    hideModal(set3ServerModal);
}

// Function to handle escape key presses for closing modals
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        // Check modals in reverse order of likely appearance
        if (!allStatsModal.classList.contains('hidden')) {
            hideAllStatsModal();
        } else if (!statisticsModal.classList.contains('hidden')) {
            hideStatisticsModal();
        } else if (!legendModal.classList.contains('hidden')) {
            hideLegendModal();
        } else if (!set3ServerModal.classList.contains('hidden')) {
             // Optionally prevent closing Set 3 modal with Esc if choice is mandatory
             // Or allow closing: hideSet3ServerModal();
        }
    }
}


