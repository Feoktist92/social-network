import { observer } from 'mobx-react-lite';
import { List, Card, Button, Popconfirm, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { EditOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons'; // Импортируем иконки
import CommentForm from './CommentForm';
import newsStore from '../stores/NewsStore/NewsStore';
import { Comment, Post } from '../types';
import userStore from '../stores/UserStore/UserStore';

const NewsFeed = observer(() => {
    const { user } = userStore;
    const { news } = newsStore;

    useEffect(() => {
        newsStore.fetchNews();
    }, []);

    const [editingComments, setEditingComments] = useState<{ [key: number]: boolean }>({});

    const handleEditButtonClick = (commentId: number) => {
        setEditingComments({ ...editingComments, [commentId]: !editingComments[commentId] });
    };

    const handleEditComment = (postId: number, commentId: number, newContent: string) => {
        const originalComment = newsStore.findCommentById(postId, commentId);

        if (!originalComment) {
            console.error('Original comment not found');
            return;
        }

        const contentToSave = newContent.trim() !== '' ? newContent : originalComment.content;

        newsStore.editCommentLocally(postId, commentId, contentToSave);
        newsStore.updateNews();
        setEditingComments({ ...editingComments, [commentId]: false });
    };

    const handleDeleteComment = (postId: number, commentId: number) => {
        newsStore.deleteCommentLocally(postId, commentId);
        newsStore.updateNews();
    };

    return (
        <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={news}
            renderItem={(post: Post) => (
                <List.Item key={post.id}>
                    <Card title={post.title}>{post.content}</Card>
                    <List
                        dataSource={post.comments}
                        renderItem={(comment: Comment) => (
                            <List.Item key={comment.id}>
                                {editingComments[comment.id] ? (
                                    <Form.Item className='news-feed__form-item'>
                                        <Input.TextArea
                                            defaultValue={comment.content}
                                            onBlur={(e) => handleEditComment(post.id, comment.id, e.target.value)}
                                            size='large'
                                        />
                                    </Form.Item>
                                ) : (
                                    <p className='news-feed__comment'>
                                        <b>{comment.author}:</b>
                                        {comment.content}
                                    </p>
                                )}
                                {comment.author === user?.fullName && (
                                    <>
                                        {editingComments[comment.id] ? (
                                            <Button
                                                className='news-feed__edit-comment-button'
                                                icon={<CheckOutlined />}
                                                onClick={() => handleEditComment(post.id, comment.id, comment.content)}
                                            />
                                        ) : (
                                            <Button
                                                className='news-feed__edit-comment-button'
                                                icon={<EditOutlined />}
                                                onClick={() => handleEditButtonClick(comment.id)}
                                            />
                                        )}
                                        <Popconfirm
                                            title="Are you sure you want to delete this comment?"
                                            onConfirm={() => handleDeleteComment(post.id, comment.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button icon={<CloseCircleOutlined />} />
                                        </Popconfirm>
                                    </>
                                )}
                            </List.Item>
                        )}
                    />
                    <CommentForm postItemId={post.id} />
                </List.Item >
            )}
        />
    );
});

export default NewsFeed;
