const Pool = require('pg').Pool
const pool = new Pool({
  user: 'hackatonchallenge',
  host: '127.0.0.1',
  database: 'rmrk',
  password: 'password##!',
  port: 5432,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getRMRK1ByOwner = (request, response) => {
    const id = request.params.id

    console.log("Received id is: ", id)
  
    pool.query('SELECT * FROM nfts_v1 WHERE owner = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getRMRK2ByOwner = (request, response) => {
  const id = request.params.id

  console.log("Received id is: ", id)

  pool.query('SELECT * FROM nfts_v2 WHERE owner = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getRMRK2ResourceBNftId = (request, response) => {
  const id = request.params.id

  console.log("Received id is: ", id)

  pool.query('SELECT * FROM nft_resources_v2 WHERE nft_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getRMRK1ByOwner,
  getRMRK2ByOwner,
  getRMRK2ResourceBNftId
}