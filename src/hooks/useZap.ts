import { NDKEvent, NDKKind, NDKUserProfile, NostrEvent } from '@nostr-dev-kit/ndk';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { bech32 } from "bech32";
import { utils } from 'nostr-tools';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { requestProvider } from 'webln';
import { useUser } from '../context/UserContext';
//@ts-ignore
import { decode } from "light-bolt11-decoder";

const useZap = () => {

    const [showZapModal, setShowZapModal] = useState(false);
    const [zapLoading, setZapLoading] = useState(false)
    const { ndk } = useNDK();
    const { user } = useUser();
    let webln : any = null ;

    const handleZap = async (eventToZap : NDKEvent, zapMessage: string, zapAmount : number) => {
        webln = await requestProvider();
        setZapLoading(true)
        try {
          if (user) {
            console.log(`User logged in we can zap.. ${user.npub}`)
            // make  zap request
            const sats = zapAmount;
            const amount = sats * 1000
            let comment; 
            if(zapMessage !== null && zapMessage !== undefined && zapMessage.length >0){
              comment = zapMessage
            } else {
              comment = "brought to you by stargazr.xyz"
            }
            if (eventToZap !== null) {
              let result = await getZapRequest(eventToZap, amount, comment);
              console.log(result)
              if (result) {
                setZapLoading(false)
                toast.success("⚡️ ZAP !")
              } else {
                setZapLoading(false)
                toast.error("Problem zapping 🫠 ")
              }
            }
          } else {
            console.log("no user ")
            toast.error("Please login")
          }
          setZapLoading(false)
          setShowZapModal(false)
    
        } catch (error) {
          console.log(error)
          toast.error("Problem logging in")
          setZapLoading(false)
          setShowZapModal(false)
        }
    
      };

  const getZapRequest = async (note: NDKEvent, amount: number, comment: string) => {
    let author = ndk?.getUser({ hexpubkey: `${note.pubkey}` })
    await author?.fetchProfile();
    let callback;
    if (author?.profile != undefined) {
      callback = await getZapEndpoint(author.profile);
      console.log("got a callback", callback)
      if (callback == null) {
        return false;
      }
    } else {
      toast.error("This author cannot recieve zaps! ")
      return false;
    }
    const sats = Math.round(amount);
    let eventDescription;
    const relayObject = JSON.parse(import.meta.env.VITE_APP_relays);

    if (user) {
      const zapReq: NostrEvent = {
        kind: 9734,
        pubkey: user.hexpubkey(),
        created_at: Math.round(Date.now() / 1000),
        content: comment,
        tags: [
          ["p", note.pubkey],
          ["e", note.id],
          ["amount", String(sats)],
          ["relays"],
          ["lnurl", callback]
        ],
      };

      // Iterate through the string array and add its elements to the "relays" array
      for (const item of relayObject) {
        zapReq.tags[3].push(item);
      }

      let zapRequestEvent = new NDKEvent(ndk, zapReq)
      await zapRequestEvent.sign(ndk?.signer)
      eventDescription = JSON.stringify(zapRequestEvent.rawEvent());
    }
    try {
      const event = encodeURI(eventDescription ? eventDescription : "");
      console.log("calling callback...")
      // const r2 = await (await fetch(`${callback}?amount=${sats}&nostr=${event}`)).json();
      // const pr = r2.pr; // invoice
      // console.log(pr)
      let callbackUrl = `${callback}?amount=${sats}&nostr=${event}`
      const timeoutDuration = 12000; // 12 seconds 
      let response: any;
      let data;
      try {
        //response = await fetch(`${callback}?amount=${sats}&nostr=${event}`);

        response = await Promise.race([
          fetch(callbackUrl),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch timeout')), timeoutDuration))
        ]);

        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        }

        data = await response.json();
        console.log(`Invoice recieved: ${data.pr}`);
      } catch (error) {
        console.error(error);
        return false
      }

      let decodedInvoice = decode(data.pr);
      if (webln !== null) {
        let res = await webln.sendPayment(data.pr);
        console.log(res)
        let preimage = res.preimage;
        console.log("publishing zap receipt")
        await publishZapReceipt(eventDescription, decodedInvoice, preimage, note)

      } else {
        return false;
      }
      return true;
    } catch (reason) {
      console.error('Failed to zap: ', reason);
      toast.error("Failed to zap!")
      return false;
    }
  }

  const getZapEndpoint = async (user: NDKUserProfile): Promise<string | null> => {
    try {
      let lnurl: string = ''

      let { lud06, lud16 } = user;

      if (lud16) {
        console.log("lud16 found")
        let [name, domain] = lud16.split('@')
        lnurl = `https://${domain}/.well-known/lnurlp/${name}`
        console.log(lnurl)
      }
      else if (lud06) {
        console.log("lud06 found")
        let { words } = bech32.decode(lud06, 1023)
        let data = bech32.fromWords(words)
        lnurl = utils.utf8Decoder.decode(new Uint8Array(data))
      }
      else {
        return null;
      }

      let res = await fetch(lnurl)
      let body = await res.json()

      if (body.allowsNostr && body.nostrPubkey) {
        return body.callback;
      }
    } catch (err) {
      console.log('E: ', err);
      return null;
      /*-*/
    }

    return null;
  }

  const publishZapReceipt = async (eventDescription: string | undefined, decodedInvoice: any, preimage: string, note: NDKEvent) => {
    console.log("got the goods", eventDescription)
    const timestampSection = decodedInvoice.sections.find(
      (s: any) => s.name === "timestamp"
    );

    const zapReceiptevent = new NDKEvent(ndk);

    let tags = [
      ["p", note.pubkey],
      ["e", note.id],
      ["description", eventDescription],
      ["preimage", preimage],
      ["bolt11", decodedInvoice.paymentRequest]
    ]

    zapReceiptevent.kind = NDKKind.Zap;
    zapReceiptevent.content = "";
    zapReceiptevent.created_at = timestampSection.value,
      zapReceiptevent.tags = tags
    await zapReceiptevent.sign()
    console.log(zapReceiptevent)
    try {
      await zapReceiptevent.publish();
    } catch (err) {
      console.log(err)
    }
  }




  return { handleZap, showZapModal, setShowZapModal, setZapLoading, zapLoading };
};

export default useZap;