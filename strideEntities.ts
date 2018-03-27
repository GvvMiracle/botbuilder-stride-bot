import { IAddress } from "botbuilder";

export interface ConversationAddress extends IAddress {
    cloudId: string;
    conversationId: string;
    clientId: string;
}

export class ApiToken {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

export interface StrideBotMentionMessage {
    cloudId: string;
    message: Message;
    recipients?: any[] | null;
    sender: Sender;
    conversation: Conversation;
    type: string;
}

export interface Message {
    id: string;
    body: Body;
    text: string;
    sender: Sender;
    ts: string;
}

export interface Sender {
    id: string;
}

export interface Conversation {
    avatarUrl: string;
    id: string;
    isArchived: boolean;
    name: string;
    privacy: string;
    topic: string;
    type: string;
    modified: string;
    created: string;
}