import { useState, useEffect } from 'react';
import { List, Avatar, Button, message, Input } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import userStore from '../stores/UserStore';
import { getUserById } from '../api/api';
import { User } from '../types';
import { observer } from 'mobx-react-lite';

const { TextArea } = Input;

const FriendList = observer(() => {
    const { user: loggedInUser, sendMessage } = userStore;
    const [userFriends, setUserFriends] = useState<User[]>([]);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

    useEffect(() => {
        const loadUserFriends = async () => {
            try {
                if (!loggedInUser) return;
                const currentUser = await getUserById(loggedInUser.id);
                setUserFriends(currentUser.friends);
            } catch (error) {
                console.error('Error loading user friends:', error);
            }
        };

        loadUserFriends();
    }, [loggedInUser]);

    const handleSendMessageClick = (friend: User) => {
        setSelectedFriend(friend);
        setIsSendingMessage(true);
    };

    const handleCancelSendMessage = () => {
        setIsSendingMessage(false);
        setMessageContent('');
        setSelectedFriend(null);
    };

    const handleSendMessage = async () => {
        if (!selectedFriend || !loggedInUser) return;

        try {
            await sendMessage(loggedInUser.id, selectedFriend.id, messageContent);
            message.success('Message sent successfully');
            setIsSendingMessage(false);
            setMessageContent('');
            setSelectedFriend(null);
        } catch (error) {
            console.error('Error sending message:', error);
            message.error('Failed to send message');
        }
    };

    return (
        <List
            dataSource={userFriends}
            renderItem={friend => (
                <List.Item key={friend.id}>
                    <List.Item.Meta
                        avatar={<Avatar size={80} src={friend.avatar} />}
                        title={<span className='friend-list__title'>{friend.fullName}</span>}
                        description={
                            friend === selectedFriend && isSendingMessage ? (
                                <div className='friend-list__message'>
                                    <TextArea
                                        value={messageContent}
                                        onChange={e => setMessageContent(e.target.value)}
                                        autoSize={{ minRows: 3, maxRows: 5 }}
                                    />
                                    <div className='friend-list__message-buttons'>
                                        <Button type="primary" onClick={handleSendMessage}>Send</Button>
                                        <Button onClick={handleCancelSendMessage}>Cancel</Button>
                                    </div>

                                </div>
                            ) : (
                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={<MessageOutlined />}
                                    size="large"
                                    onClick={() => handleSendMessageClick(friend)}
                                >
                                    Отправить
                                </Button>
                            )
                        }
                    />
                </List.Item>
            )}
        />
    );
});
export default FriendList;
