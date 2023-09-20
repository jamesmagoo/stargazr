import logo from '../assets/1eye.svg'
import { Dialog } from '@headlessui/react';

type Props = {
    handleLogin(): any;
}

function OnBoardStep1({ handleLogin }: Props) {

    return (
        <div>
            <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full'>
                <img
                    className='block h-20 w-auto'
                    src={logo}
                    alt='Workflow'
                />
            </div>
            <div className='mt-3 text-center sm:mt-5'>
                <Dialog.Title
                    as='h3'
                    className='text-lg leading-6 font-medium text-gray-900 my-2'
                >
                    I already have an account
                </Dialog.Title>
                <div className='text-sm text-gray-500 mb-4 mt-2 '>
                    We support <a className='underline text-sm text-indigo-700' href='https://getalby.com/' target='blank'> Alby </a>
                    and <a className='underline text-sm text-indigo-700' href='https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp' target='blank'> Nos2x </a>
                    browser extensions.
                </div>
                <div className='w-full items-center mb-8 '>
                    <button
                        type='button'
                        onClick={handleLogin}
                        className='cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 border-black border-2 text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 rounded-md shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium focus:ring-offset-2'
                    >
                        Login With Extension
                    </button>
                </div>


            </div>
            <div className='border border-b-2 border-black' />
            <div className='mt-3 text-center sm:mt-5'>
                <Dialog.Title
                    as='h3'
                    className='text-lg leading-6 font-medium text-gray-900 my-2'
                >
                    Create Account
                </Dialog.Title>
                <div className='text-sm text-gray-500 mb-2 mt-2 '>
                    You don't have an account? No problem! We can create one in a minute.
                </div>

                {/* <div className='w-full items-center '>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        className='cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 border-black border-2 text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 rounded-md shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium focus:ring-offset-2'
                    >
                        Create An Account
                    </button>
                </div> */}

            </div>
        </div>
    )
}

export default OnBoardStep1