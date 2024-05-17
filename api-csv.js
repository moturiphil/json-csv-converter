const axios = require('axios');
const { parse } = require('json2csv');
const fs = require('fs');

function convertJsonToCsv(jsonData) {
    const fields = ['Period ID', 'Period', 'implants insertion', 'implants removal', 'fp injections'];
    const opts = { fields };

    try {
        const rows = jsonData.rows.map(row => ({
            'Period ID': row[0],
            'Period': row[1],
            'implants insertion': row[5],
            'implants removal': row[5],
            'fp injections': row[6] 
        }));

        const csv = parse(rows, opts);
        return csv;
    } catch (error) {
        console.error('Error converting JSON to CSV:', error);
        throw new Error('Failed to convert JSON to CSV.');
    }
}


async function authenticate() {
    try {
        const response = await axios.get('https://test.hiskenya.org/api/auth', {
            username: 'programmingtest',
            password: 'Kenya@2040'
        });
        return response.data.token;

    } catch (error) {
        throw new Error('Authentication failed. Check your credentials.');
    }
}

async function fetchData(authToken) {
    try {
        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };
        const url = 'https://test.hiskenya.org/api/analytics.json?dimension=dx%3AotgQMOXuyIn%3BM4RzpOew1Im%3ByQFyyQBhXQf&dimension=pe%3A202301%3B202302%3B202303%3B202304%3B202305%3B202306%3B202307%3B202308%3B202309%3B202310%3B202311%3B202312&tableLayout=true&columns=dx&rows=pe&skipRounding=false&completedOnly=false&filter=ou%3AUSER_ORGUNIT';
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch data from the endpoint.');
    }
}


function convertJsonToCsv(jsonData) {
    try {
        const csv = parse(jsonData);
        return csv;
    } catch (error) {
        throw new Error('Failed to convert JSON to CSV.');
    }
}

function saveCsvToFile(csvData, filePath) {
    try {
        fs.writeFileSync(filePath, csvData);
        console.log('Data has been saved to', filePath);
    } catch (error) {
        throw new Error('Failed to save CSV file.');
    }
}

async function main() {
    try {
        const token = await authenticate();
        const jsonData = await fetchData(token);
        const csvData = convertJsonToCsv(jsonData);

        const outputPath = './output.csv';
        saveCsvToFile(csvData, outputPath);
    } catch (error) {
        console.error('Error in main execution:', error.message);
    }
}

main();

