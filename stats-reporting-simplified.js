// Helper function to determine which team is defending based on rally state
function determineDefendingTeam(rally, actionIndex) {
    const attackingTeam = determineAttackingTeam(rally, actionIndex);
    // The defending team is the opposite of the attacking team
    return attackingTeam === 'a' ? 'b' : 'a';
}

// Helper function to determine which team is attacking based on rally state
function determineAttackingTeam(rally, actionIndex) {
    const isTeamAServing = rally.servingTeam === 'a';
    
    // Count possession changes up to this action
    let currentTurn = 0;
    for (let j = 0; j < actionIndex; j++) {
        const prevAction = rally.actions[j];
        // Reception and defense actions typically switch possession
        if (prevAction.startsWith('Rec') || prevAction.startsWith('Def')) {
            currentTurn++;
        }
    }
    
    // Even number of turns means serving team is attacking, odd means receiving team
    return (currentTurn % 2 === 0) ? 
        rally.servingTeam : 
        (rally.servingTeam === 'a' ? 'b' : 'a');
}
 
// --- Category Stats (For All Stats Modal) ---
 
function getAllCategories() {
    const categories = {};
    const currentStateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
  
    for (const stateName in currentStateMachine) {
        if (stateName.startsWith('__')) continue;
        const state = currentStateMachine[stateName];
        if (!state.transitions) continue;
        state.transitions.forEach(transition => {
            if (transition.category) {
                categories[transition.category] = true; // Use category key
            }
        });
    }
    return categories; // Returns object like {'serve': true, 'reception': true, ...}
}
 
function getCategoryDisplayName(categoryKey) {
     // Simple conversion: 'atkRes' -> 'Atk Res', 'serve' -> 'Serve'
     return categoryKey
         .replace(/([A-Z])/g, ' $1') // Add space before capitals
         .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
}
   
function generateCategoryStats() {
    const stats = { 
        team: {}, 
        playerA: {}, 
        playerB: {},
        teamOnlyCategories: {} // Track categories with team-only actions
    };
    const categories = getAllCategories();
    const currentStateMachine = appState.gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
 
    // Initialize category structures
    Object.keys(categories).forEach(category => {
        stats.team[category] = {}; // Action counts: { action: { a: 0, b: 0 }}
        stats.playerA[category] = {}; // Action counts: { action: { 1: 0, 2: 0 }}
        stats.playerB[category] = {}; // Action counts: { action: { 1: 0, 2: 0 }}
    });    
    
    // Process all historical rallies
    const rallies = Object.values(appState.rallyHistory);
    for (let r = 0; r < rallies.length; r++) {
        const rally = rallies[r];
        let currentState = currentStateMachine.__rules__.initialState;
        const isTeamAServing = rally.servingTeam === 'a';
 
        // Track last player involved for '-1' attribution
        let lastPlayer = { team: null, num: null };
 
        let skipRemainingActions = false;
        for (let a = 0; a < rally.actions.length; a++) {
            const action = rally.actions[a];
            const transitions = currentStateMachine[currentState]?.transitions || [];
            const transition = transitions.find(t => t.action === action);
 
            if (transition) {
                const category = transition.category;
                const statTeamRef = transition.statTeam;
                const statPlayerRef = transition.statPlayer;
 
                if (category && statTeamRef && categories[category]) {
                    const actingTeam = (statTeamRef === "Serving")
                        ? (isTeamAServing ? 'a' : 'b')
                        : (isTeamAServing ? 'b' : 'a');
 
                    // --- Team Stats ---
                    if (!stats.team[category][action]) {
                        stats.team[category][action] = { a: 0, b: 0 };
                    }
                    stats.team[category][action][actingTeam]++;
 
                    // --- Check if this is a team-only action ---
                    if (statPlayerRef === '0') {
                        stats.teamOnlyCategories[category] = true;
                    }
 
                    // --- Player Stats (only if not team-only) ---
                    if (statPlayerRef !== '0') {
                        const playerStatsTarget = (actingTeam === 'a') ? stats.playerA[category] : stats.playerB[category];
                        if (!playerStatsTarget[action]) {
                            playerStatsTarget[action] = { 1: 0, 2: 0 };
                        }
 
                        let targetPlayerNum = null;
                        if (statPlayerRef === '1' || statPlayerRef === '2') {
                            targetPlayerNum = parseInt(statPlayerRef);
                        } else if (statPlayerRef === '-1') {
                            if(lastPlayer.team === actingTeam && lastPlayer.num) {
                                targetPlayerNum = lastPlayer.num;
                            } else {
                                // If we can't determine the player, distribute evenly
                                playerStatsTarget[action][1]++;
                                playerStatsTarget[action][2]++;
                                console.warn(`Could not determine player for action ${action} (statPlayer: -1), assigned to both.`);
                                // Continue to next action since we've already handled this case
                                continue;
                            }
                        }
 
                        if (targetPlayerNum) {
                            playerStatsTarget[action][targetPlayerNum]++;
                            lastPlayer = { team: actingTeam, num: targetPlayerNum };
                        }
                    }
                }
 
                // Update lastPlayer if the current action specifies a player directly
                if ((statPlayerRef === '1' || statPlayerRef === '2') && typeof actingTeam !== 'undefined' && actingTeam) {
                    lastPlayer = { team: actingTeam, num: parseInt(statPlayerRef) };
                }
 
                // Advance to the next state for the next action
                currentState = transition.nextState;
 
            } else {
                console.warn(`Category Stats: No transition found for action "${action}" from state "${currentState}" in rally.`);
                let foundNextState = null;
                for (const stateName in currentStateMachine) {
                    if (stateName.startsWith('__')) continue;
                    const otherTransitions = currentStateMachine[stateName]?.transitions || [];
                    const foundElsewhere = otherTransitions.find(t => t.action === action);
                    if (foundElsewhere) {
                        foundNextState = foundElsewhere.nextState;
                        break;
                    }
                }
                if (foundNextState) {
                    currentState = foundNextState;
                } else {
                    console.error(`Category Stats: Cannot determine next state after action "${action}". Aborting rally processing.`);
                    skipRemainingActions = true;
                    break;
                }
            }
        }
         
        if (skipRemainingActions) {
            continue;
        }
    }
 
    // Clean up empty categories and actions
    Object.keys(stats.team).forEach(category => {
        if (Object.keys(stats.team[category]).length === 0) {
            delete stats.team[category];
        }
    });
    
    Object.keys(stats.playerA).forEach(category => {
        if (Object.keys(stats.playerA[category]).length === 0) {
            delete stats.playerA[category];
        }
    });
    
    Object.keys(stats.playerB).forEach(category => {
        if (Object.keys(stats.playerB[category]).length === 0) {
            delete stats.playerB[category];
        }
    });
 
    return stats;
}
