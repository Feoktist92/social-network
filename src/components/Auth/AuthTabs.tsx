import React, { useState } from 'react';
import { Tabs, TabsProps } from 'antd';
import AuthForm from './AuthForm';

const AuthTabs: React.FC = () => {
    const [activeTabKey, setActiveTabKey] = useState<string>('1');

    const switchTab = (key: string) => {
        setActiveTabKey(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Вход',
            children: <AuthForm switchTab={() => switchTab('2')} type="login" />,
        },
        {
            key: '2',
            label: 'Регистрация',
            children: <AuthForm switchTab={() => switchTab('1')} type="register" />,
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
