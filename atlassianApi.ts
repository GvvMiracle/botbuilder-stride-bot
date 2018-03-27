import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { post } from 'request-promise';
import { ApiToken } from './strideEntities';

export class AtlassianApi {
    private static tokens: {
        [clientId: string]: {
            token: string;
            validUntil: Date
        }
    } = {};

    constructor(private clientId: string, private clientSecret: string) {
    }

    parseVerifyJwtToken(jwtToken: string) {
        let decodedToken = jwt.decode(jwtToken);
        let atlassianClientId = decodedToken.iss;
        let atlassianUserId = decodedToken.sub;
        let verifiedToken = jwt.verify(jwtToken, this.clientSecret);
        return { atlassianUserId, atlassianClientId, verifiedToken };
    }

    async sendMessageToConversation(cloudId: string, conversationId: string, message: object): Promise<string> {
        let accessToken = await this.getAccessToken();
        let apiResult = await post(`https://api.atlassian.com/site/${cloudId}/conversation/${conversationId}/message`, {
            body: message,
            json: true,
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        return apiResult.id;
    }

    async sendMessageToUser(cloudId: string, userId: string, message: string | object): Promise<string> {
        let accessToken = await this.getAccessToken();
        let apiResult = await post(`https://api.atlassian.com/site/${cloudId}/conversation/user/${userId}/message`, {
            body: message,
            json: true,
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        return apiResult.id;
    }

    async getAccessToken(): Promise<string> {
        if (!AtlassianApi.tokens[this.clientId] || AtlassianApi.tokens[this.clientId].validUntil < new Date()) {
            let token: ApiToken = await post('https://api.atlassian.com/oauth/token', {
                body: {
                    grant_type: 'client_credentials',
                    client_id: this.clientId,
                    client_secret: this.clientSecret
                },
                json: true
            });

            AtlassianApi.tokens[this.clientId] = {
                token: token.access_token,
                validUntil: moment().add(token.expires_in - 120, 'seconds').toDate()
            };
        }

        return AtlassianApi.tokens[this.clientId].token;
    }
}