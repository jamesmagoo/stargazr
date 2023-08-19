import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Test from './components/Test.tsx'
import './index.css'
import { NDKProvider } from "@nostr-dev-kit/ndk-react"
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,

} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="test" element={<Test />} />
      {/* ... etc. */}
    </Route>
  )
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <NDKProvider
      relayUrls={[
        "ws://127.0.0.1:8080"
      ]}
    >
      <App />
    </NDKProvider>
  </React.StrictMode>,
)
