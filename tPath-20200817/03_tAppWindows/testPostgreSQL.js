const { Client } = require('pg');

const client = new Client()
await client.connect()
const res = await client.query('SELECT NOW()')
await client.end()