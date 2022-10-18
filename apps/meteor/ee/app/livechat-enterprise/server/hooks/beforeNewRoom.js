import { Meteor } from 'meteor/meteor';
import { OmnichannelServiceLevelAgreements } from '@rocket.chat/models';

import { callbacks } from '../../../../../lib/callbacks';

callbacks.add(
	'livechat.beforeRoom',
	(roomInfo, extraData) => {
		if (!extraData) {
			return roomInfo;
		}

		const { priority: searchTerm } = extraData;
		if (!searchTerm) {
			return roomInfo;
		}

		const priority = Promise.await(OmnichannelServiceLevelAgreements.findOneByIdOrName(searchTerm));
		if (!priority) {
			throw new Meteor.Error('error-invalid-priority', 'Invalid priority', {
				function: 'livechat.beforeRoom',
			});
		}

		const { _id: slaId } = priority;
		return Object.assign({ ...roomInfo }, { slaId });
	},
	callbacks.priority.MEDIUM,
	'livechat-before-new-room',
);
