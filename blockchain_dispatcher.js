import dotenv from "dotenv"
dotenv.config()
import Web3 from "web3"
// import { getMongoClient, store_event } from "./db_handling.js"

// export function listen_blockchain_events(clientToChannelMap) {
//     // Connect to the db
//     // const db_client = getMongoClient()
//     // db_client.connect()
//     // console.log("Successfully connected to the db")
//     // const database = db_client.db('kaibapi')
//     // const logs = database.collection('logs')

//     const web3 = new Web3('wss://mainnet.infura.io/ws/v3/9dfebee406c14245ab6877658f02fa65')
//     let subscription = web3.eth.subscribe('event')

//     // Dispatch events to clients
//     subscription.on('data', event => dispatch(event, clientToChannelMap))

//     // Pull any event from the blockchain and save it into the db in real time
//     // subscription.on('data', event => store_event(logs, event))
// }

// async function dispatch(event, clientToChannelMap) {
//     console.log(event)
// }

export async function event_updater(ws, abi, address, event) {
    // Connect to the endpoint
    const web3 = new Web3(process.env.WEB3_PROVIDER_URI)
    const contract = new web3.eth.Contract(abi, address)
    contract.events[event]({
        fromBlock: 'latest'
    })
        .on('data', event => ws.send(JSON.stringify(event)))
        .on('changed', changed => ws.send(JSON.stringify(changed)))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))
}