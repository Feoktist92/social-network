import { useEffect, useState } from 'react';
import { Tabs, List, Avatar, TabsProps } from 'antd';
import userStore from '../stores/UserStore';
import { Message, User } from '../types';
import { getUserById } from '../api/api';
import { observer } from 'mobx-react-lite';

const MessageList = observer(() => {
    const { user } = userStore;
    const [incomingMessages, setIncomingMessages] = useState<Message[]>([]);
    const [outgoingMessages, setOutgoingMessages] = useState<Message[]>([]);
    const [usersMap, setUsersMap] = useState<{ [key: number]: User }>({});

    useEffect(() => {
        // Загрузка входящих и исходящих сообщений пользователя
        const loadIncomingMessages = async () => {
            if (user?.incomingMessages) {
                setIncomingMessages(user.incomingMessages);
            }
        };

        const loadOutgoingMessages = async () => {
            if (user?.outgoingMessages) {
                setOutgoingMessages(user.outgoingMessages);
            }
        };

        // Загрузка пользователей отправителей и получателей
        const loadUsersAndMessages = async () => {
            const users: { [key: number]: User } = {};

            if (user?.incomingMessages) {
                for (const message of user.incomingMessages) {
                    if (!users[message.senderId]) {
                        const sender = await getUserById(message.senderId);
                        users[message.senderId] = sender;
                    }
                }
            }
            if (user?.outgoingMessages) {
                for (const message of user.outgoingMessages) {
                    if (!users[message.receiverId]) {
                        const receiver = await getUserById(message.receiverId);
                        users[message.receiverId] = receiver;
                    }
                }
            }
            setUsersMap(users);
        };

        loadIncomingMessages();
        loadOutgoingMessages();
        loadUsersAndMessages();
    }, [user]);

    const items: TabsProps['items'] = [
        {
            key: 'incoming',
            label: 'Входящие',
            children: (
                <List
                    itemLayout="horizontal"
                    dataSource={incomingMessages}
                    renderItem={message => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={usersMap[message.senderId]?.avatar} />}
                                title={`Отправитель: ${usersMap[message.senderId]?.fullName || 'Неизвестный пользователь'}`}
                                description={message.content}
                            />
                        </List.Item>
                    )}
                />
            ),
        },
        {
            key: 'outgoing',
            label: 'Исходящие',
            children: (
                <List
                    itemLayout="horizontal"
                    dataSource={outgoingMessages}
                    renderItem={message => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={usersMap[message.receiverId]?.avatar} />}
                                title={`Получатель: ${usersMap[message.receiverId]?.fullName || 'Неизвестный пользователь'}`}
                                description={message.content}
                            />
                        </List.Item>
                    )}
                />
            ),
        },
    ];

    return <Tabs items={items} />;
});

export default MessageList;
