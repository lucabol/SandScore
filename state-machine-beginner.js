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
            { "action": "Blk1", "nextState": "Point Server", "style": "error", "help": "Blocked player 1", "category": "attack", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "Blk2", "nextState": "Point Server", "style": "error", "help": "Blocked player 2", "category": "attack", "statTeam": "Receiving", "statPlayer": "2" },
            { "action": "Def1", "nextState": "Attack Server", "style": "regular", "help": "Defended player 1", "category": "attack", "statTeam": "Receiving", "statPlayer": "1" },
            { "action": "Def2", "nextState": "Attack Server", "style": "regular", "help": "Defended player 2", "category": "attack", "statTeam": "Receiving", "statPlayer": "2" }
        ]
    },
    "Attack Server": {
        "displayName": "{servingTeam} Attack",
        "transitions": [
            { "action": "Win1", "nextState": "Point Server", "style": "point", "help": "Winning attack by player 1", "category": "attack", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "Win2", "nextState": "Point Server", "style": "point", "help": "Winning attack by player 2", "category": "attack", "statTeam": "Serving", "statPlayer": "2" },
            { "action": "Err1", "nextState": "Point Receiver", "style": "error", "help": "Attack error by player 1", "category": "attack", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "Err2", "nextState": "Point Receiver", "style": "error", "help": "Attack error by player 2", "category": "attack", "statTeam": "Serving", "statPlayer": "2" },
            { "action": "Blk1", "nextState": "Point Receiver", "style": "error", "help": "Blocked player 1", "category": "attack", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "Blk2", "nextState": "Point Receiver", "style": "error", "help": "Blocked player 2", "category": "attack", "statTeam": "Serving", "statPlayer": "2" },
            { "action": "Def1", "nextState": "Attack Receiver", "style": "regular", "help": "Defended player 1", "category": "attack", "statTeam": "Serving", "statPlayer": "1" },
            { "action": "Def2", "nextState": "Attack Receiver", "style": "regular", "help": "Defended player 2", "category": "attack", "statTeam": "Serving", "statPlayer": "2" }
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
    }
};