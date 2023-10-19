type Props = {
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedFile: File | null;
}

function OnBoardStep3({ handleFileChange, selectedFile }: Props) {
    return (
        <div className='my-12'>
            <label className="block text-base mb-2 font-normal text-slate-300"
                htmlFor="file_input">Upload Profile Pic
            </label>
            <div className="flex flex-row justify-between items-center">
                <input
                    className="block text-sm focus:border-indigo-600 text-white rounded-xl cursor-pointer bg-gray-700 focus:outline-none px-4 py-2.5  placeholder:text-text/50"
                    id="file_input"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    type="file" />
            </div>

            <p
                aria-live="polite"
                id="email:helper"
                className="mt-1 text-xs font-base text-slate-400"
            >
                You can change this later.
            </p>
            {selectedFile ? (<div className="text-center">
                <label htmlFor="file_input" className="cursor-pointer w-full">
                    <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full overflow-hidden mt-6 flex justify-center items-center">
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </label>
                <p
                    aria-live="polite"
                    className="mt-1 text-xs font-base text-slate-400"
                >
                    Preview
                </p></div>)
                : (null)}
        </div>


    )
}

export default OnBoardStep3