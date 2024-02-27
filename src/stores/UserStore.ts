import { makeAutoObservable, runInAction } from 'mobx';
import { Message, User } from '../types';
import axios from 'axios';
import { API_URL } from '../api/api';

class UserStore {
    user: User | null = null;
    loggedIn = false;

    constructor() {
        makeAutoObservable(this);
        this.checkToken();
        this.checkUser();
    }

    // Метод для установки пользователя в localStorage
    setUser = (user: User) => {
        this.user = user;
        this.loggedIn = true;
        localStorage.setItem('token', user?.token || '');
        localStorage.setItem('user', JSON.stringify(user));
    };

    // Метод для выхода пользователя
    logout = () => {
        this.user = null;
        this.loggedIn = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Метод для проверки токена
    checkToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            this.loggedIn = true;
        }
    };

    // Метод для проверки авторизованного пользователя
    checkUser = () => {
        const user = localStorage.getItem('user');
        if (user) {
            this.user = JSON.parse(user);
        }
    };

    // Метод для обновления аватара пользователя по ID
    updateUserAvatar = async (id: number, avatar: string) => {
        try {
            const response = await axios.patch(`${API_URL}/users/${id}`, {
                avatar,
            });
            runInAction(() => {
                const updatedUser = response.data;
                this.user = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser;
            });
        } catch (error) {
            console.error('Error updating user avatar:', error);
            throw new Error('Failed to update user avatar');
        }
    };

    // Метод для добавления друга по ID
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
                const friendResponse = await axios.get(
                    `${API_URL}/users/${friendId}`
                );
                const friend = friendResponse.data;
                user.friends.push(friend);

                await axios.patch(`${API_URL}/users/${userId}`, user);

                runInAction(() => {
                    this.user = user;
                });
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                throw new Error('Friend with the same ID already exists');
            }
        } catch (error) {
            console.error('Error adding friend:', error);
            throw new Error('Failed to add friend');
        }
    };

    // Метод для удаления друга по ID
    removeFriend = async (userId: number, friendId: number) => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}`);
            const user = response.data;

            if (!user.friends) {
                throw new Error('User has no friends to remove');
            }

            // Фильтруем массив друзей, оставляя только тех, у кого id не совпадает с friendId
            user.friends = user.friends.filter(
                (friend: User) => friend.id !== friendId
            );

            await axios.patch(`${API_URL}/users/${userId}`, user);

            runInAction(() => {
                this.user = user;
            });

            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Error removing friend:', error);
            throw new Error('Failed to remove friend');
        }
    };

    // Метод для отправки сообщения
    sendMessage = async (
        senderId: number,
        receiverId: number,
        content: string
    ) => {
        try {
            const message: Message = {
                id: Date.now(),
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

            if (!receiver.incomingMessages) {
                receiver.incomingMessages = [];
            }
            receiver.incomingMessages.push(message);

            if (!sender.outgoingMessages) {
                sender.outgoingMessages = [];
            }
            sender.outgoingMessages.push(message);

            await axios.patch(`${API_URL}/users/${receiverId}`, receiver);
            await axios.patch(`${API_URL}/users/${senderId}`, sender);

            // Обновляем данные пользователя в хранилище, если отправитель - текущий пользователь
            runInAction(() => {
                if (senderId === this.user!.id) {
                    this.user = sender;
                    localStorage.setItem('user', JSON.stringify(sender));
                }
            });

            return message;
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Failed to send message');
        }
    };
}

const userStore = new UserStore();
export default userStore;
