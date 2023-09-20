
type Props = {
    onChange : (event: React.ChangeEvent<HTMLInputElement>) => void;
    formData : any
}

function OnBoardStep2({ onChange, formData }: Props) {
    return (
        <div>
            <label
                htmlFor="username"
                className="mt-12 block text-sm mb-2 font-normal text-slate-600"
            >
                What will we call you?
            </label>
            <input
                type="text"
                id="username"
                name="username"
                onChange={onChange}
                value={formData.username}
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
        </div>
    )
}

export default OnBoardStep2