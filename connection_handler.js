import { event_updater } from "./blockchain_dispatcher.js"

export function connection_handler(ws) {
    ws.on('message', function message(data) {
        try {
            decodeAndExecute(ws, data)
        } catch(err) {
            console.log("error: ", err)
        }
    })
}

function decodeAndExecute(ws, data) {
    /**
     * Message form (JSON):
     * {
     *      abi: <contract_abi>,
     *      address: <contract_address>
     *      event: <event_name>
     * }
     */

    const jsonMessage = JSON.parse(data)

    const { abi, address, event } = jsonMessage 

    event_updater(ws, abi, address, event)
}