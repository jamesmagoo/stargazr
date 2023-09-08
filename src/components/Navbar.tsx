import { BoltIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../context/UserContext';
import LoginModal from './LoginModal';
import { NDKUser } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { logEvent } from 'firebase/analytics'
import { analytics } from '../../firebase.config';

const Navbar = () => {
    const { user, setUser, logout } = useUser();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { ndk, loginWithNip07, loginWithSecret } = useNDK();
    const navigate = useNavigate();


    const handleCancelLoginModal = () => {
        setShowLoginModal(false);
    };

    const handleLogin = async () => {
        // first check if there is a wallet installed for login
        // then check try and use the local storage keys 

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
        try {
            await tryLogin()
        } catch (err) {

        }
    }

    const tryLogin = async () => {
        console.log("logging in with extension...")
        let newUser: NDKUser | undefined
        let res;
        try {
            res = await loginWithNip07()
        } catch (err) {
            console.log(err)
            console.log("attempting pk sign-in")
            let nsec = localStorage.getItem("nsec")
            if (nsec?.length != 0 && nsec != null) {
                await loginWithPrivateKey(nsec)
            } else {
                // TODO need to add a modal to accept a users npub/nsec for login
                // for the case where there is no local stroage but they have keys
                toast.info("Please create an account!")
            }
        }

        if (res != undefined) {
            res.signer.user().then(async (user) => {
                if (!!user.npub) {
                    newUser = ndk?.getUser({ npub: `${user.npub}` })
                    console.log(`Geting User for npub: ${user.npub}`)
                    await newUser?.fetchProfile()
                    setUser(newUser)
                    const message = newUser?.profile ? `Welcome ${newUser.profile.displayName}` : 'Welcome';
                    logEvent(analytics, "nip07_extension_login_success")
                    toast.success(message)
                    console.log(newUser)
                }
            }).catch((err) => {
                console.log("Problem logging in: ", err)
            })
        }
    }

    const loginWithPrivateKey = async (nsec: string) => {
        console.log("logging in with the users private key")
        let newUser: NDKUser | undefined
        let res
        try {
            res = await loginWithSecret(nsec)
            if (res != undefined) {
                res.signer.user().then(async (user) => {
                    if (!!user.npub) {
                        newUser = ndk?.getUser({ npub: `${user.npub}` })
                        setUser(newUser)
                        const message = newUser?.profile ? `Welcome ${newUser.profile.displayName}` : 'Welcome';
                        toast.success(message)
                        console.log(newUser)
                    }
                })
                    .catch((err) => {
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
                            <b>stargazr -&nbsp; </b> explore lyrics
                        </p>
                    </div>
                </Link>
                <ul>
                    <li>
                        <Link to={`publish`}>Publish Lyrics</Link>
                    </li>
                    <li>
                        <Link to={`lyrics`}>View Lyrics</Link>
                    </li>
                </ul>


                {user === undefined ? (
                    <button
                        type='button'
                        className='relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-200'
                        onClick={() => setShowLoginModal(true)}
                    >
                        <BoltIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                        <span>Enter</span>
                    </button>
                ) : (
                    <div className='flex flex-row items-center space-x-10 cursor-pointer' onClick={() => navigate('/home')}>
                        {user.profile?.image ? (
                            <div className='h-20 flex pr-5'>
                                <img src={user.profile?.image} className='rounded-full border border-gray-100 shadow-sm'></img>
                            </div>) : (
                            <div className='h-20 flex pr-5'>
                                <img src={localStorage.getItem("profile_picture") || "/placeholders/placeholder-profile.png"} className='rounded-full border border-black shadow-sm'></img>
                            </div>)}
                        Profile
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