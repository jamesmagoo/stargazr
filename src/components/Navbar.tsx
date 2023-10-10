import { BoltIcon, MusicalNoteIcon, PencilIcon } from '@heroicons/react/20/solid';
import { EyeIcon } from '@heroicons/react/24/outline';
import { NDKUser } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { analytics } from '../../firebase.config';
import logo from '../assets/1eye.svg'
import { useUser } from '../context/UserContext';
import OnBoardFlowModal from './OnBoardFlowModal'


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
            <nav className='justify-between mt-6'>
                <Link to={`/`}>
                    <div className="items-center justify-between font-mono text-3xl flex flex-row">
                        {/* <img
                            className='block h-20 w-auto'
                            src={logo}
                            alt='Workflow'
                        /> */}
                        🔭stargazr
                    </div>
                </Link>


                <div className='items-center flex flex-row'>
                    <div className='items-center flex flex-row'>
                    <Link to={`publish`} >
                        <div className="cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-white bg-gradient-to-r from-indigo-500 to-indigo-950  focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2">
                            <PencilIcon className='mr-2 h-5 w-5' />
                            <div className='text-lg'>Publish</div>
                        </div>
                    </Link>

                    <Link to={`lyrics`}>
                        <div className="cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-white bg-gradient-to-r from-indigo-500 to-indigo-950  focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2">
                            <EyeIcon className='mr-2 h-5 w-5' />
                            <div >Explore</div>
                        </div>
                    </Link>
                    </div>



                    {user === undefined ? (
                        <button
                            type='button'
                            className="cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  bg-white text-black focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                            onClick={() => setShowLoginModal(true)}
                        >
                            <MusicalNoteIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                            <span>Get Started</span>
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
                </div>
            </nav>
            <OnBoardFlowModal handleCancel={handleCancelLoginModal} handleLogin={handleLogin} showLoginModal={showLoginModal} />

        </>
    )
}

export default Navbar