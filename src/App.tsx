import { observer } from 'mobx-react-lite';
import AuthTabs from './components/Auth/AuthTabs';
import userStore from './stores/UserStore/UserStore';
import AppLayout from './components/Layout';
import { Route, Routes } from 'react-router-dom';



const App = observer(() => {
  const { loggedIn } = userStore;
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={loggedIn ? <AppLayout /> : <AuthTabs />} />
      </Routes>
    </div>
  );
});

export default App;
