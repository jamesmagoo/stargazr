import { Fragment } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LyricsView from './components/LyricsView.tsx';
import Navbar from './components/Navbar.tsx';
import { UserProvider } from './context/UserContext.tsx';
import './index.css';
import Home from "./pages/Home.tsx";
import PublishLyricsPage from './pages/PublishLyricsPage.tsx';
import UserPage from "./pages/UserPage.tsx";

function App() {

  return (
    <BrowserRouter>
    <Fragment>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/lyric/:eventID' element={<LyricsView />} />
          <Route path='/publish' element={<PublishLyricsPage />} />
          <Route path='/user' element={<UserPage />} />
        </Routes>
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
    </BrowserRouter>
  )
}

export default App


