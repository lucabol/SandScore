const beginnerStateMachine = {
    "__rules__": {
        "setWinConditions": {
            "pointsToWin": {
                "beginner": [21, 21, 15],
                "short": [3, 3, 3],
                "regular": [21, 21, 15]
            },
            "minPointDifference": 2,
            "setsToWin": 2
        },
        "initialState": "Serve",
        "setTransitions": {
            "nextState": "Serve",
            "resetScores": true,
            "matchEndCondition": {
                "setsToWin": 2
            }
        },
        "defaults": {
            "teamA": {
                "players": ["Player 1", "Player 2"],
                "isServing": true
            },
            "teamB": {
                "players": ["Player 3", "Player 4"],
                "isServing": false
            }
        },
        "actionStyles": {
            "error": "danger",
            "point": "success",
            "regular": "primary"
        }
    },
    "Serve": {
        "displayName": "{servingTeam} Serve",
        "transitions": [
            { "action": "Ace", "nextState": "Point Server", "style": "point", "help": "Direct point from serve", "category": "serve", "statTeam": "Serving", "statPlayer": "0" }, // Simplified stat player
            { "action": "SErr", "nextState": "Point Receiver", "style": "error", "help": "Service error", "category": "serve", "statTeam": "Serving", "statPlayer": "0" }, // Simplified stat player
            { "action": "RE1", "nextState": "Point Server", "style": "error", "help": "Reception error by player 1", "category": "reception", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "RE2", "nextState": "Point Server", "style": "error", "help": "Reception error by player 2", "category": "reception", "statTeam": "Receiving", "statPlayer": "2" },
            { "action": "R1", "nextState": "Attack Receiver", "style": "regular", "help": "Reception by player 1", "category": "reception", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "R2", "nextState": "Attack Receiver", "style": "regular", "help": "Reception by player 2", "category": "reception", "statTeam": "Receiving", "statPlayer": "2" }
        ]
    },
    "Attack Receiver": {
        "displayName": "{receivingTeam} Attack",
        "transitions": [
            { "action": "Win1", "nextState": "Point Receiver", "style": "point", "help": "Winning attack by player 1", "category": "attack", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "Win2", "nextState": "Point Receiver", "style": "point", "help": "Winning attack by player 2", "category": "attack", "statTeam": "Receiving", "statPlayer": "2" },
            { "action": "Err1", "nextState": "Point Server", "style": "error", "help": "Attack error by player 1", "category": "attack", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "Err2", "nextState": "Point Server", "style": "error", "help": "Attack error by player 2", "category": "attack", "statTeam": "Receiving", "statPlayer": "2" },
            { "action": "Blk1", "nextState": "Point Server", "style": "error", "help": "Blocked player 1 (by Server P1)", "category": "attack", "statTeam": "Receiving", "statPlayer": "1" }, // Atk player stat
            { "action": "Blk2", "nextState": "Point Server", "style": "error", "help": "Blocked player 2 (by Server P2)", "category": "attack", "statTeam": "Receiving", "statPlayer": "2" }, // Atk player stat
            { "action": "Def1", "nextState": "Attack Server", "style": "regular", "help": "Defended by player 1 (Server P1)", "category": "defense", "statTeam": "Serving", "statPlayer": "1" }, // Def player stat
            { "action": "Def2", "nextState": "Attack Server", "style": "regular", "help": "Defended by player 2 (Server P2)", "category": "defense", "statTeam": "Serving", "statPlayer": "2" }  // Def player stat
        ]
    },
    "Attack Server": {
        "displayName": "{servingTeam} Attack",
        "transitions": [
            { "action": "Win1", "nextState": "Point Server", "style": "point", "help": "Winning attack by player 1", "category": "attack", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "Win2", "nextState": "Point Server", "style": "point", "help": "Winning attack by player 2", "category": "attack", "statTeam": "Serving", "statPlayer": "2" },
            { "action": "Err1", "nextState": "Point Receiver", "style": "error", "help": "Attack error by player 1", "category": "attack", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "Err2", "nextState": "Point Receiver", "style": "error", "help": "Attack error by player 2", "category": "attack", "statTeam": "Serving", "statPlayer": "2" },
            { "action": "Blk1", "nextState": "Point Receiver", "style": "error", "help": "Blocked player 1 (by Receiver P1)", "category": "attack", "statTeam": "Serving", "statPlayer": "1" }, // Atk player stat
            { "action": "Blk2", "nextState": "Point Receiver", "style": "error", "help": "Blocked player 2 (by Receiver P2)", "category": "attack", "statTeam": "Serving", "statPlayer": "2" }, // Atk player stat
            { "action": "Def1", "nextState": "Attack Receiver", "style": "regular", "help": "Defended player 1 (Receiver P1)", "category": "defense", "statTeam": "Receiving", "statPlayer": "1" }, // Def player stat
            { "action": "Def2", "nextState": "Attack Receiver", "style": "regular", "help": "Defended player 2 (Receiver P2)", "category": "defense", "statTeam": "Receiving", "statPlayer": "2" }  // Def player stat
        ]
    },
    "Point Server": {
        "displayName": "Point {servingTeam}",
        "isTerminal": true,
        "scoring": {
            "awardPoint": "server",
            "switchServer": true // Usually true in beginner, side-out scoring often assumed
        },
        "setTransition": {
            "nextServer": "winner" // Stays with winner
        }
    },
    "Point Receiver": {
        "displayName": "Point {receivingTeam}",
        "isTerminal": true,
        "scoring": {
            "awardPoint": "receiver",
            "switchServer": true // Side-out, server switches
        },
        "setTransition": {
            "nextServer": "winner" // Receiver becomes server
        }
    },
    // Initialize beginner mode statistics table (attached here)
    "__statisticsTable__": [
        {
            key: 'pointsWon',
            label: 'Total Points',
            showInPlayerStats: false,
            calculate: (team, rallyHistory) => Object.values(rallyHistory).filter(rally => rally.scoringTeam === team).length
        },
        {
            key: 'aces',
            label: 'Aces',
            showInPlayerStats: false, // Simplified: Team stat
            calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
                return count + rally.actions.filter(action => action === 'Ace' && rally.scoringTeam === team).length;
            }, 0)
        },
        {
            key: 'serviceErrors',
            label: 'Service Errors',
            showInPlayerStats: false, // Simplified: Team stat
            calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
                // Service error means the *other* team scored, and this team was serving
                return count + rally.actions.filter(action => action === 'SErr' && rally.servingTeam === team).length;
            }, 0)
        },
        {
            key: 'attackPoints', // Points from Win1/Win2 actions
            label: 'Attack Points',
            showInPlayerStats: true,
            calculate: (team, rallyHistory, playerIndex = null) => Object.values(rallyHistory).reduce((count, rally) => {
                const actionSuffix = playerIndex !== null ? (playerIndex + 1).toString() : ''; // '1' or '2' or ''
                const pattern = new RegExp(`^Win${actionSuffix}$`);
                  return count + rally.actions.filter(action =>
                      pattern.test(action) && rally.scoringTeam === team).length;
            }, 0)
        },
        {
            key: 'attackErrors', // Points lost from Err1/Err2 actions
            label: 'Attack Errors',
            showInPlayerStats: true,
            calculate: (team, rallyHistory, playerIndex = null) => Object.values(rallyHistory).reduce((count, rally) => {
                 const actionSuffix = playerIndex !== null ? (playerIndex + 1).toString() : ''; // '1' or '2' or ''
                 const pattern = new RegExp(`^Err${actionSuffix}$`);
                  // Error means the *other* team scored
                  return count + rally.actions.filter(action =>
                      pattern.test(action) && rally.scoringTeam !== team).length;
              }, 0)
        },
        {
            key: 'totalAttacks', // Sum of Win, Err, Blk actions by this team/player
            label: 'Total Attacks',
            showInPlayerStats: true,
            calculate: (team, rallyHistory, playerIndex = null) => Object.values(rallyHistory).reduce((count, rally) => {
                const actionSuffix = playerIndex !== null ? (playerIndex + 1).toString() : ''; // '1' or '2' or ''
                const attackPatterns = [new RegExp(`^Win${actionSuffix}$`), new RegExp(`^Err${actionSuffix}$`), new RegExp(`^Blk${actionSuffix}$`)];

                // Determine team based on state (simplified: check if serving team matches)
                 let isServingTurn = rally.servingTeam === team;
                 rally.actions.forEach(action => {
                    const checkTeam = isServingTurn ? 'Serving' : 'Receiving';
                    // Find transition to check statTeam
                    let transitionTeam = null;
                     for (const stateName in beginnerStateMachine) {
                         if (stateName.startsWith('__')) continue;
                         const stateTransitions = beginnerStateMachine[stateName]?.transitions || [];
                         const found = stateTransitions.find(t => t.action === action);
                         if (found) {
                             transitionTeam = found.statTeam;
                             break;
                         }
                     }

                    if (transitionTeam === checkTeam && attackPatterns.some(p => p.test(action))) {
                        count++;
                    }
                    // Crude turn switching logic for beginner mode
                    if (action.startsWith('R') || action.startsWith('Def')) isServingTurn = !isServingTurn;
                 });
                 return count;
             }, 0)
        },
        {
            key: 'attackEfficiency',
            label: 'Attack Efficiency',
            showInPlayerStats: true,
            calculate: (team, rallyHistory, playerIndex = null) => {
                const points = beginnerStateMachine.__statisticsTable__.find(s => s.key === 'attackPoints').calculate(team, rallyHistory, playerIndex);
                const errors = beginnerStateMachine.__statisticsTable__.find(s => s.key === 'attackErrors').calculate(team, rallyHistory, playerIndex);
                const totalAttacks = beginnerStateMachine.__statisticsTable__.find(s => s.key === 'totalAttacks').calculate(team, rallyHistory, playerIndex);

                // Calculate blocks against this team/player
                 const blocksAgainst = Object.values(rallyHistory).reduce((count, rally) => {
                     const actionSuffix = playerIndex !== null ? (playerIndex + 1).toString() : ''; // '1' or '2' or ''
                     const blockPattern = new RegExp(`^Blk${actionSuffix}$`);
                     // Block action by the opponent team is an error for the attacking player
                     return count + rally.actions.filter(action =>
                         blockPattern.test(action) && rally.scoringTeam !== team).length;
                 }, 0);

                 return totalAttacks === 0 ? 'NaN' : Math.round(((points - errors - blocksAgainst) / totalAttacks) * 100);
            }
        },
        {
            key: 'blocks', // Successful blocks (Blk action where this team scores)
            label: 'Blocks',
            showInPlayerStats: true,
            calculate: (team, rallyHistory, playerIndex = null) => Object.values(rallyHistory).reduce((count, rally) => {
                 const actionSuffix = playerIndex !== null ? (playerIndex + 1).toString() : '';
                 // Blocker is on the defending team. Need to determine blocker number.
                 // Assume Def1/Def2 maps to Blocker P1/P2 on the *other* team for simplicity.
                 const defenseActionPattern = new RegExp(`^Def${actionSuffix}$`);

                 // Check if a Def action by the *correct player on this team* immediately precedes a Blk action where the opponent was attacking
                 rally.actions.forEach((action, index) => {
                     if (action.startsWith('Blk') && rally.scoringTeam === team) {
                         // Find the preceding Def action to potentially identify the blocker
                         if (index > 0) {
                             const prevAction = rally.actions[index-1];
                             if(defenseActionPattern.test(prevAction)) {
                                // Check if this team was defending based on turn logic
                                let wasDefending = false;
                                // Basic check: if receiving team scored via block, receiver was defending
                                if (rally.scoringTeam === team && rally.servingTeam !== team) wasDefending = true;
                                // if serving team scored via block, server was defending
                                if (rally.scoringTeam === team && rally.servingTeam === team) wasDefending = true;

                                if(wasDefending) count++;
                             }
                         }
                     }
                 });
                 return count;
             }, 0)
        },
        {
            key: 'receptionErrors', // Points lost from RE1/RE2 actions
            label: 'Reception Errors',
            showInPlayerStats: true,
            calculate: (team, rallyHistory, playerIndex = null) => Object.values(rallyHistory).reduce((count, rally) => {
                 const actionSuffix = playerIndex !== null ? (playerIndex + 1).toString() : ''; // '1' or '2' or ''
                 const pattern = new RegExp(`^RE${actionSuffix}$`);
                  // Reception error means the *other* team scored, and this team was receiving
                  return count + rally.actions.filter(action =>
                      pattern.test(action) && rally.scoringTeam !== team && rally.servingTeam !== team).length;
              }, 0)
        },
        {
            key: 'defenses', // Successful defenses (Def1/Def2 actions)
            label: 'Successful Defenses (Digs)',
            showInPlayerStats: true,
            calculate: (team, rallyHistory, playerIndex = null) => Object.values(rallyHistory).reduce((count, rally) => {
                const actionSuffix = playerIndex !== null ? (playerIndex + 1).toString() : ''; // '1' or '2' or ''
                const pattern = new RegExp(`^Def${actionSuffix}$`);

                // Determine team based on state (simplified: check if serving team matches)
                 let isServingTurn = rally.servingTeam === team;
                 rally.actions.forEach(action => {
                     const checkTeam = isServingTurn ? 'Serving' : 'Receiving';
                     let transitionTeam = null;
                     for (const stateName in beginnerStateMachine) {
                          if (stateName.startsWith('__')) continue;
                          const stateTransitions = beginnerStateMachine[stateName]?.transitions || [];
                          const found = stateTransitions.find(t => t.action === action);
                          if (found) {
                             transitionTeam = found.statTeam;
                             break;
                          }
                     }
                      if (transitionTeam === checkTeam && pattern.test(action)) {
                          count++;
                      }
                     if (action.startsWith('R') || action.startsWith('Def')) isServingTurn = !isServingTurn;
                 });
                 return count;
             }, 0)
        }
    ]
};