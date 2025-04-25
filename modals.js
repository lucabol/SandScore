
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

         // Player header row removed
         
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

    // Action header row (without team names)
    html += `<div class="stats-row action-header">
        <div></div>
        <div>Action</div>
        <div></div>
    </div>`;

    // Sort actions alphabetically
    const sortedActions = Object.keys(categoryStats).sort();

    sortedActions.forEach(action => {
        const counts = categoryStats[action];
        const countA = counts.a || 0;
        const countB = counts.b || 0;
        const percentA = totalA > 0 ? Math.round((countA / totalA) * 100) : 0;
        const percentB = totalB > 0 ? Math.round((countB / totalB) * 100) : 0;

        html += `<div class="stats-row">
            <div>${countA} <span class="stats-percent">(${percentA}%)</span></div>
            <div>${action}</div>
            <div>${countB} <span class="stats-percent">(${percentB}%)</span></div>
        </div>`;
    
    });

    // Add total row with simplified label
    html += `<div class="stats-row total">
        <div>${totalA}</div>
        <div>Total</div>
        <div>${totalB}</div>
    </div>`;

    return html;
}
    
function generateCategoryPlayerStatsRows(playerStats, categoryKey, playerNames) {
    if (!playerStats || Object.keys(playerStats).length === 0) {
        return `<div class="no-data">No data available</div>`;
    }
    
    let html = '';
    let totalP1 = 0;
    let totalP2 = 0;
    Object.values(playerStats).forEach(counts => {
        totalP1 += counts['1'] || 0;
        totalP2 += counts['2'] || 0;
    });
    
    // Add player names header row
    html += `<div class="stats-row player-header">
        <div>${playerNames && playerNames[0] ? playerNames[0] : 'Player 1'}</div>
        <div>Action</div>
        <div>${playerNames && playerNames[1] ? playerNames[1] : 'Player 2'}</div>
    </div>`;
    
    // Sort actions alphabetically
    const sortedActions = Object.keys(playerStats).sort();
    
    sortedActions.forEach(action => {
        const counts = playerStats[action];
        const countP1 = counts['1'] || 0;
        const countP2 = counts['2'] || 0;
        const percentP1 = totalP1 > 0 ? Math.round((countP1 / totalP1) * 100) : 0;
        const percentP2 = totalP2 > 0 ? Math.round((countP2 / totalP2) * 100) : 0;
        
        html += `<div class="stats-row">
            <div>${countP1} <span class="stats-percent">(${percentP1}%)</span></div>
            <div>${action}</div>
            <div>${countP2} <span class="stats-percent">(${percentP2}%)</span></div>
        </div>`;
    });
    
    // Add total row with simplified label
    html += `<div class="stats-row total">
        <div>${totalP1}</div>
        <div>Total</div>
        <div>${totalP2}</div>
    </div>`;
    
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
         console.error("All Stats modal elements not found."); 
         return;
    }

    const categoryStats = generateCategoryStats();
    const categories = getAllCategories();
    const sortedCategories = Object.keys(categories).sort();

    let html = `<div class="all-stats-content">
        <h1 class="stats-title">All Stats</h1>
        <div class="stats-consolidated-view">
            <div class="team-names-header">
                <div class="team-name-left">${appState.teams.a.name}</div>
                <div class="team-name-right">${appState.teams.b.name}</div>
            </div>`;

    sortedCategories.forEach(categoryKey => {
        const categoryName = getCategoryDisplayName(categoryKey);
        const teamCatStats = categoryStats.team[categoryKey];
        const playerACatStats = categoryStats.playerA[categoryKey];
        const playerBCatStats = categoryStats.playerB[categoryKey];
        const isTeamOnlyCategory = categoryStats.teamOnlyCategories && categoryStats.teamOnlyCategories[categoryKey];

        if (teamCatStats && Object.keys(teamCatStats).length > 0) {
            html += `<div class="stats-category-block">
                <h3 class="category-header">${categoryName}</h3>
                
                <div class="team-stats-section">
                    ${generateCategoryTeamStatsRows(teamCatStats, categoryKey)}
                </div>`;
            
            if (!isTeamOnlyCategory && 
                ((playerACatStats && Object.keys(playerACatStats).length > 0) ||
                 (playerBCatStats && Object.keys(playerBCatStats).length > 0))) {
                
                html += `
                <div class="player-stats-toggle" data-category="${categoryKey}">
                    <span class="toggle-icon">+</span> Show Player Stats
                </div>
                
                <div class="player-stats-section hidden" id="player-stats-${categoryKey}">`;
                
                if (playerACatStats && Object.keys(playerACatStats).length > 0) {
                    html += `
                    <div class="player-team-section">
                        <h4 class="player-team-header">${appState.teams.a.name}</h4>
                        ${generateCategoryPlayerStatsRows(playerACatStats, categoryKey, appState.teams.a.players)}
                    </div>`;
                }
                
                if (playerBCatStats && Object.keys(playerBCatStats).length > 0) {
                    html += `
                    <div class="player-team-section">
                        <h4 class="player-team-header">${appState.teams.b.name}</h4>
                        ${generateCategoryPlayerStatsRows(playerBCatStats, categoryKey, appState.teams.b.players)}
                    </div>`;
                }
                
                html += `</div>`;
            }
            
            html += `</div>`;
        }

    });

    html += `</div></div>`;
    allStatsContainer.innerHTML = html;

    const toggles = allStatsContainer.querySelectorAll('.player-stats-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const playerStatsSection = document.getElementById(`player-stats-${category}`);
            const toggleIcon = this.querySelector('.toggle-icon');

            if (playerStatsSection.classList.contains('hidden')) {
                playerStatsSection.classList.remove('hidden');
                toggleIcon.textContent = '-';
                this.innerHTML = this.innerHTML.replace('Show Player Stats', 'Hide Player Stats');
            } else {
                playerStatsSection.classList.add('hidden');
                toggleIcon.textContent = '+';
                this.innerHTML = this.innerHTML.replace('Hide Player Stats', 'Show Player Stats');
            }
        });
    });

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
        } else if (!legendModal.classList.contains('hidden')) {
            hideLegendModal();
        } else if (!set3ServerModal.classList.contains('hidden')) {
             // Optionally prevent closing Set 3 modal with Esc if choice is mandatory
             // Or allow closing: hideSet3ServerModal();
        }
    }
}

