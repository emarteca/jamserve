import {testService} from '../base/base.service.spec';
import {mockUser} from '../user/user.mock';
import {ChatService} from './chat.service';

describe('ChatService', () => {
	let chatService: ChatService;
	const user1 = mockUser();
	user1.id = 'chatUserID1';
	testService({mockData: false},
		async () => {
			chatService = new ChatService();
			chatService.setSettings({
				maxMessages: 4,
				maxAge: {
					value: 1000,
					unit: 's'
				}
			});
		},
		() => {
			it('should add and remove a msg', async () => {
				const msg = await chatService.add('msg', user1);
				expect(msg).toBeDefined();
				expect(await chatService.find(msg.time)).toBe(msg);
				await chatService.remove(msg);
				const list = await chatService.get();
				expect(list.length).toBe(0);
			});
			it('should find since a given datetime', async () => {
				const msg = await chatService.add('msg', user1);
				expect(msg).toBeDefined();
				let list = await chatService.get(msg.time - 1);
				expect(list.length).toBe(1);
				list = await chatService.get(msg.time);
				expect(list.length).toBe(0);
				await chatService.remove(msg);
			});
			it('should remove old/max messages', async () => {
				await chatService.add('msg1', user1);
				await chatService.add('msg2', user1);
				await chatService.add('msg3', user1);
				await chatService.add('msg4', user1);
				const msg = await chatService.add('msg5', user1);
				let list = await chatService.get();
				expect(list.length).toBe(4);
				msg.time = msg.time - (1000 * 60 * 1000);
				list = await chatService.get();
				expect(list.length).toBe(3);
			});
		}
	);
});
