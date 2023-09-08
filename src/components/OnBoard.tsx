import { KeyIcon } from '@heroicons/react/20/solid';
import { NDKEvent, NDKKind, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import Welcome from './Welcome';
import { logEvent } from 'firebase/analytics'
import { analytics } from '../../firebase.config';
import axios from 'axios';

type KeyPair = {
    npub: string;
    nsec: string;
    hexpub: string;
    hexpriv: string;
}

const MAX_FILE_SIZE_BYTES = 10485760;

function OnBoard() {

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (e.target.files[0].size > MAX_FILE_SIZE_BYTES) {
                setSelectedFile(null)
                toast.error("File size too big!")
                toast.info("Must be less than 10MB")
            } else {
                setSelectedFile(e.target.files[0]);
            }
        }

    };

    const [, setKeys] = useState<KeyPair>({
        npub: "",
        nsec: "",
        hexpub: "",
        hexpriv: "",
    })

    const [formData, setFormData] = useState({
        username: '',
        picture: null,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [onBoarded, setOnBoarded] = useState<boolean>(false)
    const [profilePicLater, setProfilePicLater] = useState<boolean>(false)


    useEffect(() => {
        const storedNsec = localStorage.getItem('nsec');
        const storedProfileName = localStorage.getItem('profileName');

        if (storedNsec) {
            let hexprivkey = convertKeyToHex(storedNsec);
            let hexpubkey = getPublicKey(hexprivkey);
            let encodedNpub = nip19.npubEncode(hexpubkey);
            setKeys(() => ({ hexpriv: hexprivkey, hexpub: hexpubkey, npub: encodedNpub, nsec: storedNsec }));
            setOnBoarded(true);
        }

        if (storedProfileName) {
            setFormData((prevState) => ({
                ...prevState,
                username: storedProfileName,
            }));
        }
    }, []);


    const onChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createNostrProfile = async (e: any) => {
        e.preventDefault();
        const storedNsec = localStorage.getItem('nsec');
        if (storedNsec) {
            setLoading(false)
        } else {
            if (formData.username.length > 0 && (selectedFile || profilePicLater)) {
                setLoading(true)
                // generate keys and login user 
                let picture_url = await handleUpload()
                console.log("upload returned this:" + picture_url)
                const privatekeyHex = generatePrivateKey()
                const publickeyHex = getPublicKey(privatekeyHex)
                // encode keys 
                let encodedNsec = nip19.nsecEncode(privatekeyHex)
                let encodedNpub = nip19.npubEncode(publickeyHex)
                // save to local storage
                localStorage.setItem("nsec", encodedNsec)
                localStorage.setItem("npub", encodedNpub)
                localStorage.setItem("profileName", formData.username)
                localStorage.setItem("onboarded", "true")
                let newUser;
                loginWithSecret(encodedNsec).then((res) => {
                    if (res?.signer) {
                        res.signer.user().then(async (user) => {
                            if (!!user.npub) {
                                newUser = ndk?.getUser({ npub: `${user.npub}` })
                                newUser?.profile?.displayName == formData.username
                                setUser(newUser)
                                console.log(newUser)
                            }
                        })
                        publishNewUserProfile(res?.signer, publickeyHex, picture_url)
                    }
                }).catch((err) => {
                    console.log("another fucking problem:", err)
                })
                setKeys({ hexpub: publickeyHex, hexpriv: privatekeyHex, npub: encodedNpub, nsec: encodedNsec })
                await new Promise(resolve => setTimeout(resolve, 1500));
                setLoading(false)
                navigate("/home")
            } else {
                logEvent(analytics, "clicked_with_no_name")
                toast.info("Add your profile name & picture or do later")
                return;
            }
        }
    }

    const publishNewUserProfile = async (signer: NDKPrivateKeySigner, publickey: string, picture_url: string) => {
        console.log("publishing kind 0")
        const event = new NDKEvent(ndk);
        let user: { name: string; picture?: string | null } = {
            "name": formData.username
        }
        if (picture_url !== undefined && picture_url !== null) {
            console.log("in the red zone...")
            user = {
                ...user,
                "picture": picture_url,
              };
        }
        event.kind = NDKKind.Metadata;
        event.content = JSON.stringify(user),
            event.created_at = Math.floor(Date.now() / 1000);
        event.pubkey = publickey;
        let nostrevent = await event.toNostrEvent();
        event.sig = await signer.sign(nostrevent)
        console.log(event)
        try {
            let publishedProfileEvent = await event.publish()
            console.log(publishedProfileEvent)
            logEvent(analytics, "new_nostr_profile_created")
            toast.update("Account created!")
            toast.success("Welcome to Stargazr on Nostr!")
        } catch {
            toast.error("Problem creating your profile")
        }
    }


    function convertKeyToHex(value: string): string {
        if (value && value.startsWith("nsec")) {
            let decodedPrivateKey = nip19.decode(value);
            return decodedPrivateKey.data as string;
        }
        if (value && value.startsWith("npub")) {
            let decodedPublicKey = nip19.decode(value);
            return decodedPublicKey.data as string;
        }
        return value;
    }

    const handleUpload = async () => {
        if (!selectedFile) return;
        const dataToSend = new FormData();
        dataToSend.append('file', selectedFile);

        try {
            const response = await axios.post('https://nostr.build/api/v2/upload/files', dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Extract and store the URL from the response data
            const { data } = response;
            console.log(response)
            if (Array.isArray(data.data) && data.data.length > 0) {
                console.log("in here")
                setFormData((prevState) => ({
                    ...prevState,
                    picture: data.data[0].url,
                }));
            }
            console.log('Upload successful:', data.data);
            localStorage.setItem("profile_picture", data.data[0].thumbnail)
            return data.data[0].url
        } catch (error) {
            console.error('Error uploading file:', error);
        }

    };



    return onBoarded ? (<Welcome loading={loading} username={formData.username} />) : (
        <div className="splash-card w-full h-max border-2 border-black rounded-lg p-2 shadow-lg shadow-slate-500 pb-4">
            <div className='flex w-full justify-center mb-6'>
                <h1 className='font-extralight text-5xl'>
                    Ready to explore?
                </h1>
            </div>
            <div className='flex flex-col items-center space-y-3'>
                <div className='italic font-light text-gray-500 text-lg'>Get started with just a profile name!</div>

                <form className='w-full p-4'>


                    <p className='text-base text-slate-600 font-normal'></p>

                    <div className='items-start w-full flex flex-col mt-1 mb-5'>

                        <label
                            htmlFor="username"
                            className="block text-base mb-2 font-normal text-slate-600"
                        >
                            What do you call yourself / your band / your stage name / your alter-ego?
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
                        <div className='my-4 w-full'>
                            <label className="block text-sm font-normal text-heading"
                                htmlFor="file_input">Upload Profile Pic
                            </label>
                            <div className="flex flex-row justify-between items-center">
                                <input
                                    className="block text-sm focus:border-indigo-600 text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none px-4 py-2.5  placeholder:text-text/50"
                                    id="file_input"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    type="file" />
                                <div className='flex items-center h-5 justify-end mx-2 text-xs text-slate-600'>
                                    <p className='text-xs text-slate-600'>Skip for now</p>
                                    <input
                                        id='profilepiclater'
                                        name='profilepiclater'
                                        type='checkbox'
                                        onClick={() => { setProfilePicLater(!profilePicLater) }}
                                        className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded mx-2'
                                    />
                                </div>

                            </div>
                        </div>
                        <div className='justify-center w-full my-6 flex'>
                            <button
                                onClick={createNostrProfile}
                                disabled={loading}
                                className="cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
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
                </form>
            </div>
        </div>
    )
}

export default OnBoard