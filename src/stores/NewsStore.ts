import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { Post, Comment } from '../types';
import { API_URL } from '../api/api';

class NewsStore {
    news: Post[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    // Загрузка новостей c сервера
    async fetchNews() {
        try {
            const response = await axios.get(API_URL + '/newsfeed');
            runInAction(() => {
                this.news = response.data;
            });
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    // Найти комментарий по ID поста и ID комментария
    findCommentById(
        postItemId: number,
        commentId: number
    ): Comment | undefined {
        return this.news
            .find((post) => post.id === postItemId)
            ?.comments.find((comment) => comment.id === commentId);
    }

    // Добавление комментария по ID поста
    addCommentLocally(postId: number, comment: string, author: string) {
        const newsItem = this.news.find((item) => item.id === postId);
        if (newsItem) {
            const newComment: Comment = {
                id: newsItem.comments.length + 1,
                postId: newsItem.id,
                author: author,
                content: comment,
            };
            newsItem.comments.push(newComment);
        }
    }

    // Редактирование комментария по ID поста и ID комментария
    editCommentLocally(postId: number, commentId: number, newContent: string) {
        const post = this.news.find((post) => post.id === postId);
        if (post) {
            const comment = post.comments.find(
                (comment) => comment.id === commentId
            );
            if (comment) {
                comment.content = newContent;
            }
        }
    }

    // Удаление комментария по ID поста и ID комментария
    deleteCommentLocally(postItemId: number, commentId: number) {
        const post = this.news.find((item) => item.id === postItemId);
        if (post) {
            post.comments = post.comments.filter(
                (comment) => comment.id !== commentId
            );
        }
    }

    // Обновление новостей на сервере
    async updateNews() {
        try {
            const response = await axios.patch(
                API_URL + '/newsfeed',
                this.news
            );
            runInAction(() => {
                this.news = response.data;
            })
        } catch (error) {
            console.error('Error updating news:', error);
        }
    }
}

const newsStore = new NewsStore();
export default newsStore;
