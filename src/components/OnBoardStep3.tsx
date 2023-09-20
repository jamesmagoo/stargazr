type Props = {
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function OnBoardStep3({ handleFileChange }: Props) {
    return (
        <div className='my-12 w-full'>
            <label className="block text-base mb-2 font-normal text-slate-600"
                htmlFor="file_input">Upload Profile Pic
            </label>
            <div className="flex flex-row justify-between items-center">
                <input
                    className="block text-sm focus:border-indigo-600 text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none px-4 py-2.5  placeholder:text-text/50"
                    id="file_input"
                    accept="image/*"
                    onChange={handleFileChange}
                    type="file" />
            </div>
        </div>
    )
}

export default OnBoardStep3