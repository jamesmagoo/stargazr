import { Fragment } from 'react';
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.tsx';
import { UserProvider } from './context/UserContext.tsx';

function App() {



  return (
    <Fragment>
      <UserProvider>
      <Navbar/>
      <Outlet />
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </UserProvider>
    </Fragment>
  )
}

export default App


