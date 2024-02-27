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
import userStore from '../stores/UserStore';
import { observer } from 'mobx-react-lite';
import FriendList from './FriendList';
import { Link, Route, Routes } from 'react-router-dom';
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
    getItem('Профиль', '1', <Link to="/profile"><UserOutlined /> </Link>),
    getItem('Новости', '2', <Link to="/news-feed"><AppstoreOutlined /> </Link>),
    getItem('Пользователи', '3', <Link to="/users"><UsergroupAddOutlined /> </Link>),
    getItem('Друзья', '4', <Link to="/friends"><TeamOutlined /> </Link>),
    getItem('Сообщения', '5', <Link to="/messages"><MessageOutlined /> </Link>),
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
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} onClick={handleMenuClick} />
                </Sider>
                <Layout className="site-layout">
                    <Content className="site-layout__content">
                        <Routes>
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/news-feed" element={<NewsFeed />} />
                            <Route path="/users" element={<UserList />} />
                            <Route path="/friends" element={<FriendList />} />
                            <Route path="/messages" element={<MessageList />} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
});

export default AppLayout;
