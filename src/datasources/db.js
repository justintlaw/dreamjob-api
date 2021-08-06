'use strict'

// const { database } = require('dreamjob-db')

// const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager')

// const secretsClient = new SecretsManagerClient()

// async function test() {
//   const dbSecrets = await secretsClient.send(new GetSecretValueCommand({
//     SecretId: 'arn:aws:secretsmanager:us-east-1:163961535528:secret:CdkStackStackDreamjobSecret-zrpN2XrsD99i-HMRhs1'
//   }))

//   console.log(JSON.parse(dbSecrets.SecretString))
// }

// test()

const { database } = require('dreamjob-db')({
  client: process.env.engine || 'mysql',
  host: process.env.host || '127.0.0.1',
  user: process.env.user || 'root',
  password: process.env.password || 'password',
  database: process.env.database || 'dreamjob_db'
})

module.exports = database
