import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BoltIcon, MusicalNoteIcon, PencilIcon } from '@heroicons/react/20/solid';
import { EyeIcon } from '@heroicons/react/24/outline';
import { NDKUser } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { analytics } from '../../firebase.config';
import logo from '../assets/stargazr.svg'
import { useUser } from '../context/UserContext';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/20/solid';
import OnBoardFlowModal from './OnBoardFlowModal'


type Props = {}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar2({ }: Props) {


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

    const navigation = [
        { name: 'Explore', current: false, routeURL: '/lyrics' },
        { name: 'Publish', current: false, routeURL: '/publish' },
        //{ name: 'Listings', current: false, routeURL: '/listings' },
    ];

    return (
        <>
            <Disclosure as='nav' className='transparent py-4'>
                {({ open }) => (
                    <>
                        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
                            <div className='flex justify-between h-16'>
                                <div className='flex'>
                                    <div className='-ml-2 mr-2 flex items-center md:hidden'>
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                                            <span className='sr-only'>Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                                            ) : (
                                                <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                    <div
                                        className='flex-shrink-0 flex items-center cursor-pointer'
                                        onClick={() => navigate('/')}
                                    >
                                        <img
                                            className='block h-16 w-auto'
                                            src={logo}
                                            alt='stagazr'
                                        />

                                        <div>
                                            <p className='font-mono text-1xl md:text-2xl md:block hidden text-white hover:text-indigo-600 ml-2'>
                                                stargazr
                                            </p>
                                        </div>
                                    </div>

                                    <div className='hidden md:ml-6 md:flex md:items-center md:space-x-4'>
                                        {/* <button
                        type='button'
                        className='relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500'
                        onClick={()=>{console.log("logout here")}}
                      >
                        <span>Sign Out</span>
                      </button> */}
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                onClick={() => navigate(item.routeURL)}
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-gray-900 text-white cursor-pointer'
                                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex items-center'>
                                    <div className='flex-shrink-0'>
                                        <button
                                            type='button'
                                            className='relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500'
                                            onClick={() => navigate('/lyrics')}
                                        >
                                            <EyeIcon
                                                className='-ml-1 mr-2 h-5 w-5'
                                                aria-hidden='true'
                                            />
                                            <span>Explore</span>
                                        </button>
                                    </div>
                                    <div className='ml-4 md:ml-4 md:flex-shrink-0 md:flex md:items-center'>
                                        {user === undefined ? (
                                            <button
                                                type='button'
                                                className=' hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500'
                                                //className="cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  bg-white text-black focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                                                onClick={() => setShowLoginModal(true)}
                                            >
                                                <MusicalNoteIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                                                <span>Get Started</span>
                                            </button>
                                        ) : (
                                            <>
                                                {user.profile?.image ? (
                                                    <div className='h-10 flex' onClick={() => navigate('/home')}>
                                                        <img src={user.profile?.image} className='rounded-full border border-gray-100 shadow-sm'></img>
                                                    </div>) : (
                                                    <div className='h-10 flex' onClick={() => navigate('/home')}>
                                                        <img src={localStorage.getItem("profile_picture") || "/placeholders/placeholder-profile.png"} className='rounded-full border border-black shadow-sm'></img>
                                                    </div>)}

                                            </>
                                        )}

                                        {/* Profile dropdown */}
                                        <Menu as='div' className='ml-3 relative'>
                                            {({ open }) => (
                                                <>
                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        enter='transition ease-out duration-200'
                                                        enterFrom='transform opacity-0 scale-95'
                                                        enterTo='transform opacity-100 scale-100'
                                                        leave='transition ease-in duration-75'
                                                        leaveFrom='transform opacity-100 scale-100'
                                                        leaveTo='transform opacity-0 scale-95'
                                                    >
                                                        <Menu.Items
                                                            static
                                                            className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                                                        ></Menu.Items>
                                                    </Transition>
                                                </>
                                            )}
                                        </Menu>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className='md:hidden'>
                            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        onClick={() => navigate(item.routeURL)}
                                        className={classNames(
                                            item.current
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block px-3 py-2 rounded-md text-base font-medium cursor-pointer'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <OnBoardFlowModal handleCancel={handleCancelLoginModal} handleLogin={handleLogin} showLoginModal={showLoginModal} />
        </>
    );
}