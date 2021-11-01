const axios = require('axios');
const publicIP = require('public-ip');

const requestConfig = {
    headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        'Content-Type': 'application/json'
    }
};

let currentIP;

setInterval(checkIP,  60000);

checkIP();

async function checkIP() {

    const newIP = await publicIP.v4();

    if(!newIP){ return; }

    if(!currentIP){ currentIP = newIP; }

    if(currentIP !== newIP){
        currentIP = newIP;
        updateDNSRecords();
    }

}

async function updateDNSRecords() {

    const dnsRecords = await getDNSRecords();

    for (const record of dnsRecords) { await updateDNSRecord(record); }

}

async function getDNSRecords() {

    const getEndpoint = `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`;
    const {data} = await axios.get(getEndpoint, requestConfig);

    return data && data.result;
}

async function updateDNSRecord({id, type, name, proxied}) {

    const updateEndpoint = `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records/${id}`;
    const updateData = {type, name, proxied, content: currentIP};

    await axios.put(updateEndpoint, updateData, requestConfig);

}