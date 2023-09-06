import { KeyIcon } from '@heroicons/react/20/solid';
import { NDKEvent, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';


type Props = {}

type KeyPair = {
    npub: string;
    nsec: string;
    hexpub: string;
    hexpriv: string;
}

function OnBoard({ }: Props) {

    /**
     * New Plan....
     * 
     * 1. User provides username. trigger key gen and login under the hood
     * 2. clicks create account
     * 3. login user using the loginWithSecret
     * 4. set user in context to be used later 
     * 5. when to publish the kind 0 metatdata event? 
     * 6. probabaly need to save in local storage until the user sorts out key backup / alby
     * 
     */


    const { ndk, loginWithSecret } = useNDK();
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [, setKeys] = useState<KeyPair>({
        npub: "",
        nsec: "",
        hexpub: "",
        hexpriv: "",
    })

    const [formData, setFormData] = useState({
        username: '',
        profilePic: null,
    });

    const [loading, setLoading] = useState<boolean>(false);
    // const isMounted = useRef(false)

    // useEffect(() => {
    //     const bootUpLogin = async () => {
    //         // generate keys and login user 
    //         const privatekeyHex = generatePrivateKey()
    //         const publickeyHex = getPublicKey(privatekeyHex)
    //         // encode keys 
    //         let encodedNsec = nip19.nsecEncode(privatekeyHex)
    //         let encodedNpub = nip19.npubEncode(publickeyHex)
    //         await loginWithSecret(encodedNsec)
    //         setKeys({ hexpub: publickeyHex, hexpriv: privatekeyHex, npub: encodedNpub, nsec: encodedNsec })
    //     }

    //     const storedNsec = localStorage.getItem('nsec');
    //     const storedProfileName = localStorage.getItem('profileName')
    //     if (storedNsec) {
    //         let hexprivkey = convertKeyToHex(storedNsec)
    //         let hexpubkey = getPublicKey(hexprivkey)
    //         let encodedNpub = nip19.npubEncode(hexpubkey)
    //         setKeys(() => ({ hexpriv: hexprivkey, hexpub: hexpubkey, npub: encodedNpub, nsec: storedNsec }));
    //         setShowKeys(true)
    //     } else {
    //         if (!isMounted.current) {
    //             bootUpLogin();
    //             isMounted.current = true;
    //         }
    //     }

    //     if (storedProfileName) {
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             username: storedProfileName,
    //         }))
    //     }
    // }, []);

    // TODO Function to update the progress width
    // const updateProgress = (percentage: number) => {
    //     setProgressWidth(percentage);
    // };

    const onChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createNostrProfile = async (e: any) => {
        e.preventDefault();
        const storedNsec = localStorage.getItem('nsec');
        if (storedNsec) {
            setLoading(false)
        } else {
            if (formData.username.length > 0) {
                setLoading(true)
                // generate keys and login user 
                const privatekeyHex = generatePrivateKey()
                const publickeyHex = getPublicKey(privatekeyHex)
                // encode keys 
                let encodedNsec = nip19.nsecEncode(privatekeyHex)
                let encodedNpub = nip19.npubEncode(publickeyHex)
                // save to local storage
                localStorage.setItem("nsec", privatekeyHex)
                localStorage.setItem("profileName", formData.username)   
                let newUser;        
                loginWithSecret(encodedNsec).then((res) =>{
                    if(res?.signer){
                        res.signer.user().then(async (user) => {
                            if (!!user.npub) {
                                newUser = ndk?.getUser({ npub: `${user.npub}` })
                                newUser?.profile?.displayName == formData.username
                                setUser(newUser)
                                console.log(newUser)
                            }
                        })
                        publishNewUserProfile(res?.signer, publickeyHex)
                    }
                }).catch((err)=>{
                    console.log("another fucking problem:", err)
                })
                setKeys({ hexpub: publickeyHex, hexpriv: privatekeyHex, npub: encodedNpub, nsec: encodedNsec })
                await new Promise(resolve => setTimeout(resolve, 1500));
                setLoading(false)
                navigate("/home")
            } else {
                toast.info("Add your profile name")
                return;
            }
        }
    }
  
    const publishNewUserProfile = async (signer: NDKPrivateKeySigner, publickey: string) => {
        console.log("publishing kind 0")
        const event = new NDKEvent(ndk);
        const user = {
            "name": formData.username,
            // "picture": null,
            // "about" : null
        }
        event.kind = 0;
        event.content = JSON.stringify(user),
        event.created_at = Math.floor(Date.now() / 1000);
        event.pubkey = publickey;
        let nostrevent = await event.toNostrEvent();
        event.sig = await signer.sign(nostrevent)
        console.log(event)
        try {        
            let publishedProfileEvent = await event.publish()
            console.log(publishedProfileEvent)
            toast.update("Account created!")
            toast.success("Welcome to Stargazr on Nostr!")
        } catch {
            toast.error("Problem creating your profile")
        }
    }


    // function convertKeyToHex(value: string): string {
    //     if (value && value.startsWith("nsec")) {
    //         let decodedPrivateKey = nip19.decode(value);
    //         return decodedPrivateKey.data as string;
    //     }
    //     if (value && value.startsWith("npub")) {
    //         let decodedPublicKey = nip19.decode(value);
    //         return decodedPublicKey.data as string;
    //     }
    //     return value;
    // }

    // const loginWithGeneratedKeys = async (nsec: string) => {
    //     let newUser: NDKUser | undefined
    //     try {
    //         let res = await loginWithSecret(nsec)
    //         if (res != undefined) {
    //             res.signer.user().then(async (user) => {
    //                 if (!!user.npub) {
    //                     newUser = ndk?.getUser({ npub: `${user.npub}` })
    //                     setUser(newUser)
    //                     const message = formData.username ? `Welcome ${formData.username}` : 'Welcome';
    //                     toast.success(message)
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log("Problem logging in: ", err)
    //             })
    //         }

    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    return (
        <div className="splash-card w-full h-max border-2 border-black rounded-lg p-2 shadow-lg shadow-slate-500 pb-4">
            <div className='flex w-full justify-center mb-6'>
                <h1 className='font-extralight text-5xl'>
                    It's new, but <span className='italic underline font-light underline-offset-8'>simple</span>.
                </h1>
            </div>
            <div className='flex flex-col items-center space-y-3'>
                <div className='italic font-light text-gray-500 text-lg'>Get started with just a profile name!</div>
              
                <form className='w-full p-4'>
                    <div className='text-2xl font-normal mb-6'>Create Profile
                        <p className='text-sm text-slate-600 font-normal'>Some information about yourself.</p>
                    </div>
                    <div className='items-start w-full flex flex-col mt-1 mb-5'>

                        <label
                            htmlFor="username"
                            className="block text-sm font-normal text-heading"
                        >
                            Add your profile name
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={onChange}
                            className="block w-full text-gray-900 border rounded-xl border-gray-300 focus:border-indigo-600 bg-white px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
                            placeholder="Name"
                            value={formData.username}
                        />
                        <p
                            aria-live="polite"
                            id="email:helper"
                            className="mt-1 text-xs font-base text-slate-400"
                        >
                            You can change this later.
                        </p>
                        {/* TODO - profile picture uploader - use placeholder for now */}
                        {/* <div className='my-4 w-full'>
                        <label className="block text-sm font-normal text-heading"
                            htmlFor="file_input">Upload Profile Pic
                        </label>
                        <div className="flex flex-row justify-between items-center">
                            <input
                                className="block text-sm focus:border-indigo-600 text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none px-4 py-2.5  placeholder:text-text/50"
                                id="file_input"
                                type="file" />
                            <div className='flex items-center h-5 justify-end mx-2'>
                                Skip for now
                                <input
                                    id='profilepiclater'
                                    name='profilepiclater'
                                    type='checkbox'
                                    onClick={() => { console.log("make on onMutate function") }}
                                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded mx-2'
                                />
                            </div>

                        </div>
                    </div> */}
                        <div className='justify-center w-full my-6 flex'>
                            <button
                                onClick={createNostrProfile}
                                disabled={loading}
                                className="hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <span className="animate-spin inline-block mr-2">
                                            <svg
                                                className="w-5 h-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                />
                                            </svg>
                                        </span>
                                        Loading...
                                    </div>
                                ) : (
                                    <>
                                        <KeyIcon className="w-5 h-5 inline-block mr-2" />
                                        Create Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>



                    {/* <div className='text-2xl font-normal mb-2 mt-6 border-t border-gray-500'>Add Alby
                        <p className='text-sm text-slate-600 font-normal'>Alby is a browser extension that securely holds your keys - this takes ~4 minutes.</p>
                        <div className='justify-center w-full mt-6 flex flex-col'>
                            <div className='justify-center w-full flex'>
                                <a
                                    className="hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                                    href='https://getalby.com/' target='blank'>
                                    <PlusIcon className="w-5 h-5 inline-block mr-2" />
                                    Add Alby
                                </a>
                            </div>

                            <div className='mt-6 flex flex-row items-center h-5 justify-center mx-2 text-base'>
                                I've added Alby and stored my keys there.
                                <input
                                    id='albyDownloaded'
                                    name='albyDownloaded'
                                    type='checkbox'
                                    onClick={() => {
                                        setAlbyDownloaded(!albyDownloaded)
                                    }}
                                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded mx-2'
                                />
                            </div>

                        </div>
                    </div> */}
                </form>
                {/* {albyDownloaded ?
                    (<><p>You're done! You now have a Nostr profile which will get you into any app on Nostr!</p>
                        <div className='flex flex-col justify-center w-min'>
                            <button
                                type='button'
                                className='hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-200'
                                onClick={login}
                            >
                                <BoltIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                                <span>Login</span>
                            </button>
                        </div></>) :
                    (null)} */}
            </div>

        </div>
    )
}

export default OnBoard