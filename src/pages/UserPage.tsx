import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';

const UserPage = () => {

  const [albyDownloaded, setAlbyDownloaded] = useState<boolean>(false)
  const [progressWidth,] = useState<number>(50)
  const { user } = useUser();

  const getnsecFromStorage = () => {
    return localStorage.getItem("nsec")
  }

  const copyToClipboard = (e: any) => {
    e.preventDefault();
    if (e.target.value) {
      navigator.clipboard.writeText(
        e.target.value
      );
      toast.info("Key Copied To Clipboard 📋");
      toast.warn("Be Careful 🔐")
    }
  }

  // const onMutate = (e: any) => {
  //     //Checkboxes
  //     if (e.target.checked == true && e.target.type == 'checkbox') {
  //         //checkbox was checked
  //         setFormData((prevState) => ({
  //             ...prevState,
  //             [e.target.name]: true,
  //         }));
  //     } else {
  //         setFormData((prevState) => ({
  //             ...prevState,
  //             [e.target.name]: false,
  //         }));
  //     }
  // };

  return (
    <div>
      <div className="mx-auto w-full flex-grow lg:flex xl:px-8">
        <div className="m-4 splash-card lg:w-1/2 w-full h-max border-2 border-black rounded-lg p-2 shadow-lg shadow-slate-500 pb-4">
          <div className='w-full px-5 mb-8'>
            <div className="mt-2 " aria-hidden="true">
              <div className="overflow-hidden rounded-full bg-gray-200 min-w-max">
                <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${progressWidth}%` }} />
              </div>
              <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                <div className="text-indigo-600">1. Profile Name</div>
                <div className="text-center">2. Create Account</div>
                <div className="text-right">3. Get Alby</div>
                <div className="text-right">4. Login</div>
              </div>
            </div>
          </div>
          <div className='text-2xl font-normal mb-2 border-gray-500 p-4'>Your Account Information
            <p className='text-sm text-slate-600 font-normal'>Keys are like your password (private key) and username (public key).</p>
            <div>
              <div className='flex flex-col justify-center'>
                <p className='text-sm text-red-500 font-semibold justify-center w-full'>Copy your keys and keep them somewhere safe for backup.</p>
                <p className='text-sm text-red-500 font-semibold mb-4 justify-center w-full'>Use them in the next step</p>
                <div className='mb-4'>
                  <label htmlFor="privatekey" className="block text-sm font-medium text-gray-700">
                    Private Key - this is like your password - keep it safe and never share it.
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="privatekey"
                      id="privatekey"
                      onClick={(e) => { copyToClipboard(e) }}
                      className="cursor-pointer blur hover:blur-none px-4 py-2.5  block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      // @ts-ignore 
                      defaultValue={getnsecFromStorage()}
                    />
                    <div
                      className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <DocumentDuplicateIcon className="h-5 w-5 text-gray-400 cursor" aria-hidden="true" />
                    </div>
                  </div>
                  <p
                    aria-live="polite"
                    id="email:helper"
                    className="mt-1 text-xs font-base text-slate-400"
                  >
                    Click to copy to your clipboard.
                  </p>
                </div>

                <div>
                  <label htmlFor="publickey" className="block text-sm font-medium text-gray-700">
                    Public Key - this is like your username - people can find you with it.
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      onClick={(e) => { copyToClipboard(e) }}
                      name="publickey"
                      id="publickey"
                      className="cursor-pointer px-4 py-2.5  block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      defaultValue={user?.npub}
                    />
                    <div
                      className="pointer-events-none  absolute inset-y-0 right-0 flex items-center pr-3">
                      <DocumentDuplicateIcon
                        className="h-5 w-5 text-gray-400 cursor"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <p
                    aria-live="polite"
                    id="email:helper"
                    className="mt-1 text-xs font-base text-slate-400"
                  >
                    Click to copy to your clipboard.
                  </p>
                </div>
                <div className='mt-6 flex flex-row items-center h-5 justify-center mx-2 text-base'>
                  I've copied my keys to somewhere safe.
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

            </div>
          </div>

          <div className='mt-4 p-4'>
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
        <div className="m-4 splash-card lg:w-1/2 w-full h-max border-2 border-black rounded-lg p-2 shadow-lg shadow-slate-500 pb-4">
          <div>
            {user ? (
              <div>
                {user.profile?.banner ? (
                  null) : (
                  <img src={user.profile?.banner} alt="Banner" className='border-2 border-black rounded-md' />)}
                <img src={user.profile?.banner} alt="Banner" className='border-2 border-black rounded-md' />
                <div className="flex items-center space-x-4 my-4">
                  <img src={user.profile?.image} alt="Profile Image" className="w-16 h-16 rounded-full" />
                  <div>
                    <h1 className="text-xl font-semibold">{user.profile?.displayName}</h1>
                    <p className="text-gray-600">{user.profile?.name}</p>
                  </div>
                </div>
                <div>

                  <h1 className="text-xl font-semibold">{user.profile?.displayName}</h1>
                  <p className="text-gray-600">{user.profile?.name}</p>
                  <p className="text-gray-700">{user.profile?.about}</p>
                  <p className="text-gray-700">{user.profile?.email}</p>
                  <p className="text-gray-700">Website: {user.profile?.website}</p>
                  <p className="text-gray-700">Lud16: {user.profile?.lud16}</p>
                  <p className={`text-gray-700 ${user.profile?.nip05valid ? 'text-green-500' : 'text-red-500'}`}>
                    Nip05 Valid: {user.profile?.nip05valid ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>

      </div>

    </div>

  )
}

export default UserPage