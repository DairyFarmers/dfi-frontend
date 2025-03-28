import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/shared/Sidebar';
import Navbar from '../../components/shared/Navbar';
import Dashboard from '../../components/Dashboard/Dashboard';
import Inventory from '../../components/Inventory/Inventory';
import Orders from '../../components/Orders/Orders';
import UserManagement from '../../components/Users/UserManagement';
import 'boxicons/css/boxicons.min.css';
import './Home.css';

const Content = () => {
  const activePage = useSelector(state => state.layout.activePage);
  
  const pages = {
    dashboard: <Dashboard />,
    inventory: <Inventory />,
    orders: <Orders />,
    users: <UserManagement />,
  };

  return pages[activePage] || <Dashboard />;
};

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode);
  };

  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''} ${isSidebarVisible ? '' : 'sidebar-hidden'}`}>
      <Sidebar isSidebarVisible={isSidebarVisible}/>
      <div id="content">
        <Navbar toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar}/>
        <main className="main-content">
            <Content />
        </main>
      </div>
    </div>
  );
}

export default Home;

