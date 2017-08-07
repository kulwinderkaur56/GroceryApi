const Hapi = require('hapi')
const monk = require('monk')
require('dotenv').config()


const server = new Hapi.Server()

server.connection(
{
  host:'localhost',
  port:3000
});

const db = monk('localhost:27017/grocery')
const grocery = db.get('grocery')
server.route(require('./items'))

server.route([
    {
      method: 'GET',
      path: '/grocery',
      handler: (request, reply) => {
          return reply('grocery store')
      }
    },
    {
        path: '/items',
        method: 'GET',
        handler: async (request, reply) => {
            let allDocs = await grocery.find()
            return reply(allDocs)
        }
    },
     {
        path: '/items/{foodname}',
        method: 'GET',
        handler: async (request, reply) => {
            let allDocs = await grocery.find()
            return reply(allDocs)
        }
    },
    {
        method: 'POST',
        path: '/food',
        handler: async (request, reply) => {
            let newDoc = await grocery.insert(request.payload)
            return reply(newDoc)
        }
    }
])


server.start((err) => {
  if (err) {
    throw err
  }
  console.log('server listening at: ', server.info.uri)
})
  
  