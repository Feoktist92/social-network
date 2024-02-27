import React, { useState } from 'react';
import { Tabs, TabsProps } from 'antd';
import AuthForm from './AuthForm';

const AuthTabs: React.FC = () => {
    const [activeTabKey, setActiveTabKey] = useState<string>('1');

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Вход',
            children: <AuthForm type="login" />,
        },
        {
            key: '2',
            label: 'Регистрация',
            children: <AuthForm type="register" />,
        },
    ];

    return (
        <div className='auth-tabs-container'>
            <Tabs
                size='large'
                type='line'
                centered
                activeKey={activeTabKey}
                onChange={setActiveTabKey}
                items={items} />
        </div>

    );
};

export default AuthTabs;
