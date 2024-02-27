import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { Post, Comment } from '../../types';
import { API_URL } from '../../api/api';

class NewsStore {
    news: Post[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async fetchNews() {
        try {
            const response = await axios.get(API_URL + '/newsfeed');
            this.news = response.data;
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    findCommentById(
        postItemId: number,
        commentId: number
    ): Comment | undefined {
        const post = this.news.find((post) => post.id === postItemId);
        if (post) {
            return post.comments.find((comment) => comment.id === commentId);
        }
        return undefined;
    }

    addCommentLocally(newsItemId: number, comment: string, author: string) {
        const newsItem = this.news.find((item) => item.id === newsItemId);
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

    deleteCommentLocally(postItemId: number, commentId: number) {
        const post = this.news.find((item) => item.id === postItemId);
        if (post) {
            post.comments = post.comments.filter(
                (comment) => comment.id !== commentId
            );
        }
    }

    async updateNews() {
        try {
            const response = await axios.patch(
                API_URL + '/newsfeed',
                this.news
            );
            this.news = response.data;
        } catch (error) {
            console.error('Error updating news:', error);
        }
    }
}

const newsStore = new NewsStore();
export default newsStore;
