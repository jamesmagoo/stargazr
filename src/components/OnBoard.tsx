import OnBoardProgress from './OnBoardProgress'
import { useState } from 'react';
type Props = {}

function OnBoard({ }: Props) {
    const [activeStep, setActiveStep] = useState(1);

    const initSteps = [
        {id: 1, name: 'Contact Details & Address', status: 'current'},
        {id: 2, name: 'Property Details', status: 'upcoming'},
        {id: 3, name: 'Preview Advert', status: 'upcoming'},
        {id: 4, name: 'Payment', status: 'upcoming'},
    ];

    const [steps, setSteps] = useState(initSteps);

    // its the last step if the active step == the steps array length-1
    const isLastStep = activeStep === steps.length;


    // Method to handle step change
    const handleNextStep = () => {
        // Make sure this cna't be called on last step
        setSteps((prevSteps) => {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);

            const newState = prevSteps.map((step) => {
                if (step.id === activeStep + 1) {
                    return {...step, status: 'current'};
                } else if (step.id <= activeStep + 1) {
                    return {...step, status: 'complete'};
                } else {
                    return step;
                }
            });

            return newState;
        });
    };


    return (
        <div className="splash-card  w-full h-full border-2 border-black rounded-lg p-2 shadow-lg shadow-slate-500">
            <div className='flex w-full justify-center'>
                <h1 className='font-extralight text-5xl mb-2 '>
                    It's new, but <span className='italic underline font-light decoration-red-600 underline-offset-8'>simple</span>.
                </h1>
            </div>
            <div className='flex flex-col items-center space-y-10'>
                <OnBoardProgress activeStep={activeStep} steps={steps} />
            <div className='italic font-light text-gray-500'>Let's walk through how to get started...</div>
                <div className='items-start w-full bg-white'>
                    <p className='text-2xl font-semibold'>1. Get your keys </p>
                    <p className='text-sm text-slate-400 font-semibold'>One time thing, like a password (private key) and username (public key). </p>
                    <button>Get Keys</button>
                </div>
                <div>2. Get Alby & login </div>
                <div>3. Add details to your profile</div>
            <p>You're done! You now have a Nostr profile which will get you into any app on Nostr!</p>
            </div>
        </div>
    )
}

export default OnBoard