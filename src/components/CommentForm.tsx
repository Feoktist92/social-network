import { observer } from 'mobx-react-lite';
import { Form, Button, Input, message } from 'antd';
import userStore from '../stores/UserStore/UserStore';
import newsStore from '../stores/NewsStore/NewsStore';

const { TextArea } = Input;

interface CommentFormProps {
    postItemId: number;
}

const CommentForm = observer(({ postItemId }: CommentFormProps) => {
    const { user } = userStore;
    const [form] = Form.useForm();

    const onFinish = async (values: { comment: string }) => {
        try {
            if (!user) {
                message.error('You must be logged in to add a comment');
                return;
            }
            newsStore.addCommentLocally(postItemId, values.comment, user.fullName);
            await newsStore.updateNews();

            form.resetFields();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return user ? (
        <Form form={form} onFinish={onFinish}>
            <Form.Item name="comment">
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Добавить комментарий
                </Button>
            </Form.Item>
        </Form>
    ) : null;
});

export default CommentForm;
