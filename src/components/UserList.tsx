import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Input, Button, List, message } from 'antd';
import { SearchOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { getUsers } from '../api/api';
import userStore from '../stores/UserStore/UserStore';
import { User } from '../types';

const UserList = observer(() => {
    const [searchValue, setSearchValue] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const { user, addFriend, removeFriend } = userStore;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Ошибка при получении пользователей:', error);
                message.error('Не удалось получить пользователей');
            }
        };

        fetchUsers();
    }, []);

    const handleAddFriend = async (friendId: number) => {
        try {
            await addFriend(user!.id, friendId);
            message.success('Друг успешно добавлен');
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Ошибка при добавлении друга:', error);
            message.error('Не удалось добавить друга');
        }
    };

    const handleRemoveFriend = async (friendId: number) => {
        try {
            await removeFriend(user!.id, friendId);
            message.success('Друг успешно удален');
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Ошибка при удалении друга:', error);
            message.error('Не удалось удалить друга');
        }
    };

    return (
        <div>
            <Input
                placeholder="Найти пользователя..."
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <List
                itemLayout="horizontal"
                dataSource={users
                    .filter(user => user.fullName.toLowerCase().includes(searchValue.toLowerCase()))
                    .filter(user => user.id !== userStore.user?.id)
                }
                renderItem={(user) => (
                    <List.Item
                        key={user.id}
                        actions={[
                            <Button

                                icon={<UserAddOutlined className='user-list__add-icon' />}
                                onClick={() => handleAddFriend(user.id)}
                            >
                                <span className='user-list__add-button-text'>Добавить</span>
                            </Button>,
                            <Button
                                icon={<UserDeleteOutlined className='user-list__remove-icon' />}
                                onClick={() => handleRemoveFriend(user.id)}
                            >
                                <span className='user-list__remove-button-text'>Удалить</span>
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={user.fullName}
                            description={user.email}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
});

export default UserList;
