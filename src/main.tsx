import { NDKProvider } from "@nostr-dev-kit/ndk-react"
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { EventProvider } from "./context/EventContext.tsx"
import { UserProvider } from "./context/UserContext.tsx"

const relayUrls : string[] = JSON.parse(import.meta.env.VITE_APP_relays);
console.log("Rolling " + import.meta.env.VITE_APP_TITLE);
console.log(relayUrls)



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NDKProvider
      relayUrls={relayUrls}
    >
      <UserProvider>
      <EventProvider>
        <App />
      </EventProvider>
      </UserProvider>
    </NDKProvider>
  </React.StrictMode>,
)
