import { Fragment } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './context/UserContext.tsx';
import './index.css';
import Home from "./pages/Home.tsx";
import PublishLyricsPage from './pages/PublishLyricsPage.tsx';
import UserPage2 from "./pages/UserPage2.tsx";
import LyricsDetailPage from './pages/LyricsDetailPage.tsx';
import Splash2 from './pages/Splash2.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import Footer from './components/Footer.tsx';
import Navbar2 from './components/Navbar2.tsx';

function App() {

  return (
    <BrowserRouter>
    <Fragment>
      <UserProvider>
        <Navbar2 />
        <Routes>
          <Route path='/' element={<Splash2 />} />
          <Route path='/lyrics' element={<Home />} />
          <Route path='/lyrics/lyric/:eventID' element={<LyricsDetailPage />} />
          <Route path='/publish' element={<PublishLyricsPage />} />
          <Route path='/home' element={<PrivateRoute />}>
              <Route path='/home' element={<UserPage2 />} />
            </Route>
        </Routes>
        <Footer/>
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


