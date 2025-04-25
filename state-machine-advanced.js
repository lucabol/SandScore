// State Machine Definition - Advanced Mode
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
            { "action": "Ace", "nextState": "Point Server", "style": "point", "help": "Direct point from serve", "category": "serve", "statTeam": "Serving", "statPlayer": "0" },
            { "action": "SErr", "nextState": "Point Receiver", "style": "error", "help": "Service error", "category": "serve", "statTeam": "Serving", "statPlayer": "0" },
            { "action": "RE1", "nextState": "Point Server", "style": "error", "help": "Reception error by player 1", "category": "reception", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "RE2", "nextState": "Point Server", "style": "error", "help": "Reception error by player 2", "category": "reception", "statTeam": "Receiving", "statPlayer": "2" },
            { "action": "R-1", "nextState": "Reception", "style": "regular", "help": "Poor reception by player 1", "category": "reception", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "R-2", "nextState": "Reception", "style": "regular", "help": "Poor reception by player 2", "category": "reception", "statTeam": "Receiving", "statPlayer": "2" },
            { "action": "R=1", "nextState": "Reception", "style": "regular", "help": "Medium reception by player 1", "category": "reception", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "R=2", "nextState": "Reception", "style": "regular", "help": "Medium reception by player 2", "category": "reception", "statTeam": "Receiving", "statPlayer": "2" },
            { "action": "R+1", "nextState": "Reception", "style": "regular", "help": "Good reception by player 1", "category": "reception", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "R+2", "nextState": "Reception", "style": "regular", "help": "Good reception by player 2", "category": "reception", "statTeam": "Receiving", "statPlayer": "2" }
        ]
    },
    "Reception": {
        "displayName": "{receivingTeam} Received",
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Rec", "style": "regular", "help": "Attack by player 1", "category": "set", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "Atk2", "nextState": "Zone of Attack Rec", "style": "regular", "help": "Attack by player 2", "category": "set", "statTeam": "Receiving", "statPlayer": "2" },
            { "action": "SetE1", "nextState": "Point Server", "style": "error", "help": "Set err by player 1", "category": "set", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "SetE2", "nextState": "Point Server", "style": "error", "help": "Set err by player 2", "category": "set", "statTeam": "Receiving", "statPlayer": "2" }
        ]
    },
    "Zone of Attack Rec": {
        "displayName": "Attack Zone for {receivingTeam}",
        "transitions": [
            { "action": "V1", "nextState": "Trajectory Rec", "help": "High ball position 1", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "V2", "nextState": "Trajectory Rec", "help": "High ball position 2", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "V3", "nextState": "Trajectory Rec", "help": "High ball position 3", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "V4", "nextState": "Trajectory Rec", "help": "High ball position 4", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "V5", "nextState": "Trajectory Rec", "help": "High ball position 5", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "X1", "nextState": "Trajectory Rec", "help": "Low ball position 1", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "X2", "nextState": "Trajectory Rec", "help": "Low ball position 2", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "X3", "nextState": "Trajectory Rec", "help": "Low ball position 3", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "X4", "nextState": "Trajectory Rec", "help": "Low ball position 4", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "X5", "nextState": "Trajectory Rec", "help": "Low ball position 5", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "I1", "nextState": "Trajectory Rec", "help": "Around setter position 1", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "I2", "nextState": "Trajectory Rec", "help": "Around setter position 2", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "I3", "nextState": "Trajectory Rec", "help": "Around setter position 3", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "I4", "nextState": "Trajectory Rec", "help": "Around setter position 4", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "I5", "nextState": "Trajectory Rec", "help": "Around setter position 5", "category": "atk Zone", "statTeam": "Receiving", "statPlayer": "-1" }
        ]
    },
    "Trajectory Rec": {
        "displayName": "Trajectory {receivingTeam}",
        "transitions": [
            { "action": "Diag", "nextState": "Attack by Receiving Team", "help": "Diagonal attack", "category": "atk Traj", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "DiagL", "nextState": "Attack by Receiving Team", "help": "Long diagonal attack", "category": "atk Traj", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "DiagS", "nextState": "Attack by Receiving Team", "help": "Short diagonal attack", "category": "atk Traj", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "Line", "nextState": "Attack by Receiving Team", "help": "Line attack", "category": "atk Traj", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "LineS", "nextState": "Attack by Receiving Team", "help": "Short line attack", "category": "atk Traj", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "Cut", "nextState": "Attack by Receiving Team", "help": "Cut shot", "category": "atk Traj", "statTeam": "Receiving", "statPlayer": "-1" }
        ]
    },
    "Attack by Receiving Team": {
        "displayName": "Attack by {receivingTeam}",
        "transitions": [
            { "action": "Win", "nextState": "Point Receiver", "style": "point", "help": "Winning attack", "category": "atk Result", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "Err", "nextState": "Point Server", "style": "error", "help": "Attack error", "category": "atk Result", "statTeam": "Receiving", "statPlayer": "-1" },
            { "action": "Blk1", "nextState": "Point Server", "style": "error", "help": "Blocked by player 1", "category": "atk Result", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "Blk2", "nextState": "Point Server", "style": "error", "help": "Blocked by player 2", "category": "atk Result", "statTeam": "Serving", "statPlayer": "2" },
            { "action": "Def1", "nextState": "Defense By Serving Team", "style": "regular", "help": "Defended by player 1", "category": "defense", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "Def2", "nextState": "Defense By Serving Team", "style": "regular", "help": "Defended by player 2", "category": "defense", "statTeam": "Serving", "statPlayer": "2" }
        ]
    },
    "Defense By Serving Team": {
        "displayName": "Defense by {servingTeam}",
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Srv", "help": "Attack by player 1", "category": "set", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "Atk2", "nextState": "Zone of Attack Srv", "help": "Attack by player 2", "category": "set", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "SetE1", "nextState": "Point Receiver", "style": "error", "help": "Set err by player 1", "category": "set", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "SetE2", "nextState": "Point Receiver", "style": "error", "help": "Set err by player 2", "category": "set", "statTeam": "Serving", "statPlayer": "2" },
        ]
    },
    "Zone of Attack Srv": {
        "displayName": "Attack Zone for {servingTeam}",
        "transitions": [
            { "action": "V1", "nextState": "Trajectory Srv", "help": "High ball position 1", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "V2", "nextState": "Trajectory Srv", "help": "High ball position 2", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "V3", "nextState": "Trajectory Srv", "help": "High ball position 3", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "V4", "nextState": "Trajectory Srv", "help": "High ball position 4", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "V5", "nextState": "Trajectory Srv", "help": "High ball position 5", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "X1", "nextState": "Trajectory Srv", "help": "Low ball position 1", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "X2", "nextState": "Trajectory Srv", "help": "Low ball position 2", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "X3", "nextState": "Trajectory Srv", "help": "Low ball position 3", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "X4", "nextState": "Trajectory Srv", "help": "Low ball position 4", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "X5", "nextState": "Trajectory Srv", "help": "Low ball position 5", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "I1", "nextState": "Trajectory Srv", "help": "Around setter position 1", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "I2", "nextState": "Trajectory Srv", "help": "Around setter position 2", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "I3", "nextState": "Trajectory Srv", "help": "Around setter position 3", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "I4", "nextState": "Trajectory Srv", "help": "Around setter position 4", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "I5", "nextState": "Trajectory Srv", "help": "Around setter position 5", "category": "atk Zone", "statTeam": "Serving", "statPlayer": "-1" }
        ]
    },
    "Trajectory Srv": {
        "displayName": "Trajectory {servingTeam}",
        "transitions": [
            { "action": "Diag", "nextState": "Attack by Serving Team", "help": "Diagonal attack", "category": "atk Traj", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "DiagL", "nextState": "Attack by Serving Team", "help": "Long diagonal attack", "category": "atk Traj", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "DiagS", "nextState": "Attack by Serving Team", "help": "Short diagonal attack", "category": "atk Traj", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "Line", "nextState": "Attack by Serving Team", "help": "Line attack", "category": "atk Traj", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "LineS", "nextState": "Attack by Serving Team", "help": "Short line attack", "category": "atk Traj", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "Cut", "nextState": "Attack by Serving Team", "help": "Cut shot", "category": "atk Traj", "statTeam": "Serving", "statPlayer": "-1" }
        ]
    },
    "Attack by Serving Team": {
        "displayName": "Attack by {servingTeam}",
        "transitions": [
            { "action": "Win", "nextState": "Point Server", "style": "point", "help": "Winning attack", "category": "atk Result", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "Err", "nextState": "Point Receiver", "style": "error", "help": "Attack error", "category": "atk Result", "statTeam": "Serving", "statPlayer": "-1" },
            { "action": "Blk1", "nextState": "Point Receiver", "style": "error", "help": "Blocked by player 1", "category": "atk Result", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "Blk2", "nextState": "Point Receiver", "style": "error", "help": "Blocked by player 2", "category": "atk Result", "statTeam": "Receiving", "statPlayer": "2" },
            { "action": "Def1", "nextState": "Defense By Receiving Team", "style": "regular", "help": "Defended by player 1", "category": "defense", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "Def2", "nextState": "Defense By Receiving Team", "style": "regular", "help": "Defended by player 2", "category": "defense", "statTeam": "Receiving", "statPlayer": "2" }
        ]
    },
    "Defense By Receiving Team": {
        "displayName": "Defense by {receivingTeam}",
        "transitions": [
            { "action": "Atk1", "nextState": "Zone of Attack Rec", "help": "Attack by player 1", "category": "set", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "Atk2", "nextState": "Zone of Attack Rec", "help": "Attack by player 2", "category": "set", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "SetE1", "nextState": "Point Server", "style": "error", "help": "Set err by player 1", "category": "set", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "SetE2", "nextState": "Point Server", "style": "error", "help": "Set err by player 2", "category": "set", "statTeam": "Receiving", "statPlayer": "2" }
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
    },    "Point Receiver": {
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
