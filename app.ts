import * as express from 'express';
import * as bodyParser from 'body-parser';
import { AtlassianApi } from './atlassianApi';
import { StrideBot } from './strideBot';
import { StrideBotMentionMessage } from './strideEntities';

let strideClientId = "abc";
let strideClientSecret = "def";
let api = new AtlassianApi(strideClientId, strideClientSecret);
let bot = new StrideBot(strideClientId, strideClientSecret);
let app = express();
app.use(bodyParser.json());

// This webhook will be called by stride when the bot is mentioned in a channel or dm
app.post('/bot-mention', (req: express.Request, res: express.Response) => {
    let jwtToken = req.header('Authorization').split(' ')[1];
    let message: StrideBotMentionMessage = req.body;

    // Check that the JWT token is valid & signed
    let { verifiedToken } = api.parseVerifyJwtToken(jwtToken);
    bot.handleMention(verifiedToken, message);

    // Send 200 to signal that we processed the request
    res.status(200).send();
});

app.listen(3000);
