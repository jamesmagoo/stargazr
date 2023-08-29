import ReactMarkdown from 'react-markdown';
import remarkBreaks from "remark-breaks";


type Props = {
    markdownText: string;
}

const MarkdownPreview = ({ markdownText }: Props) => {
    return (
        <div className="h-1/4 p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <label htmlFor="content" className="block text-lg font-medium text-gray-700">
                Preview
            </label>
            <ReactMarkdown
                className='bg-gray-100 border border-gray-600 rounded-md opacity-60 p-1'
                remarkPlugins={[remarkBreaks]}
                children={markdownText.replace(/\n/gi, "&nbsp; \n")} />
        </div>
    );
};

export default MarkdownPreview;
