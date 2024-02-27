import { Layout, Menu, Typography } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    AppstoreOutlined,
    UsergroupAddOutlined,
    TeamOutlined,
    MessageOutlined,
    UserSwitchOutlined
} from '@ant-design/icons';
import UserProfile from './UserProfile';
import { useState, useEffect } from 'react';
import NewsFeed from './NewsFeed';
import type { MenuProps } from 'antd';
import userStore from '../stores/UserStore/UserStore';
import { observer } from 'mobx-react-lite';
import FriendList from './FriendList';
import { Link } from 'react-router-dom';
import MessageList from './MessageList';
import UserList from './UserList';

type MenuItem = Required<MenuProps>['items'][number];
const { Header, Sider, Content } = Layout;
const { Title } = Typography

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Профиль', '1', <UserOutlined />),
    getItem('Лента новостей', '2', <AppstoreOutlined />),
    getItem('Пользователи', '3', <TeamOutlined />),
    getItem('Друзья', '4', <UsergroupAddOutlined />),
    getItem('Сообщения', '5', <MessageOutlined />),
];

const AppLayout = observer(() => {
    const { logout } = userStore;
    const [selectedMenuItem, setSelectedMenuItem] = useState<string>();
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleMenuClick = ({ key }: { key: React.Key }) => {
        setSelectedMenuItem(key?.toString() ?? '');
    };

    let content;
    switch (selectedMenuItem) {
        case '1':
            content = <UserProfile />;
            break;
        case '2':
            content = <NewsFeed />;
            break;
        case '3':
            content = <UserList />;
            break;
        case '4':
            content = <FriendList />;
            break;
        case '5':
            content = <MessageList />;
            break;
        default:
            content = <UserProfile />;
    }

    return (
        <>
            <Header className='header' >
                <Title style={{ color: 'white', margin: 0 }} level={3}>
                    Социальная сеть{' '}
                    <UserSwitchOutlined />
                </Title>
                <Link className="logout-button" to="/">
                    <LogoutOutlined color='primary' onClick={logout} />
                </Link>

            </Header>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    width={isMobile ? 68 : 200}
                    collapsedWidth="0"
                >
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} onClick={handleMenuClick} />
                </Sider>
                <Layout className="site-layout">
                    <Content className="site-layout__content">
                        {content}
                    </Content>
                </Layout>
            </Layout>
        </>
    );
});

export default AppLayout;
