import { Users } from '@rocket.chat/models';
import type { IMessage } from '@rocket.chat/core-typings';

import { ServiceClassInternal } from '../../sdk/types/ServiceClass';
import type { IMessageService } from '../../sdk/types/IMessageService';
import { createDirectMessage } from '../../methods/createDirectMessage';
import { executeSendMessage } from '../../../app/lib/server/methods/sendMessage';

export class MessageService extends ServiceClassInternal implements IMessageService {
	protected name = 'message';

	async createDirectMessage({ to, from }: { to: string; from: string }): Promise<{ rid: string }> {
		const [toUser, fromUser] = await Promise.all([Users.findOneByUsername(to), Users.findOneByUsername(from)]);

		if (!toUser || !fromUser) {
			throw new Error('error-invalid-user');
		}
		return createDirectMessage([to], from);
	}

	async sendMessage({ fromId, rid, msg }: { fromId: string; rid: string; msg: string }): Promise<IMessage> {
		return executeSendMessage(fromId, { rid, msg });
	}
}