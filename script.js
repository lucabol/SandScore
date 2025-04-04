// State Machine Definition
const advancedStateMachine = {
    // Game rules metadata
    "__rules__": {
        "setWinConditions": {
            "pointsToWin": {
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
    // State definitions
    "Serve": {
        "displayName": "{servingTeam} Serve",
        "transitions": [
            { "action": "Ace", "nextState": "Point Server", "style": "point", "help": "Direct point from serve", "category": "serve", "changeTurn": false },
            { "action": "SErr", "nextState": "Point Receiver", "style": "error", "help": "Service error", "category": "serve", "changeTurn": false },
            { "action": "RE1", "nextState": "Point Server", "style": "error", "help": "Recept error by player 1", "category": "reception", "changeTurn": false },
            { "action": "RE2", "nextState": "Point Server", "style": "error", "help": "Recept error by player 2", "category": "reception", "changeTurn": false },
            { "action": "R-1", "nextState": "Reception", "style": "regular", "help": "Poor reception by player 1", "category": "reception", "changeTurn": true },
            { "action": "R-2", "nextState": "Reception", "style": "regular", "help": "Poor reception by player 2", "category": "reception", "changeTurn": true },
            { "action": "R=1", "nextState": "Reception", "style": "regular", "help": "Medium reception by player 1", "category": "reception", "changeTurn": true },
            { "action": "R=2", "nextState": "Reception", "style": "regular", "help": "Medium reception by player 2", "category": "reception", "changeTurn": true },
            { "action": "R+1", "nextState": "Reception", "style": "regular", "help": "Good reception by player 1", "category": "reception", "changeTurn": true },
            { "action": "R+2", "nextState": "Reception", "style": "regular", "help": "Good reception by player 2", "category": "reception", "changeTurn": true }
        ]
    },
    "Reception": {
        "displayName": "{receivingTeam} Received",
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Rec", "style": "regular", "help": "Attack by player 1", "category": "set", "changeTurn": false },
            { "action": "Atk2", "nextState": "Zone of Attack Rec", "style": "regular", "help": "Attack by player 2", "category": "set", "changeTurn": false },
            { "action": "SetE1", "nextState": "Point Server", "style": "error", "help": "Set err by player 1", "category": "set", "changeTurn": false },
            { "action": "SetE2", "nextState": "Point Server", "style": "error", "help": "Set err by player 2", "category": "set", "changeTurn": false }
        ]
    },
    "Zone of Attack Rec": {
        "displayName": "Attack Zone for {receivingTeam}",
        "transitions": [
            { "action": "V1", "nextState": "Trajectory Rec", "help": "High ball position 1", "category": "atk Zone", "changeTurn": false },
            { "action": "V2", "nextState": "Trajectory Rec", "help": "High ball position 2", "category": "atk Zone", "changeTurn": false },
            { "action": "V3", "nextState": "Trajectory Rec", "help": "High ball position 3", "category": "atk Zone", "changeTurn": false },
            { "action": "V4", "nextState": "Trajectory Rec", "help": "High ball position 4", "category": "atk Zone", "changeTurn": false },
            { "action": "V5", "nextState": "Trajectory Rec", "help": "High ball position 5", "category": "atk Zone", "changeTurn": false },
            { "action": "X1", "nextState": "Trajectory Rec", "help": "Low ball position 1", "category": "atk Zone", "changeTurn": false },
            { "action": "X2", "nextState": "Trajectory Rec", "help": "Low ball position 2", "category": "atk Zone", "changeTurn": false },
            { "action": "X3", "nextState": "Trajectory Rec", "help": "Low ball position 3", "category": "atk Zone", "changeTurn": false },
            { "action": "X4", "nextState": "Trajectory Rec", "help": "Low ball position 4", "category": "atk Zone", "changeTurn": false },
            { "action": "X5", "nextState": "Trajectory Rec", "help": "Low ball position 5", "category": "atk Zone", "changeTurn": false },
            { "action": "I1", "nextState": "Trajectory Rec", "help": "Around setter position 1", "category": "atk Zone", "changeTurn": false },
            { "action": "I2", "nextState": "Trajectory Rec", "help": "Around setter position 2", "category": "atk Zone", "changeTurn": false },
            { "action": "I3", "nextState": "Trajectory Rec", "help": "Around setter position 3", "category": "atk Zone", "changeTurn": false },
            { "action": "I4", "nextState": "Trajectory Rec", "help": "Around setter position 4", "category": "atk Zone", "changeTurn": false },
            { "action": "I5", "nextState": "Trajectory Rec", "help": "Around setter position 5", "category": "atk Zone", "changeTurn": false }
        ]
    },
    "Trajectory Rec": {
        "displayName": "Trajectory {receivingTeam}",
        "transitions": [
            { "action": "Diag", "nextState": "Attack by Receiving Team", "help": "Diagonal attack", "category": "atk Traj", "changeTurn": false },
            { "action": "DiagL", "nextState": "Attack by Receiving Team", "help": "Long diagonal attack", "category": "atk Traj", "changeTurn": false },
            { "action": "DiagS", "nextState": "Attack by Receiving Team", "help": "Short diagonal attack", "category": "atk Traj", "changeTurn": false },
            { "action": "Line", "nextState": "Attack by Receiving Team", "help": "Line attack", "category": "atk Traj", "changeTurn": false },
            { "action": "LineS", "nextState": "Attack by Receiving Team", "help": "Short line attack", "category": "atk Traj", "changeTurn": false },
            { "action": "Cut", "nextState": "Attack by Receiving Team", "help": "Cut shot", "category": "atk Traj", "changeTurn": false }
        ]
    },
    "Attack by Receiving Team": {
        "displayName": "Attack by {receivingTeam}",
        "transitions": [
            { "action": "Win", "nextState": "Point Receiver", "style": "point", "help": "Winning attack", "category": "atk Result", "changeTurn": false },
            { "action": "Err", "nextState": "Point Server", "style": "error", "help": "Attack error", "category": "atk Result", "changeTurn": false },
            { "action": "Blk1", "nextState": "Point Server", "style": "error", "help": "Blocked by player 1", "category": "atk Result", "changeTurn": false },
            { "action": "Blk2", "nextState": "Point Server", "style": "error", "help": "Blocked by player 2", "category": "atk Result", "changeTurn": false },
            { "action": "Def1", "nextState": "Defense By Serving Team", "style": "regular", "help": "Defended by player 1", "category": "atk Res", "changeTurn": true },
            { "action": "Def2", "nextState": "Defense By Serving Team", "style": "regular", "help": "Defended by player 2", "category": "atk Res", "changeTurn": true }
        ]
    },
    "Defense By Serving Team": {
        "displayName": "Defense by {servingTeam}",
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Srv", "help": "Attack by player 1", "category": "set", "changeTurn": false },
            { "action": "Atk2", "nextState": "Zone of Attack Srv", "help": "Attack by player 2", "category": "set", "changeTurn": false },
            { "action": "SetE1", "nextState": "Point Receiver", "style": "error", "help": "Set err by player 1", "category": "set", "changeTurn": false },
            { "action": "SetE2", "nextState": "Point Receiver", "style": "error", "help": "Set err by player 2", "category": "set", "changeTurn": false }
        ]
    },
    "Zone of Attack Srv": {
        "displayName": "Attack Zone for {servingTeam}",
        "transitions": [
            { "action": "V1", "nextState": "Trajectory Srv", "help": "High ball position 1", "category": "atk Zone", "changeTurn": false },
            { "action": "V2", "nextState": "Trajectory Srv", "help": "High ball position 2", "category": "atk Zone", "changeTurn": false },
            { "action": "V3", "nextState": "Trajectory Srv", "help": "High ball position 3", "category": "atk Zone", "changeTurn": false },
            { "action": "V4", "nextState": "Trajectory Srv", "help": "High ball position 4", "category": "atk Zone", "changeTurn": false },
            { "action": "V5", "nextState": "Trajectory Srv", "help": "High ball position 5", "category": "atk Zone", "changeTurn": false },
            { "action": "X1", "nextState": "Trajectory Srv", "help": "Low ball position 1", "category": "atk Zone", "changeTurn": false },
            { "action": "X2", "nextState": "Trajectory Srv", "help": "Low ball position 2", "category": "atk Zone", "changeTurn": false },
            { "action": "X3", "nextState": "Trajectory Srv", "help": "Low ball position 3", "category": "atk Zone", "changeTurn": false },
            { "action": "X4", "nextState": "Trajectory Srv", "help": "Low ball position 4", "category": "atk Zone", "changeTurn": false },
            { "action": "X5", "nextState": "Trajectory Srv", "help": "Low ball position 5", "category": "atk Zone", "changeTurn": false },
            { "action": "I1", "nextState": "Trajectory Srv", "help": "Around setter position 1", "category": "atk Zone", "changeTurn": false },
            { "action": "I2", "nextState": "Trajectory Srv", "help": "Around setter position 2", "category": "atk Zone", "changeTurn": false },
            { "action": "I3", "nextState": "Trajectory Srv", "help": "Around setter position 3", "category": "atk Zone", "changeTurn": false },
            { "action": "I4", "nextState": "Trajectory Srv", "help": "Around setter position 4", "category": "atk Zone", "changeTurn": false },
            { "action": "I5", "nextState": "Trajectory Srv", "help": "Around setter position 5", "category": "atk Zone", "changeTurn": false }
        ]
    },
    "Trajectory Srv": {
        "displayName": "Trajectory {servingTeam}",
        "transitions": [
            { "action": "Diag", "nextState": "Attack by Serving Team", "help": "Diagonal attack", "category": "atk Traj", "changeTurn": false },
            { "action": "DiagL", "nextState": "Attack by Serving Team", "help": "Long diagonal attack", "category": "atk Traj", "changeTurn": false },
            { "action": "DiagS", "nextState": "Attack by Serving Team", "help": "Short diagonal attack", "category": "atk Traj", "changeTurn": false },
            { "action": "Line", "nextState": "Attack by Serving Team", "help": "Line attack", "category": "atk Traj", "changeTurn": false },
            { "action": "LineS", "nextState": "Attack by Serving Team", "help": "Short line attack", "category": "atk Traj", "changeTurn": false },
            { "action": "Cut", "nextState": "Attack by Serving Team", "help": "Cut shot", "category": "atk Traj", "changeTurn": false }
        ]
    },
    "Attack by Serving Team": {
        "displayName": "Attack by {servingTeam}",
        "transitions": [
            { "action": "Win", "nextState": "Point Server", "style": "point", "help": "Winning attack", "category": "atk Res", "changeTurn": false },
            { "action": "Err", "nextState": "Point Receiver", "style": "error", "help": "Attack error", "category": "atk Res", "changeTurn": false },
            { "action": "Blk1", "nextState": "Point Receiver", "style": "error", "help": "Blocked by player 1", "category": "atk Res", "changeTurn": false },
            { "action": "Blk2", "nextState": "Point Receiver", "style": "error", "help": "Blocked by player 2", "category": "atk Res", "changeTurn": false },
            { "action": "Def1", "nextState": "Defense By Receiving Team", "style": "regular", "help": "Defended by player 1", "category": "atk Res", "changeTurn": true },
            { "action": "Def2", "nextState": "Defense By Receiving Team", "style": "regular", "help": "Defended by player 2", "category": "atk Res", "changeTurn": true }
        ]
    },
    "Defense By Receiving Team": {
        "displayName": "Defense by {receivingTeam}",
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Rec", "help": "Attack by player 1", "category": "set", "changeTurn": false },
            { "action": "Atk2", "nextState": "Zone of Attack Rec", "help": "Attack by player 2", "category": "set", "changeTurn": false },
            { "action": "SetE1", "nextState": "Point Server", "style": "error", "help": "Set err by player 1", "category": "set", "changeTurn": false },
            { "action": "SetE2", "nextState": "Point Server", "style": "error", "help": "Set err by player 2", "category": "set", "changeTurn": false }
        ]
    },
    "Point Server": {
        "displayName": "Point {servingTeam}",
        "isTerminal": true,
        "scoring": {
            "awardPoint": "server",
            "switchServer": true
        },
        "setTransition": {
            "nextServer": "winner"
        }
    },
    "Point Receiver": {
        "displayName": "Point {receivingTeam}",
        "isTerminal": true,
        "scoring": {
            "awardPoint": "receiver",
            "switchServer": true
        },
        "setTransition": {
            "nextServer": "winner"
        }
    }
};

// Add helper function before the statistics table definitions
function calculateTotalAttacks(team, rallyHistory) {
    let count = 0;
    Object.values(rallyHistory).forEach(rally => {
        // Determine which team's turn it is initially
        let isReceivingTeam = rally.actions[0].startsWith('R');
        let isTeamsTurn = team === (isReceivingTeam ? 'b' : 'a');
        
        // Go through each action in the rally
        rally.actions.forEach(action => {
            // Find this action in any state's transitions to check if it changes turn
            let transition = null;
            for (const stateName in stateMachine) {
                if (stateName.startsWith('__')) continue; // Skip metadata
                
                const stateTransitions = stateMachine[stateName]?.transitions || [];
                const foundTransition = stateTransitions.find(t => t.action === action);
                
                if (foundTransition) {
                    transition = foundTransition;
                    break;
                }
            }

            // Check if this is an attack action & it's this team's turn
            if (transition && 
                (action === 'Win' || action === 'Err' || action.startsWith('Blk') || 
                 action === 'Win1' || action === 'Win2' || action === 'Err1' || action === 'Err2')) {
                if (isTeamsTurn) {
                    count++;
                }
            }
            
            // Use changeTurn property to determine if we need to switch turns
            if (transition && transition.changeTurn) {
                isTeamsTurn = !isTeamsTurn;
            }
        });
    });
    return count;
}

// Initialize advanced mode statistics table
advancedStateMachine.__statisticsTable__ = [
    {
        key: 'pointsWon',
        label: 'Total Points',
        showInPlayerStats: false,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).filter(rally => rally.scoringTeam === team).length
    },
    {
        key: 'aces',
        label: 'Aces',
        showInPlayerStats: false,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action === 'Ace' && rally.scoringTeam === team).length;
        }, 0)
    },
    {
        key: 'serviceErrors',
        label: 'Service Errors',
        showInPlayerStats: false,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action === 'SErr' && rally.scoringTeam !== team).length;
        }, 0)
    },
    {
        key: 'attackPoints',
        label: 'Attack Points',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
                action === 'Win' && rally.scoringTeam === team).length;
        }, 0)
    },
    {
        key: 'attackErrors',
        label: 'Attack Errors',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
                action === 'Err' && rally.scoringTeam !== team).length;
        }, 0)
    },
    {
        key: 'totalAttacks',
        label: 'Total Attacks',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => calculateTotalAttacks(team, rallyHistory)
    },
    {
        key: 'attackEfficiency',
        label: 'Attack Efficiency',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => {
            const points = Object.values(rallyHistory).reduce((count, rally) => {
                return count + rally.actions.filter(action => 
                    (action === 'Win' || action === 'Win1' || action === 'Win2') && rally.scoringTeam === team).length;
            }, 0);
            const errors = Object.values(rallyHistory).reduce((count, rally) => {
                return count + rally.actions.filter(action => 
                    (action === 'Err' || action === 'Err1' || action === 'Err2') && rally.scoringTeam !== team).length;
            }, 0);
            const totalAttacks = calculateTotalAttacks(team, rallyHistory);
            return totalAttacks === 0 ? 'NaN' : Math.round(((points - errors) / totalAttacks) * 100);
        }
    },
    {
        key: 'blocks',
        label: 'Blocks',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
                (action === 'Blk1' || action === 'Blk2') && rally.scoringTeam === team).length;
        }, 0)
    },
    {
        key: 'receptionErrors',
        label: 'Reception Errors',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
                (action === 'RE1' || action === 'RE2') && rally.scoringTeam !== team).length;
        }, 0)
    },
    {
        key: 'defenses',
        label: 'Defenses',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
                (action === 'Def1' || action === 'Def2') && rally.scoringTeam === team).length;
        }, 0)
    },
];

// Simplified state machine for beginners that only includes states leading to points
const beginnerStateMachine = {
    // Game rules metadata
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
    // State definitions
    "Serve": {
        "displayName": "{servingTeam} Serve",
        "transitions": [
            { "action": "Ace", "nextState": "Point Server", "style": "point", "help": "Direct point from serve", "category": "serve", "changeTurn": false },
            { "action": "SErr", "nextState": "Point Receiver", "style": "error", "help": "Service error", "category": "serve", "changeTurn": false },
            { "action": "RE1", "nextState": "Point Server", "style": "error", "help": "Reception error by player 1", "category": "reception", "changeTurn": false },
            { "action": "RE2", "nextState": "Point Server", "style": "error", "help": "Reception error by player 2", "category": "reception", "changeTurn": false },
            { "action": "R1", "nextState": "Attack Receiver", "style": "regular", "help": "Reception by player 1", "category": "reception", "changeTurn": true },
            { "action": "R2", "nextState": "Attack Receiver", "style": "regular", "help": "Reception by player 2", "category": "reception", "changeTurn": true }
        ]
    },
    "Attack Receiver": {
        "displayName": "{receivingTeam} Attack",
        "transitions": [
            { "action": "Win1", "nextState": "Point Receiver", "style": "point", "help": "Winning attack by player 1", "category": "attack", "changeTurn": true },
            { "action": "Win2", "nextState": "Point Receiver", "style": "point", "help": "Winning attack by player 2", "category": "attack", "changeTurn": true },
            { "action": "Err1", "nextState": "Point Server", "style": "error", "help": "Attack error by player 1", "category": "attack", "changeTurn": true },
            { "action": "Err2", "nextState": "Point Server", "style": "error", "help": "Attack error by player 2", "category": "attack", "changeTurn": true },
            { "action": "Blk1", "nextState": "Point Server", "style": "point", "help": "Blocked by player 1", "category": "attack", "changeTurn": true },
            { "action": "Blk2", "nextState": "Point Server", "style": "point", "help": "Blocked by player 2", "category": "attack", "changeTurn": true },
            { "action": "Def1", "nextState": "Attack Server", "style": "regular", "help": "Defended by player 1", "category": "defense", "changeTurn": true },
            { "action": "Def2", "nextState": "Attack Server", "style": "regular", "help": "Defended by player 2", "category": "defense", "changeTurn": true }
        ]
    },
    "Attack Server": {
        "displayName": "{servingTeam} Attack",
        "transitions": [
            { "action": "Win1", "nextState": "Point Server", "style": "point", "help": "Winning attack by player 1", "category": "attack", "changeTurn": true },
            { "action": "Win2", "nextState": "Point Server", "style": "point", "help": "Winning attack by player 2", "category": "attack", "changeTurn": true },
            { "action": "Err1", "nextState": "Point Receiver", "style": "error", "help": "Attack error by player 1", "category": "attack", "changeTurn": true },
            { "action": "Err2", "nextState": "Point Receiver", "style": "error", "help": "Attack error by player 2", "category": "attack", "changeTurn": true },
            { "action": "Blk1", "nextState": "Point Receiver", "style": "point", "help": "Blocked by player 1", "category": "attack", "changeTurn": true },
            { "action": "Blk2", "nextState": "Point Receiver", "style": "point", "help": "Blocked by player 2", "category": "attack", "changeTurn": true },
            { "action": "Def1", "nextState": "Attack Receiver", "style": "regular", "help": "Defended by player 1", "category": "defense", "changeTurn": true },
            { "action": "Def2", "nextState": "Attack Receiver", "style": "regular", "help": "Defended by player 2", "category": "defense", "changeTurn": true }
        ]
    },
    "Point Server": {
        "displayName": "Point {servingTeam}",
        "isTerminal": true,
        "scoring": {
            "awardPoint": "server",
            "switchServer": true
        },
        "setTransition": {
            "nextServer": "winner"
        }
    },
    "Point Receiver": {
        "displayName": "Point {receivingTeam}",
        "isTerminal": true,
        "scoring": {
            "awardPoint": "receiver",
            "switchServer": true
        },
        "setTransition": {
            "nextServer": "winner"
        }
    }
};

// Initialize beginner mode statistics table
beginnerStateMachine.__statisticsTable__ = [
    {
        key: 'pointsWon',
        label: 'Total Points',
        showInPlayerStats: false,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).filter(rally => rally.scoringTeam === team).length
    },
    {
        key: 'aces',
        label: 'Aces',
        showInPlayerStats: false,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action === 'Ace' && rally.scoringTeam === team).length;
        }, 0)
    },
    {
        key: 'serviceErrors',
        label: 'Service Errors',
        showInPlayerStats: false,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => action === 'SErr' && rally.scoringTeam !== team).length;
        }, 0)
    },
    {
        key: 'attackPoints',
        label: 'Attack Points',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
(                action === 'Win1' || action === 'Win2') && rally.scoringTeam === team).length;
        }, 0)
    },
    {
        key: 'attackErrors',
        label: 'Attack Errors',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
                action === 'Err' && rally.scoringTeam !== team).length;
        }, 0)
    },
    {
        key: 'totalAttacks',
        label: 'Total Attacks',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => calculateTotalAttacks(team, rallyHistory)
    },
    {
        key: 'attackEfficiency',
        label: 'Attack Efficiency',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => {
            const points = Object.values(rallyHistory).reduce((count, rally) => {
                return count + rally.actions.filter(action => 
                    (action === 'Win' || action === 'Win1' || action === 'Win2') && rally.scoringTeam === team).length;
            }, 0);
            const errors = Object.values(rallyHistory).reduce((count, rally) => {
                return count + rally.actions.filter(action => 
                    (action === 'Err' || action === 'Err1' || action === 'Err2') && rally.scoringTeam !== team).length;
            }, 0);
            const totalAttacks = calculateTotalAttacks(team, rallyHistory);
            return totalAttacks === 0 ? 'NaN' : Math.round(((points - errors) / totalAttacks) * 100);
        }
    },
    {
        key: 'blocks',
        label: 'Blocks',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
                (action === 'Blk1' || action === 'Blk2') && rally.scoringTeam === team).length;
        }, 0)
    },
    {
        key: 'receptionErrors',
        label: 'Reception Errors',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
                (action === 'RE1' || action === 'RE2') && rally.scoringTeam !== team).length;
        }, 0)
    },
    {
        key: 'defenses',
        label: 'Defenses',
        showInPlayerStats: true,
        calculate: (team, rallyHistory) => Object.values(rallyHistory).reduce((count, rally) => {
            return count + rally.actions.filter(action => 
                (action === 'Def1' || action === 'Def2') && rally.scoringTeam === team).length;
        }, 0)
    },
];

// Set default state machine
let stateMachine = advancedStateMachine;

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const matchScreen = document.getElementById('match-screen');
const summaryScreen = document.getElementById('summary-screen');
const startMatchBtn = document.getElementById('start-match');
const actionButtonsEl = document.getElementById('action-buttons');
const undoBtn = document.getElementById('undo-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const restartBtn = document.getElementById('restart-btn');
const historyListEl = document.getElementById('history-list');
const legendModal = document.getElementById('legend-modal');
const infoButton = document.getElementById('info-button');
const infoButtonMatch = document.getElementById('info-button-match');
const closeModalButton = document.querySelector('.close-modal');

// Add these variables with the other DOM elements
const statisticsModal = document.getElementById('statistics-modal');
const statButton = document.getElementById('stat-button');
const statButtonMatch = document.getElementById('stat-button-match');

// Add new elements for All Stats modal
const allStatsModal = document.getElementById('all-stats-modal');
const detailsButton = document.getElementById('details-button');
const detailsButtonMatch = document.getElementById('details-button-match');
const detailsButtonSummary = document.getElementById('details-button-summary');

// Add these with the other DOM elements at the top
const set3ServerModal = document.getElementById('set3-server-modal');
const set3TeamAName = document.getElementById('set3-team-a-name');
const set3TeamBName = document.getElementById('set3-team-b-name');
const set3ServerConfirm = document.getElementById('set3-server-confirm');

// Application State
let appState = {
    teams: {
        a: {
            name: 'Team A',
            players: ['Luca', 'Matteo'],
            setScores: [0, 0, 0],
            currentScore: 0,
            isServing: true
        },
        b: {
            name: 'Team B',
            players: ['Mol', 'Sorum'],
            setScores: [0, 0, 0],
            currentScore: 0,
            isServing: false
        }
    },
    currentSet: 0,
    currentRally: 1,
    pointsPerSet: [3, 3, 3], // Default points per set (short game)
    currentState: 'Serve',
    history: [],
    // To track rally history by rally number and actions
    rallyActions: [], // Actions for current rally
    rallyHistory: {}, // Object with rally numbers as keys and action arrays as values
    firstServingTeam: 'a', // Track who served first in the match
};

// Simplified state management
const state = {
    states: [], // Stack of states
};

function saveState(newState) {
    // Avoid saving duplicate states
    const lastState = state.states[state.states.length - 1];
    if (lastState && JSON.stringify(newState) === lastState) {
        return; // Do not save if the state is identical to the last one
    }

    // Push new state to stack
    state.states.push(JSON.stringify(newState));

    // Save to localStorage
    localStorage.setItem('sandscoreStates', JSON.stringify(state));
}

function loadFromStorage() {
    const savedState = localStorage.getItem('sandscoreStates');
    if (savedState) {
        const loadedState = JSON.parse(savedState);
        state.states = loadedState.states || [];
        if (state.states.length > 0) {
            const lastState = JSON.parse(state.states[state.states.length - 1]);
            loadState(lastState, true);

            // Restore the correct state machine based on saved game mode
            if (lastState.gameMode === 'beginner') {
                stateMachine = beginnerStateMachine;
            } else {
                stateMachine = advancedStateMachine;
            }

            return true;
        }
    }
    return false;
}

function loadState(loadedAppState, replaceStack = false) {
    // Restore appState from the loaded state
    Object.assign(appState, loadedAppState);

    if (replaceStack) {
        // Replace the entire undo stack with the loaded state
        state.states = [JSON.stringify(loadedAppState)];
    } else {
        // Ensure the current state is saved to the stack
        saveState(appState);
    }
}

function saveStateForUndo() {
    // Save the current appState for undo functionality
    saveState(appState);
}

// Save player preferences to localStorage
function savePlayerPreferences() {
    const preferences = {
        teamA: {
            player1: document.getElementById('team-a-player1').value,
            player2: document.getElementById('team-a-player2').value
        },
        teamB: {
            player1: document.getElementById('team-b-player1').value,
            player2: document.getElementById('team-b-player2').value
        },
        scoringFormat: document.querySelector('input[name="scoring"]:checked').value,
        servingTeam: document.querySelector('input[name="serving"]:checked').value
    };
    localStorage.setItem('sandScorePreferences', JSON.stringify(preferences));
}

// Load player preferences from localStorage
function loadPlayerPreferences() {
    const savedPreferences = localStorage.getItem('sandScorePreferences');
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        document.getElementById('team-a-player1').value = preferences.teamA.player1 || '';
        document.getElementById('team-a-player2').value = preferences.teamA.player2 || '';
        document.getElementById('team-b-player1').value = preferences.teamB.player1 || '';
        document.getElementById('team-b-player2').value = preferences.teamB.player2 || '';
        
        // Set scoring format
        const scoringInputs = document.querySelectorAll('input[name="scoring"]');
        scoringInputs.forEach(input => {
            if (input.value === preferences.scoringFormat) {
                input.checked = true;
            }
        });

        // Set serving team
        if (preferences.servingTeam) {
            const servingInputs = document.querySelectorAll('input[name="serving"]');
            servingInputs.forEach(input => {
                if (input.value === preferences.servingTeam) {
                    input.checked = true;
                }
            });
        }
    }
}

// Initialize application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load player preferences first
    loadPlayerPreferences();

    // Set up event listeners
    startMatchBtn.addEventListener('click', () => {
        startMatch();
        // Save preferences when starting a new match
        savePlayerPreferences();
    });

    // Add serving checkbox handlers
    const serveCheckboxes = document.querySelectorAll('input[name="serving"]');
    serveCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            // Uncheck the other checkbox
            serveCheckboxes.forEach(cb => {
                if (cb !== e.target) {
                    cb.checked = false;
                }
            });
            // Ensure at least one checkbox is always checked
            if (!e.target.checked) {
                e.target.checked = true;
            }
        });
    });

    // Add statistics button event listeners
    statButton.addEventListener('click', showStatisticsModal);
    statButtonMatch.addEventListener('click', showStatisticsModal);
    const statButtonSummary = document.getElementById('stat-button-summary');
    statButtonSummary.addEventListener('click', showStatisticsModal);
    statisticsModal.querySelector('.close-modal').addEventListener('click', hideStatisticsModal);
    statisticsModal.addEventListener('click', (e) => {
        if (e.target === statisticsModal) {
            hideStatisticsModal();
        }
    });

    undoBtn.addEventListener('click', undoLastAction);
    saveBtn.addEventListener('click', saveMatch);
    loadBtn.addEventListener('click', loadMatch);
    restartBtn.addEventListener('click', restartApp);
    document.getElementById('restart-btn-summary').addEventListener('click', restartApp);

    // Add file input change listener
    document.getElementById('load-file').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const parsedState = JSON.parse(e.target.result);
                    
                    // Restore the main parts of the state
                    appState = {
                        teams: parsedState.teams,
                        currentSet: parsedState.currentSet,
                        currentRally: parsedState.currentRally,
                        pointsPerSet: parsedState.pointsPerSet,
                        currentState: parsedState.currentState,
                        history: parsedState.history || [],
                        rallyActions: parsedState.rallyActions || [],
                        rallyHistory: parsedState.rallyHistory || {},
                        firstServingTeam: parsedState.firstServingTeam
                    };
                    
                    // Restore undo stack if it exists in the saved file
                    if (parsedState.undoStack) {
                        state.states = parsedState.undoStack;
                    } else {
                        // Initialize undo stack with just this state if no stack was saved
                        state.states = [JSON.stringify(appState)];
                    }
                    
                    // Save to localStorage with the restored stack
                    localStorage.setItem('sandscoreStates', JSON.stringify(state));
                    
                    // Update UI
                    updateHistoryDisplay();
                    updateScoreboard();
                    updateActionButtons();
                    
                    // Show match screen
                    setupScreen.classList.add('hidden');
                    matchScreen.classList.remove('hidden');
                    summaryScreen.classList.add('hidden');
                    
                    // Reset file input
                    event.target.value = '';
                } catch (e) {
                    console.error('Error loading match:', e);
                    alert('Failed to load match file. The file might be corrupted or in wrong format.');
                }
            };
            reader.readAsText(file);
        }
    });

    // Try to load saved state
    if (loadFromStorage()) {
        // Update history display using the new format
        updateHistoryDisplay();
        
        // Update UI
        updateScoreboard();
        updateActionButtons();
        
        // Show match screen
        setupScreen.classList.add('hidden');
        matchScreen.classList.remove('hidden');
        summaryScreen.classList.add('hidden');
    }

    infoButton.addEventListener('click', showLegendModal);
    infoButtonMatch.addEventListener('click', showLegendModal);
    closeModalButton.addEventListener('click', hideLegendModal);
    legendModal.addEventListener('click', (e) => {
        if (e.target === legendModal) {
            hideLegendModal();
        }
    });

    // Add escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !legendModal.classList.contains('hidden')) {
            hideLegendModal();
        }
    });

    // Initialize summary screen buttons and add event listeners
    const undoBtnSummary = document.getElementById('undo-btn-summary');
    const saveBtnSummary = document.getElementById('save-btn-summary');
    const loadBtnSummary = document.getElementById('load-btn-summary');
    const restartBtnSummary = document.getElementById('restart-btn-summary');

    // Add event listeners for summary screen utility buttons
    if (undoBtnSummary) undoBtnSummary.addEventListener('click', undoLastAction);
    if (saveBtnSummary) saveBtnSummary.addEventListener('click', saveMatch);
    if (loadBtnSummary) loadBtnSummary.addEventListener('click', loadMatch);
    if (restartBtnSummary) loadBtnSummary.addEventListener('click', restartApp);

    // Add event listeners for All Stats button
    detailsButton.addEventListener('click', showAllStatsModal);
    detailsButtonMatch.addEventListener('click', showAllStatsModal);
    detailsButtonSummary.addEventListener('click', showAllStatsModal);
    allStatsModal.querySelector('.close-modal').addEventListener('click', hideAllStatsModal);
    allStatsModal.addEventListener('click', (e) => {
        if (e.target === allStatsModal) {
            hideAllStatsModal();
        }
    });

    // Add this to the existing key handler for escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideStatisticsModal();
            hideAllStatsModal();
            // ...existing escape key handlers...
        }
    });

    // Add Set 3 server modal handler
    set3ServerConfirm.addEventListener('click', () => {
        const selectedTeam = document.querySelector('input[name="set3-server"]:checked').value;
        appState.teams.a.isServing = selectedTeam === 'a';
        appState.teams.b.isServing = selectedTeam === 'b';
        appState.currentState = stateMachine.__rules__.setTransitions.nextState;
        hideSet3ServerModal();
        updateScoreboard();
        updateActionButtons();
    });

    // Add escape key handler for set3 server modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!set3ServerModal.classList.contains('hidden')) {
                e.preventDefault(); // Prevent closing if this modal is open
            } else {
                hideStatisticsModal();
                hideLegendModal();
            }
        }
    });
});

// Start a new match with the entered player data
function startMatch() {
    // Clear previous state
    localStorage.removeItem('sandscoreStates');
    state.states = [];

    // Get player names from input fields
    const teamAPlayer1 = document.getElementById('team-a-player1').value || stateMachine.__rules__.defaults.teamA.players[0];
    const teamAPlayer2 = document.getElementById('team-a-player2').value || stateMachine.__rules__.defaults.teamA.players[1];
    const teamBPlayer1 = document.getElementById('team-b-player1').value || stateMachine.__rules__.defaults.teamB.players[0];
    const teamBPlayer2 = document.getElementById('team-b-player2').value || stateMachine.__rules__.defaults.teamB.players[1];

    // Set team names based on player names
    const teamAName = `${teamAPlayer1}/${teamAPlayer2}`;
    const teamBName = `${teamBPlayer1}/${teamBPlayer2}`;
    
    // Get scoring format, serving team, and game mode
    const scoringFormat = document.querySelector('input[name="scoring"]:checked').value;
    const servingTeam = document.querySelector('input[name="serving"]:checked').value;
    const gameMode = document.querySelector('input[name="mode"]:checked').value;
    
    // Set the state machine based on game mode
    stateMachine = gameMode === 'beginner' ? beginnerStateMachine : advancedStateMachine;
    
    // Initialize app state using state machine rules
    appState = {
        teams: {
            a: {
                name: teamAName,
                players: [teamAPlayer1, teamAPlayer2],
                setScores: [0, 0, 0],
                currentScore: 0,
                isServing: servingTeam === 'team-a'
            },
            b: {
                name: teamBName,
                players: [teamBPlayer1, teamBPlayer2],
                setScores: [0, 0, 0],
                currentScore: 0,
                isServing: servingTeam === 'team-b'
            }
        },
        currentSet: 0,
        currentRally: 1,
        pointsPerSet: stateMachine.__rules__.setWinConditions.pointsToWin[scoringFormat],
        currentState: stateMachine.__rules__.initialState,
        history: [],
        rallyActions: [],
        rallyHistory: {},
        firstServingTeam: servingTeam === 'team-a' ? 'a' : 'b',
        gameMode: gameMode
    };

    // Update the scoreboard with initial values
    updateScoreboard();
    
    // Save initial state
    saveStateForUndo();
    
    // Clear the history display
    updateHistoryDisplay();
    
    // Show match screen
    setupScreen.classList.add('hidden');
    matchScreen.classList.remove('hidden');
    
    // Set up action buttons for initial state
    updateActionButtons();
}

// Update the scoreboard with current state
function updateScoreboard() {
    // Update team names
    document.getElementById('display-team-a-name').textContent = appState.teams.a.name;
    document.getElementById('display-team-b-name').textContent = appState.teams.b.name;
    
    // Update current scores
    document.getElementById('team-a-score').textContent = appState.teams.a.currentScore;
    document.getElementById('team-b-score').textContent = appState.teams.b.currentScore;
    
    // Update serving indicator
    document.getElementById('team-a-serving').classList.toggle('serving', appState.teams.a.isServing);
    document.getElementById('team-b-serving').classList.toggle('serving', appState.teams.b.isServing);
    
    // Update set scores
    for (let i = 0; i < 3; i++) {
        document.getElementById(`team-a-set${i+1}`).textContent = appState.teams.a.setScores[i];
        document.getElementById(`team-b-set${i+1}`).textContent = appState.teams.b.setScores[i];
    }
}
function updateActionButtons() {
    actionButtonsEl.innerHTML = '';

    const currentStateEl = document.getElementById('current-state');
    currentStateEl.textContent = getStateDisplayName(appState.currentState);

    const transitions = stateMachine[appState.currentState]?.transitions || [];
    const styles = stateMachine.__rules__.actionStyles;

    transitions.forEach(transition => {
        const button = document.createElement('button');
        button.textContent = transition.action;
        button.classList.add('action-button');

        // Correctly apply the style class from actionStyles
        if (transition.style && styles[transition.style]) {
            button.classList.add(`button-${styles[transition.style]}`);
        }

        button.addEventListener('click', () => {
            handleAction(transition.action, transition.nextState);
        });

        actionButtonsEl.appendChild(button);
    });
}

// Handle action button click
async function handleAction(action, nextState) {
    appState.rallyActions.push(action);
    appState.history.push({
        rally: appState.currentRally,
        state: appState.currentState,
        action: action,
        nextState: nextState,
        scoreA: appState.teams.a.currentScore,
        scoreB: appState.teams.b.currentScore
    });
    
    appState.currentState = nextState;
    
    // Use state machine metadata for scoring
    const stateConfig = stateMachine[nextState];
    if (stateConfig?.isTerminal) {
        const scoring = stateConfig.scoring;
        const scoringTeam = scoring.awardPoint === 'server' ? 
            (appState.teams.a.isServing ? 'a' : 'b') : 
            (appState.teams.a.isServing ? 'b' : 'a');
        
        // Award point
        appState.teams[scoringTeam].currentScore++;
        
        // Store rally history
        appState.rallyHistory[appState.currentRally] = {
            actions: [...appState.rallyActions],
            scoreA: appState.teams.a.currentScore,
            scoreB: appState.teams.b.currentScore,
            scoringTeam: scoringTeam
        };

        const oppositeTeam = scoringTeam === 'a' ? 'b' : 'a';
        const setIsOver = isSetComplete(scoringTeam, oppositeTeam);
        
        if (setIsOver) {
            handleSetCompletion(scoringTeam, oppositeTeam);
        } else {
            // Handle server changes based on state machine config
            if (scoring.switchServer) {
                appState.teams.a.isServing = scoringTeam === 'a';
                appState.teams.b.isServing = scoringTeam === 'b';
            }
            
            // Start next rally
            appState.currentRally++;
            appState.currentState = 'Serve';
            appState.rallyActions = [];
        }
    }
    
    updateScoreboard();
    updateActionButtons();
    updateHistoryDisplay();
    saveStateForUndo();
    updateCurrentPointDisplay();
}

// Helper function to check if a set is complete
function isSetComplete(scoringTeam, oppositeTeam) {
    const rules = stateMachine.__rules__.setWinConditions;
    const pointsToWin = appState.pointsPerSet[appState.currentSet];
    const hasEnoughPoints = appState.teams[scoringTeam].currentScore >= pointsToWin;
    const hasTwoPointLead = appState.teams[scoringTeam].currentScore - appState.teams[oppositeTeam].currentScore >= rules.minPointDifference;
    return hasEnoughPoints && hasTwoPointLead;
}

// Helper function to handle set completion
function handleSetCompletion(scoringTeam, oppositeTeam) {
    // Update set scores
    appState.teams[scoringTeam].setScores[appState.currentSet] = appState.teams[scoringTeam].currentScore;
    appState.teams[oppositeTeam].setScores[appState.currentSet] = appState.teams[oppositeTeam].currentScore;
    
    const rules = stateMachine.__rules__.setTransitions;
    
    // Store the final rally of the set before resetting rally counter
    if (appState.rallyActions.length > 0) {
        appState.rallyHistory[appState.currentRally] = {
            actions: [...appState.rallyActions],
            scoreA: appState.teams.a.currentScore,
            scoreB: appState.teams.b.currentScore,
            scoringTeam: scoringTeam
        };
    }
    
    // Reset current scores if configured
    if (rules.resetScores) {
        appState.teams.a.currentScore = 0;
        appState.teams.b.currentScore = 0;
    }
    
    // Move to next set
    appState.currentSet++;
    // Reset rally counter for new set
    appState.currentRally = (appState.currentSet * 1000) + 1; // Use different range for each set
    appState.rallyActions = [];
    
    // Check match end condition
    const setsWonA = appState.teams.a.setScores.filter((score, i) => 
        score > appState.teams.b.setScores[i]).length;
    const setsWonB = appState.teams.b.setScores.filter((score, i) => 
        score > appState.teams.a.setScores[i]).length;
    
    if (setsWonA >= rules.matchEndCondition.setsToWin || 
        setsWonB >= rules.matchEndCondition.setsToWin) {
        showMatchSummary();
        return;
    }
    
    if (appState.currentSet < 3) {
        // For set 2, serve goes to the opposite of the first serving team
        if (appState.currentSet === 1) { // This is the start of set 2
            const firstServingTeam = appState.firstServingTeam;
            appState.teams.a.isServing = firstServingTeam === 'b';
            appState.teams.b.isServing = firstServingTeam === 'a';
            appState.currentState = rules.nextState;
            saveStateForUndo(); // Save state after updating serving team
        } else if (appState.currentSet === 2) { // This is the start of set 3
            // Show dialog to choose serving team
            showSet3ServerModal();
            // The rest of the logic will be handled by the dialog confirmation
        }
    }

    updateScoreboard();
    updateActionButtons();
}

// Undo the last action
function undoLastAction() {
    if (state.states.length > 1) {
        // Remove current state
        state.states.pop();
        // Get previous state
        const previousState = JSON.parse(state.states[state.states.length - 1]);
        loadState(previousState);
        // Save updated stack to localStorage
        localStorage.setItem('sandscoreStates', JSON.stringify(state));
        
        // Check if we need to switch back from summary screen to match screen
        const setsWonA = appState.teams.a.setScores.filter((score, i) => 
            score > appState.teams.b.setScores[i]).length;
        const setsWonB = appState.teams.b.setScores.filter((score, i) => 
            score > appState.teams.a.setScores[i]).length;
        const rules = stateMachine.__rules__.setTransitions;
        
        // If neither team has won enough sets, we should be on the match screen
        if (setsWonA < rules.matchEndCondition.setsToWin && 
            setsWonB < rules.matchEndCondition.setsToWin) {
            summaryScreen.classList.add('hidden');
            matchScreen.classList.remove('hidden');
        }
        
        updateScoreboard();
        updateActionButtons();
        updateHistoryDisplay();
        updateCurrentPointDisplay();
        
        // Update summary screen display if we're still on that screen
        if (!summaryScreen.classList.contains('hidden')) {
            for (let i = 0; i < 3; i++) {
                document.getElementById(`summary-team-a-set${i+1}`).textContent = appState.teams.a.setScores[i];
                document.getElementById(`summary-team-b-set${i+1}`).textContent = appState.teams.b.setScores[i];
            }
            
            // Update winner announcement
            const setsWonA = appState.teams.a.setScores.filter((score, i) => 
                score > appState.teams.b.setScores[i]).length;
            const setsWonB = appState.teams.b.setScores.filter((score, i) => 
                score > appState.teams.a.setScores[i]).length;
            let winner = setsWonA > setsWonB ? appState.teams.a.name : appState.teams.b.name;
            let score = `${setsWonA}-${setsWonB}`;
            document.getElementById('winner-announcement').textContent = `${winner} wins ${score}!`;
        }
    }
}

// Save the match state to a file
function saveMatch() {
    try {
        // Create a streamlined version of the state to save, including the undo stack
        const stateToSave = {
            teams: appState.teams,
            currentSet: appState.currentSet,
            currentRally: appState.currentRally,
            pointsPerSet: appState.pointsPerSet,
            currentState: appState.currentState,
            history: appState.history,
            rallyActions: appState.rallyActions,
            rallyHistory: appState.rallyHistory,
            firstServingTeam: appState.firstServingTeam,
            gameMode: appState.gameMode,
            undoStack: state.states  // Add the undo stack to the saved state
        };

        // Create file name with current date and player names
        const currentDate = new Date().toISOString().split('T')[0];
        const teamA = `${appState.teams.a.players[0]}-${appState.teams.a.players[1]}`;
        const teamB = `${appState.teams.b.players[0]}-${appState.teams.b.players[1]}`;
        const fileName = `${currentDate} ${teamA} vs ${teamB}.json`;

        // Create blob and download
        const blob = new Blob([JSON.stringify(stateToSave, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error('Error saving match:', e);
        alert('Failed to save match file.');
    }
}

// Load the match state from a file
function loadMatch() {
    const fileInput = document.getElementById('load-file');
    fileInput.click();
}

// Restart the app (go back to setup screen)
function restartApp() {
    if (confirm('Are you sure you want to start a new match? All current progress will be lost.')) {
        // Clear the saved states from localStorage
        localStorage.removeItem('sandscoreStates');
        
        // Clear the rally history display
        historyListEl.innerHTML = '';
        
        // Reset the app state
        appState = {
            teams: {
                a: {
                    name: 'Team A',
                    players: [stateMachine.__rules__.defaults.teamA.players[0], stateMachine.__rules__.defaults.teamA.players[1]],
                    setScores: [0, 0, 0],
                    currentScore: 0,
                    isServing: true
                },
                b: {
                    name: 'Team B',
                    players: [stateMachine.__rules__.defaults.teamB.players[0], stateMachine.__rules__.defaults.teamB.players[1]],
                    setScores: [0, 0, 0],
                    currentScore: 0,
                    isServing: false
                }
            },
            currentSet: 0,
            currentRally: 1,
            pointsPerSet: [3, 3, 3],
            currentState: 'Serve',
            history: [],
            rallyActions: [],
            rallyHistory: {},
            firstServingTeam: 'a'
        };

        // Reset the state stack
        state.states = [];
        
        // Load saved preferences
        loadPlayerPreferences();
        
        // Show setup screen
        setupScreen.classList.remove('hidden');
        matchScreen.classList.add('hidden');
        summaryScreen.classList.add('hidden');
    }
}

// Show match summary
function showMatchSummary() {
    // Update summary screen with final scores
    for (let i = 0; i < 3; i++) {
        document.getElementById(`summary-team-a-set${i+1}`).textContent = appState.teams.a.setScores[i];
        document.getElementById(`summary-team-b-set${i+1}`).textContent = appState.teams.b.setScores[i];
    }
    
    // Set team names
    document.getElementById('summary-team-a-name').textContent = appState.teams.a.name;
    document.getElementById('summary-team-b-name').textContent = appState.teams.b.name;
    
    // Correctly count sets won by each team
    let setsWonA = 0;
    let setsWonB = 0;
    
    for (let i = 0; i < appState.currentSet; i++) {
        if (appState.teams.a.setScores[i] > appState.teams.b.setScores[i]) {
            setsWonA++;
        } else if (appState.teams.b.setScores[i] > appState.teams.a.setScores[i]) {
            setsWonB++;
        }
    }
    
    let winner = setsWonA > setsWonB ? appState.teams.a.name : appState.teams.b.name;
    let score = `${setsWonA}-${setsWonB}`;
    
    document.getElementById('winner-announcement').textContent = `${winner} wins ${score}!`;
    
    // Show summary screen
    matchScreen.classList.add('hidden');
    summaryScreen.classList.remove('hidden');
}

// Update the history display function to use state machine styles
function updateHistoryDisplay() {
    // Clear existing history list first
    historyListEl.innerHTML = '';
    
    // Create a container for our history entries
    const historyContainer = document.createElement('div');
    historyContainer.classList.add('history-container');
    
    // Get all rally numbers from history and sort them
    const rallyNumbers = [...new Set(Object.keys(appState.rallyHistory).map(Number))];
    rallyNumbers.sort((a, b) => a - b);
    
    // Add current rally if it has actions but isn't in history yet
    if (appState.rallyActions.length > 0 && !rallyNumbers.includes(appState.currentRally)) {
        rallyNumbers.push(appState.currentRally);
    }
    
    // For each rally, create a history item showing actions and score
    rallyNumbers.forEach(rallyNum => {
        let actionsForRally = [];
        let rallyData = null;
        
        if (appState.rallyHistory[rallyNum]) {
            rallyData = appState.rallyHistory[rallyNum];
            actionsForRally = rallyData.actions;
        } else if (rallyNum ===appState.currentRally) {
            actionsForRally = appState.rallyActions;
        }
        
        // Create a history item with the appropriate layout
        const rallyItem = document.createElement('div');
        rallyItem.classList.add('history-item');
        
        // Format actions with proper tag classes using state machine metadata
        const formattedActions = actionsForRally.map(action => {
            // Find the style of this action in any state's transitions
            let style = 'regular';  // default style
            for (const state in stateMachine) {
                const transitions = stateMachine[state].transitions || [];
                const transition = transitions.find(t => t.action === action);
                if (transition?.style) {
                    style = transition.style;
                    break;
                }
            }
            return `<span class="tag-${style}">${action}</span>`;
        }).join(' ');
        
        // For completed rallies, use the stored scores
        if (rallyData) {
            const scoreText = `${rallyData.scoreA}-${rallyData.scoreB}`;
            
            if (rallyData.scoringTeam === 'a') {
                rallyItem.innerHTML = `
                    <div class="history-actions home-scored">${formattedActions}</div>
                    <div class="history-score">${scoreText}</div>
                `;
            } else {
                rallyItem.innerHTML = `
                    <div class="history-score">${scoreText}</div>
                    <div class="history-actions away-scored">${formattedActions}</div>
                `;
            }
        } else if (actionsForRally.length > 0) {
            const scoreText = `${appState.teams.a.currentScore}-${appState.teams.b.currentScore}`;
            rallyItem.innerHTML = `
                <div class="history-actions current-rally">${formattedActions}</div>
                <div class="history-score current-rally">${scoreText}</div>
            `;
        }
        
        // Add event listeners to all history actions after adding to DOM
        const tooltip = document.getElementById('tooltip');
        rallyItem.querySelectorAll('.history-actions').forEach(actionDiv => {
            // Function to check if content is truncated (will show ellipsis)
            const isTextTruncated = (element) => {
                const computedStyle = window.getComputedStyle(element);
                
                // Create a temporary span to measure text width with exact same styling
                const span = document.createElement('span');
                span.style.visibility = 'hidden';
                span.style.position = 'absolute';
                span.style.fontSize = computedStyle.fontSize;
                span.style.fontFamily = computedStyle.fontFamily;
                span.style.fontWeight = computedStyle.fontWeight;
                span.style.letterSpacing = computedStyle.letterSpacing;
                span.style.textTransform = computedStyle.textTransform;
                span.style.whiteSpace = 'nowrap';
                span.style.padding = computedStyle.padding;
                span.textContent = element.textContent;
                
                document.body.appendChild(span);
                const textWidth = span.offsetWidth;
                document.body.removeChild(span);
                
                // Get the container width including any padding
                const availableWidth = element.clientWidth;
                
                return textWidth > availableWidth;
            };

            actionDiv.addEventListener('mouseenter', (e) => {
                if (isTextTruncated(actionDiv)) {
                    tooltip.textContent = actionsForRally.join(' ');
                    tooltip.classList.add('show');
                    
                    // Position the tooltip
                    const rect = actionDiv.getBoundingClientRect();
                    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                }
            });
            
            actionDiv.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
            
            actionDiv.addEventListener('click', (e) => {
                if (isTextTruncated(actionDiv)) {
                    e.stopPropagation();
                    tooltip.textContent = actionsForRally.join(' ');
                    tooltip.classList.add('show');
                    
                    // Position the tooltip
                    const rect = actionDiv.getBoundingClientRect();
                    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                    
                    // Add click outside listener
                    const closeTooltip = (event) => {
                        if (!actionDiv.contains(event.target)) {
                            tooltip.classList.remove('show');
                            document.removeEventListener('click', closeTooltip);
                        }
                    };
                    
                    // Small delay to avoid immediate closure
                    setTimeout(() => {
                        document.addEventListener('click', closeTooltip);
                    }, 0);
                }
            });
        });
        
        // Only add the rally item if we have actions
        if (actionsForRally.length > 0) {
            historyContainer.appendChild(rallyItem);
        }
    });
    
    // Add the container to the history list
    historyListEl.appendChild(historyContainer);
    
    // Scroll to the bottom to show the most recent rally
    historyListEl.scrollTop = historyListEl.scrollHeight;
    updateCurrentPointDisplay();
}

// Helper function to get state display name
function getStateDisplayName(state) {
    const stateConfig = stateMachine[state];
    if (!stateConfig?.displayName) return state;
    
    const ST = appState.teams.a.isServing ? appState.teams.a.name : appState.teams.b.name;
    const RT = appState.teams.a.isServing ? appState.teams.b.name : appState.teams.a.name;
    
    return stateConfig.displayName
        .replace('{servingTeam}', ST)
        .replace('{receivingTeam}', RT);
}

function saveStateToLocalStorage() {
    // This is now just an alias for saveStateForUndo
    saveStateForUndo();
}

// Add this function to generate the legend modal content dynamically
function generateLegendContent() {
    const legendContainer = document.getElementById('legend-container');
    legendContainer.innerHTML = ''; // Clear any existing content
    
    // Create category containers for different action types
    const categories = {
        'serve': { title: 'Serve Actions', actions: {} },
        'reception': { title: 'Reception Actions', actions: {} },
        'attack': { title: 'Attack Actions', actions: {} },
        'zone': { title: 'Attack Zones', actions: {} },
        'trajectory': { title: 'Attack Trajectories', actions: {} }
    };
    
    // Scan all transitions in the state machine and collect unique actions with their help text
    for (const stateName in stateMachine) {
        if (stateName.startsWith('__')) continue; // Skip metadata
        
        const state = stateMachine[stateName];
        if (!state.transitions) continue;
        
        state.transitions.forEach(transition => {
            if (!transition.help) return; // Skip actions without help text
            
            const action = transition.action;
            const help = transition.help;
            
            // Categorize actions based on patterns
            if (stateName === 'Serve') {
                categories.serve.actions[action] = help;
            } else if (action.startsWith('R') && (action.includes('+') || action.includes('-') || action.includes('='))) {
                categories.reception.actions[action] = help;
            } else if (action.match(/^(V|X|I)\d$/)) {
                categories.zone.actions[action] = help;
            } else if (action.match(/^(Diag|DiagL|DiagS|Line|LineS|Cut)$/)) {
                categories.trajectory.actions[action] = help;
            } else if (action.match(/^(Atk|Win|Err|Blk|Def)/)) {
                categories.attack.actions[action] = help;
            }
        });
    }
    
    // Create the HTML sections for each category
    for (const categoryKey in categories) {
        const category = categories[categoryKey];
        const actionEntries = Object.entries(category.actions);
        
        if (actionEntries.length === 0) continue; // Skip empty categories
        
        // Create section for this category
        const sectionEl = document.createElement('div');
        sectionEl.className = 'legend-section';
        
        // Add section title
        const titleEl = document.createElement('h4');
        titleEl.textContent = category.title;
        sectionEl.appendChild(titleEl);
        
        // Sort actions to ensure consistent display
        actionEntries.sort((a, b) => a[0].localeCompare(b[0]));
        
        // Add action descriptions
        for (const [action, help] of actionEntries) {
            const paraEl = document.createElement('p');
            paraEl.innerHTML = `<strong>${action}</strong> - ${help}`;
            sectionEl.appendChild(paraEl);
        }
        
        // Add the section to the container
        legendContainer.appendChild(sectionEl);
    }
}

function showLegendModal() {
    // Generate content before showing
    generateLegendContent();
    
    // Show the modal
    legendModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
}

function hideLegendModal() {
    legendModal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

function generateBeginnerModeStatistics() {
    // Initialize statistics object
    const stats = {
        teamA: {
            name: appState.teams.a.name,
            pointsWon: 0,
            aces: 0,
            serviceErrors: 0,
            attackPoints: 0,
            blocks: 0,
            receptionErrors: 0,
            attackErrors: 0,
            defenses: 0,
            totalAttacks: 0,
            attackEfficiency: 0,
            players: [
                {
                    name: appState.teams.a.players[0],
                    attacks: 0,
                    attackPoints: 0,
                    attackErrors: 0,
                    blocks: 0,
                    receptionErrors: 0,
                    defenses: 0
                },
                {
                    name: appState.teams.a.players[1],
                    attacks: 0,
                    attackPoints: 0,
                    attackErrors: 0,
                    blocks: 0,
                    receptionErrors: 0,
                    defenses: 0
                }
            ]
        },
        teamB: {
            name: appState.teams.b.name,
            pointsWon: 0,
            aces: 0,
            serviceErrors: 0,
            attackPoints: 0,
            blocks: 0,
            receptionErrors: 0,
            attackErrors: 0,
            defenses: 0,
            totalAttacks: 0,
            attackEfficiency: 0,
            players: [
                {
                    name: appState.teams.b.players[0],
                    attacks: 0,
                    attackPoints: 0,
                    attackErrors: 0,
                    blocks: 0,
                    receptionErrors: 0,
                    defenses: 0
                },
                {
                    name: appState.teams.b.players[1],
                    attacks: 0,
                    attackPoints: 0,
                    attackErrors: 0,
                    blocks: 0,
                    receptionErrors: 0,
                    defenses: 0
                }
            ]
        },
        totalRallies: Object.keys(appState.rallyHistory).length,
        longestRallyActions: 0,
        longestRallySequence: ''
    };

    // Use statistics table functions to calculate team-level statistics
    stateMachine.__statisticsTable__.forEach(stat => {
        if (stat.key in stats.teamA) {
            stats.teamA[stat.key] = stat.calculate('a', appState.rallyHistory);
            stats.teamB[stat.key] = stat.calculate('b', appState.rallyHistory);
        }
    });

    // Calculate total attacks using the calculateTotalAttacks function
    stats.teamA.totalAttacks = calculateTotalAttacks('a', appState.rallyHistory);
    stats.teamB.totalAttacks = calculateTotalAttacks('b', appState.rallyHistory);

    // Process each rally in the history for player-specific stats and longest rally
    Object.values(appState.rallyHistory).forEach(rally => {
        // Track longest rally
        if (rally.actions.length > stats.longestRallyActions) {
            stats.longestRallyActions = rally.actions.length;
            stats.longestRallySequence = rally.actions.join(' ');
        }
        
        // Initial conditions for tracking player-specific stats
        let isTeamATurn = !rally.actions[0].startsWith('R'); // If first action is reception, team B starts
        
        // Process each action in the rally for player-specific statistics
        rally.actions.forEach(action => {
            const currentTeamKey = isTeamATurn ? 'teamA' : 'teamB';
            const playerNum = action.match(/\d$/)?.[0]; // Get player number if present
            
            // Process player stats by action type
            if (action.match(/^Win\d$/)) {
                if (playerNum) {
                    stats[currentTeamKey].players[playerNum-1].attackPoints++;
                    stats[currentTeamKey].players[playerNum-1].attacks++;
                }
                isTeamATurn = !isTeamATurn;
            } else if (action.match(/^Err\d$/)) {
                if (playerNum) {
                    stats[currentTeamKey].players[playerNum-1].attackErrors++;
                    stats[currentTeamKey].players[playerNum-1].attacks++;
                }
                isTeamATurn = !isTeamATurn;
            } else if (action.match(/^Blk\d$/)) {
                if (playerNum) {
                    stats[currentTeamKey].players[playerNum-1].blocks++;
                }
            } else if (action.match(/^RE\d$/)) {
                if (playerNum) {
                    stats[currentTeamKey].players[playerNum-1].receptionErrors++;
                }
            } else if (action.match(/^Def\d$/)) {
                if (playerNum) {
                    stats[currentTeamKey].players[playerNum-1].defenses++;
                }
            }
        });
    });
    
    // Calculate attack efficiency for each player
    ['teamA', 'teamB'].forEach(teamKey => {
        team = stats[teamKey];
        team.players.forEach(player => {
            if (player.attacks > 0) {
                player.attackEfficiency = Math.round(
                    ((player.attackPoints - player.attackErrors) / player.attacks) * 100
                );
            } else {
                player.attackEfficiency = 0;
            }
        });
    });
    
    return stats;
}

function showStatisticsModal() {
    // Use the appropriate statistics function based on game mode
    const gameMode = stateMachine === beginnerStateMachine ? 'beginner' : 'advanced';
    
    if (gameMode === 'beginner') {
        showBeginnerStatisticsModal();
    } else {
        showAdvancedStatisticsModal();
    }
}

function showBeginnerStatisticsModal() {
    const stats = generateBeginnerModeStatistics();
    const modalContent = statisticsModal.querySelector('.modal-content');
    
    // Create the HTML content for the statistics
    const html = `
        <h3>Match Statistics</h3>
        <div class="stats-container">
            <div class="stats-header">
                <div class="stats-team">${stats.teamA.name}</div>
                <div class="stats-metric">Stat</div>
                <div class="stats-team">${stats.teamB.name}</div>
            </div>
            
            <div class="stats-section">
                <h4>Team Stats</h4>
                ${stateMachine.__statisticsTable__.map(stat => `
                    <div class="stats-row">
                        <div class="stats-value">${stats.teamA[stat.key]}${stat.key === 'pointsWon' &&stats.teamA.pointsPercentage ? ` (${stats.teamA.pointsPercentage}%)` : stat.key === 'attackEfficiency' ? '%' : ''}</div>
                        <div class="stats-label">${stat.label}</div>
                        <div class="stats-value">${stats.teamB[stat.key]}${stat.key === 'pointsWon' && stats.teamB.pointsPercentage ? ` (${stats.teamB.pointsPercentage}%)` : stat.key === 'attackEfficiency' ? '%' : ''}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h4>Player Stats - ${stats.teamA.name}</h4>
                <div class="stats-row">
                    <div class="stats-value">${stats.teamA.players[0].name}</div>
                    <div class="stats-label">Player</div>
                    <div class="stats-value">${stats.teamA.players[1].name}</div>
                </div>
                ${stateMachine.__statisticsTable__.filter(stat => stat.showInPlayerStats).map(stat => `
                    <div class="stats-row">
                        <div class="stats-value">${stats.teamA.players[0][stat.key] || 0}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                        <div class="stats-label">${stat.label}</div>
                        <div class="stats-value">${stats.teamA.players[1][stat.key] || 0}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h4>Player Stats - ${stats.teamB.name}</h4>
                <div class="stats-row">
                    <div class="stats-value">${stats.teamB.players[0].name}</div>
                    <div class="stats-label">Player</div>
                    <div class="stats-value">${stats.teamB.players[1].name}</div>
                </div>
                ${stateMachine.__statisticsTable__.filter(stat => stat.showInPlayerStats).map(stat => `
                    <div class="stats-row">
                        <div class="stats-value">${stats.teamB.players[0][stat.key] || 0}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                        <div class="stats-label">${stat.label}</div>
                        <div class="stats-value">${stats.teamB.players[1][stat.key] || 0}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h4>Match Info</h4>
                <div class="stats-row">
                    <div class="stats-value">${stats.totalRallies}</div>
                    <div class="stats-label">Total Rallies</div>
                    <div class="stats-value"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stats-value">${stats.longestRallyActions}</div>
                    <div class="stats-label">Longest Rally Actions</div>
                    <div class="stats-value"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stats-value stats-sequence">${stats.longestRallySequence}</div>
                    <div class="stats-label">Longest Rally Sequence</div>
                    <div class="stats-value"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stats-value">Set ${appState.currentSet + 1}</div>
                    <div class="stats-label">Current Set</div>
                    <div class="stats-value"></div>
                </div>
            </div>
            
            <div class="stats-section">
                <h4>Set Scores</h4>
                <div class="stats-row">
                    <div class="stats-value ${appState.teams.a.setScores[0] > appState.teams.b.setScores[0] ? 'winning-score' : ''}">${appState.teams.a.setScores[0]}</div>
                    <div class="stats-label">Set 1</div>
                    <div class="stats-value ${appState.teams.b.setScores[0] > appState.teams.a.setScores[0] ? 'winning-score' : ''}">${appState.teams.b.setScores[0]}</div>
                </div>
                <div class="stats-row">
                    <div class="stats-value ${appState.teams.a.setScores[1] > appState.teams.b.setScores[1] ? 'winning-score' : ''}">${appState.teams.a.setScores[1]}</div>
                    <div class="stats-label">Set 2</div>
                    <div class="stats-value ${appState.teams.b.setScores[1] > appState.teams.a.setScores[1] ? 'winning-score' : ''}">${appState.teams.b.setScores[1]}</div>
                </div>
                <div class="stats-row">
                    <div class="stats-value ${appState.teams.a.setScores[2] > appState.teams.b.setScores[2] ? 'winning-score' : ''}">${appState.teams.a.setScores[2]}</div>
                    <div class="stats-label">Set 3</div>
                    <div class="stats-value ${appState.teams.b.setScores[2] > appState.teams.a.setScores[2] ? 'winning-score' : ''}">${appState.teams.b.setScores[2]}</div>
                </div>
            </div>
        </div>
        <button class="close-modal">×</button>
    `;
    
    modalContent.innerHTML = html;
    modalContent.querySelector('.close-modal').addEventListener('click', hideStatisticsModal);
    
    statisticsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function showAdvancedStatisticsModal() {
    const stats = calculateMatchStatistics();
    const modalContent = statisticsModal.querySelector('.modal-content');
    
    // Create the HTML content for the statistics
    const html = `
        <h3>Match Statistics</h3>
        <div class="stats-container">
            <div class="stats-header">
                <div class="stats-team">${stats.teamA.name}</div>
                <div class="stats-metric">Stat</div>
                <div class="stats-team">${stats.teamB.name}</div>
            </div>
            
            <div class="stats-section">
                <h4>Team Stats</h4>
                ${stateMachine.__statisticsTable__.map(stat => `
                    <div class="stats-row">
                        <div class="stats-value">${stats.teamA[stat.key]}${stat.key === 'pointsWon' &&stats.teamA.pointsPercentage ? ` (${stats.teamA.pointsPercentage}%)` : stat.key === 'attackEfficiency' ? '%' : ''}</div>
                        <div class="stats-label">${stat.label}</div>
                        <div class="stats-value">${stats.teamB[stat.key]}${stat.key === 'pointsWon' && stats.teamB.pointsPercentage ? ` (${stats.teamB.pointsPercentage}%)` : stat.key === 'attackEfficiency' ? '%' : ''}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h4>Player Stats - ${stats.teamA.name}</h4>
                <div class="stats-row">
                    <div class="stats-value">${stats.teamA.player1.name}</div>
                    <div class="stats-label">Player</div>
                    <div class="stats-value">${stats.teamA.player2.name}</div>
                </div>
                ${stateMachine.__statisticsTable__.filter(stat => stat.showInPlayerStats).map(stat => `
                    <div class="stats-row">
                        <div class="stats-value">${stats.teamA.player1[stat.key]}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                        <div class="stats-label">${stat.label}</div>
                        <div class="stats-value">${stats.teamA.player2[stat.key]}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h4>Player Stats - ${stats.teamB.name}</h4>
                <div class="stats-row">
                    <div class="stats-value">${stats.teamB.player1.name}</div>
                    <div class="stats-label">Player</div>
                    <div class="stats-value">${stats.teamB.player2.name}</div>
                </div>
                ${stateMachine.__statisticsTable__.filter(stat => stat.showInPlayerStats).map(stat => `
                    <div class="stats-row">
                        <div class="stats-value">${stats.teamB.player1[stat.key]}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                        <div class="stats-label">${stat.label}</div>
                        <div class="stats-value">${stats.teamB.player2[stat.key]}${stat.key === 'attackEfficiency' ? '%' : ''}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h4>Match Info</h4>
                <div class="stats-row">
                    <div class="stats-value">${stats.totalRallies}</div>
                    <div class="stats-label">Total Rallies</div>
                    <div class="stats-value"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stats-value">${stats.longestRally.actions}</div>
                    <div class="stats-label">Longest Rally Actions</div>
                    <div class="stats-value"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stats-value stats-sequence">${stats.longestRally.sequence}</div>
                    <div class="stats-label">Longest Rally Sequence</div>
                    <div class="stats-value"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stats-value">Set ${stats.currentSet + 1}</div>
                    <div class="stats-label">Current Set</div>
                    <div class="stats-value"></div>
                </div>
            </div>
            
            <div class="stats-section">
                <h4>Set Scores</h4>
                ${stats.setScores.map(set => `
                    <div class="stats-row">
                        <div class="stats-value ${set.winner === 'a' ? 'winning-score' : ''}">${set.scoreA}</div>
                        <div class="stats-label">Set ${set.set}</div>
                        <div class="stats-value ${set.winner === 'b' ? 'winning-score' : ''}">${set.scoreB}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <button class="close-modal">×</button>
    `;
    
    modalContent.innerHTML = html;
    modalContent.querySelector('.close-modal').addEventListener('click', hideStatisticsModal);
    
    statisticsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Add this function near the other modal functions
function showSet3ServerModal() {
    set3ServerModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Set the team names in the dialog
    set3TeamAName.textContent = appState.teams.a.name;
    set3TeamBName.textContent = appState.teams.b.name;
}

function hideSet3ServerModal() {
    set3ServerModal.classList.add('hidden');
    document.body.style.overflow = '';
}

function updateCurrentPointDisplay() {
    const currentPointEl = document.getElementById('current-point');
    const currentRallyActions = appState.rallyActions.join(' ');
    
    // If we have actions in the current rally, display them
    if (currentRallyActions) {
        currentPointEl.textContent = currentRallyActions;
    } else if (appState.history.length > 0) {
        // If the rally just ended, get the complete history for that rally
        const rallyNumber = appState.history[appState.history.length - 1].rally;
        
        // Check if we have the rally in the rally history
        if (appState.rallyHistory[rallyNumber]) {
            const completeRallyActions = appState.rallyHistory[rallyNumber].actions.join(' ');
            currentPointEl.textContent = completeRallyActions;
        } else {
            // Fallback to the last action if we can't find the complete history
            const lastRally = appState.history[appState.history.length - 1];
            currentPointEl.textContent = lastRally.action;
        }
    }
}

// Calculate match statistics based on rally history
function calculateMatchStatistics() {
    const stats = {
        teamA: {
            name: appState.teams.a.name,
            player1: { 
                name: appState.teams.a.players[0],
                pointsWon: 0,
                aces: 0,
                serviceErrors: 0,
                attackPoints: 0,
                attackErrors: 0,
                totalAttacks: 0,
                blocks: 0,
                receptionErrors: 0,
                defenses: 0
            },
            player2: { 
                name: appState.teams.a.players[1],
                pointsWon: 0,
                aces: 0,
                serviceErrors: 0,
                attackPoints: 0,
                attackErrors: 0,
                totalAttacks: 0,
                blocks: 0,
                receptionErrors: 0,
                defenses: 0
            }
        },
        teamB: {
            name: appState.teams.b.name,
            player1: { 
                name: appState.teams.b.players[0],
                pointsWon: 0,
                aces: 0,
                serviceErrors: 0,
                attackPoints: 0,
                attackErrors: 0,
                totalAttacks: 0,
                blocks: 0,
                receptionErrors: 0,
                defenses: 0
            },
            player2: { 
                name: appState.teams.b.players[1],
                pointsWon: 0,
                aces: 0,
                serviceErrors: 0,
                attackPoints: 0,
                attackErrors: 0,
                totalAttacks: 0,
                blocks: 0,
                receptionErrors: 0,
                defenses: 0
            }
        },
        totalRallies: Object.keys(appState.rallyHistory).length,
        longestRally: {
            actions: 0,
            sequence: ''
        },
        setScores: []
    };

    // Calculate team stats first
    stateMachine.__statisticsTable__.forEach(stat => {
        stats.teamA[stat.key] = stat.calculate('a', appState.rallyHistory);
        stats.teamB[stat.key] = stat.calculate('b', appState.rallyHistory);
    });

    // Process rally history for player-specific stats
    Object.values(appState.rallyHistory).forEach(rally => {
        const scoringTeam = rally.scoringTeam;
        const teamKey = scoringTeam === 'a' ? 'teamA' : 'teamB';
        const opponentKey = scoringTeam === 'a' ? 'teamB' : 'teamA';

        // Track which team's turn it is to attack, starting with the receiving team
        let isReceivingTeam = rally.actions[0].startsWith('R');
        let isTeamATurn = isReceivingTeam ? false : true; // First attack is by receiving team

        rally.actions.forEach((action, index) => {
            if (action.startsWith('Atk')) {
                const playerNum = parseInt(action.charAt(action.length - 1));
                if (playerNum === 1 || playerNum === 2) {
                    // Add to total attacks for the correct team and player based on turn
                    const currentTeam = isTeamATurn ? 'teamA' : 'teamB';
                    stats[currentTeam]['player' + playerNum].totalAttacks++;
                }
                isTeamATurn = !isTeamATurn; // Switch turns after each attack
            }

            // Points won attribution
            if (index === rally.actions.length - 1) {
                const playerNum = getPlayerNumberFromLastAction(action);
                if (playerNum) {
                    stats[teamKey]['player' + playerNum].pointsWon++;
                }
            }

            // Handle specific actions
            if (action === 'Ace') {
                // Find the last serving player
                const lastServingPlayer = findLastServingPlayer(rally.actions);
                if (lastServingPlayer) {
                    stats[teamKey]['player' + lastServingPlayer].aces++;
                }
            } else if (action === 'SErr') {
                const lastServingPlayer = findLastServingPlayer(rally.actions);
                if (lastServingPlayer) {
                    stats[opponentKey]['player' + lastServingPlayer].serviceErrors++;
                }
            } else if (action.startsWith('RE')) {
                const playerNum = parseInt(action.charAt(action.length - 1));
                if (playerNum === 1 || playerNum === 2) {
                    stats[opponentKey]['player' + playerNum].receptionErrors++;
                }
            } else if (action.startsWith('Blk')) {
                const playerNum = parseInt(action.charAt(action.length - 1));
                if (playerNum === 1 || playerNum === 2) {
                    stats[teamKey]['player' + playerNum].blocks++;
                }
            } else if (action === 'Win') {
                const attackingPlayer = findLastAttackingPlayer(rally.actions);
                if (attackingPlayer) {
                    stats[teamKey]['player' + attackingPlayer].attackPoints++;
                }
            } else if (action === 'Err') {
                const attackingPlayer = findLastAttackingPlayer(rally.actions);
                if (attackingPlayer) {
                    // Attribution of error to the losing team (non-scoring team)
                    stats[opponentKey]['player' + attackingPlayer].attackErrors++;
                }
            } else if (action.startsWith('Def')) {
                const playerNum = parseInt(action.charAt(action.length - 1));
                if (playerNum === 1 || playerNum === 2) {
                    stats[teamKey]['player' + playerNum].defenses++;
                }
            }
        });
    });

    // Calculate percentages and efficiencies
    const totalPoints = stats.teamA.pointsWon + stats.teamB.pointsWon;
    
    // Team percentages
    stats.teamA.pointsPercentage = totalPoints > 0 ? Math.round((stats.teamA.pointsWon / totalPoints) * 100) : 'NaN';
    stats.teamB.pointsPercentage = totalPoints > 0 ? Math.round((stats.teamB.pointsWon / totalPoints) * 100) : 'NaN';
    
    // Player attack efficiencies
    ['player1', 'player2'].forEach(playerKey => {
        // Team A players
        const points = stats.teamA[playerKey].attackPoints || 0;
        const errors = stats.teamA[playerKey].attackErrors || 0;
        const totalAttacks = stats.teamA[playerKey].totalAttacks || 0;
        stats.teamA[playerKey].attackEfficiency = totalAttacks > 0 ? 
            Math.round(((points - errors) / totalAttacks) * 100) : 'NaN';
        
        // Team B players
        const pointsB = stats.teamB[playerKey].attackPoints || 0;
        const errorsB = stats.teamB[playerKey].attackErrors || 0;
        const totalAttacksB = stats.teamB[playerKey].totalAttacks || 0;
        stats.teamB[playerKey].attackEfficiency = totalAttacksB > 0 ? 
            Math.round(((pointsB - errors) / totalAttacksB) * 100) : 'NaN';
    });

    // Populate set scores
    for (let i = 0; i <= appState.currentSet; i++) {
        const scoreA = i < appState.currentSet ? appState.teams.a.setScores[i] : appState.teams.a.currentScore;
        const scoreB = i < appState.currentSet ? appState.teams.b.setScores[i] : appState.teams.b.currentScore;
        stats.setScores.push({
            set: i + 1,
            scoreA: scoreA,
            scoreB: scoreB,
            winner: scoreA > scoreB ? 'a' : scoreB > scoreA ? 'b' : null
        });
    }

    return stats;
}

// Helper function to find the last serving player from rally actions
function findLastServingPlayer(actions) {
    for (let i = actions.length - 1; i >= 0; i--) {
        if (actions[i].match(/^(Ace|SErr|R[\+\-=]\d)/)) {
            // If we find a serve-related action, get the player number from the reception
            const receptionMatch = actions[i].match(/R[\+\-=](\d)/);
            if (receptionMatch) {
                return receptionMatch[1];
            }
            // For Ace or SErr, it would be the opposite of the receiving player
            return '1'; // Default to player 1 if we can't determine
        }
    }
    return null;
}

// Helper function to find the last attacking player from rally actions
function findLastAttackingPlayer(actions) {
    for (let i = actions.length - 1; i >= 0; i--) {
        if (actions[i].startsWith('Atk')) {
            return actions[i].charAt(actions[i].length - 1);
        }
    }
    return null;
}

// Helper function to get player number from the final action of a rally
function getPlayerNumberFromLastAction(action) {
    if (action.match(/^(Win|Err|Blk|RE|Def)\d$/)) {
        return action.charAt(action.length - 1);
    }
    return null;
}

function hideStatisticsModal() {
    statisticsModal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

// Function to show All Stats modal with categorized transition statistics
function showAllStatsModal() {
    const allStatsContainer = document.getElementById('all-stats-container');
    
    // Dynamically collect all unique categories from the state machine transitions
    const categories = getAllCategories();
    
    // Create HTML for All Stats based on category
    let html = `
        <div class="stats-header">
            <div class="stats-team">${appState.teams.a.name}</div>
            <div class="stats-metric">Action</div>
            <div class="stats-team">${appState.teams.b.name}</div>
        </div>
    `;
    
    // Generate detailed stats for team and player level
    const teamStats = generateCategoryStats();
    
    // Create a section for each category
    Object.keys(categories).forEach(categoryKey => {
        const categoryName = getCategoryDisplayName(categoryKey);
        const categoryTeamStats = teamStats.team[categoryKey] || {};
        const categoryPlayerAStats = teamStats.playerA[categoryKey] || {};
        const categoryPlayerBStats = teamStats.playerB[categoryKey] || {};
        
        // Only display categories that have stats
        if (Object.keys(categoryTeamStats).length > 0) {
            // Team level stats section
            html += `
                <div class="stats-section">
                    <h4>${categoryName} Stats - Team</h4>
                    ${generateStatsRows(categoryTeamStats, categoryKey)}
                </div>
            `;
            
            // Player level stats for Team A
            html += `
                <div class="stats-section">
                    <h4>${categoryName} Stats - ${appState.teams.a.name}</h4>
                    <div class="stats-row">
                        <div class="stats-value">${appState.teams.a.players[0]}</div>
                        <div class="stats-label">Player</div>
                        <div class="stats-value">${appState.teams.a.players[1]}</div>
                    </div>
                    ${generatePlayerStatsRows(categoryPlayerAStats, categoryKey)}
                </div>
            `;
            
            // Player level stats for Team B
            html += `
                <div class="stats-section">
                    <h4>${categoryName} Stats - ${appState.teams.b.name}</h4>
                    <div class="stats-row">
                        <div class="stats-value">${appState.teams.b.players[0]}</div>
                        <div class="stats-label">Player</div>
                        <div class="stats-value">${appState.teams.b.players[1]}</div>
                    </div>
                    ${generatePlayerStatsRows(categoryPlayerBStats, categoryKey)}
                </div>
            `;
        }
    });
    
    // Set the HTML content
    allStatsContainer.innerHTML = html;
    
    // Show the modal
    allStatsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Helper function to generate stats rows for team level
function generateStatsRows(categoryStats, categoryKey) {
    if (Object.keys(categoryStats).length === 0) {
        return '<div class="stats-row"><div class="stats-value">-</div><div class="stats-label">No data</div><div class="stats-value">-</div></div>';
    }
    
    let html = '';
    let total = { a: 0, b: 0 };
    
    // First calculate totals for each team within this category
    Object.keys(categoryStats).forEach(action => {
        const countA = categoryStats[action].a || 0;
        const countB = categoryStats[action].b || 0;
        total.a += countA;
        total.b += countB;
    });
    
    // Add rows for each action in the category with percentages based on team totals
    Object.keys(categoryStats).forEach(action => {
        const countA = categoryStats[action].a || 0;
        const countB = categoryStats[action].b || 0;
        
        // Calculate percentages relative to each team's category total (not combined)
        const percentA = total.a > 0 ? Math.round((countA / total.a) * 100) : 0;
        const percentB = total.b > 0 ? Math.round((countB / total.b) * 100) : 0;
        
        // Get the help text for this action from the state machine
        let helpText = action;
        for (const state in stateMachine) {
            if (state.startsWith('__')) continue;
            const transitions = stateMachine[state].transitions || [];
            const transition = transitions.find(t => t.action === action);
            if (transition?.help) {
                helpText = transition.help;
                break;
            }
        }
        
        html += `
            <div class="stats-row">
                <div class="stats-value">${countA} <span class="stats-percent">(${percentA}%)</span></div>
                <div class="stats-label" title="${helpText}">${action}</div>
                <div class="stats-value">${countB} <span class="stats-percent">(${percentB}%)</span></div>
            </div>
        `;
    });
    
    // The total row will always show 100% for each team (or 0% if no actions)
    const totalPercentA = total.a > 0 ? 100 : 0;
    const totalPercentB = total.b > 0 ? 100 : 0;
    
    // Add a total row with percentages
    html += `
        <div class="stats-row total-row">
            <div class="stats-value">${total.a} <span class="stats-percent">(${totalPercentA}%)</span></div>
            <div class="stats-label">Total ${getCategoryDisplayName(categoryKey)}</div>
            <div class="stats-value">${total.b} <span class="stats-percent">(${totalPercentB}%)</span></div>
        </div>
    `;
    
    return html;
}

// Helper function to generate stats rows for player level
function generatePlayerStatsRows(categoryPlayerStats, categoryKey) {
    if (Object.keys(categoryPlayerStats).length === 0) {
        return '<div class="stats-row"><div class="stats-value">-</div><div class="stats-label">No data</div><div class="stats-value">-</div></div>';
    }
    
    let html = '';
    let totalPlayer1 = 0;
    let totalPlayer2 = 0;
    
    // First calculate total for each player within this category
    Object.keys(categoryPlayerStats).forEach(action => {
        const player1Count = categoryPlayerStats[action][1] || 0;
        const player2Count = categoryPlayerStats[action][2] || 0;
        totalPlayer1 += player1Count;
        totalPlayer2 += player2Count;
    });
    
    // Add rows for each action in the category with percentages based on player totals
    Object.keys(categoryPlayerStats).forEach(action => {
        const player1Count = categoryPlayerStats[action][1] || 0;
        const player2Count = categoryPlayerStats[action][2] || 0;
        
        // Calculate percentages relative to each player's category total (not combined)
        const percentP1 = totalPlayer1 > 0 ? Math.round((player1Count / totalPlayer1) * 100) : 0;
        const percentP2 = totalPlayer2 > 0 ? Math.round((player2Count / totalPlayer2) * 100) : 0;
        
        // Get the help text for this action from the state machine
        let helpText = action;
        for (const state in stateMachine) {
            if (state.startsWith('__')) continue;
            const transitions = stateMachine[state].transitions || [];
            const transition = transitions.find(t => t.action === action);
            if (transition?.help) {
                helpText = transition.help;
                break;
            }
        }
        
        html += `
            <div class="stats-row">
                <div class="stats-value">${player1Count} <span class="stats-percent">(${percentP1}%)</span></div>
                <div class="stats-label" title="${helpText}">${action}</div>
                <div class="stats-value">${player2Count} <span class="stats-percent">(${percentP2}%)</span></div>
            </div>
        `;
    });
    
    // The total row will always show 100% for each player (or 0% if no actions)
    const totalPercentP1 = totalPlayer1 > 0 ? 100 : 0;
    const totalPercentP2 = totalPlayer2 > 0 ? 100 : 0;
    
    // Add a total row with percentages
    html += `
        <div class="stats-row total-row">
            <div class="stats-value">${totalPlayer1} <span class="stats-percent">(${totalPercentP1}%)</span></div>
            <div class="stats-label">Total ${getCategoryDisplayName(categoryKey)}</div>
            <div class="stats-value">${totalPlayer2} <span class="stats-percent">(${totalPercentP2}%)</span></div>
        </div>
    `;
    
    return html;
}

// Generate category stats from rally history
function generateCategoryStats() {
    // Initialize stats structure
    const stats = {
        team: {},
        playerA: {},
        playerB: {}
    };
    
    // Dynamically get categories
    const categories = getAllCategories();
    
    // Initialize categories
    Object.keys(categories).forEach(category => {
        stats.team[category] = {};
        stats.playerA[category] = {};
        stats.playerB[category] = {};
    });
    
    // Process all rallies
    Object.values(appState.rallyHistory).forEach(rally => {
        const actions = rally.actions;
        
        // For team stats, we need to know which team performed each action
        let isTeamATurn = true; // Assuming team A serves first in the rally
        
        actions.forEach(action => {
            // Find the transition for this action to get its category
            let category = null;
            for (const state in stateMachine) {
                if (state.startsWith('__')) continue; // Skip metadata
                const transitions = stateMachine[state].transitions || [];
                const transition = transitions.find(t => t.action === action);
                if (transition?.category) {
                    category = transition.category;
                    break;
                }
            }
            
            if (category) {
                // Team stats
                if (!stats.team[category][action]) {
                    stats.team[category][action] = { a: 0, b: 0 };
                }
                stats.team[category][action][isTeamATurn ? 'a' : 'b']++;
                
                // Player stats - extract player number from action if available
                const playerMatch = action.match(/(\d)$/);
                if (playerMatch) {
                    const playerNum = parseInt(playerMatch[1]);
                    if (playerNum === 1 || playerNum === 2) {
                        const teamStats = isTeamATurn ? stats.playerA : stats.playerB;
                        if (!teamStats[category][action]) {
                            teamStats[category][action] = { 1: 0, 2: 0 };
                        }
                        teamStats[category][action][playerNum]++;
                    }
                } else {
                    // For actions without player numbers, attribute to both players
                    const teamStats = isTeamATurn ? stats.playerA : stats.playerB;
                    if (!teamStats[category][action]) {
                        teamStats[category][action] = { 1: 0, 2: 0 };
                    }
                    teamStats[category][action][1]++;
                    teamStats[category][action][2]++;
                }
                
                // Switch turns for certain actions
                if (action.startsWith('Atk') || action === 'Win' || action === 'Err') {
                    isTeamATurn = !isTeamATurn;
                }
            }
        });
    });
    
    return stats;
}

function hideAllStatsModal() {
    allStatsModal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

// Function to gather all unique categories from state machine transitions
function getAllCategories() {
    const categories = {};
    
    // Iterate through all states and their transitions
    for (const stateName in stateMachine) {
        if (stateName.startsWith('__')) continue; // Skip metadata
        
        const state = stateMachine[stateName];
        if (!state.transitions) continue;
        
        // Collect all unique categories from transitions
        state.transitions.forEach(transition => {
            if (transition.category) {
                categories[transition.category] = true;
            }
        });
    }
    
    return categories;
}

// Function to get a display name for a category
function getCategoryDisplayName(categoryKey) {
    // Convert category key to title case
    return categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
}