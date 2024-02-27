import { observer } from 'mobx-react-lite';
import AuthTabs from './components/Auth/AuthTabs';
import userStore from './stores/UserStore';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';



const App = observer(() => {
  const { loggedIn } = userStore;
  return (
    <Routes>
      <Route path="*" element={loggedIn ? <AppLayout /> : <AuthTabs />} />
    </Routes>
  );
});

export default App;
