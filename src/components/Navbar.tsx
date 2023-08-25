import { BoltIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../context/UserContext';
import LoginModal from './LoginModal';
import { NDKUser } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-react';


const Navbar = () => {
    const { user, setUser, logout } = useUser();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { ndk, loginWithNip07 } = useNDK();

    const handleCancelLoginModal = () => {
        setShowLoginModal(false);
    };

    const handleLogin = async () => {
        try {
            await login()
            setShowLoginModal(false)
        } catch (error) {
            console.log(error)
            toast.error("Problem logging in")
            setShowLoginModal(false)
        }
    };

    const login = async () => {
        let newUser: NDKUser | undefined
        try {
            let res = await loginWithNip07()
            if (res != undefined) {
                res.signer.user().then(async (user) => {
                    if (!!user.npub) {
                        newUser = ndk?.getUser({ npub: `${user.npub}` })
                        await newUser?.fetchProfile()
                        setUser(newUser)
                        const message = newUser?.profile ? `Welcome ${newUser.profile.displayName}` : 'Welcome';
                        toast.success(message)
                        setUser(newUser)
                        console.log(newUser)
                    }
                }).catch((err) => {
                    console.log("Problem logging in: ", err)
                })
            }

        } catch (err) {
            console.log(err)
        }
    }

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
                {/* <ul>
                    <li>
                        <Link to={`publish`}>Publish Lyrics</Link>
                    </li>
                    <li>
                        <Link to={`user`}>Your Stuff</Link>
                    </li>
                </ul> */}


                {user === undefined ? (
                    <button
                        type='button'
                        className='relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-200'
                        onClick={() => setShowLoginModal(true)}
                    >
                        <BoltIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                        <span>Login</span>
                    </button>
                ) : (
                    <div className='flex flex-row items-center space-x-10'>
                        <div className='h-20 flex'>
                            <img src={user.profile?.image} className='rounded-full border border-gray-100 shadow-sm'></img>
                        </div>
                        <p>{user.profile?.displayName}</p>
                        <button
                            type='button'
                            className='relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-red-500 hover:bg-red-200'
                            onClick={() => { logout() }} // Assuming you have a function to handle logout
                        >
                            <BoltIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' /> {/* Replace with your logout icon */}
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </nav>
            <LoginModal handleCancel={handleCancelLoginModal} handleSubmit={handleLogin} showLoginModal={showLoginModal} />
        </>
    )
}

export default Navbar