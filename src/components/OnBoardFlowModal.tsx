import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/20/solid';
import { NDKEvent, NDKKind, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import axios from 'axios';
import { logEvent } from 'firebase/analytics';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';
import { FormEvent, Fragment, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { analytics } from '../../firebase.config';
import { useMultiStepForm } from '../hooks/useMultiStepForm';
import OnBoardStep1 from './OnBoardStep1';
import OnBoardStep2 from './OnBoardStep2';
import OnBoardStep3 from './OnBoardStep3';
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';


type Props = {
  showLoginModal: boolean;
  handleCancel(): any;
  handleLogin(): any;
}

type UserAccountFormData = {
  username: string;
  picture: string | undefined;
}

const MAX_FILE_SIZE_BYTES = 10485760;

const OnBoardFlowModal = ({ showLoginModal, handleCancel, handleLogin }: Props) => {

  const [loading, setLoading] = useState<boolean>(false);
  const { ndk, loginWithSecret } = useNDK();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState<UserAccountFormData>({
    username: '',
    picture: undefined,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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


  const cancelButtonRef = useRef(null);
  const [open, setOpen] = useState(true);
  const { step, next, isFirstStep, isLastStep, currentStepIndex, steps, back } = useMultiStepForm([
    <OnBoardStep1 handleLogin={handleLogin} />,
    <OnBoardStep2 onChange={onChange} formData={formData} />,
    <OnBoardStep3 handleFileChange={handleFileChange} selectedFile={selectedFile} />,
    // TODO these steps
    // <div>Follow some people</div>,
    // <div>Are you an artist or a fan?</div>
  ])

  const onProfileFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isLastStep) return next();
    try {
      createNostrProfile();
    } catch {
      toast.error(`Problem creating profile`)
    }
    handleCancel()
  }

  const createNostrProfile = async () => {
    if (formData.username.length > 0 && (selectedFile)) {
      setLoading(true)
      // generate keys and login user 
      let picture_url = await handleUpload()
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false)
      navigate("/home")
    } else {
      logEvent(analytics, "clicked_with_no_name")
      toast.info("Add your profile name & picture 😃")
      return;
    }

  }


  const publishNewUserProfile = async (signer: NDKPrivateKeySigner, publickey: string, picture_url: string) => {
    console.log("publishing kind 0")
    const event = new NDKEvent(ndk);
    let user: { name: string; picture?: string | null } = {
      "name": formData.username
    }
    if (picture_url !== undefined && picture_url !== null) {
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

  return (
    <Transition.Root show={showLoginModal} as={Fragment}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        as='div'
        static
        className='fixed z-10 inset-0 overflow-y-auto'
        initialFocus={cancelButtonRef}
        open={open}
        onClose={setOpen}
      >
        <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='bg-white inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
              <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => handleCancel()}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="absolute top-0 left-0 hidden pt-4 pl-4 sm:block">
                <div
                  className="rounded-md bg-white text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"

                >
                    <div>{isFirstStep ? null : (<p>Step {currentStepIndex} / {steps.length}</p>)}</div>
                     
                  {/* TODO - progress bar here growing in length would be cool */}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 hidden pb-8 pl-4 sm:block">
                <div
                  className="rounded-md bg-white text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"

                >
                    <div>{isFirstStep ? null : (<div className='flex cursor-pointer' onClick={back} ><ArrowLeftIcon className="h-6 w-6" aria-hidden="true"/> Back</div>)}</div>
                     
                  {/* TODO - progress bar here growing in length would be cool */}
                </div>
              </div>
              <form onSubmit={onProfileFormSubmit}>
                {step}
                <div className='flex justify-center items-center h-full'>
                  {isFirstStep ?
                    (<button
                      type='submit'
                      className='flex cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 border-black border-2 text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 rounded-md shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium focus:ring-offset-2'
                    >
                      Create Account
                    </button>) : (<button
                      type='submit'
                      className='flex cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 border-black border-2 text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 rounded-md shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium focus:ring-offset-2'
                    >
                      {isLastStep ?
                        (<div>{loading ? (<div className="flex items-center">
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
                        </div>) :
                          (<span>Finish</span>)}</div>) :
                        (<p>Next</p>)}
                    </button>)}
                </div>
              </form>

            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default OnBoardFlowModal