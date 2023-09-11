import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import Spinner from './Spinner';

type Props = {
    showZapModal: boolean;
    handleCancel(): any;
    handleZap(zapMessage: string, zapAmount: number): any;
    zapLoading: boolean;
}

const ZapModal = ({ showZapModal, handleCancel, handleZap, zapLoading }: Props) => {

    const cancelButtonRef = useRef(null);
    const [open, setOpen] = useState(true);
    const [zapMessage, setZapMessage] = useState<string>("")
    const [zapAmount, setZapAmount] = useState<number>(21)


    const onChange = (e: any) => {
        setZapMessage(e.target.value);
    };

    const onChangeZapAmount = (e: any) => {
        setZapAmount(e.target.value)
    }

    const handleZapSubmit = () => {
        setZapMessage("")
        handleZap(zapMessage, zapAmount)
    }

    return (
        <Transition.Root show={showZapModal} as={Fragment}>
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
                        <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
                            <div>
                                <div className='text-3xl mx-auto flex items-center justify-center h-12 w-12 rounded-full'>
                                    🪩
                                </div>
                                <div className='mt-3 text-center sm:mt-5'>
                                    <Dialog.Title
                                        as='h3'
                                        className='text-lg leading-6 font-medium text-gray-900'
                                    >
                                        {zapLoading ? <div className='flex flex-row items-center justify-center'><Spinner /> Zapping... </div> :
                                            <div>
                                                <div className='mb-2'>Zap this artist some satoshis! ⚡️</div>
                                                <div className='flex flex-row items-center w-full justify-evenly my-2'>
                                                    <button
                                                        onClick={(() => { setZapAmount(21) })}
                                                        className='bg-purple-200 rounded-md border-black border font-bold p-2'>
                                                        🥰 21
                                                    </button>
                                                    <button
                                                        onClick={(() => { setZapAmount(1000) })}
                                                        className='bg-purple-200 rounded-md border-black border font-bold p-2'>
                                                        🤘 1000
                                                    </button>
                                                    <button
                                                        onClick={(() => { setZapAmount(5000) })}
                                                        className='bg-purple-200 rounded-md border-black border font-bold p-2'>
                                                        🎸 5000
                                                    </button>
                                                    <button
                                                        onClick={(() => { setZapAmount(10000) })}
                                                        className='bg-purple-200 rounded-md border-black border font-bold p-2'>
                                                        🤩 10k
                                                    </button>
                                                </div>

                                                <div className='flex flex-col items-center justify-center mb-4'>
                                                    <label
                                                        htmlFor="zapAmount"
                                                        className="block text-sm mb-2 font-normal text-slate-600"
                                                    >
                                                        The amount of sats you are zapping </label>
                                                    <input
                                                        type="number"
                                                        id="zapAmount"
                                                        name="zapAmount"
                                                        onChange={onChangeZapAmount}
                                                        value={zapAmount}
                                                        className="block w-min text-center text-gray-900 border rounded-xl border-gray-300 focus:border-indigo-600 bg-white px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
                                                        placeholder="Your message"
                                                    />
                                                </div>

                                                <div>
                                                    <input
                                                        type="text"
                                                        id="zapMessage"
                                                        name="zapMessage"
                                                        onChange={onChange}
                                                        value={zapMessage}
                                                        className="block w-full text-gray-900 border rounded-xl border-gray-300 focus:border-indigo-600 bg-white px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
                                                        placeholder="Your message"
                                                    />

                                                </div>
                                            </div>}
                                    </Dialog.Title>

                                    <div className='mt-2'>
                                        <p className='text-sm text-gray-500'>
                                            Leave them a message (optional) 📝
                                        </p>
                                        <br />

                                    </div>
                                    <div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense'>
                                        {' '}
                                        <button
                                            type='button'
                                            onClick={() => handleZapSubmit()}
                                            className=' text-black w-full inline-flex justify-center rounded-md border border-black shadow-sm px-4 py-2 bg-yellow-400 text-base font-medium hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm'
                                        >
                                            ⚡️ Zap
                                        </button>
                                        <button
                                            type='button'
                                            className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm'
                                            onClick={() => handleCancel()}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ZapModal