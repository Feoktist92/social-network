import axios from 'axios';
import { User } from '../types';

export const API_URL = 'https://72f58616bc34db15.mokky.dev';

export const getUsers = async (): Promise<User[]> => {
    try {
        const users = await axios.get<User[]>(`${API_URL}/users`);
        return users.data;
    } catch (error) {
        throw new Error('Failed to get users');
    }
};

export const getUserById = async (userId: number) => {
    try {
        const response = await axios.get(API_URL + '/users');

        const users = response.data;
        const user = users.find((user: User) => user.id === userId);

        if (user) {
            return user;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user by id:', error);
        throw new Error('Failed to fetch user by id');
    }
};
