
// Helper to count total attacks based on specific actions within rallies for a given team
// Note: This needs the stateMachine definition available globally.
function calculateTotalAttacks(team, rallyHistory) {
    let count = 0;
    const teamKey = team === 'a' ? 'a' : 'b';
    
    // Convert Object.values to array for standard for loop
    const rallies = Object.values(rallyHistory);
 
    for (let r = 0; r < rallies.length; r++) {
        const rally = rallies[r];
        
        let isTeamsTurn; // Determine whose turn it is based on serving/receiving at the start
        const isTeamAServing = rally.servingTeam === 'a';
  
        // Phase 1: Serve/Reception
        isTeamsTurn = (teamKey === rally.servingTeam); // Server's turn initially
  
        let currentState = stateMachine.__rules__.initialState; // Assumes 'Serve'
        
        // Process each action in this rally
        let skipRemainingActions = false;
        
        for (let a = 0; a < rally.actions.length; a++) {
            const action = rally.actions[a];
            
            // Find the transition to understand the action's context
            const transitions = stateMachine[currentState]?.transitions || [];
            const transition = transitions.find(t => t.action === action);
  
            if (transition) {
                const category = transition.category;
                const statTeamRef = transition.statTeam; // "Serving" or "Receiving"
  
                // Determine the actual team ('a' or 'b') performing the action
                let performingTeam = null;
                if (statTeamRef === "Serving") {
                    performingTeam = isTeamAServing ? 'a' : 'b';
                } else if (statTeamRef === "Receiving") {
                    performingTeam = isTeamAServing ? 'b' : 'a';
                }
  
                // Check if this action qualifies as an attack attempt by the specified team
                // Advanced mode: Win, Err, Blk actions at the end of attack sequences
                // Beginner mode: Win[1/2], Err[1/2], Blk[1/2] actions
                let isAttackAction = false;
                if (stateMachine === advancedStateMachine) {
                    // Attack results or blocks signify the end of an attack attempt
                    isAttackAction = category === 'atk Result' || category === 'atk Res'; // Includes Win, Err, Blk
                } else {
                    isAttackAction = category === 'attack'; // Includes Win1/2, Err1/2, Blk1/2
                }
  
                if (isAttackAction && performingTeam === teamKey) {
                    count++;
                }
  
                // Update current state for the next action
                currentState = transition.nextState;
  
                // Basic turn switching logic (might need refinement for complex scenarios)
                // Generally, after reception or defense, the turn switches.
                if (category === 'reception' || category === 'defense' || category === 'set') {
                    // This implies the other team will likely attack next
                }
                if(isAttackAction) {
                    // After an attack result, the rally might end or continue with defense - turn depends on result
                }
            } else {
                console.warn(`No transition found for action "${action}" from state "${currentState}"`);
                // Attempt to find the action anywhere to guess the next state maybe? Risky.
                let foundNextState = null;
                
                // Search for the action in any state
                for (const stateName in stateMachine) {
                    if (stateName.startsWith('__')) continue;
                    
                    const otherTransitions = stateMachine[stateName]?.transitions || [];
                    const foundElsewhere = otherTransitions.find(t => t.action === action);
                    
                    if (foundElsewhere) {
                        foundNextState = foundElsewhere.nextState;
                        break; // This break is now correctly scoped to this for loop
                    }
                }
                
                if (foundNextState) {
                    currentState = foundNextState; // Use best guess if found
                } else {
                    // Stop processing this rally if state is completely lost
                    skipRemainingActions = true;
                    break; // Now correctly breaks out of the actions loop
                }
            }
        } // End of actions loop
        
        if (skipRemainingActions) {
            // Continue with the next rally if needed
            continue;
        }
    } // End of rallies loop
    
    return count;
}
  
// Helper function to find the last serving player (simplified)
function findLastServingPlayer(actions) {
    // In advanced mode, the server is P1 of the serving team
    // In beginner mode, it's just the serving team (player irrelevant)
    // This function might need more context if player rotation is tracked
    return '1'; // Placeholder - assumes player 1 serves if specific player needed
}
  
// Helper function to find the last attacking player (from Atk actions)
function findLastAttackingPlayer(actions) {
    for (let i = actions.length - 1; i >= 0; i--) {
        if (stateMachine === advancedStateMachine && actions[i].match(/^Atk[12]$/)) {
             return actions[i].charAt(actions[i].length - 1);
        }
        // Beginner mode attack actions name the player directly (Win1/Err1 etc.)
         if (stateMachine === beginnerStateMachine && actions[i].match(/^(Win|Err|Blk)[12]$/)) {
             return actions[i].charAt(actions[i].length - 1);
         }
    }
    return null; // No attacking player identified
}
  
// Helper function to get player number from the final action (if applicable)
function getPlayerNumberFromLastAction(action) {
    // Works for actions like RE1, RE2, Win1, Win2, Err1, Err2, Blk1, Blk2, Def1, Def2, SetE1, SetE2, Atk1, Atk2
    const match = action.match(/[12]$/);
    return match ? match[0] : null;
}
  
// --- Statistics Calculation (Combined Logic) ---
  
function calculateMatchStatistics(gameMode = 'advanced') {
    const currentStateMachine = gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
    const statsTable = currentStateMachine.__statisticsTable__;
  
    // Initialize stats structure
    const stats = {
        teamA: { name: appState.teams.a.name, players: [], pointsPercentage: 0 },
        teamB: { name: appState.teams.b.name, players: [], pointsPercentage: 0 },
        totalRallies: Object.keys(appState.rallyHistory).length,
        longestRally: { actions: 0, sequence: '' },
        currentSet: appState.currentSet,
        setScores: []
    };
  
    // Initialize team-level stats and player structures
    statsTable.forEach(statDef => {
        stats.teamA[statDef.key] = 0;
        stats.teamB[statDef.key] = 0;
    });
  
    [0, 1].forEach(i => {
        stats.teamA.players[i] = { name: appState.teams.a.players[i] };
        stats.teamB.players[i] = { name: appState.teams.b.players[i] };
        statsTable.filter(sd => sd.showInPlayerStats).forEach(statDef => {
            stats.teamA.players[i][statDef.key] = 0;
            stats.teamB.players[i][statDef.key] = 0;
        });
    });
  
    // 1. Calculate all base statistics using the __statisticsTable__ definitions
    statsTable.forEach(statDef => {
        // Calculate team totals
        stats.teamA[statDef.key] = statDef.calculate('a', appState.rallyHistory);
        stats.teamB[statDef.key] = statDef.calculate('b', appState.rallyHistory);
  
        // Calculate player stats if applicable
        if (statDef.showInPlayerStats) {
              // Check if the calculate function accepts a playerIndex
              if (statDef.calculate.length >= 3) { // Assumes function signature (team, history, playerIndex)
                 stats.teamA.players[0][statDef.key] = statDef.calculate('a', appState.rallyHistory, 0);
                 stats.teamA.players[1][statDef.key] = statDef.calculate('a', appState.rallyHistory, 1);
                 stats.teamB.players[0][statDef.key] = statDef.calculate('b', appState.rallyHistory, 0);
                 stats.teamB.players[1][statDef.key] = statDef.calculate('b', appState.rallyHistory, 1);
              } else {
                 // If function doesn't support playerIndex, try to distribute based on action naming convention
                 // This is complex and requires iterating through rallies again
                 console.warn(`Stat '${statDef.key}' cannot be automatically calculated per player without specific logic.`);
                 // Add manual player stat calculation logic here if needed, using rallyHistory
                 calculatePlayerSpecificStatManual(stats, statDef.key);
              }
        }
    });
  
     // 2. Calculate derived statistics (like percentages)
     const totalPoints = (stats.teamA.pointsWon || 0) + (stats.teamB.pointsWon || 0);
     stats.teamA.pointsPercentage = totalPoints > 0 ? Math.round(((stats.teamA.pointsWon || 0) / totalPoints) * 100) : 0;
     stats.teamB.pointsPercentage = totalPoints > 0 ? Math.round(((stats.teamB.pointsWon || 0) / totalPoints) * 100) : 0;
  
    // Player efficiencies are calculated within their definitions in __statisticsTable__
  
    // 3. Process Rallies for Longest Rally
    Object.values(appState.rallyHistory).forEach(rally => {
        if (rally.actions.length > stats.longestRally.actions) {
            stats.longestRally.actions = rally.actions.length;
            stats.longestRally.sequence = rally.actions.join(' ');
        }
    });
  
    // 4. Populate Set Scores
    for (let i = 0; i <= appState.currentSet; i++) {
         // Use setScores for completed sets, currentScore for the ongoing set
         const scoreA = i < appState.currentSet ? (appState.teams.a.setScores[i] ?? 0) : appState.teams.a.currentScore;
         const scoreB = i < appState.currentSet ? (appState.teams.b.setScores[i] ?? 0) : appState.teams.b.currentScore;
         // Ensure scores are numbers
         const numScoreA = Number(scoreA) || 0;
         const numScoreB = Number(scoreB) || 0;
  
         stats.setScores.push({
             set: i + 1,
             scoreA: numScoreA,
             scoreB: numScoreB,
             winner: numScoreA > numScoreB ? 'a' : (numScoreB > numScoreA ? 'b' : null)
         });
     }
  
     return stats;
}
  
// Manual calculation for player stats if calculate function doesn't support playerIndex
// This needs to be implemented specifically for each stat key required.
function calculatePlayerSpecificStatManual(statsObject, statKey) {
     // Example for 'attackPoints' in beginner mode (Win1/Win2)
     if (stateMachine === beginnerStateMachine && statKey === 'attackPoints') {
         Object.values(appState.rallyHistory).forEach(rally => {
             rally.actions.forEach(action => {
                 if (action === 'Win1') {
                     if (rally.scoringTeam === 'a') statsObject.teamA.players[0][statKey]++;
                     if (rally.scoringTeam === 'b') statsObject.teamB.players[0][statKey]++;
                 } else if (action === 'Win2') {
                     if (rally.scoringTeam === 'a') statsObject.teamA.players[1][statKey]++;
                     if (rally.scoringTeam === 'b') statsObject.teamB.players[1][statKey]++;
                 }
             });
         });
     }
    // Add similar logic for other keys like 'attackErrors', 'blocks', 'receptionErrors', 'defenses'
    // This duplicates logic from the stat table but split by player.
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