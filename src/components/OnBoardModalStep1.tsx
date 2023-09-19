import logo from '../assets/1eye.svg'
import { Dialog } from '@headlessui/react';

type Props = {
    handleSubmit(): any;
}

function OnBoardModalStep1({ handleSubmit }: Props) {

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
                <div className='w-full items-center '>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        className='cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 border-black border-2 text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 rounded-md shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium focus:ring-offset-2'
                    >
                        Login With Extension
                    </button>
                </div>

                <div className='text-sm text-gray-500 mb-4 mt-2 '>
                    We support <a className='underline text-sm text-indigo-700' href='https://getalby.com/' target='blank'> Alby </a>
                    and <a className='underline text-sm text-indigo-700' href='https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp' target='blank'> Nos2x </a>
                    browser extensions.
                </div>
            </div>
            <div className='border border-b-2 border-black' />
            <div className='mt-3 text-center sm:mt-5'>
                <Dialog.Title
                    as='h3'
                    className='text-lg leading-6 font-medium text-gray-900 my-2'
                >
                    I want to get started
                </Dialog.Title>

                <div className='w-full items-center '>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        className='cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 border-black border-2 text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 rounded-md shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium focus:ring-offset-2'
                    >
                        Create An Account
                    </button>
                </div>
                <div className='text-sm text-gray-500 mb-2 mt-2 '>
                   Blah blah balh
                </div>
            </div>
        </div>
    )
}

export default OnBoardModalStep1