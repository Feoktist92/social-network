import { observer } from 'mobx-react-lite';
import userStore from '../stores/UserStore/UserStore';
import { useState } from 'react';
import { Avatar, Input, Button, message } from 'antd';

const UserProfile = observer(() => {
    const { user, updateUserAvatar } = userStore;
    const [newAvatarUrl, setNewAvatarUrl] = useState('');

    const handleAvatarChange = async () => {
        try {
            await updateUserAvatar(user!.id, newAvatarUrl);
            setNewAvatarUrl('');
            message.success('Avatar updated successfully');
        } catch (error) {
            console.error('Error updating user avatar:', error);
            message.error('Failed to update user avatar');
        }
    };

    return (
        <div>
            {user && (
                <>
                    <h2>{user.fullName}</h2>
                    <Avatar
                        size={80}
                        src={newAvatarUrl || user.avatar}
                        alt="Avatar"
                    />
                    <p>{user.email}</p>
                    <p>Friends: {user.friends?.length}</p>
                    <div className='user-profile__avatar'>
                        <Input
                            placeholder="Введите URL вашего аватара"
                            className='user-profile__avatar-input'
                            type="text"
                            value={newAvatarUrl}
                            onChange={(e) => setNewAvatarUrl(e.target.value)}
                        />
                        <Button type='primary' onClick={handleAvatarChange}>
                            Обновить
                        </Button>
                    </div>

                </>
            )}
        </div>
    );
});

export default UserProfile;
