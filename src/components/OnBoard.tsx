import { useState } from 'react';
import { generatePrivateKey } from 'nostr-tools';
import { KeyIcon, DocumentDuplicateIcon } from '@heroicons/react/20/solid';
type Props = {}

type KeyPair = {
    npub: string;
    nsec: string;
}

function OnBoard({ }: Props) {

    /**
     *  1. Get info to build kind 0 event ; name, avatar, generatePrivateKey
     *  2. Publish event to relay on success return keys for backup
     *  3. install Alby 
     */

    const [progressWidth, setProgressWidth] = useState<number>(0);
    const [showKeys, setShowKeys] = useState<boolean>(false)
    const [keys, setKeys] = useState<KeyPair>({
        npub: "",
        nsec: ""
    })

    const [formData, setFormData] = useState({
        username: '',
        profilePic: null,
        albyDownloaded: false,
    });

    // Function to update the progress width
    const updateProgress = (percentage: number) => {
        setProgressWidth(percentage);
    };

    const onChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGetKeys = (e: any) => {
        e.preventDefault();
        console.log("doing stuff")
        // generate some keys
        // save to local storage?
        // show them to user 
        setKeys({ npub: "blah", nsec: "secret!" })
        console.log(keys)
        setShowKeys(!showKeys)
    }


    return (
        <div className="splash-card w-full h-max border-2 border-black rounded-lg p-2 shadow-lg shadow-slate-500">
            <div className='flex w-full justify-center mb-6'>
                <h1 className='font-extralight text-5xl'>
                    It's new, but <span className='italic underline font-light underline-offset-8'>simple</span>.
                </h1>
            </div>
            <div className='flex flex-col items-center space-y-3'>
                <div className='italic font-light text-gray-500 text-lg'>Let's walk through how to get started...</div>
                <div className='w-full px-5'>
                    <div className="mt-2 " aria-hidden="true">
                        <div className="overflow-hidden rounded-full bg-gray-200 min-w-max">
                            <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${progressWidth}%` }} />
                        </div>
                        <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                            <div className="text-indigo-600">1. Make Profile</div>
                            <div className="text-center">2. Get Keys</div>
                            <div className="text-right">3. Get Alby</div>
                            <div className="text-right">4. Login</div>
                        </div>
                    </div>
                </div>
                <form className='w-full p-4'>
                    <div className='text-2xl font-normal mb-6'>Make Profile
                        <p className='text-sm text-slate-400 font-normal'>Some information about yourself.</p>
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
                        />
                        <p
                            aria-live="polite"
                            id="email:helper"
                            className="mt-1 text-xs font-base text-slate-400"
                        >
                            You can change this later.
                        </p>

                        <div className='my-4 w-full'>
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
                        </div>


                    </div>

                    <div className='text-2xl font-normal mb-2'>Get Your Keys
                        <p className='text-sm text-slate-400 font-normal'>One time thing, keys are like you password (private key) and username (public key).</p>
                        <div className='justify-center w-full my-6 flex'>
                            <button
                                onClick={handleGetKeys}
                                className="hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                            >
                                <KeyIcon className="w-5 h-5 inline-block mr-2" />
                                Get My Keys
                            </button>

                        </div>
                        <div>
                            {showKeys ? null :
                                (<div className='flex flex-col justify-center'>
                                    <p className='text-sm text-red-500 font-semibold my-4 justify-center w-full'>Copy your keys and keep them somewhere safe for backup.</p>
                                    <div>
                                        <label htmlFor="account-number" className="block text-sm font-medium text-gray-700">
                                            Private Key - this is like your password - keep it safe and never share it.
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm mb-4">
                                            <input
                                                type="text"
                                                name="account-number"
                                                id="account-number"
                                                className="px-4 py-2.5  block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={keys.nsec}
                                            />
                                            <div 
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <DocumentDuplicateIcon className="h-5 w-5 text-gray-400 cursor" aria-hidden="true" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="account-number" className="block text-sm font-medium text-gray-700">
                                            Public Key - this is like your username people can find you with it.
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="account-number"
                                                id="account-number"
                                                className="px-4 py-2.5  block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={keys.npub}
                                            />
                                            <div 
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <DocumentDuplicateIcon className="h-5 w-5 text-gray-400 cursor" aria-hidden="true" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
                        </div>
                    </div>

                    <div className='text-2xl font-normal mb-2'>Add Alby
                        <p className='text-sm text-slate-400 font-normal'>Alby is a browser extension that securely holds your keys - this takes 2 minutes.</p>
                        <div className='justify-center w-full my-6 flex'>
                            <a className='text-base' href='https://getalby.com/' target='blank'>Install Alby </a>
                            <div className='flex items-center h-5 justify-end mx-2'>
                                I've added Alby and stored my keys there.
                                <input
                                    id='albyready'
                                    name='albyready'
                                    type='checkbox'
                                    onClick={() => { console.log("make on onMutate function") }}
                                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded mx-2'
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <p>You're done! You now have a Nostr profile which will get you into any app on Nostr!</p>
            </div>

        </div>
    )
}

export default OnBoard