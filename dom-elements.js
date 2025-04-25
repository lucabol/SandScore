const setupScreen = document.getElementById('setup-screen');
const matchScreen = document.getElementById('match-screen');
const summaryScreen = document.getElementById('summary-screen');

// Button Elements (Setup)
const startMatchBtn = document.getElementById('start-match');
const infoButton = document.getElementById('info-button'); // Info on setup
const detailsButton = document.getElementById('details-button'); // All Stats on setup (if needed?)
const loadBtn = document.getElementById('load-btn'); // Load on setup

// Button Elements (Match)
const actionButtonsEl = document.getElementById('action-buttons');
const undoBtn = document.getElementById('undo-btn');
const saveBtn = document.getElementById('save-btn');
const restartBtn = document.getElementById('restart-btn'); // Restart during match
const infoButtonMatch = document.getElementById('info-button-match'); // Info during match
const detailsButtonMatch = document.getElementById('details-button-match'); // All Stats during match

// Button Elements (Summary)
const undoBtnSummary = document.getElementById('undo-btn-summary');
const saveBtnSummary = document.getElementById('save-btn-summary');
const loadBtnSummary = document.getElementById('load-btn-summary'); // Load on summary
const restartBtnSummary = document.getElementById('restart-btn-summary'); // Restart from summary
const detailsButtonSummary = document.getElementById('details-button-summary'); // All Stats on summary

// Display Elements (Match)
const currentPointEl = document.getElementById('current-point');
const historyListEl = document.getElementById('history-list');
const currentStateEl = document.getElementById('current-state');
const teamADisplayName = document.getElementById('display-team-a-name');
const teamBDisplayName = document.getElementById('display-team-b-name');
const teamAScoreDisplay = document.getElementById('team-a-score');
const teamBScoreDisplay = document.getElementById('team-b-score');
const teamAServingIndicator = document.getElementById('team-a-serving');
const teamBServingIndicator = document.getElementById('team-b-serving');
const teamASetDisplays = [document.getElementById('team-a-set1'), document.getElementById('team-a-set2'), document.getElementById('team-a-set3')];
const teamBSetDisplays = [document.getElementById('team-b-set1'), document.getElementById('team-b-set2'), document.getElementById('team-b-set3')];

// Display Elements (Summary)
const summaryTeamAName = document.getElementById('summary-team-a-name');
const summaryTeamBName = document.getElementById('summary-team-b-name');
const summaryTeamASetDisplays = [document.getElementById('summary-team-a-set1'), document.getElementById('summary-team-a-set2'), document.getElementById('summary-team-a-set3')];
const summaryTeamBSetDisplays = [document.getElementById('summary-team-b-set1'), document.getElementById('summary-team-b-set2'), document.getElementById('summary-team-b-set3')];
const winnerAnnouncement = document.getElementById('winner-announcement');

// Modal Elements
const legendModal = document.getElementById('legend-modal');
const legendContainer = document.getElementById('legend-container');
const closeModalButtons = document.querySelectorAll('.close-modal'); // Generic close buttons

const allStatsModal = document.getElementById('all-stats-modal');
const allStatsContainer = document.getElementById('all-stats-container'); // Specific content area for all stats

const set3ServerModal = document.getElementById('set3-server-modal');
const set3TeamAName = document.getElementById('set3-team-a-name');
const set3TeamBName = document.getElementById('set3-team-b-name');
const set3ServerConfirm = document.getElementById('set3-server-confirm');

// Other Elements
const loadFileInput = document.getElementById('load-file'); // Hidden file input
const tooltip = document.getElementById('tooltip'); // Tooltip for history actions
