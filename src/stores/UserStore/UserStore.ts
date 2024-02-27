import { makeAutoObservable } from 'mobx';
import { Message, User } from '../../types';
import axios from 'axios';
import { API_URL } from '../../api/api';

class UserStore {
    user: User | null = null;
    loggedIn = false;

    constructor() {
        makeAutoObservable(this);
        this.checkToken();
        this.checkUser();
    }

    setUser = (user: User) => {
        this.user = user;
        this.loggedIn = true;
        localStorage.setItem('token', user?.token || '');
        localStorage.setItem('user', JSON.stringify(user));
    };

    logout = () => {
        this.user = null;
        this.loggedIn = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    checkToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            this.loggedIn = true;
        }
    };

    checkUser = () => {
        const user = localStorage.getItem('user');
        if (user) {
            this.user = JSON.parse(user);
        }
    };

    updateUserAvatar = async (id: number, avatar: string) => {
        try {
            const response = await axios.patch(`${API_URL}/users/${id}`, {
                avatar,
            });
            const updatedUser = response.data;
            this.user = updatedUser;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error('Error updating user avatar:', error);
            throw new Error('Failed to update user avatar');
        }
    };

    addFriend = async (userId: number, friendId: number) => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}`);
            const user = response.data;

            if (!user.friends) {
                user.friends = [];
            }

            // Проверяем, не существует ли уже друг с таким идентификатором
            const isFriendExists = user.friends.some(
                (friend: User) => friend.id === friendId
            );
            if (!isFriendExists) {
                // Добавляем друга в массив друзей
                const friendResponse = await axios.get(
                    `${API_URL}/users/${friendId}`
                );
                const friend = friendResponse.data;
                user.friends.push(friend);

                // Обновляем пользователя на сервере
                await axios.patch(`${API_URL}/users/${userId}`, user);

                // Обновляем данные пользователя в хранилище
                this.user = user;
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                throw new Error('Friend with the same ID already exists');
            }
        } catch (error) {
            console.error('Error adding friend:', error);
            throw new Error('Failed to add friend');
        }
    };

    // В вашем файле UserStore.ts
    removeFriend = async (userId: number, friendId: number) => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}`);
            const user = response.data;

            // Проверяем, существует ли у пользователя массив друзей
            if (!user.friends) {
                throw new Error('User has no friends to remove');
            }

            // Фильтруем массив друзей, оставляя только тех, у кого id не совпадает с friendId
            user.friends = user.friends.filter(
                (friend: User) => friend.id !== friendId
            );

            // Обновляем пользователя на сервере
            await axios.patch(`${API_URL}/users/${userId}`, user);

            // Обновляем данные пользователя в хранилище
            this.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Error removing friend:', error);
            throw new Error('Failed to remove friend');
        }
    };

    sendMessage = async (
        senderId: number,
        receiverId: number,
        content: string
    ) => {
        try {
            // Создаем сообщение
            const message: Message = {
                id: Date.now(), // временное решение для генерации ID
                senderId: senderId,
                receiverId: receiverId,
                content: content,
            };

            // Получаем данные получателя
            const receiverResponse = await axios.get(
                `${API_URL}/users/${receiverId}`
            );
            const receiver = receiverResponse.data;

            // Получаем данные отправителя
            const senderResponse = await axios.get(
                `${API_URL}/users/${senderId}`
            );
            const sender = senderResponse.data;

            // Добавляем сообщение к входящим сообщениям получателя
            if (!receiver.incomingMessages) {
                receiver.incomingMessages = [];
            }
            receiver.incomingMessages.push(message);

            // Добавляем сообщение к исходящим сообщениям отправителя
            if (!sender.outgoingMessages) {
                sender.outgoingMessages = [];
            }
            sender.outgoingMessages.push(message);

            // Обновляем данные получателя на сервере
            await axios.patch(`${API_URL}/users/${receiverId}`, receiver);

            // Обновляем данные отправителя на сервере
            await axios.patch(`${API_URL}/users/${senderId}`, sender);

            // Обновляем данные пользователя в хранилище, если отправитель - текущий пользователь
            if (senderId === this.user!.id) {
                this.user = sender;
                localStorage.setItem('user', JSON.stringify(sender));
            }

            return message;
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Failed to send message');
        }
    };
}

const userStore = new UserStore();
export default userStore;
