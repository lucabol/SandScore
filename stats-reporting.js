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


function generateSummaryStats() {
    // Get detailed category statistics first
    const categoryStats = generateCategoryStats();
    
    const summaryStats = {
        team: {
            a: {
                attack: { kills: 0, errors: 0, totalAttempts: 0, hittingPercentage: 0, hittingEfficiency: 0 },
                serve: { aces: 0, errors: 0, totalServes: 0, acePercentage: 0, errorPercentage: 0 },
                block: { blocks: 0 },
                dig: { digs: 0 },
                reception: { errors: 0, total: 0 },
                overall: { pointsScored: 0, totalErrors: 0, sideoutPercentage: 0, pointScoringPercentage: 0 }
            },
            b: {
                attack: { kills: 0, errors: 0, totalAttempts: 0, hittingPercentage: 0, hittingEfficiency: 0 },
                serve: { aces: 0, errors: 0, totalServes: 0, acePercentage: 0, errorPercentage: 0 },
                block: { blocks: 0 },
                dig: { digs: 0 },
                reception: { errors: 0, total: 0 },
                overall: { pointsScored: 0, totalErrors: 0, sideoutPercentage: 0, pointScoringPercentage: 0 }
            }
        },
        player: {
            a1: createEmptyPlayerStats(),
            a2: createEmptyPlayerStats(),
            b1: createEmptyPlayerStats(),
            b2: createEmptyPlayerStats()
        }
    };

    // Process attack statistics including errors
    if (categoryStats.team.attack || categoryStats.team['atk Result']) {
        // Process beginner mode stats (category: 'attack')
        if (categoryStats.team.attack) {
            for (const action in categoryStats.team.attack) {
                const stats = categoryStats.team.attack[action];
                
                if (action.includes('Win')) {
                    summaryStats.team.a.attack.kills += stats.a || 0;
                    summaryStats.team.b.attack.kills += stats.b || 0;
                } else if (action.includes('Err')) {
                    summaryStats.team.a.attack.errors += stats.a || 0;
                    summaryStats.team.b.attack.errors += stats.b || 0;
                }
                
                // All attack actions count toward total attempts
                summaryStats.team.a.attack.totalAttempts += stats.a || 0;
                summaryStats.team.b.attack.totalAttempts += stats.b || 0;
            }
        }
        
        // Process advanced mode stats (category: 'atk Result')
        if (categoryStats.team['atk Result']) {
            for (const action in categoryStats.team['atk Result']) {
                const stats = categoryStats.team['atk Result'][action];
                
                if (action === 'Win') {
                    summaryStats.team.a.attack.kills += stats.a || 0;
                    summaryStats.team.b.attack.kills += stats.b || 0;
                } else if (action === 'Err') {
                    summaryStats.team.a.attack.errors += stats.a || 0;
                    summaryStats.team.b.attack.errors += stats.b || 0;
                }
                
                // All attack result actions count toward total attempts
                summaryStats.team.a.attack.totalAttempts += stats.a || 0;
                summaryStats.team.b.attack.totalAttempts += stats.b || 0;
            }
        }
        
        // Process player attack stats
        processPlayerStats('attack', categoryStats.playerA, 'a', summaryStats);
        processPlayerStats('atk Result', categoryStats.playerA, 'a', summaryStats);
        processPlayerStats('attack', categoryStats.playerB, 'b', summaryStats);
        processPlayerStats('atk Result', categoryStats.playerB, 'b', summaryStats);
    }
    
    // Process serving statistics
    if (categoryStats.team.serve) {
        for (const action in categoryStats.team.serve) {
            const stats = categoryStats.team.serve[action];
              // Count total serves
            summaryStats.team.a.serve.totalServes += stats.a || 0;
            summaryStats.team.b.serve.totalServes += stats.b || 0;
            
            // Check for aces
            if (action === 'Ace') {
                summaryStats.team.a.serve.aces += stats.a || 0;
                summaryStats.team.b.serve.aces += stats.b || 0;
            }
            // Check for errors - look for SErr which is the service error action
            else if (action === 'SErr') {
                summaryStats.team.a.serve.errors += stats.a || 0;
                summaryStats.team.b.serve.errors += stats.b || 0;
            }
        }
        
        // Process player serve stats
        processPlayerStats('serve', categoryStats.playerA, 'a', summaryStats);
        processPlayerStats('serve', categoryStats.playerB, 'b', summaryStats);
    }
    
    // Process blocking statistics
    if (categoryStats.team.block) {
        for (const action in categoryStats.team.block) {
            const stats = categoryStats.team.block[action];
            
            if (action.includes('Block') && !action.includes('Error')) {
                summaryStats.team.a.block.blocks += stats.a || 0;
                summaryStats.team.b.block.blocks += stats.b || 0;
            }
        }
        
        // Process player block stats
        processPlayerStats('block', categoryStats.playerA, 'a', summaryStats);
        processPlayerStats('block', categoryStats.playerB, 'b', summaryStats);
    }
    
    // Process digging statistics
    if (categoryStats.team.dig) {
        for (const action in categoryStats.team.dig) {
            const stats = categoryStats.team.dig[action];
            
            if (!action.includes('Error')) {
                summaryStats.team.a.dig.digs += stats.a || 0;
                summaryStats.team.b.dig.digs += stats.b || 0;
            }
        }
        
        // Process player dig stats
        processPlayerStats('dig', categoryStats.playerA, 'a', summaryStats);
        processPlayerStats('dig', categoryStats.playerB, 'b', summaryStats);
    }
    
    // Process reception statistics
    if (categoryStats.team.reception) {
        for (const action in categoryStats.team.reception) {
            const stats = categoryStats.team.reception[action];
              // Count total receptions
            summaryStats.team.a.reception.total += stats.a || 0;
            summaryStats.team.b.reception.total += stats.b || 0;
            
            // Check for reception errors - looking for RE1 or RE2 actions
            if (action === 'RE1' || action === 'RE2') {
                summaryStats.team.a.reception.errors += stats.a || 0;
                summaryStats.team.b.reception.errors += stats.b || 0;
            }
        }
        
        // Process player reception stats
        processPlayerStats('reception', categoryStats.playerA, 'a', summaryStats);
        processPlayerStats('reception', categoryStats.playerB, 'b', summaryStats);
    }
    
    // Calculate percentages and derived stats
    calculateDerivedStats(summaryStats);
    
    // Calculate sideout and point scoring percentages
    calculateRallyBasedStats(summaryStats);
    
    return summaryStats;
}

// Helper function to create empty player stats structure
function createEmptyPlayerStats() {
    return {
        attack: { kills: 0, errors: 0, totalAttempts: 0, hittingPercentage: 0, hittingEfficiency: 0 },
        serve: { aces: 0, errors: 0, totalServes: 0, acePercentage: 0, errorPercentage: 0 },
        block: { blocks: 0 },
        dig: { digs: 0 },
        reception: { errors: 0, total: 0 },
        overall: { pointsScored: 0, totalErrors: 0 }
    };
}

// Process player statistics for a given category
function processPlayerStats(category, playerCategoryStats, team, summaryStats) {
    if (!playerCategoryStats[category]) return;
    
    for (const action in playerCategoryStats[category]) {
        const stats = playerCategoryStats[category][action];
        
        for (let player = 1; player <= 2; player++) {
            const playerKey = `${team}${player}`;
            const count = stats[player] || 0;
            
            // Add to total attempts/serves/etc.
            if (category === 'attack' || category === 'atk Result') {
                summaryStats.player[playerKey].attack.totalAttempts += count;
                
                if (action.includes('Win') || action === 'Win') {
                    summaryStats.player[playerKey].attack.kills += count;
                } else if (action.includes('Err') || action === 'Err') {
                    summaryStats.player[playerKey].attack.errors += count;
                }
            } else if (category === 'serve') {
                summaryStats.player[playerKey].serve.totalServes += count;
                
                if (action.includes('Ace')) {
                    summaryStats.player[playerKey].serve.aces += count;
                } else if (action.includes('Error') || action === 'SErr') {
                    summaryStats.player[playerKey].serve.errors += count;
                }
            } else if (category === 'block' && action.includes('Blk') && !action.includes('Error')) {
                summaryStats.player[playerKey].block.blocks += count;
            } else if (category === 'atk Result' && action.includes('Blk') && !action.includes('Error')) {
                // Handle blocks in advanced mode (category: 'atk Result')
                summaryStats.player[playerKey].block.blocks += count;
            } else if (category === 'dig' && !action.includes('Error')) {
                summaryStats.player[playerKey].dig.digs += count;
            } else if (category === 'reception') {
                summaryStats.player[playerKey].reception.total += count;
                if (action === 'RE1' || action === 'RE2') {
                    summaryStats.player[playerKey].reception.errors += count;
                }
            }
        }
    }
}

// Calculate percentages and derived statistics
function calculateDerivedStats(stats) {
    // Calculate team stats
    for (const team of ['a', 'b']) {
        // Attack percentages
        const attack = stats.team[team].attack;
        if (attack.totalAttempts > 0) {
            attack.hittingPercentage = (attack.kills / attack.totalAttempts) * 100;
            attack.hittingEfficiency = (attack.kills - attack.errors) / attack.totalAttempts;
        }
        
        // Serve percentages
        const serve = stats.team[team].serve;
        if (serve.totalServes > 0) {
            serve.acePercentage = (serve.aces / serve.totalServes) * 100;
            serve.errorPercentage = (serve.errors / serve.totalServes) * 100;
        }
        
        // Overall stats
        const overall = stats.team[team].overall;
        overall.pointsScored = attack.kills + stats.team[team].block.blocks + serve.aces;
        overall.totalErrors = attack.errors + serve.errors + stats.team[team].reception.errors;
    }
    
    // Calculate player stats
    for (const playerKey in stats.player) {
        const playerStats = stats.player[playerKey];
        
        // Attack percentages
        const attack = playerStats.attack;
        if (attack.totalAttempts > 0) {
            attack.hittingPercentage = (attack.kills / attack.totalAttempts) * 100;
            attack.hittingEfficiency = (attack.kills - attack.errors) / attack.totalAttempts;
        }
        
        // Serve percentages
        const serve = playerStats.serve;
        if (serve.totalServes > 0) {
            serve.acePercentage = (serve.aces / serve.totalServes) * 100;
            serve.errorPercentage = (serve.errors / serve.totalServes) * 100;
        }
        
        // Overall stats
        playerStats.overall.pointsScored = attack.kills + playerStats.block.blocks + serve.aces;
        playerStats.overall.totalErrors = attack.errors + serve.errors + playerStats.reception.errors;
    }
}

// Calculate sideout percentage and point scoring percentage from rally history
function calculateRallyBasedStats(summaryStats) {
    const rallies = Object.values(appState.rallyHistory);
    
    // Initialize counters
    let teamA = { servePoints: 0, serveOpportunities: 0, sideoutPoints: 0, sideoutOpportunities: 0 };
    let teamB = { servePoints: 0, serveOpportunities: 0, sideoutPoints: 0, sideoutOpportunities: 0 };
    
    rallies.forEach(rally => {
        const servingTeam = rally.servingTeam;
        const scoringTeam = rally.scoringTeam;
        
        if (servingTeam === 'a') {
            teamA.serveOpportunities++;
            teamB.sideoutOpportunities++;
            
            if (scoringTeam === 'a') {
                teamA.servePoints++;
            } else if (scoringTeam === 'b') {
                teamB.sideoutPoints++;
            }
        } else if (servingTeam === 'b') {
            teamB.serveOpportunities++;
            teamA.sideoutOpportunities++;
            
            if (scoringTeam === 'b') {
                teamB.servePoints++;
            } else if (scoringTeam === 'a') {
                teamA.sideoutPoints++;
            }
        }
    });
    
    // Calculate percentages
    if (teamA.serveOpportunities > 0) {
        summaryStats.team.a.overall.pointScoringPercentage = (teamA.servePoints / teamA.serveOpportunities) * 100;
    }
    if (teamA.sideoutOpportunities > 0) {
        summaryStats.team.a.overall.sideoutPercentage = (teamA.sideoutPoints / teamA.sideoutOpportunities) * 100;
    }
    
    if (teamB.serveOpportunities > 0) {
        summaryStats.team.b.overall.pointScoringPercentage = (teamB.servePoints / teamB.serveOpportunities) * 100;
    }
    if (teamB.sideoutOpportunities > 0) {
        summaryStats.team.b.overall.sideoutPercentage = (teamB.sideoutPoints / teamB.sideoutOpportunities) * 100;
    }
}

// Show summary statistics dialog
function showSummaryStats() {    const stats = generateSummaryStats();
    const teamNames = {
        a: appState.teams.a.name || 'Team A',
        b: appState.teams.b.name || 'Team B'
    };
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'summary-stats-modal';
    modal.innerHTML = `
        <div class="summary-stats-content">
            <span class="summary-stats-close">&times;</span>
            <h2>Match Summary Statistics</h2>
            
            <div class="stats-tabs">
                <button class="stats-tab-btn active" data-tab="team-tab">Team Stats</button>
                <button class="stats-tab-btn" data-tab="player-tab">Player Stats</button>
            </div>
            
            <div id="team-tab" class="stats-tab-content active">
                <h3>Attack Statistics</h3>
                <table class="stats-table">
                    <tr>
                        <th>Stat</th>
                        <th>${teamNames.a}</th>
                        <th>${teamNames.b}</th>
                    </tr>
                    <tr>
                        <td>Kills</td>
                        <td>${stats.team.a.attack.kills}</td>
                        <td>${stats.team.b.attack.kills}</td>
                    </tr>
                    <tr>
                        <td>Attack Errors</td>
                        <td>${stats.team.a.attack.errors}</td>
                        <td>${stats.team.b.attack.errors}</td>
                    </tr>
                    <tr>
                        <td>Total Attempts</td>
                        <td>${stats.team.a.attack.totalAttempts}</td>
                        <td>${stats.team.b.attack.totalAttempts}</td>
                    </tr>
                    <tr>
                        <td>Hitting %</td>
                        <td>${stats.team.a.attack.hittingPercentage.toFixed(1)}%</td>
                        <td>${stats.team.b.attack.hittingPercentage.toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td>Hitting Efficiency</td>
                        <td>${stats.team.a.attack.hittingEfficiency.toFixed(3)}</td>
                        <td>${stats.team.b.attack.hittingEfficiency.toFixed(3)}</td>
                    </tr>
                </table>
                
                <h3>Serving Statistics</h3>
                <table class="stats-table">
                    <tr>
                        <th>Stat</th>
                        <th>${teamNames.a}</th>
                        <th>${teamNames.b}</th>
                    </tr>
                    <tr>
                        <td>Aces</td>
                        <td>${stats.team.a.serve.aces}</td>
                        <td>${stats.team.b.serve.aces}</td>
                    </tr>
                    <tr>
                        <td>Service Errors</td>
                        <td>${stats.team.a.serve.errors}</td>
                        <td>${stats.team.b.serve.errors}</td>
                    </tr>
                    <tr>
                        <td>Total Serves</td>
                        <td>${stats.team.a.serve.totalServes}</td>
                        <td>${stats.team.b.serve.totalServes}</td>
                    </tr>
                    <tr>
                        <td>Ace %</td>
                        <td>${stats.team.a.serve.acePercentage.toFixed(1)}%</td>
                        <td>${stats.team.b.serve.acePercentage.toFixed(1)}%</td>
                    </tr>
                </table>
                
                <h3>Other Statistics</h3>
                <table class="stats-table">
                    <tr>
                        <th>Stat</th>
                        <th>${teamNames.a}</th>
                        <th>${teamNames.b}</th>
                    </tr>
                    <tr>
                        <td>Blocks</td>
                        <td>${stats.team.a.block.blocks}</td>
                        <td>${stats.team.b.block.blocks}</td>
                    </tr>
                    <tr>
                        <td>Digs</td>
                        <td>${stats.team.a.dig.digs}</td>
                        <td>${stats.team.b.dig.digs}</td>
                    </tr>
                    <tr>
                        <td>Reception Errors</td>
                        <td>${stats.team.a.reception.errors}</td>
                        <td>${stats.team.b.reception.errors}</td>
                    </tr>
                </table>
                
                <h3>Performance Statistics</h3>
                <table class="stats-table">
                    <tr>
                        <th>Stat</th>
                        <th>${teamNames.a}</th>
                        <th>${teamNames.b}</th>
                    </tr>
                    <tr>
                        <td>Total Points Scored</td>
                        <td>${stats.team.a.overall.pointsScored}</td>
                        <td>${stats.team.b.overall.pointsScored}</td>
                    </tr>
                    <tr>
                        <td>Total Errors</td>
                        <td>${stats.team.a.overall.totalErrors}</td>
                        <td>${stats.team.b.overall.totalErrors}</td>
                    </tr>
                    <tr>
                        <td>Sideout %</td>
                        <td>${stats.team.a.overall.sideoutPercentage.toFixed(1)}%</td>
                        <td>${stats.team.b.overall.sideoutPercentage.toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td>Point Scoring % (serving)</td>
                        <td>${stats.team.a.overall.pointScoringPercentage.toFixed(1)}%</td>
                        <td>${stats.team.b.overall.pointScoringPercentage.toFixed(1)}%</td>
                    </tr>
                </table>
            </div>
            
            <div id="player-tab" class="stats-tab-content">
                <!-- Player stats tab content will be populated by JS -->
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Populate player stats tab
    const playerTab = modal.querySelector('#player-tab');
    playerTab.innerHTML = generatePlayerStatsHTML(stats, teamNames);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.summary-stats-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    const tabBtns = modal.querySelectorAll('.stats-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deactivate all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            modal.querySelectorAll('.stats-tab-content').forEach(c => c.classList.remove('active'));
            
            // Activate selected tab
            btn.classList.add('active');
            modal.querySelector(`#${btn.dataset.tab}`).classList.add('active');
        });
    });
    
    // Add CSS for the summary stats modal
    if (!document.getElementById('summary-stats-styles')) {
        const style = document.createElement('style');
        style.id = 'summary-stats-styles';
        style.textContent = `
            .summary-stats-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .summary-stats-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 600px;
                max-height: 90%;
                overflow-y: auto;
                padding: 15px;
            }
            
            .summary-stats-close {
                float: right;
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
            }
            
            .stats-tabs {
                display: flex;
                border-bottom: 1px solid #ccc;
                margin-bottom: 15px;
            }
            
            .stats-tab-btn {
                background: none;
                border: none;
                padding: 8px 15px;
                cursor: pointer;
                border-radius: 5px 5px 0 0;
                margin-right: 5px;
            }
            
            .stats-tab-btn.active {
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                border-bottom: none;
            }
            
            .stats-tab-content {
                display: none;
            }
            
            .stats-tab-content.active {
                display: block;
            }
            
            .stats-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 14px;
            }
            
            .stats-table th, .stats-table td {
                border-bottom: 1px solid #eee;
                padding: 6px;
                text-align: center;
            }
            
            .stats-table th:first-child, .stats-table td:first-child {
                text-align: left;
            }
            
            .stats-table th {
                background-color: #f5f5f5;
            }
            
            h3 {
                font-size: 16px;
                margin: 15px 0 8px 0;
            }
            
            @media (max-width: 480px) {
                .stats-table {
                    font-size: 12px;
                }
                
                .stats-table th, .stats-table td {
                    padding: 4px;
                }
                
                h3 {
                    font-size: 14px;
                    margin: 12px 0 6px 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Generate HTML for player statistics tables
function generatePlayerStatsHTML(stats, teamNames) {    const playerNames = {
        a1: appState.teams.a.players[0] || 'Player A1',
        a2: appState.teams.a.players[1] || 'Player A2',
        b1: appState.teams.b.players[0] || 'Player B1',
        b2: appState.teams.b.players[1] || 'Player B2'
    };
    
    let html = '';
    
    // Team A Players
    html += `<h3>${teamNames.a} Players</h3>`;
    html += generatePlayerStatTable('Attack', ['Kills', 'Errors', 'Total', 'Hit %', 'Efficiency'], 
        [playerNames.a1, playerNames.a2], 
        [
            [stats.player.a1.attack.kills, stats.player.a2.attack.kills],
            [stats.player.a1.attack.errors, stats.player.a2.attack.errors],
            [stats.player.a1.attack.totalAttempts, stats.player.a2.attack.totalAttempts],
            [stats.player.a1.attack.hittingPercentage.toFixed(1) + '%', stats.player.a2.attack.hittingPercentage.toFixed(1) + '%'],
            [stats.player.a1.attack.hittingEfficiency.toFixed(3), stats.player.a2.attack.hittingEfficiency.toFixed(3)]
        ]
    );
    
    html += generatePlayerStatTable('Serve', ['Aces', 'Errors', 'Total', 'Ace %'], 
        [playerNames.a1, playerNames.a2], 
        [
            [stats.player.a1.serve.aces, stats.player.a2.serve.aces],
            [stats.player.a1.serve.errors, stats.player.a2.serve.errors],
            [stats.player.a1.serve.totalServes, stats.player.a2.serve.totalServes],
            [stats.player.a1.serve.acePercentage.toFixed(1) + '%', stats.player.a2.serve.acePercentage.toFixed(1) + '%']
        ]
    );
    
    html += generatePlayerStatTable('Other', ['Blocks', 'Digs', 'Reception Errors'], 
        [playerNames.a1, playerNames.a2], 
        [
            [stats.player.a1.block.blocks, stats.player.a2.block.blocks],
            [stats.player.a1.dig.digs, stats.player.a2.dig.digs],
            [stats.player.a1.reception.errors, stats.player.a2.reception.errors]
        ]
    );
    
    // Team B Players
    html += `<h3>${teamNames.b} Players</h3>`;
    html += generatePlayerStatTable('Attack', ['Kills', 'Errors', 'Total', 'Hit %', 'Efficiency'], 
        [playerNames.b1, playerNames.b2], 
        [
            [stats.player.b1.attack.kills, stats.player.b2.attack.kills],
            [stats.player.b1.attack.errors, stats.player.b2.attack.errors],
            [stats.player.b1.attack.totalAttempts, stats.player.b2.attack.totalAttempts],
            [stats.player.b1.attack.hittingPercentage.toFixed(1) + '%', stats.player.b2.attack.hittingPercentage.toFixed(1) + '%'],
            [stats.player.b1.attack.hittingEfficiency.toFixed(3), stats.player.b2.attack.hittingEfficiency.toFixed(3)]
        ]
    );
    
    html += generatePlayerStatTable('Serve', ['Aces', 'Errors', 'Total', 'Ace %'], 
        [playerNames.b1, playerNames.b2], 
        [
            [stats.player.b1.serve.aces, stats.player.b2.serve.aces],
            [stats.player.b1.serve.errors, stats.player.b2.serve.errors],
            [stats.player.b1.serve.totalServes, stats.player.b2.serve.totalServes],
            [stats.player.b1.serve.acePercentage.toFixed(1) + '%', stats.player.b2.serve.acePercentage.toFixed(1) + '%']
        ]
    );
    
    html += generatePlayerStatTable('Other', ['Blocks', 'Digs', 'Reception Errors'], 
        [playerNames.b1, playerNames.b2], 
        [
            [stats.player.b1.block.blocks, stats.player.b2.block.blocks],
            [stats.player.b1.dig.digs, stats.player.b2.dig.digs],
            [stats.player.b1.reception.errors, stats.player.b2.reception.errors]
        ]
    );
    
    return html;
}

// Helper function to generate player stat tables
function generatePlayerStatTable(title, rowLabels, playerNames, data) {
    let html = `<h4>${title}</h4>`;
    html += '<table class="stats-table">';
    
    // Header row with player names
    html += '<tr><th>Stat</th>';
    playerNames.forEach(name => {
        html += `<th>${name}</th>`;
    });
    html += '</tr>';
    
    // Data rows
    for (let i = 0; i < rowLabels.length; i++) {
        html += `<tr><td>${rowLabels[i]}</td>`;
        for (let j = 0; j < playerNames.length; j++) {
            html += `<td>${data[i][j]}</td>`;
        }
        html += '</tr>';
    }
    
    html += '</table>';
    return html;
}
