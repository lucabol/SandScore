# SandScore

Build an application that provides a detailed rally-by-rally tracking system for for a beach volleyball match, focusing on the sequence of actions and their outcomes in each rally.

The code needs to build the application flow dynamically based on the content of the state machine (which should be integrated in the code verbatim). At the start of a rally one team is serving and the other is receiving. One screen is created for each state with buttons representing the actions move between states. The goal is that just by changing the state machine representation, the UI flow changes without the need to modify any other code.

The score (sets and points) need to be shown to the user and modified when a terminal state is reached.

There should be buttons to Save and Load a match (state).

There should be a button to Undo the previous point by restoring the state to its value before the modification.

There should be a button to Reset the app to the initial state.

There should be an initial screen to specify the names of the four players and how many points each set has. You should be able to choose between each set having 3 points (3-3-3) or a normal beach volley score where the first two sets go to 21 and the third to 15 (21-21-15). Remember that in all cases a set needs to be won by at least 2 points.