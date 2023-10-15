import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import MarkdownPreview from "../components/MarkdownPreview";
import { useNavigate } from "react-router-dom";
import useNostrBuild from "../hooks/useNostrBuild";


interface FormData {
  title: string;
  content: string;
  image: string,
  summary: string;
  tags: NDKTag[]
}

const MAX_FILE_SIZE_BYTES = 10485760;

export default function PublishLyricsPage() {

  const { ndk } = useNDK();
  const { handleUpload } = useNostrBuild()
  const navigate = useNavigate()
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    image: '',
    summary: "Lyrics posted from stargazr.xyz",
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

      let imageUrl = await uploadFile()

      const event = new NDKEvent(ndk);
      event.kind = 30023;
      event.created_at = Math.floor(Date.now() / 1000);
      let slug: any = String(Date.now())

      const newTags: NDKTag[] = [
        ["summary", formData.summary],
        ["title", formData.title],
        ["published_at", event.created_at.toString()],
        ["d", slug],
      ];

      if (imageUrl !== undefined && imageUrl !== null && imageUrl.length != 0) {
        console.log("Image url provided")
        newTags.push(["image", imageUrl])
      }


      setFormData(prevFormData => ({
        ...prevFormData,
        tags: [...prevFormData.tags, ...newTags]
      }));

      formData.tags.map((tag) => {
        event.tags.push(tag)
      })

      newTags.map(tag => {
        event.tags.push(tag);
      });

      // Replace single line breaks with double line breaks for proper rendering
      const markdownWithLineBreaks = formData.content.replace(/\n/g, '  \n');

      event.content = markdownWithLineBreaks;
      let result = await event.publish();
      if (result) {
        toast.success(`Published ${formData.title} !🪩🎤`)
        toast.success(`Thank You! 💜`)
        setLoading(false)
        navigate("/lyrics")
      }
      // TODO remove 
      console.log(event)
    } else {
      toast.error("Please input a title & content")
      setLoading(false)
    }

  }

  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const markdownWithLineBreaks = formData.content.replace(/\n/g, '  \n');

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

  const uploadFile = async () => {
    if (selectedFile) {
      const uploadedUrl = await handleUpload(selectedFile);
      if (uploadedUrl) {
        console.log("got this back:", uploadedUrl)
        return uploadedUrl
      }
    }
  };

  return (
    <>
      <div className="w-screen h-screen p-10 ">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-white">Publish Your Lyrics</h3>
              <p className="mt-1 text-sm text-slate-100">
                Share your work with the world.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={onSubmit} method='POST'>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6  bg-indigo-950 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-white">
                        Title
                      </label>
                      <div className="mt-1 flex">
                        <input
                          type="text"
                          onChange={onChange}
                          required
                          name="title"
                          id="title"
                          className="bg-gray-600 text-white p-1 block w-full border flex-1 rounded-lg border-black focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Title"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-white">
                      Content
                    </label>
                    <div className="border border-black rounded-lg">
                      <textarea
                        id="content"
                        name="content"
                        onChange={onChange}
                        required
                        rows={24}
                        className="bg-gray-600 text-white p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="I just wanted to be one of The Strokes..."
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-white">
                      Song lyrics to be posted to Nostr.
                    </p>
                  </div>
                  {markdownWithLineBreaks.length > 0 ?
                    <MarkdownPreview markdownText={markdownWithLineBreaks} title={formData.title} />
                    : null
                  }
                  <div className='my-4 w-full'>
                    <label className="block text-sm font-medium text-white mb-2"
                      htmlFor="file_input">Upload imagery - this will appear with your lyrics (optional)
                    </label>
                    <div className="flex flex-row justify-between items-center ">
                      <input
                        className="bg-indigo-900 text-white block text-sm focus:border-indigo-600 border border-black rounded-xl cursor-pointer focus:outline-none px-4 py-2.5  placeholder:text-text/50"
                        id="file_input"
                        accept="image/*"
                        onChange={handleFileChange}
                        type="file" />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-right sm:px-6 flex justify-center">
                  <button
                    type="submit"
                    className="cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2 text-white bg-gradient-to-r from-indigo-500 to-indigo-950  font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2">
                    {loading ? (
                      <div className="flex items-center">
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
                      </div>
                    ) : (<span>🎶 Publish</span>)}
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
