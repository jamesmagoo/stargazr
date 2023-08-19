import { BoltIcon } from '@heroicons/react/20/solid';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { Fragment, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginModal from './components/LoginModal';
import Main from './components/Main';



function App() {

    const [showLoginModal, setShowLoginModal] = useState(false);
    const { loginWithNip07 } = useNDK();

    const handleCancel = () => {
        setShowLoginModal(false);
    };

    const handleLoginSubmit = async () => {
      try {
        const user = await loginWithNip07();
        user
        if(user){
          toast.success(`Welcome ${user.npub}`)
          setShowLoginModal(false)
        } else {
          toast.error("Problem logging in")
          setShowLoginModal(false)
        }
      } catch (error) {
        toast.error("Problem logging in")
        setShowLoginModal(false)
      }
      
    };


  return (
    <Fragment>
      <nav className='justify-between'>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-black bg-white pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:p-4">
            <b>stargazer -&nbsp; </b> explore lyrics & poetry
          </p>
        </div>

        <button
          type='button'
          className='relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-200'

          onClick={() => setShowLoginModal(true)}
        >
          <BoltIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
          <span>Login</span>
        </button>
      </nav>
      <Main />
      
      <LoginModal handleCancel={handleCancel} handleSubmit={handleLoginSubmit} showLoginModal={showLoginModal} />
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
    </Fragment>
  )
}

export default App
