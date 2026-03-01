# Gmail Label Color Test Script

This script creates custom Gmail label colors to test the extension's handling of accounts with many colored labels.

## Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Gmail API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it

### 2. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in app name and your email
   - Add the scope: `https://www.googleapis.com/auth/gmail.labels`
   - Add your email as a test user
4. Create OAuth client ID:
   - Application type: **Desktop app**
   - Give it a name
5. Download the JSON file
6. Rename it to `credentials.json` and place it in this `test/` folder

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Script

```bash
npm run test:labels
```

On first run:
1. The script will display an authorization URL
2. Open the URL in your browser
3. Sign in with your Gmail account
4. Allow the requested permissions
5. Copy the authorization code and paste it back in the terminal

The script will save your credentials in `token.json` for future runs.

## What the Script Does

1. Authenticates with Gmail via OAuth
2. Lists all your labels
3. Counts how many have custom colors
4. Creates new test labels with random colors until you have 100 colored labels

## Cleanup

To remove the test labels, you can manually delete them in Gmail:
1. Go to Gmail Settings > Labels
2. Delete labels starting with `TestLabel_`

Or use the Gmail web interface to bulk delete.

## Files

- `test.js` - Main test script
- `credentials.json` - Your OAuth client credentials (gitignored)
- `token.json` - Saved access token (gitignored)
