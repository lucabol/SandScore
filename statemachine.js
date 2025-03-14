const rallyGraph = {
    Serve: {
        transitions: [
            { action: "Ace", nextState: "Point Server" },          // Serving team scores (Point Server)
            { action: "Err", nextState: "Point Receiver" },        // Receiving team scores (Point Receiver)
            { action: "R! Rec1", nextState: "Point Server" },   // Bad reception by Player 1
            { action: "R- Rec1", nextState: "Reception" },  // Poor reception by Player 1
            { action: "R= Rec1", nextState: "Reception" },  // Average reception by Player 1
            { action: "R+ Rec1", nextState: "Reception" },  // Perfect reception by Player 1
            { action: "R! Rec2", nextState: "Point Server" },   // Bad reception by Player 2
            { action: "R- Rec2", nextState: "Reception" },  // Poor reception by Player 2
            { action: "R= Rec2", nextState: "Reception" },  // Average reception by Player 2
            { action: "R+ Rec2", nextState: "Reception" }   // Perfect reception by Player 2
        ]
    },
    Reception: {
        transitions: [
            { action: "Atk Rec1", nextState: "Zone of Attack Rec" },
            { action: "Atk Rec2", nextState: "Zone of Attack Rec" }
        ]
    },
    "Zone of Attack Rec": {
        transitions: [
            { action: "V1", nextState: "Trajectory Rec" },
            { action: "V2", nextState: "Trajectory Rec" },
            { action: "V3", nextState: "Trajectory Rec" },
            { action: "V4", nextState: "Trajectory Rec" },
            { action: "V5", nextState: "Trajectory Rec" },
            { action: "X1", nextState: "Trajectory Rec" },
            { action: "X2", nextState: "Trajectory Rec" },
            { action: "X3", nextState: "Trajectory Rec" },
            { action: "X4", nextState: "Trajectory Rec" },
            { action: "X5", nextState: "Trajectory Rec" },
            { action: "I1", nextState: "Trajectory Rec" },
            { action: "I2", nextState: "Trajectory Rec" },
            { action: "I3", nextState: "Trajectory Rec" },
            { action: "I4", nextState: "Trajectory Rec" },
            { action: "I5", nextState: "Trajectory Rec" }
        ],
    },
    "Trajectory Rec": {
        transitions: [
            { action: "Diag", nextState: "Attack by Receiving Team" },
            { action: "DiagL", nextState: "Attack by Receiving Team" },
            { action: "DiagS", nextState: "Attack by Receiving Team" },
            { action: "Line", nextState: "Attack by Receiving Team" },
            { action: "LineS", nextState: "Attack by Receiving Team" },
            { action: "Cut", nextState: "Attack by Receiving Team" },
        ],
    },
    "Attack by Receiving Team": {
        transitions: [
            { action: "Win Atk", nextState: "Point Receiver" },  // Receiving team scores (Point Receiver)
            { action: "Err Atk", nextState: "Point Server" },    // Serving team scores (Point Server)
            { action: "Blk Srv1", nextState: "Point Server" },   // Serving team scores (Point Server)
            { action: "Blk Srv2", nextState: "Point Server" },   // Serving team scores (Point Server)
            { action: "Def Srv1", nextState: "Defense By Serving Team" },
            { action: "Def Srv2", nextState: "Defense By Serving Team" }
        ]
    },
    "Defense By Serving Team": {
        transitions: [
            { action: `Atk Srv1`, nextState: "Zone of Attack Srv" },
            { action: `Atk Srv2`, nextState: "Zone of Attack Srv" }
        ]
    },
    "Zone of Attack Srv": {
        transitions: [
            { action: "V1", nextState: "Trajectory Srv" },
            { action: "V2", nextState: "Trajectory Srv" },
            { action: "V3", nextState: "Trajectory Srv" },
            { action: "V4", nextState: "Trajectory Srv" },
            { action: "V5", nextState: "Trajectory Srv" },
            { action: "X1", nextState: "Trajectory Srv" },
            { action: "X2", nextState: "Trajectory Srv" },
            { action: "X3", nextState: "Trajectory Srv" },
            { action: "X4", nextState: "Trajectory Srv" },
            { action: "X5", nextState: "Trajectory Srv" },
            { action: "I1", nextState: "Trajectory Srv" },
            { action: "I2", nextState: "Trajectory Srv" },
            { action: "I3", nextState: "Trajectory Srv" },
            { action: "I4", nextState: "Trajectory Srv" },
            { action: "I5", nextState: "Trajectory Srv" }
        ],
    },
    "Trajectory Srv": {
        transitions: [
            { action: "Diag", nextState: "Attack by Serving Team" },
            { action: "DiagL", nextState: "Attack by Serving Team" },
            { action: "DiagS", nextState: "Attack by Serving Team" },
            { action: "Line", nextState: "Attack by Serving Team" },
            { action: "LineS", nextState: "Attack by Serving Team" },
            { action: "Cut", nextState: "Attack by Serving Team" },
        ],
    },
    "Attack by Serving Team": {
        transitions: [
            { action: "Win Atk", nextState: "Point Server" },  // Serving team scores (Point Server)
            { action: "Err Atk", nextState: "Point Receiver" },    // Receiving team scores (Point Receiver)
            { action: "Blk Rec1", nextState: "Point Receiver" },   // Receiving team scores (Point Receiver)
            { action: "Blk Rec2", nextState: "Point Receiver" },   // Receiving team scores (Point Receiver)
            { action: "Def Rec1", nextState: "Defense By Receiving Team" },
            { action: "Def Rec2", nextState: "Defense By Receiving Team" }
        ]
    },
    "Defense By Receiving Team": {
        transitions: [
            { action: "Atk Rec1", nextState: "Zone of Attack Rec" },
            { action: "Atk Rec2", nextState: "Zone of Attack Rec" }
        ]
    }
};
