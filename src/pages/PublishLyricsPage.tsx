import { useState } from "react"
import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk"
import { useNDK } from "@nostr-dev-kit/ndk-react"
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";

interface FormData {
  title: string;
  content: string;
  tags: NDKTag[] // An array of arrays where each inner array contains two strings
}

export default function PublishLyricsPage() {

  const { ndk } = useNDK();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("Lyrics posted on stargazer")
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    tags: [["t", "lyrics"]]
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      setLoading(false);
      toast.error('Please login');
      return;
    }

    if (formData.content.length > 0 && formData.title.length > 0) {
      const event = new NDKEvent(ndk);
      event.kind = 30023;
      event.created_at = Math.floor(Date.now() / 1000);

      const newTags: NDKTag[] = [
        ["summary", summary],
        ["title", formData.title],
        ["published_at", event.created_at.toString()]
      ];


      setFormData(prevFormData => ({
        ...prevFormData,
        tags: [...prevFormData.tags, ...newTags]
      }));

      formData.tags.map((tag)=>{
        event.tags.push(tag)
      })

      newTags.map(tag => {
        event.tags.push(tag);
      });
      

      event.content = content;
      //await event.publish();
      console.log(event)
    } else {
      toast.error("Please input a title & content")
    }

  }

  const onChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData)
  };;


  return (
    <>
      <div className="w-screen h-screen p-10 bg-blue-200">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Publish Your Lyrics</h3>
              <p className="mt-1 text-sm text-gray-600">
                Share your work with the world.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={onSubmit} method='POST'>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          onChange={onChange}
                          required
                          name="title"
                          id="title"
                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Title"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="content"
                        name="content"
                        onChange={onChange}
                        required
                        rows={24}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Jesus in the day spa.."
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Song lyrics to be posted to Nostr.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        Link to Album Art/Cover Image (Optional)
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Title"
                        />
                      </div>
                    </div>
                  </div>


                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
