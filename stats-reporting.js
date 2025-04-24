
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
        // Beginner mode attack actions name the player directly (Win1, Err1 etc.)
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
 
// --- Player Attribution Helper Functions ---
 
/**
 * Determines which team is currently attacking based on rally state
 * @param {Object} rally - The rally object containing actions and serving team
 * @param {number} actionIndex - Current action index in the rally
 * @returns {string} - 'a' or 'b' indicating the attacking team
 */
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
 
/**
 * Determines which team is currently defending based on rally state
 * @param {Object} rally - The rally object containing actions and serving team
 * @param {number} actionIndex - Current action index in the rally
 * @returns {string} - 'a' or 'b' indicating the defending team
 */
function determineDefendingTeam(rally, actionIndex) {
    const attackingTeam = determineAttackingTeam(rally, actionIndex);
    // The defending team is the opposite of the attacking team
    return attackingTeam === 'a' ? 'b' : 'a';
}
 
/**
 * Finds the player who performed a specific action type most recently before the given index
 * @param {Array} actions - Array of actions in the rally
 * @param {number} currentIndex - Current action index
 * @param {Array} actionTypes - Array of action type prefixes to look for
 * @returns {string|null} - Player number ('1' or '2') or null if not found
 */
function findPlayerForPreviousAction(actions, currentIndex, actionTypes) {
    for (let i = currentIndex - 1; i >= 0; i--) {
        const action = actions[i];
        for (const actionType of actionTypes) {
            if (action.startsWith(actionType)) {
                // Extract player number if present in the action
                const playerMatch = action.match(/[12]$/);
                if (playerMatch) {
                    return playerMatch[0];
                }
            }
        }
    }
    return null;
}
 
/**
 * Analyzes a rally sequence to determine the player who performed an attack
 * @param {Object} rally - The rally object
 * @param {number} actionIndex - Index of the attack result action
 * @returns {Object} - {team: 'a'|'b', player: 0|1} or null if undetermined
 */
function analyzeAttackSequence(rally, actionIndex) {
    const attackingTeam = determineAttackingTeam(rally, actionIndex);
    let attackingPlayer = null;
    
    // For advanced mode
    if (stateMachine === advancedStateMachine) {
        // Look for the most recent Atk1 or Atk2 action
        const playerNum = findPlayerForPreviousAction(rally.actions, actionIndex, ['Atk']);
        if (playerNum) {
            attackingPlayer = parseInt(playerNum) - 1; // Convert to 0-based index
        }
    } 
    // For beginner mode
    else if (stateMachine === beginnerStateMachine) {
        // In beginner mode, the player is directly in the action (Win1, Err1, etc.)
        const action = rally.actions[actionIndex];
        const playerMatch = action.match(/[12]$/);
        if (playerMatch) {
            attackingPlayer = parseInt(playerMatch[0]) - 1; // Convert to 0-based index
        }
    }
    
    // If we couldn't determine the player, use a fallback
    if (attackingPlayer === null) {
        // Default to player 0 as a fallback
        attackingPlayer = 0;
    }
    
    return { team: attackingTeam, player: attackingPlayer };
}
 
/**
 * Analyzes a rally sequence to determine the player who performed a block
 * @param {Object} rally - The rally object
 * @param {number} actionIndex - Index of the block action
 * @returns {Object} - {team: 'a'|'b', player: 0|1} or null if undetermined
 */
function analyzeBlockSequence(rally, actionIndex) {
    // In volleyball, the blocking team is typically the defending team
    const defendingTeam = determineDefendingTeam(rally, actionIndex);
    let blockingPlayer = null;
    
    // For advanced mode
    if (stateMachine === advancedStateMachine) {
        // Look for the most recent Def1 or Def2 action to determine who was at the net
        const playerNum = findPlayerForPreviousAction(rally.actions, actionIndex, ['Def']);
        if (playerNum) {
            blockingPlayer = parseInt(playerNum) - 1; // Convert to 0-based index
        }
    } 
    // For beginner mode
    else if (stateMachine === beginnerStateMachine) {
        // In beginner mode, the player is directly in the action (Blk1, Blk2)
        const action = rally.actions[actionIndex];
        const playerMatch = action.match(/[12]$/);
        if (playerMatch) {
            blockingPlayer = parseInt(playerMatch[0]) - 1; // Convert to 0-based index
        }
    }
    
    // If we couldn't determine the player, use a fallback
    if (blockingPlayer === null) {
        // Default to player 0 as a fallback
        blockingPlayer = 0;
    }
    
    return { team: defendingTeam, player: blockingPlayer };
}
 
/**
 * Analyzes a rally sequence to determine the player who performed a reception
 * @param {Object} rally - The rally object
 * @param {number} actionIndex - Index of the reception action or error
 * @returns {Object} - {team: 'a'|'b', player: 0|1} or null if undetermined
 */
function analyzeReceptionSequence(rally, actionIndex) {
    // The receiving team is the opposite of the serving team
    const receivingTeam = rally.servingTeam === 'a' ? 'b' : 'a';
    let receivingPlayer = null;
    
    // For advanced mode
    if (stateMachine === advancedStateMachine) {
        // Look for the most recent Rec1 or Rec2 action
        const playerNum = findPlayerForPreviousAction(rally.actions, actionIndex, ['Rec']);
        if (playerNum) {
            receivingPlayer = parseInt(playerNum) - 1; // Convert to 0-based index
        }
    } 
    // For beginner mode
    else if (stateMachine === beginnerStateMachine) {
        // In beginner mode, the player is directly in the action (RE1, RE2)
        const action = rally.actions[actionIndex];
        const playerMatch = action.match(/[12]$/);
        if (playerMatch) {
            receivingPlayer = parseInt(playerMatch[0]) - 1; // Convert to 0-based index
        }
    }
    
    // If we couldn't determine the player, use a fallback
    if (receivingPlayer === null) {
        // Default to player 0 as a fallback
        receivingPlayer = 0;
    }
    
    return { team: receivingTeam, player: receivingPlayer };
}
 
/**
 * Analyzes a rally sequence to determine the player who performed a set
 * @param {Object} rally - The rally object
 * @param {number} actionIndex - Index of the set action or error
 * @returns {Object} - {team: 'a'|'b', player: 0|1} or null if undetermined
 */
function analyzeSetSequence(rally, actionIndex) {
    const action = rally.actions[actionIndex];
    const settingTeam = determineAttackingTeam(rally, actionIndex);
    let settingPlayer = null;
    
    // For advanced mode
    if (stateMachine === advancedStateMachine) {
        // Look for the most recent Set1 or Set2 action
        const playerNum = findPlayerForPreviousAction(rally.actions, actionIndex, ['Set']);
        if (playerNum) {
            settingPlayer = parseInt(playerNum) - 1; // Convert to 0-based index
        }
    } 
    // For beginner mode
    else if (stateMachine === beginnerStateMachine) {
        // In beginner mode, the player is directly in the action (SetE1, SetE2)
        const playerMatch = action.match(/[12]$/);
        if (playerMatch) {
            settingPlayer = parseInt(playerMatch[0]) - 1; // Convert to 0-based index
        }
    }
    
    // If we couldn't determine the player, use a fallback
    if (settingPlayer === null) {
        // Default to player 1 as a fallback (often the setter in volleyball)
        settingPlayer = 1;
    }
    
    return { team: settingTeam, player: settingPlayer };
}
 
/**
 * Analyzes a rally sequence to determine the player who performed a defense
 * @param {Object} rally - The rally object
 * @param {number} actionIndex - Index of the defense action
 * @returns {Object} - {team: 'a'|'b', player: 0|1} or null if undetermined
 */
function analyzeDefenseSequence(rally, actionIndex) {
    const action = rally.actions[actionIndex];
    const defendingTeam = determineDefendingTeam(rally, actionIndex);
    let defendingPlayer = null;
    
    // Extract player number directly from the action if available
    const playerMatch = action.match(/[12]$/);
    if (playerMatch) {
        defendingPlayer = parseInt(playerMatch[0]) - 1; // Convert to 0-based index
    }
    
    // If we couldn't determine the player, use a fallback
    if (defendingPlayer === null) {
        // Default to player 0 as a fallback
        defendingPlayer = 0;
    }
    
    return { team: defendingTeam, player: defendingPlayer };
}
 
/**
 * Tracks player turns throughout a rally to determine who should be credited with an action
 * @param {Object} rally - The rally object
 * @param {string} actionType - Type of action to track
 * @returns {Array} - Array of {team: 'a'|'b', player: 0|1, actionIndex: number} objects
 */
function trackPlayerTurns(rally, actionType) {
    const result = [];
    const isTeamAServing = rally.servingTeam === 'a';
    
    // Initialize turn tracking
    let currentTurn = 0;
    let lastPlayerByTeam = {
        'a': { player: null, action: null },
        'b': { player: null, action: null }
    };
    
    // Process each action in the rally
    for (let i = 0; i < rally.actions.length; i++) {
        const action = rally.actions[i];
        
        // Determine which team is acting based on the current turn
        const actingTeam = (currentTurn % 2 === 0) ? 
            rally.servingTeam : 
            (rally.servingTeam === 'a' ? 'b' : 'a');
        
        // Extract player number if present in the action
        const playerMatch = action.match(/[12]$/);
        if (playerMatch) {
            const playerNum = parseInt(playerMatch[0]) - 1; // Convert to 0-based index
            
            // Update last player for this team
            lastPlayerByTeam[actingTeam] = { player: playerNum, action: action };
            
            // If this is the action type we're tracking, add it to results
            if (action.startsWith(actionType)) {
                result.push({
                    team: actingTeam,
                    player: playerNum,
                    actionIndex: i
                });
            }
        } else if (action.startsWith(actionType)) {
            // Action matches type but doesn't specify player
            // Use the last known player for this team
            const lastPlayer = lastPlayerByTeam[actingTeam].player;
            if (lastPlayer !== null) {
                result.push({
                    team: actingTeam,
                    player: lastPlayer,
                    actionIndex: i
                });
            }
        }
        
        // Update turn counter when possession changes
        if (action.startsWith('Rec') || action.startsWith('Def')) {
            currentTurn++;
        }
    }
    
    return result;
}
 
/**
 * Gets the player who should be credited with a specific action
 * @param {Object} rally - The rally object
 * @param {number} actionIndex - Index of the action
 * @param {string} actionType - Type of action (e.g., 'Win', 'Err', 'Blk')
 * @returns {Object} - {team: 'a'|'b', player: 0|1} or null if undetermined
 */
function getPlayerForAction(rally, actionIndex, actionType) {
    const action = rally.actions[actionIndex];
    
    // If the action doesn't match the type, return null
    if (!action.startsWith(actionType)) {
        return null;
    }
    
    // Different analysis based on action type
    switch (actionType) {
        case 'Win':
        case 'Err':
        case 'Atk':
            return analyzeAttackSequence(rally, actionIndex);
        case 'Blk':
            return analyzeBlockSequence(rally, actionIndex);
        case 'RE':
        case 'Rec':
            return analyzeReceptionSequence(rally, actionIndex);
        case 'SetE':
        case 'Set':
            return analyzeSetSequence(rally, actionIndex);
        case 'Def':
            return analyzeDefenseSequence(rally, actionIndex);
        default:
            // For other action types, try to extract player directly from action
            const playerMatch = action.match(/[12]$/);
            if (playerMatch) {
                const playerNum = parseInt(playerMatch[0]) - 1; // Convert to 0-based index
                const actingTeam = determineAttackingTeam(rally, actionIndex);
                return { team: actingTeam, player: playerNum };
            }
            return null;
    }
}
 
// --- Error Handling Utilities for Statistics ---
 
/**
 * Logs a statistics calculation error with detailed information
 * @param {string} statKey - The statistic key that failed to calculate
 * @param {string} message - Error message
 * @param {Object} [details] - Additional details about the error
 */
function logStatCalculationError(statKey, message, details = {}) {
    const errorInfo = {
        statistic: statKey,
        message: message,
        timestamp: new Date().toISOString(),
        ...details
    };
    
    console.warn(`Statistics calculation error for '${statKey}': ${message}`);
    
    // Store errors for potential debugging or reporting
    if (!window.statCalculationErrors) {
        window.statCalculationErrors = [];
    }
    window.statCalculationErrors.push(errorInfo);
}
 
/**
 * Provides a fallback value for a statistic when calculation fails
 * @param {string} statKey - The statistic key
 * @param {Object} statsObject - The stats object being populated
 * @param {string} team - Team identifier ('a' or 'b')
 * @param {number} playerIndex - Player index (0 or 1)
 * @returns {number} - The fallback value
 */
function getStatFallbackValue(statKey, statsObject, team, playerIndex) {
    // Default fallback is 0 for most statistics
    let fallbackValue = 0;
    
    // For efficiency/percentage stats, use team average if available
    if (statKey === 'attackEfficiency' || statKey.endsWith('Percentage')) {
        const teamObj = team === 'a' ? statsObject.teamA : statsObject.teamB;
        if (teamObj[statKey] !== undefined) {
            fallbackValue = teamObj[statKey];
            logStatCalculationError(statKey, `Using team average (${fallbackValue}) as fallback for player ${playerIndex + 1}`, {
                team: team,
                player: playerIndex
            });
            return fallbackValue;
        }
    }
    
    // For other stats, check if we can derive from related stats
    if (statKey === 'attackEfficiency' && statsObject) {
        const teamObj = team === 'a' ? statsObject.teamA : statsObject.teamB;
        const playerObj = teamObj.players[playerIndex];
        
        const points = playerObj['attackPoints'] || 0;
        const errors = playerObj['attackErrors'] || 0;
        const total = playerObj['totalAttacks'] || 0;
        
        if (total > 0) {
            fallbackValue = Math.round(((points - errors) / total) * 100);
            logStatCalculationError(statKey, `Derived value (${fallbackValue}) from related stats for player ${playerIndex + 1}`, {
                team: team,
                player: playerIndex,
                derivedFrom: { points, errors, total }
            });
            return fallbackValue;
        }
    }
    
    logStatCalculationError(statKey, `Using default fallback (${fallbackValue}) for player ${playerIndex + 1}`, {
        team: team,
        player: playerIndex
    });
    
    return fallbackValue;
}
 
/**
 * Safely calculates a player-specific statistic with error handling
 * @param {Function} calculationFn - The calculation function to try
 * @param {string} statKey - The statistic key
 * @param {Object} statsObject - The stats object being populated
 * @param {string} team - Team identifier ('a' or 'b')
 * @param {number} playerIndex - Player index (0 or 1)
 * @param {Object} [context] - Additional context for error logging
 */
function safelyCalculatePlayerStat(calculationFn, statKey, statsObject, team, playerIndex, context = {}) {
    try {
        return calculationFn();
    } catch (error) {
        logStatCalculationError(statKey, `Calculation failed: ${error.message}`, {
            team: team,
            player: playerIndex,
            error: error.toString(),
            ...context
        });
        
        const teamObj = team === 'a' ? statsObject.teamA : statsObject.teamB;
        teamObj.players[playerIndex][statKey] = getStatFallbackValue(statKey, statsObject, team, playerIndex);
        return teamObj.players[playerIndex][statKey];
    }
}
 
// --- Statistics Calculation (Combined Logic) ---
  

function calculateMatchStatistics(gameMode = 'advanced') {
    try {
        const currentStateMachine = gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
        const statsTable = currentStateMachine.__statisticsTable__;
      
        // Initialize stats structure
        const stats = {
            teamA: { name: appState.teams.a.name, players: [], pointsPercentage: 0 },
            teamB: { name: appState.teams.b.name, players: [], pointsPercentage: 0 },
            totalRallies: Object.keys(appState.rallyHistory).length,
            longestRally: { actions: 0, sequence: '' },
            currentSet: appState.currentSet,
            setScores: [],
            calculationErrors: [] // Track any calculation errors
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
            try {
                // Calculate team totals
                stats.teamA[statDef.key] = statDef.calculate('a', appState.rallyHistory);
                stats.teamB[statDef.key] = statDef.calculate('b', appState.rallyHistory);
              
                // Calculate player stats if applicable
                if (statDef.showInPlayerStats) {
                    // Check if the calculate function accepts a playerIndex
                    if (statDef.calculate.length >= 3) { // Assumes function signature (team, history, playerIndex)
                        try {
                            stats.teamA.players[0][statDef.key] = statDef.calculate('a', appState.rallyHistory, 0);
                            stats.teamA.players[1][statDef.key] = statDef.calculate('a', appState.rallyHistory, 1);
                            stats.teamB.players[0][statDef.key] = statDef.calculate('b', appState.rallyHistory, 0);
                            stats.teamB.players[1][statDef.key] = statDef.calculate('b', appState.rallyHistory, 1);
                        } catch (playerError) {
                            logStatCalculationError(statDef.key, `Player-specific calculation failed: ${playerError.message}`, {
                                error: playerError.toString()
                            });
                            // Fall back to manual calculation
                            calculatePlayerSpecificStatManual(stats, statDef.key);
                        }
                    } else {
                        // If function doesn't support playerIndex, use manual calculation
                        calculatePlayerSpecificStatManual(stats, statDef.key);
                    }
                }
            } catch (statError) {
                logStatCalculationError(statDef.key, `Team-level calculation failed: ${statError.message}`, {
                    error: statError.toString()
                });
                
                // Set default values for failed calculations
                stats.teamA[statDef.key] = 0;
                stats.teamB[statDef.key] = 0;
                
                if (statDef.showInPlayerStats) {
                    [0, 1].forEach(playerIndex => {
                        stats.teamA.players[playerIndex][statDef.key] = 0;
                        stats.teamB.players[playerIndex][statDef.key] = 0;
                    });
                }
                
                // Track the error
                stats.calculationErrors.push({
                    statistic: statDef.key,
                    message: statError.message
                });
            }
        });
      
        // 2. Calculate derived statistics (like percentages)
        try {
            const totalPoints = (stats.teamA.pointsWon || 0) + (stats.teamB.pointsWon || 0);
            stats.teamA.pointsPercentage = totalPoints > 0 ? Math.round(((stats.teamA.pointsWon || 0) / totalPoints) * 100) : 0;
            stats.teamB.pointsPercentage = totalPoints > 0 ? Math.round(((stats.teamB.pointsWon || 0) / totalPoints) * 100) : 0;
        } catch (percentageError) {
            logStatCalculationError('pointsPercentage', `Percentage calculation failed: ${percentageError.message}`, {
                error: percentageError.toString()
            });
            stats.teamA.pointsPercentage = 0;
            stats.teamB.pointsPercentage = 0;
        }
      
        // 3. Process Rallies for Longest Rally
        try {
            Object.values(appState.rallyHistory).forEach(rally => {
                if (rally.actions.length > stats.longestRally.actions) {
                    stats.longestRally.actions = rally.actions.length;
                    stats.longestRally.sequence = rally.actions.join(' ');
                }
            });
        } catch (rallyError) {
            logStatCalculationError('longestRally', `Longest rally calculation failed: ${rallyError.message}`, {
                error: rallyError.toString()
            });
            stats.longestRally = { actions: 0, sequence: 'Error calculating longest rally' };
        }
      
        // 4. Populate Set Scores
        try {
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
        } catch (scoreError) {
            logStatCalculationError('setScores', `Set scores calculation failed: ${scoreError.message}`, {
                error: scoreError.toString()
            });
            // Provide a minimal fallback for set scores
            stats.setScores = [{
                set: 1,
                scoreA: appState.teams.a.currentScore || 0,
                scoreB: appState.teams.b.currentScore || 0,
                winner: null
            }];
        }
      
        // Collect any calculation errors that occurred
        if (window.statCalculationErrors && window.statCalculationErrors.length > 0) {
            stats.calculationErrors = window.statCalculationErrors.slice(0);
            
            // Clear the error log after collecting them
            window.statCalculationErrors = [];
            
            // Log a summary of errors
            if (stats.calculationErrors.length > 0) {
                console.warn(`Statistics calculation completed with ${stats.calculationErrors.length} errors.`);
            }
        }
      
        return stats;
    } catch (error) {
        console.error(`Fatal error in statistics calculation: ${error.message}`, error);
        
        // Return a minimal stats object that won't break the UI
        return {
            teamA: { 
                name: appState.teams.a.name || 'Team A', 
                players: [
                    { name: appState.teams.a.players[0] || 'Player 1' },
                    { name: appState.teams.a.players[1] || 'Player 2' }
                ],
                pointsWon: 0,
                pointsPercentage: 0
            },
            teamB: { 
                name: appState.teams.b.name || 'Team B', 
                players: [
                    { name: appState.teams.b.players[0] || 'Player 1' },
                    { name: appState.teams.b.players[1] || 'Player 2' }
                ],
                pointsWon: 0,
                pointsPercentage: 0
            },
            totalRallies: 0,
            longestRally: { actions: 0, sequence: 'Error calculating statistics' },
            currentSet: appState.currentSet || 0,
            setScores: [{
                set: 1,
                scoreA: appState.teams.a.currentScore || 0,
                scoreB: appState.teams.b.currentScore || 0,
                winner: null
            }],
            calculationErrors: [{
                statistic: 'all',
                message: error.message,
                error: error.toString()
            }]
        };
    }
}
    
 
// Manual calculation for player stats if calculate function doesn't support playerIndex
// This handles player-specific statistics calculation for various stat types
// This needs to be implemented specifically for each stat key required.
function calculatePlayerSpecificStatManual(statsObject, statKey) {
    // Handle 'attackPoints' in both beginner and advanced modes
    if (statKey === 'attackPoints') {
        try {
            // For beginner mode (Win1/Win2)
            if (stateMachine === beginnerStateMachine) {
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
            // For advanced mode (need to find the last attacking player)
            else if (stateMachine === advancedStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    // Find the last attacking player before a Win action
                    let lastAttackingPlayer = { team: null, player: null };
                    
                    for (let i = 0; i < rally.actions.length; i++) {
                        const action = rally.actions[i];
                        
                        // Track attacking players (Atk1, Atk2)
                        if (action === 'Atk1' || action === 'Atk2') {
                            const playerNum = action.charAt(action.length - 1);
                            const attackingTeam = determineAttackingTeam(rally, i);
                            
                            lastAttackingPlayer = { 
                                team: attackingTeam, 
                                player: parseInt(playerNum) - 1 // Convert to 0-based index
                            };
                        }
                        
                        // If this is a Win action and we have tracked an attacking player
                        if (action === 'Win' && lastAttackingPlayer.team && lastAttackingPlayer.player !== null) {
                            if (lastAttackingPlayer.team === 'a') {
                                statsObject.teamA.players[lastAttackingPlayer.player][statKey]++;
                            } else if (lastAttackingPlayer.team === 'b') {
                                statsObject.teamB.players[lastAttackingPlayer.player][statKey]++;
                            }
                        } else if (action === 'Win' && (!lastAttackingPlayer.team || lastAttackingPlayer.player === null)) {
                            // Fallback: If we couldn't determine the player, attribute to the scoring team's player 0
                            const scoringTeam = rally.scoringTeam;
                            logStatCalculationError(statKey, `Could not determine attacking player for Win action, using fallback`, {
                                rally: rally.id,
                                action: action,
                                actionIndex: i,
                                scoringTeam: scoringTeam
                            });
                            
                            if (scoringTeam === 'a') {
                                statsObject.teamA.players[0][statKey]++;
                            } else if (scoringTeam === 'b') {
                                statsObject.teamB.players[0][statKey]++;
                            }
                        }
                    }
                });
            }
        } catch (error) {
            logStatCalculationError(statKey, `Calculation failed: ${error.message}`, { error: error.toString() });
            // Initialize to 0 if calculation fails
            [0, 1].forEach(playerIndex => {
                statsObject.teamA.players[playerIndex][statKey] = statsObject.teamA.players[playerIndex][statKey] || 0;
                statsObject.teamB.players[playerIndex][statKey] = statsObject.teamB.players[playerIndex][statKey] || 0;
            });
        }
        return; // Successfully handled this stat
    }
    
    // Handle 'attackErrors' in both beginner and advanced modes
    if (statKey === 'attackErrors') {
        try {
            // For beginner mode (Err1/Err2)
            if (stateMachine === beginnerStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    rally.actions.forEach(action => {
                        if (action === 'Err1') {
                            // The team that made the error is the opposite of the scoring team
                            const errorTeam = rally.scoringTeam === 'a' ? 'b' : 'a';
                            if (errorTeam === 'a') statsObject.teamA.players[0][statKey]++;
                            if (errorTeam === 'b') statsObject.teamB.players[0][statKey]++;
                        } else if (action === 'Err2') {
                            const errorTeam = rally.scoringTeam === 'a' ? 'b' : 'a';
                            if (errorTeam === 'a') statsObject.teamA.players[1][statKey]++;
                            if (errorTeam === 'b') statsObject.teamB.players[1][statKey]++;
                        }
                    });
                });
            } 
            // For advanced mode (need to find the attacking player before an Err action)
            else if (stateMachine === advancedStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    let lastAttackingPlayer = { team: null, player: null };
                    
                    for (let i = 0; i < rally.actions.length; i++) {
                        const action = rally.actions[i];
                        
                        // Track attacking players (Atk1, Atk2)
                        if (action === 'Atk1' || action === 'Atk2') {
                            const playerNum = action.charAt(action.length - 1);
                            const attackingTeam = determineAttackingTeam(rally, i);
                            
                            lastAttackingPlayer = { 
                                team: attackingTeam, 
                                player: parseInt(playerNum) - 1
                            };
                        }
                        
                        // If this is an Err action and we have tracked an attacking player
                        if (action === 'Err' && lastAttackingPlayer.team && lastAttackingPlayer.player !== null) {
                            if (lastAttackingPlayer.team === 'a') {
                                statsObject.teamA.players[lastAttackingPlayer.player][statKey]++;
                            } else if (lastAttackingPlayer.team === 'b') {
                                statsObject.teamB.players[lastAttackingPlayer.player][statKey]++;
                            }
                        } else if (action === 'Err' && (!lastAttackingPlayer.team || lastAttackingPlayer.player === null)) {
                            // Fallback: If we couldn't determine the player, attribute to the non-scoring team's player 0
                            const errorTeam = rally.scoringTeam === 'a' ? 'b' : 'a';
                            logStatCalculationError(statKey, `Could not determine attacking player for Err action, using fallback`, {
                                rally: rally.id,
                                action: action,
                                actionIndex: i,
                                errorTeam: errorTeam
                            });
                            
                            if (errorTeam === 'a') {
                                statsObject.teamA.players[0][statKey]++;
                            } else if (errorTeam === 'b') {
                                statsObject.teamB.players[0][statKey]++;
                            }
                        }
                    }
                });
            }
        } catch (error) {
            logStatCalculationError(statKey, `Calculation failed: ${error.message}`, { error: error.toString() });
            // Initialize to 0 if calculation fails
            [0, 1].forEach(playerIndex => {
                statsObject.teamA.players[playerIndex][statKey] = statsObject.teamA.players[playerIndex][statKey] || 0;
                statsObject.teamB.players[playerIndex][statKey] = statsObject.teamB.players[playerIndex][statKey] || 0;
            });
        }
        return; // Successfully handled this stat
    }
    
    // Handle 'totalAttacks' for both modes
    if (statKey === 'totalAttacks') {
        try {
            // For beginner mode
            if (stateMachine === beginnerStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    rally.actions.forEach(action => {
                        // In beginner mode, Win1/2, Err1/2, Blk1/2 are attack actions
                        if (action.match(/^(Win|Err|Blk)[12]$/)) {
                            const playerNum = parseInt(action.charAt(action.length - 1)) - 1;
                            const actionType = action.substring(0, action.length - 1);
                            
                            // Determine which team performed the action
                            let actionTeam;
                            if (actionType === 'Win' || actionType === 'Err') {
                                // For Win, the scoring team made the attack
                                // For Err, the non-scoring team made the attack
                                actionTeam = actionType === 'Win' ? rally.scoringTeam : (rally.scoringTeam === 'a' ? 'b' : 'a');
                            } else if (actionType === 'Blk') {
                                // For blocks, the non-scoring team made the block
                                actionTeam = rally.scoringTeam === 'a' ? 'b' : 'a';
                            }
                            
                            if (actionTeam === 'a') {
                                statsObject.teamA.players[playerNum][statKey]++;
                            } else if (actionTeam === 'b') {
                                statsObject.teamB.players[playerNum][statKey]++;
                            }
                        }
                    });
                });
            } 
            // For advanced mode
            else if (stateMachine === advancedStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    // Track attack attempts by player
                    for (let i = 0; i < rally.actions.length; i++) {
                        const action = rally.actions[i];
                        
                        // In advanced mode, Atk1/2 actions indicate attack attempts
                        if (action === 'Atk1' || action === 'Atk2') {
                            const playerNum = parseInt(action.charAt(action.length - 1)) - 1;
                            const attackingTeam = determineAttackingTeam(rally, i);
                            
                            if (attackingTeam === 'a') {
                                statsObject.teamA.players[playerNum][statKey]++;
                            } else if (attackingTeam === 'b') {
                                statsObject.teamB.players[playerNum][statKey]++;
                            }
                        }
                    }
                });
            }
        } catch (error) {
            logStatCalculationError(statKey, `Calculation failed: ${error.message}`, { error: error.toString() });
            // Initialize to 0 if calculation fails
            [0, 1].forEach(playerIndex => {
                statsObject.teamA.players[playerIndex][statKey] = statsObject.teamA.players[playerIndex][statKey] || 0;
                statsObject.teamB.players[playerIndex][statKey] = statsObject.teamB.players[playerIndex][statKey] || 0;
            });
        }
        return; // Successfully handled this stat
    }
    
    // Handle 'attackEfficiency' - calculated as (attackPoints - attackErrors) / totalAttacks
    if (statKey === 'attackEfficiency') {
        try {
            // Calculate for Team A players
            [0, 1].forEach(playerIndex => {
                safelyCalculatePlayerStat(
                    () => {
                        const points = statsObject.teamA.players[playerIndex]['attackPoints'] || 0;
                        const errors = statsObject.teamA.players[playerIndex]['attackErrors'] || 0;
                        const total = statsObject.teamA.players[playerIndex]['totalAttacks'] || 0;
                        
                        if (total > 0) {
                            statsObject.teamA.players[playerIndex][statKey] = Math.round(((points - errors) / total) * 100);
                        } else {
                            statsObject.teamA.players[playerIndex][statKey] = 0;
                        }
                    },
                    statKey,
                    statsObject,
                    'a',
                    playerIndex,
                    { 
                        points: statsObject.teamA.players[playerIndex]['attackPoints'],
                        errors: statsObject.teamA.players[playerIndex]['attackErrors'],
                        total: statsObject.teamA.players[playerIndex]['totalAttacks']
                    }
                );
            });
            
            // Calculate for Team B players
            [0, 1].forEach(playerIndex => {
                safelyCalculatePlayerStat(
                    () => {
                        const points = statsObject.teamB.players[playerIndex]['attackPoints'] || 0;
                        const errors = statsObject.teamB.players[playerIndex]['attackErrors'] || 0;
                        const total = statsObject.teamB.players[playerIndex]['totalAttacks'] || 0;
                        
                        if (total > 0) {
                            statsObject.teamB.players[playerIndex][statKey] = Math.round(((points - errors) / total) * 100);
                        } else {
                            statsObject.teamB.players[playerIndex][statKey] = 0;
                        }
                    },
                    statKey,
                    statsObject,
                    'b',
                    playerIndex,
                    { 
                        points: statsObject.teamB.players[playerIndex]['attackPoints'],
                        errors: statsObject.teamB.players[playerIndex]['attackErrors'],
                        total: statsObject.teamB.players[playerIndex]['totalAttacks']
                    }
                );
            });
        } catch (error) {
            logStatCalculationError(statKey, `Calculation failed: ${error.message}`, { error: error.toString() });
            // Initialize to 0 if calculation fails
            [0, 1].forEach(playerIndex => {
                statsObject.teamA.players[playerIndex][statKey] = statsObject.teamA.players[playerIndex][statKey] || 0;
                statsObject.teamB.players[playerIndex][statKey] = statsObject.teamB.players[playerIndex][statKey] || 0;
            });
        }
        return; // Successfully handled this stat
    }
    
    // Handle 'blocks' in both modes
    if (statKey === 'blocks') {
        try {
            // For beginner mode (Blk1/Blk2)
            if (stateMachine === beginnerStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    rally.actions.forEach(action => {
                        if (action === 'Blk1') {
                            // The team that made the block is the scoring team
                            if (rally.scoringTeam === 'a') statsObject.teamA.players[0][statKey]++;
                            if (rally.scoringTeam === 'b') statsObject.teamB.players[0][statKey]++;
                        } else if (action === 'Blk2') {
                            if (rally.scoringTeam === 'a') statsObject.teamA.players[1][statKey]++;
                            if (rally.scoringTeam === 'b') statsObject.teamB.players[1][statKey]++;
                        }
                    });
                });
            } 
            // For advanced mode (need to find the blocking player before a Blk action)
            else if (stateMachine === advancedStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    for (let i = 0; i < rally.actions.length; i++) {
                        const action = rally.actions[i];
                        
                        // If this is a Blk action, find the last player who could have blocked
                        if (action === 'Blk') {
                            const blockResult = analyzeBlockSequence(rally, i);
                            
                            if (blockResult && blockResult.team && blockResult.player !== null) {
                                if (blockResult.team === 'a') {
                                    statsObject.teamA.players[blockResult.player][statKey]++;
                                } else if (blockResult.team === 'b') {
                                    statsObject.teamB.players[blockResult.player][statKey]++;
                                }
                            } else {
                                // Fallback: If we couldn't determine the player, attribute to the scoring team's player 0
                                const blockingTeam = rally.scoringTeam;
                                logStatCalculationError(statKey, `Could not determine blocking player, using fallback`, {
                                    rally: rally.id,
                                    action: action,
                                    actionIndex: i,
                                    blockingTeam: blockingTeam
                                });
                                
                                if (blockingTeam === 'a') {
                                    statsObject.teamA.players[0][statKey]++;
                                } else if (blockingTeam === 'b') {
                                    statsObject.teamB.players[0][statKey]++;
                                }
                            }
                        }
                    }
                });
            }
        } catch (error) {
            logStatCalculationError(statKey, `Calculation failed: ${error.message}`, { error: error.toString() });
            // Initialize to 0 if calculation fails
            [0, 1].forEach(playerIndex => {
                statsObject.teamA.players[playerIndex][statKey] = statsObject.teamA.players[playerIndex][statKey] || 0;
                statsObject.teamB.players[playerIndex][statKey] = statsObject.teamB.players[playerIndex][statKey] || 0;
            });
        }
        return; // Successfully handled this stat
    }
    
    // Handle 'receptionErrors' in both modes
    if (statKey === 'receptionErrors') {
        try {
            // For beginner mode (RE1/RE2)
            if (stateMachine === beginnerStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    rally.actions.forEach(action => {
                        if (action === 'RE1') {
                            // The team that made the error is the opposite of the scoring team
                            const errorTeam = rally.scoringTeam === 'a' ? 'b' : 'a';
                            if (errorTeam === 'a') statsObject.teamA.players[0][statKey]++;
                            if (errorTeam === 'b') statsObject.teamB.players[0][statKey]++;
                        } else if (action === 'RE2') {
                            const errorTeam = rally.scoringTeam === 'a' ? 'b' : 'a';
                            if (errorTeam === 'a') statsObject.teamA.players[1][statKey]++;
                            if (errorTeam === 'b') statsObject.teamB.players[1][statKey]++;
                        }
                    });
                });
            } 
            // For advanced mode (RE action)
            else if (stateMachine === advancedStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    for (let i = 0; i < rally.actions.length; i++) {
                        const action = rally.actions[i];
                        
                        // If this is a RE (reception error) action
                        if (action === 'RE') {
                            const receptionResult = analyzeReceptionSequence(rally, i);
                            
                            if (receptionResult && receptionResult.team && receptionResult.player !== null) {
                                if (receptionResult.team === 'a') {
                                    statsObject.teamA.players[receptionResult.player][statKey]++;
                                } else if (receptionResult.team === 'b') {
                                    statsObject.teamB.players[receptionResult.player][statKey]++;
                                }
                            } else {
                                // Fallback: If we couldn't determine the player, attribute to the receiving team's player 0
                                const errorTeam = rally.servingTeam === 'a' ? 'b' : 'a';
                                logStatCalculationError(statKey, `Could not determine receiving player for RE action, using fallback`, {
                                    rally: rally.id,
                                    action: action,
                                    actionIndex: i,
                                    errorTeam: errorTeam
                                });
                                
                                if (errorTeam === 'a') {
                                    statsObject.teamA.players[0][statKey]++;
                                } else if (errorTeam === 'b') {
                                    statsObject.teamB.players[0][statKey]++;
                                }
                            }
                        }
                    }
                });
            }
        } catch (error) {
            logStatCalculationError(statKey, `Calculation failed: ${error.message}`, { error: error.toString() });
            // Initialize to 0 if calculation fails
            [0, 1].forEach(playerIndex => {
                statsObject.teamA.players[playerIndex][statKey] = statsObject.teamA.players[playerIndex][statKey] || 0;
                statsObject.teamB.players[playerIndex][statKey] = statsObject.teamB.players[playerIndex][statKey] || 0;
            });
        }
        return; // Successfully handled this stat
    }
    
    // Handle 'setErrors' in both modes
    if (statKey === 'setErrors') {
        try {
            // For beginner mode (SetE1/SetE2)
            if (stateMachine === beginnerStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    rally.actions.forEach(action => {
                        if (action === 'SetE1') {
                            // The team that made the error is the opposite of the scoring team
                            const errorTeam = rally.scoringTeam === 'a' ? 'b' : 'a';
                            if (errorTeam === 'a') statsObject.teamA.players[0][statKey]++;
                            if (errorTeam === 'b') statsObject.teamB.players[0][statKey]++;
                        } else if (action === 'SetE2') {
                            const errorTeam = rally.scoringTeam === 'a' ? 'b' : 'a';
                            if (errorTeam === 'a') statsObject.teamA.players[1][statKey]++;
                            if (errorTeam === 'b') statsObject.teamB.players[1][statKey]++;
                        }
                    });
                });
            } 
            // For advanced mode (SetE action)
            else if (stateMachine === advancedStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    for (let i = 0; i < rally.actions.length; i++) {
                        const action = rally.actions[i];
                        
                        // If this is a SetE (set error) action
                        if (action === 'SetE') {
                            const setResult = analyzeSetSequence(rally, i);
                            
                            if (setResult && setResult.team && setResult.player !== null) {
                                if (setResult.team === 'a') {
                                    statsObject.teamA.players[setResult.player][statKey]++;
                                } else if (setResult.team === 'b') {
                                    statsObject.teamB.players[setResult.player][statKey]++;
                                }
                            } else {
                                // Fallback: If we couldn't determine the player, attribute to the non-scoring team's player 1
                                // (Player 1 is often the setter in volleyball)
                                const errorTeam = rally.scoringTeam === 'a' ? 'b' : 'a';
                                logStatCalculationError(statKey, `Could not determine setting player for SetE action, using fallback`, {
                                    rally: rally.id,
                                    action: action,
                                    actionIndex: i,
                                    errorTeam: errorTeam
                                });
                                
                                if (errorTeam === 'a') {
                                    statsObject.teamA.players[1][statKey]++; // Default to player 1 (often the setter)
                                } else if (errorTeam === 'b') {
                                    statsObject.teamB.players[1][statKey]++; // Default to player 1 (often the setter)
                                }
                            }
                        }
                    }
                });
            }
        } catch (error) {
            logStatCalculationError(statKey, `Calculation failed: ${error.message}`, { error: error.toString() });
            // Initialize to 0 if calculation fails
            [0, 1].forEach(playerIndex => {
                statsObject.teamA.players[playerIndex][statKey] = statsObject.teamA.players[playerIndex][statKey] || 0;
                statsObject.teamB.players[playerIndex][statKey] = statsObject.teamB.players[playerIndex][statKey] || 0;
            });
        }
        return; // Successfully handled this stat
    }
    
    // Handle 'defenses' in both modes
    if (statKey === 'defenses') {
        try {
            // For beginner mode (count Def1/Def2 actions)
            if (stateMachine === beginnerStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    rally.actions.forEach(action => {
                        if (action === 'Def1') {
                            // Determine which team made the defense based on rally context
                            const defendingTeam = determineDefendingTeam(rally, rally.actions.indexOf(action));
                            
                            if (defendingTeam === 'a') statsObject.teamA.players[0][statKey]++;
                            if (defendingTeam === 'b') statsObject.teamB.players[0][statKey]++;
                        } else if (action === 'Def2') {
                            const defendingTeam = determineDefendingTeam(rally, rally.actions.indexOf(action));
                            
                            if (defendingTeam === 'a') statsObject.teamA.players[1][statKey]++;
                            if (defendingTeam === 'b') statsObject.teamB.players[1][statKey]++;
                        }
                    });
                });
            } 
            // For advanced mode (Def1/Def2 actions)
            else if (stateMachine === advancedStateMachine) {
                Object.values(appState.rallyHistory).forEach(rally => {
                    for (let i = 0; i < rally.actions.length; i++) {
                        const action = rally.actions[i];
                        
                        // If this is a defense action
                        if (action === 'Def1' || action === 'Def2') {
                            const playerNum = parseInt(action.charAt(action.length - 1)) - 1;
                            const defendingTeam = determineDefendingTeam(rally, i);
                            
                            if (defendingTeam === 'a') {
                                statsObject.teamA.players[playerNum][statKey]++;
                            } else if (defendingTeam === 'b') {
                                statsObject.teamB.players[playerNum][statKey]++;
                            }
                        }
                    }
                });
            }
        } catch (error) {
            logStatCalculationError(statKey, `Calculation failed: ${error.message}`, { error: error.toString() });
            // Initialize to 0 if calculation fails
            [0, 1].forEach(playerIndex => {
                statsObject.teamA.players[playerIndex][statKey] = statsObject.teamA.players[playerIndex][statKey] || 0;
                statsObject.teamB.players[playerIndex][statKey] = statsObject.teamB.players[playerIndex][statKey] || 0;
            });
        }
        return; // Successfully handled this stat
    }
    
    // If we reach here, the stat wasn't handled
    logStatCalculationError(statKey, `No specific calculation logic available for this statistic`);
    
    // Initialize to 0 for unhandled stats
    [0, 1].forEach(playerIndex => {
        statsObject.teamA.players[playerIndex][statKey] = 0;
        statsObject.teamB.players[playerIndex][statKey] = 0;
    });
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