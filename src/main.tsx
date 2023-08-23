import { NDKProvider } from "@nostr-dev-kit/ndk-react"
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { EventProvider } from "./context/EventContext.tsx"

// TODO : how to configure relays for prod? env ?

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NDKProvider
      relayUrls={[
        "ws://127.0.0.1:8080",
        // "wss://purplepag.es"
      ]}
    >
      <EventProvider>
        <App />
      </EventProvider>
    </NDKProvider>
  </React.StrictMode>,
)
