import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import MarkdownPreview from "../components/MarkdownPreview";


interface FormData {
  title: string;
  content: string;
  image: string,
  summary: string;
  tags: NDKTag[]
}

export default function PublishLyricsPage() {

  const { ndk } = useNDK();
  const { user } = useUser();
  const [, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    image: '',
    summary: "Lyrics posted on stargazer",
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
      let slug: any = String(Date.now())

      const newTags: NDKTag[] = [
        ["summary", formData.summary],
        ["title", formData.title],
        ["published_at", event.created_at.toString()],
        ["d", slug],
      ];

      if (formData.image.length != 0) {
        console.log("Image url provided")
        if (isValidURL(formData.image)) {
          newTags.push(["image", formData.image])
        } else {
          toast.error("The image URL provided is not valid - double check it")
          return;
        }
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
        toast.success(`Published to Nostr! ${Array.from(result)[0]}`)
      }
      // TODO remove 
      console.log(event)
    } else {
      toast.error("Please input a title & content")
    }

  }

  function isValidURL(url: string) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const markdownWithLineBreaks = formData.content.replace(/\n/g, '  \n');


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
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          onChange={onChange}
                          required
                          name="title"
                          id="title"
                          className="p-1 block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Title"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="content"
                        name="content"
                        onChange={onChange}
                        required
                        rows={24}
                        className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Jesus in the day spa.."
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Song lyrics to be posted to Nostr.
                    </p>
                  </div>
                  {markdownWithLineBreaks.length > 0 ?
                    <MarkdownPreview markdownText={markdownWithLineBreaks} title={formData.title}/>
                    : null
                  }
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Link to Album Art/Cover Image (Optional)
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="image"
                          id="image"
                          onChange={onChange}
                          className="p-1 block w-max flex-1 rounded-none rounded-r-md border-grey-900 border focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Link to image"
                        />
                      </div>
                    </div>
                  </div>
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
