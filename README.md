# botbuilder-stride-bot
Simple example on how to use Microsoft Bot Framework &amp; LUIS Recognizer with for a Stride bot

## Getting started

### Create Stride app

1. Go to https://developer.atlassian.com/
2. Create an app
3. Provide title
4. Select Stride API
5. Copy the apps' client id and secret to the variables in the app.ts file
6. Replace "@YourBotHandle" in the strideBot.ts with the actual handle (tab "App Features")

### Create Luis.ai account

1. Go to https://www.luis.ai/
2. Create an account & sign in
3. Create a new app
4. On "Intents", add the prebuilt domain intent "Utilities.Help"
5. Create a new intent called "Greeting" and add a few example utterances 
6. Train the bot (top right corner) & publish the app
7. Copy the endpoint URL to the strideBot.ts, line 17

### Let's roll

1. Build the app by executing "tsc" (typescript compiler)
2. Run "node ./dist/app.js"
3. Start ngrok (ngrok http 3000)
4. Replace ngrok https url in app-descriptor.json & copy to dist folder
5. Check that https://<**>.ngork.io/app-descriptor.json is reachable and contains the correct ngrok url
6. Go to your Stride app (https://developer.atlassian.com/apps/) and enter the descriptor URL and click "Refresh"
7. Go to any Stride channel and install the app using the installation URL (from the previous page)
8. Mention the bot with a greeting, like this:
   ```@YourBotHandle Hi```