import { NDKProvider } from "@nostr-dev-kit/ndk-react"
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter
} from "react-router-dom"
import App from './App.tsx'
import LyricsView from './components/LyricsView.tsx'
import Test from './components/Test.tsx'
import UserPage from "./pages/UserPage.tsx"
import './index.css'
import ErrorPage from './pages/ErrorPage.tsx'
import PublishLyricsPage from './pages/PublishLyricsPage.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LyricsView/>,
      },
      {
        path: "publish",
        element: <PublishLyricsPage/>,
      },
      {
        path: "user",
        element: <UserPage/>,
      },
    ],
  },
  {
    path: "test",
    element: <Test />,
  },
]);

// TODO : how to configure relays for prod? env ?

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NDKProvider
      relayUrls={[
        "ws://127.0.0.1:8080"
      ]}
    >
      <RouterProvider router={router}/>
    </NDKProvider>
  </React.StrictMode>,
)
