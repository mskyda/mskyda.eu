const axios = require('axios');

const requestConfig = {
    headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        'Content-Type': 'application/json'
    }
};

(async () => {

    const dnsRecords = await getDNSRecords();
    const recordsIP = dnsRecords[0].content;
    const currentIP = "8.8.8.8";

    if(recordsIP !== currentIP){
        await updateDNSRecord(dnsRecords[0], currentIP);
    }

})();

async function getDNSRecords() {

    const getEndpoint = `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`;
    const {data} = await axios.get(getEndpoint, requestConfig);

    return data && data.result;
}

async function updateDNSRecord({id, type, name, proxied}, newIP) {

    const updateEndpoint = `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records/${id}`;
    const updateData = {type, name, proxied, content: newIP};

    await axios.put(updateEndpoint, updateData, requestConfig);

}
