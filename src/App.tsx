import { Fragment } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.tsx';
import { UserProvider } from './context/UserContext.tsx';
import './index.css';
import Home from "./pages/Home.tsx";
import PublishLyricsPage from './pages/PublishLyricsPage.tsx';
import UserPage from "./pages/UserPage.tsx";
import HomePageView from './pages/HomePageView.tsx';
import LyricsDetailPage from './pages/LyricsDetailPage.tsx';
import Splash2 from './pages/Splash2.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import Footer from './components/Footer.tsx';

function App() {

  return (
    <BrowserRouter>
    <Fragment>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Splash2 />} />
          <Route path='/lyrics' element={<Home />} />
          <Route path='/lyrics/lyric/:eventID' element={<LyricsDetailPage />} />
          <Route path='/publish' element={<PublishLyricsPage />} />
          <Route path='/home' element={<PrivateRoute />}>
              <Route path='/home' element={<UserPage />} />
            </Route>
          <Route path='/test' element={<HomePageView />} />
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


