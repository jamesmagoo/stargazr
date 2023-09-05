import { NDKProvider } from "@nostr-dev-kit/ndk-react"
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { EventProvider } from "./context/EventContext.tsx"
import { UserProvider } from "./context/UserContext.tsx"

// TODO : how to configure relays for prod? env ?

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NDKProvider
      relayUrls={[
        "wss://purplepag.es",
				"wss://relay.damus.io",
        "wss://nostr.fmt.wiz.biz",
      ]}
    >
      <UserProvider>
      <EventProvider>
        <App />
      </EventProvider>
      </UserProvider>
    </NDKProvider>
  </React.StrictMode>,
)
