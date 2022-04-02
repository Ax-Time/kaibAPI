import { event_updater, event_history_fetcher } from "./blockchain_dispatcher.js"

export function connection_handler(ws) {
    ws.on('message', function message(data) {
        console.log("Client connected")
        decodeAndExecute(ws, data)
    })
}

function decodeAndExecute(ws, data) {
    /**
     * Message form (JSON):
     * {
     *      method: <'update', 'get_history'>,
     *      abi: <contract_abi>,
     *      address: <contract_address>,
     *      rpc_endpoint: <your_rpc_endpoint>
     *      event: <event_name>
     * }
     */

    const jsonMessage = JSON.parse(data)
    const method = jsonMessage.method
    const abi = jsonMessage.abi
    const address = jsonMessage.address
    const rpc_endpoint = jsonMessage.rpc_endpoint
    const event_name = jsonMessage.event

    if(method == 'update') event_updater(ws, rpc_endpoint, abi, address, event_name)
    else if(method == 'get_history') event_history_fetcher(ws, rpc_endpoint, abi, address, event_name)
}