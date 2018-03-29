# botbuilder-stride-bot
Simple example on how to use Microsoft Bot Framework &amp; LUIS Recognizer with for a Stride bot. The StrideBotConnector implementation is by no means a complete implementation of IConnector yet. It worked for all use-cases we had with our Stride bot, but if you are looking to use every single feature of the BotFramework, you'll need to do some more work (PR welcome).

## Resources

[Stride API Docs](https://developer.atlassian.com/cloud/stride/)

[BotBuilder Docs](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-overview)

[LUIS.ai Docs](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/home)

## Getting started

### Prerequisites

1. Clone this repo
2. Open files with your favorite editor (VS Code, obviously)
3. Install dependencies with ```yarn``` (or npm, if you must)

### Create Stride app

1. Go to https://developer.atlassian.com/
2. Create an app

![image](https://user-images.githubusercontent.com/2111803/38095231-3b0a7cce-3370-11e8-858d-dd99b0582642.png)

3. Provide a title
4. Select "Stride API" to allow access from our app 
5. Copy the apps' client id and secret to the variables in the app.ts file

![image](https://user-images.githubusercontent.com/2111803/38095350-93618908-3370-11e8-99cd-234e6676affb.png)

6. Replace "@YourBotHandle" in the strideBot.ts with the actual handle (tab "App Features")

![image](https://user-images.githubusercontent.com/2111803/38095490-e4ec3dea-3370-11e8-8ede-3c1cf50e1261.png)

### Create Luis.ai account

1. Go to https://www.luis.ai/
2. Create an account & sign in
3. Create a new app
4. On "Intents", add the prebuilt domain intent "Utilities.Help"

![image](https://user-images.githubusercontent.com/2111803/38095577-1606b19e-3371-11e8-8200-6e21de5157c6.png)

5. Create a new intent called "Greeting" and add a few example utterances 

![image](https://user-images.githubusercontent.com/2111803/38095641-3fa07238-3371-11e8-9002-0208d93c6950.png)

6. Train the bot (top right corner) & publish the app

![image](https://user-images.githubusercontent.com/2111803/38095744-72967cbe-3371-11e8-9507-d13873d0bd24.png)

7. Copy the endpoint URL to the strideBot.ts, line 17

### Let's roll

1. Build the app by executing "tsc" ([typescript compiler](http://www.typescriptlang.org/))
2. Run "node ./dist/app.js"
3. Start ngrok (ngrok http 3000)

![image](https://user-images.githubusercontent.com/2111803/38095801-944c9be0-3371-11e8-9291-5b82b2387232.png)

4. Replace ngrok https url in app-descriptor.json & copy to dist folder

![image](https://user-images.githubusercontent.com/2111803/38095866-c064ea0c-3371-11e8-8b46-874a533c1f52.png)

5. Check that https://<**>.ngrok.io/app-descriptor.json is reachable and contains the correct ngrok url
6. Go to your Stride app (https://developer.atlassian.com/apps/) and enter the descriptor URL and click "Refresh"

![image](https://user-images.githubusercontent.com/2111803/38095895-d340614c-3371-11e8-8239-b6d731bd730b.png)

7. Go to any Stride channel and install the app using the installation URL (from the previous page)

![image](https://user-images.githubusercontent.com/2111803/38095975-021bef4a-3372-11e8-9cf7-e7ed77f33b29.png)

8. Mention the bot with a greeting, like this:
   ```@YourBotHandle Hi```
   
![image](https://user-images.githubusercontent.com/2111803/38096004-18d180c4-3372-11e8-9c12-5bfc1b7a4743.png)
