import { Fragment } from 'react';
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.tsx';
import { UserProvider } from './context/UserContext.tsx';

function App() {


  //https://getalby.com/oauth?client_id=v7Lfkmjfzy&response_type=code&redirect_uri=https://localhost:5173&scope=account:read%20invoices:create%20invoices:read%20transactions:read%20balance:read%20payments:send

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


