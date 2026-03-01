/**
 * Gmail Label Color Test Script
 * 
 * This script uses the Gmail API to:
 * 1. Authenticate via OAuth
 * 2. Count existing custom label colors
 * 3. Add new colored labels to reach 100 total
 * 
 * Setup:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing one
 * 3. Enable the Gmail API
 * 4. Create OAuth 2.0 credentials (Desktop app type)
 * 5. Download the credentials JSON and save as 'credentials.json' in this folder
 * 6. Run: npm install googleapis
 * 7. Run: node test/test.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

// OAuth2 scopes needed for label management
const SCOPES = ['https://www.googleapis.com/auth/gmail.labels'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

// Gmail's allowed label colors (background, text pairs)
const LABEL_COLORS = [
  { backgroundColor: '#000000', textColor: '#ffffff' },
  { backgroundColor: '#434343', textColor: '#ffffff' },
  { backgroundColor: '#666666', textColor: '#ffffff' },
  { backgroundColor: '#999999', textColor: '#ffffff' },
  { backgroundColor: '#cccccc', textColor: '#000000' },
  { backgroundColor: '#efefef', textColor: '#000000' },
  { backgroundColor: '#f3f3f3', textColor: '#000000' },
  { backgroundColor: '#ffffff', textColor: '#000000' },
  { backgroundColor: '#fb4c2f', textColor: '#ffffff' },
  { backgroundColor: '#ffad47', textColor: '#ffffff' },
  { backgroundColor: '#fad165', textColor: '#000000' },
  { backgroundColor: '#16a766', textColor: '#ffffff' },
  { backgroundColor: '#43d692', textColor: '#000000' },
  { backgroundColor: '#4a86e8', textColor: '#ffffff' },
  { backgroundColor: '#a479e2', textColor: '#ffffff' },
  { backgroundColor: '#f691b3', textColor: '#000000' },
  { backgroundColor: '#f6c5be', textColor: '#000000' },
  { backgroundColor: '#ffe6c7', textColor: '#000000' },
  { backgroundColor: '#fef1d1', textColor: '#000000' },
  { backgroundColor: '#b9e4d0', textColor: '#000000' },
  { backgroundColor: '#c6f3de', textColor: '#000000' },
  { backgroundColor: '#c9daf8', textColor: '#000000' },
  { backgroundColor: '#e4d7f5', textColor: '#000000' },
  { backgroundColor: '#fcdee8', textColor: '#000000' },
  { backgroundColor: '#efa093', textColor: '#000000' },
  { backgroundColor: '#ffc8af', textColor: '#000000' },
  { backgroundColor: '#fdedc1', textColor: '#000000' },
  { backgroundColor: '#b3efd3', textColor: '#000000' },
  { backgroundColor: '#a0eac9', textColor: '#000000' },
  { backgroundColor: '#a4c2f4', textColor: '#000000' },
  { backgroundColor: '#d0bcf1', textColor: '#000000' },
  { backgroundColor: '#fbc8d9', textColor: '#000000' },
  { backgroundColor: '#e66550', textColor: '#ffffff' },
  { backgroundColor: '#ffbc6b', textColor: '#000000' },
  { backgroundColor: '#fcda83', textColor: '#000000' },
  { backgroundColor: '#44b984', textColor: '#ffffff' },
  { backgroundColor: '#68dfa9', textColor: '#000000' },
  { backgroundColor: '#6d9eeb', textColor: '#ffffff' },
  { backgroundColor: '#b694e8', textColor: '#ffffff' },
  { backgroundColor: '#f7a7c0', textColor: '#000000' },
  { backgroundColor: '#cc3a21', textColor: '#ffffff' },
  { backgroundColor: '#eaa041', textColor: '#ffffff' },
  { backgroundColor: '#f2c960', textColor: '#000000' },
  { backgroundColor: '#149e60', textColor: '#ffffff' },
  { backgroundColor: '#3dc789', textColor: '#ffffff' },
  { backgroundColor: '#3c78d8', textColor: '#ffffff' },
  { backgroundColor: '#8e63ce', textColor: '#ffffff' },
  { backgroundColor: '#e07798', textColor: '#ffffff' },
  { backgroundColor: '#ac2b16', textColor: '#ffffff' },
  { backgroundColor: '#cf8933', textColor: '#ffffff' },
  { backgroundColor: '#d5ae49', textColor: '#000000' },
  { backgroundColor: '#0b804b', textColor: '#ffffff' },
  { backgroundColor: '#2a9c68', textColor: '#ffffff' },
  { backgroundColor: '#285bac', textColor: '#ffffff' },
  { backgroundColor: '#653e9b', textColor: '#ffffff' },
  { backgroundColor: '#b65775', textColor: '#ffffff' },
  { backgroundColor: '#822111', textColor: '#ffffff' },
  { backgroundColor: '#a46a21', textColor: '#ffffff' },
  { backgroundColor: '#aa8831', textColor: '#ffffff' },
  { backgroundColor: '#076239', textColor: '#ffffff' },
  { backgroundColor: '#1a764d', textColor: '#ffffff' },
  { backgroundColor: '#1c4587', textColor: '#ffffff' },
  { backgroundColor: '#41236d', textColor: '#ffffff' },
  { backgroundColor: '#83334c', textColor: '#ffffff' },
];

const TARGET_LABEL_COUNT = 100;

/**
 * Load saved credentials if they exist
 */
async function loadSavedCredentials() {
  try {
    const content = fs.readFileSync(TOKEN_PATH, 'utf8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Save credentials for future use
 */
async function saveCredentials(client) {
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  fs.writeFileSync(TOKEN_PATH, payload);
}

/**
 * Interactive OAuth authorization flow
 */
async function authorize() {
  // Check if we have saved credentials
  let client = await loadSavedCredentials();
  if (client) {
    console.log('Using saved credentials...');
    return client;
  }

  // Load OAuth client credentials
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('Error: credentials.json not found!');
    console.error('Please download OAuth credentials from Google Cloud Console.');
    console.error('See setup instructions at the top of this file.');
    process.exit(1);
  }

  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;

  const oAuth2Client = new google.auth.OAuth2(
    key.client_id,
    key.client_secret,
    key.redirect_uris ? key.redirect_uris[0] : 'http://localhost'
  );

  // Generate authorization URL
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:\n');
  console.log(authUrl);
  console.log('\n');

  // Get authorization code from user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise((resolve) => {
    rl.question('Enter the authorization code from the page: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  // Exchange code for tokens
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Save credentials for next time
  await saveCredentials(oAuth2Client);
  console.log('Credentials saved for future use.\n');

  return oAuth2Client;
}

/**
 * Get all user labels from Gmail
 */
async function getLabels(gmail) {
  const res = await gmail.users.labels.list({ userId: 'me' });
  return res.data.labels || [];
}

/**
 * Count labels that have custom colors (user-created labels with color property)
 */
async function countCustomColoredLabels(gmail, labels) {
  let coloredCount = 0;
  const coloredLabels = [];

  for (const label of labels) {
    // Skip system labels (INBOX, SENT, etc.)
    if (label.type === 'system') continue;

    // Get full label details to check color
    const fullLabel = await gmail.users.labels.get({
      userId: 'me',
      id: label.id,
    });

    if (fullLabel.data.color) {
      coloredCount++;
      coloredLabels.push({
        name: fullLabel.data.name,
        color: fullLabel.data.color,
      });
    }
  }

  return { count: coloredCount, labels: coloredLabels };
}

/**
 * Create a new label with a random color
 */
async function createColoredLabel(gmail, name) {
  const randomColor = LABEL_COLORS[Math.floor(Math.random() * LABEL_COLORS.length)];
  
  const res = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: name,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show',
      color: randomColor,
    },
  });

  return res.data;
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(50));
  console.log('Gmail Label Color Test Script');
  console.log('='.repeat(50));
  console.log('');

  // Authenticate
  console.log('Step 1: Authenticating...');
  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });
  console.log('Authentication successful!\n');

  // Get all labels
  console.log('Step 2: Fetching labels...');
  const labels = await getLabels(gmail);
  console.log(`Found ${labels.length} total labels.\n`);

  // Count custom colored labels
  console.log('Step 3: Counting custom colored labels...');
  const { count: coloredCount, labels: coloredLabels } = await countCustomColoredLabels(gmail, labels);
  console.log(`Found ${coloredCount} labels with custom colors.\n`);

  if (coloredLabels.length > 0) {
    console.log('Existing colored labels:');
    coloredLabels.forEach((l) => {
      console.log(`  - ${l.name} (bg: ${l.color.backgroundColor}, text: ${l.color.textColor})`);
    });
    console.log('');
  }

  // Calculate how many labels to create
  const labelsToCreate = TARGET_LABEL_COUNT - coloredCount;

  if (labelsToCreate <= 0) {
    console.log(`Already at or above ${TARGET_LABEL_COUNT} colored labels. Nothing to do!`);
    return;
  }

  console.log(`Step 4: Creating ${labelsToCreate} new colored labels to reach ${TARGET_LABEL_COUNT}...`);
  console.log('');

  // Create new labels
  let created = 0;
  const timestamp = Date.now();

  for (let i = 0; i < labelsToCreate; i++) {
    const labelName = `TestLabel_${timestamp}_${String(i + 1).padStart(3, '0')}`;
    
    try {
      const newLabel = await createColoredLabel(gmail, labelName);
      created++;
      console.log(`  Created: ${labelName} (${newLabel.color.backgroundColor})`);
      
      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
      console.error(`  Failed to create ${labelName}: ${err.message}`);
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log(`Done! Created ${created} new colored labels.`);
  console.log(`Total colored labels now: ${coloredCount + created}`);
  console.log('='.repeat(50));
}

// Run the script
main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
