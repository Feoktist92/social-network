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
import userStore from '../stores/UserStore';
import { observer } from 'mobx-react-lite';
import FriendList from './FriendList';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import MessageList from './MessageList';
import UserList from './UserList';
import NewsFeed from './NewsFeed';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppLayout = observer(() => {
    const { logout } = userStore;
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { pathname } = useLocation();

    // Установка selectedMenuItem на основе пути
    const selectedMenuItem = pathname.substring(1);

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

    return (
        <>
            <Header className='header'>
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
                    <Menu theme="dark" mode="inline" selectedKeys={[selectedMenuItem]} items={[
                        { key: 'profile', icon: <UserOutlined />, label: <Link to="/profile">Профиль</Link> },
                        { key: 'news-feed', icon: <AppstoreOutlined />, label: <Link to="/news-feed">Новости</Link> },
                        { key: 'users', icon: <UsergroupAddOutlined />, label: <Link to="/users">Пользователи</Link> },
                        { key: 'friends', icon: <TeamOutlined />, label: <Link to="/friends">Друзья</Link> },
                        { key: 'messages', icon: <MessageOutlined />, label: <Link to="/messages">Сообщения</Link> },
                    ]} />
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
