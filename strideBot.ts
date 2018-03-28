import { ConversationAddress, StrideBotMentionMessage } from "./strideEntities";
import { Document } from "adf-builder";
import { IMessage, LuisRecognizer, IntentDialog, UniversalBot, Session, IIntentRecognizerResult, IDialogResult, Prompts, MemoryBotStorage } from "botbuilder";
import { StrideBotConnector } from "./strideBotConnector";

export class StrideBot {
    private bot: UniversalBot;
    private botConnector: StrideBotConnector;
    private recognizer: LuisRecognizer;

    constructor(clientId: string, clientSecret: string) {
        this.registerBot(clientId, clientSecret);
    }

    registerBot(clientId: string, clientSecret: string): any {
        //Connect to LUIS and create intent <-> dialog mapping
        this.recognizer = new LuisRecognizer('<your luis endpoint>');
        let intents = new IntentDialog({ recognizers: [this.recognizer] })
            .matches('Greeting', (session) => this.handleGreetingIntent(session))
            .matches('<some other intent>', (session, dialogArgs) => session.beginDialog('someIntentDialog', dialogArgs))
            .matches('Help', (session) => {
                let doc = new Document({ version: 1 });
                doc.paragraph().text("Here's what you can say");
                doc.bulletList().textItem(" ABC");
                doc.bulletList().textItem(" DEF")

                session.send(<IMessage>{
                    textFormat: 'json',
                    value: <any>doc.toJSON()
                });
            })
            .onDefault((session) => {
                session.send("Sorry, I do not understand this.");
            });

        this.botConnector = new StrideBotConnector(clientId, clientSecret);
        this.bot = new UniversalBot(this.botConnector);

        //Switch this to persistent storage (e.g. AzureTables or AWS DynamoDb)
        this.bot.set('storage', new MemoryBotStorage());

        this.bot.dialog('/', intents);
        this.bot.dialog('someIntentDialog', this.getSomeIntentDialog())
            .cancelAction('cancelAction', "Ok, I won't create continue!", {
                matches: /^cancel|abort|stop|start over/i
            })
            .endConversationAction('endConversationAction', "Ok, I won't continue!", {
                matches: /^cancel|abort|stop|start over/i
            });
    }

    handleGreetingIntent(session: Session) {
        session.send('Nice to meet you! :)');
    }

    getSomeIntentDialog() {
        return [
            // Step 1 - Build up session data
            async (session: Session, dialogArgs: IIntentRecognizerResult, next: (res?: IDialogResult<string>) => void) => {
                //Store address in conversation, for later use
                session.conversationData.sourceAddress = <ConversationAddress>session.message.address;

                //Ask the user for some more info
                Prompts.text(session, 'Please provide some more information!');
            },
            // Do something with the result
            (session: Session, result: IDialogResult<string>, next: (res?: IDialogResult<Date>) => void) => {
                let sourceAddress: ConversationAddress = session.conversationData.sourceAddress;
                let doc = new Document();
                doc.paragraph().text('You responded: ' + result.response);

                //@ts-ignore
                session.endConversation({
                    textFormat: 'json',
                    value: doc.toJSON(),
                    address: sourceAddress
                });
            }];
    }

    handleMention(token, message: StrideBotMentionMessage) {
        let text = message.message.text;

        //Remove bot handle from message before passing it to recognizer
        text = text.replace('@YourBotHandle', '').trim();

        //Not all of that should be necessary but for completeness...
        this.botConnector.handleMessage({
            address: <ConversationAddress>{
                cloudId: message.cloudId,
                conversationId: message.conversation.id,
                clientId: token.iss,
                bot: {
                    id: 'your-bot-id',
                    name: 'Your Bot Name'
                },
                channelId: 'stride',
                user: {
                    id: message.sender.id
                },
                //So this here is important, as it will determine the scope of the bot
                // For this example we are using the conversationId + userId, so the bot
                // conversation will always be per-user, per-channel. If you want a personal 
                // global bot (conversation not limited to one channel), remove the conversation id
                // OR if everyone in the room should be able to reply to the conversation, just use the 
                // conversation id
                conversation: {
                    id: message.conversation.id + message.sender.id,
                    isGroup: true
                }
            },
            type: 'message',
            agent: 'botbuilder',
            source: 'stride',
            sourceEvent: message,
            user: {
                id: token.sub
            },
            text: text
        });
    }

    //Todo
    handleDirectMessage() {

    }

    //Todo
    handlePatternMessage() {

    }
}