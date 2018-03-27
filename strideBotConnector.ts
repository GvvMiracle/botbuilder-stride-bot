import { IConnector, IEvent, IMessage, IAddress } from 'botbuilder';
import { ConversationAddress } from './strideEntities'
import { Document } from 'adf-builder';
import { AtlassianApi } from './atlassianApi';

export class StrideBotConnector implements IConnector {
    private messageHandler: (events: IEvent[], callback?: ((err: Error) => void) | undefined) => void;

    constructor(private clientId: string, private clientSecret: string) {
    }

    onEvent(handler: (events: IEvent[], callback?: ((err: Error) => void) | undefined) => void): void {
        this.messageHandler = handler;
    }

    send(messages: IMessage[], callback: (err: Error, addresses?: IAddress[] | undefined) => void): void {
        let ids: Promise<string>[] = [];
        for (let i = 0; i < messages.length; i++) {
            let message = messages[i];
            if (message.address.conversation && message.address.conversation.isGroup) {
                let address: ConversationAddress = <any>message.address;
                let api = new AtlassianApi(this.clientId, this.clientSecret);

                let adfObject: any;
                if (!message.textFormat || message.textFormat === 'plain') {
                    let doc = new Document();
                    doc.paragraph().text(<string>message.text);
                    adfObject = doc.toJSON();
                } else if (message.textFormat === 'json') {
                    adfObject = message.value;
                }

                let idPromise = api.sendMessageToConversation(address.cloudId, address.conversationId, adfObject);
                ids.push(idPromise);
            }
        }

        Promise.all(ids).then(ids => {
            callback(<any>null, ids.map(id => <any>{ messageId: id }));
        });
    }

    startConversation(address: IAddress, callback: (err: Error, address?: IAddress | undefined) => void): void {
        callback(<any>null, address);
    }

    async handleMessage(message: IMessage) {
        return new Promise((resolve, reject) => {
            this.messageHandler([message], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
}
