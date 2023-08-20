import { BoltIcon } from '@heroicons/react/20/solid';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import { Link } from 'react-router-dom'


const Navbar = () => {
    const { user, login } = useUser();
    const [showLoginModal, setShowLoginModal] = useState(false);


    const handleCancelLoginModal = () => {
        setShowLoginModal(false);
    };

    const handleLoginSubmit = async () => {
        try {
            await login()
            setShowLoginModal(false)

        } catch (error) {
            console.log(error)
            toast.error("Problem logging in")
            setShowLoginModal(false)
        }
    };

    // Use the useEffect hook to listen for changes to the 'user' object
    useEffect(() => {
        if (user) {
            toast.success(`Welcome ${user.npub}`);
        }
    }, [user]);

    return (
        <>
            <nav className='justify-between'>
                <Link to={`/`}>
                <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                    <p className="fixed left-0 top-0 flex w-full justify-center border-b border-black bg-white pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:p-4">
                        <b>stargazer -&nbsp; </b> explore lyrics & poetry
                    </p>
                </div>
                </Link>
                <ul>
                    <li>
                        <Link to={`publish`}>Publish Lyrics</Link>
                    </li>
                    <li>
                        <Link to={`user`}>Your Stuff</Link>
                    </li>
                </ul>


                <button
                    type='button'
                    className='relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-200'
                    onClick={() => setShowLoginModal(true)}
                >
                    <BoltIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                    <span>Login</span>
                </button>
            </nav>
            <p>{user?.npub}</p>
            <LoginModal handleCancel={handleCancelLoginModal} handleSubmit={handleLoginSubmit} showLoginModal={showLoginModal} />
        </>
    )
}

export default Navbar