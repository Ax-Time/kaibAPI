import Web3 from "web3";

export async function event_updater(ws, rpc_endpoint, abi, address, event_name) {
    // Connect to the endpoint
    const web3 = new Web3(rpc_endpoint)
    const contract = new web3.eth.Contract(abi, address)
    
    let options = {
        fromBlock: await web3.eth.getBlockNumber(),
        toBlock: 'latest'
    }

    setInterval(async function() {
        let results = await contract.getPastEvents(event_name, options)
        if(results.length != 0) {
            ws.send(JSON.stringify(results))
            options.fromBlock = results.map(result => result['blockNumber'])
                .reduce(function(p, v) {
                    return (p >= v) ? p : v
                }) + 1
        }   
    }, 2000) 
}

export function event_history_fetcher(ws, rpc_endpoint, abi, address, event_name) {

}