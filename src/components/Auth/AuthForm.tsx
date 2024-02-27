import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../../api/api';
import userStore from '../../stores/UserStore/UserStore';

const AuthForm: React.FC<{ type: 'register' | 'login'; switchTab: () => void }> = observer(({ type, switchTab }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values: FormData) => {
        setLoading(true);
        try {
            const url = type === 'register' ? API_URL + '/register' : API_URL + '/auth';
            const response = await axios.post(url, values);

            if (response.status === 201) {
                userStore.setUser(response.data.data);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data));
                const successMessage = type === 'register' ? 'Регистрация прошла успешно!' : 'Вход прошел успешно!';
                message.success(successMessage);
                form.resetFields();
                if (type === 'register') {
                    switchTab();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = type === 'register' ? 'Регистрация не удалась!' : 'Вход не удался!';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} name={type} onFinish={onFinish} scrollToFirstError className='auth-form'>
            {type === 'register' && (
                <Form.Item
                    name="fullName"
                    rules={[{ required: true, message: 'Пожалуйста, введите свое имя!' }]}
                >
                    <Input prefix={<IdcardOutlined />} placeholder="Имя" />
                </Form.Item>
            )}

            <Form.Item
                name="email"
                rules={[
                    { type: 'email', message: 'Некорректная почта!' },
                    { required: true, message: 'Пожалуйста, введите почту!' },
                ]}
            >
                <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
            </Form.Item>

            {type === 'register' && (
                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста, подтвердите свой пароль!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Пароли не совпадают!'),
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
                </Form.Item>
            )}

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {type === 'register' ? 'Register' : 'Login'}
                </Button>
            </Form.Item>
        </Form>
    );
});

export default AuthForm;
