const Boom = require('boom');  
const uuid = require('node-uuid'); 
const monk = require('monk')
const async = require('async')
// validate objects with JOI, more on this next week
const Joi = require('joi')
require('dotenv').config()


// get the DBURL value 
const db = monk(process.env.DBURL)
// get or create a collection in mongo
const grocery = db.get('grocery')

// schema to test new objects against
// for now think of this like a check list for creating a new Book
const grocerySchema = Joi.object().keys({
  storename: Joi.string(),
  foodname: Joi.string(),
  price:Joi.number(),
  date: Joi.date()
}).and('foodname', 'storename', 'price','date')

module.exports = [
  {
    method: 'POST',
    path: '/store',
    config: {
      validate: {
        payload: grocerySchema
      }
    },
    handler: createNewgrocery
  },
  {
    method: 'PUT',
    path: '/update/{id}',
    handler: updategrocery
  },
   {
    method: 'DELETE',
    path: '/foods/{id}',
    handler: deletegrocery
  }
 ]
async function deletegrocery(request, reply)
{
   try {
        let removed = await grocery.remove({_id: request.payload['_id']}, {multi: false})
        return reply ().code(204)
      } catch (err) {
        console.error(err)
    }
}

async function createNewgrocery (request, reply) {
  try {
    let food = await grocery.find({}, {limit: 1, sort: {'_id': -1}})
    let groceryobj = request.payload
   groceryobj['_id'] = food[0]['_id'] + 1
    let newfood = await grocery.insert(groceryobj)
    return reply(newfood).code(201)
  } catch (err) {
    console.error(err)
  }
}


async function updategrocery (request, reply) {
  try {
    let groceryToUpdate = await grocery.update({_id:ObjectId(request.params.id)}, {$set: request.payload})
    return reply(request.payload).code(200)
  } catch (err) {
    console.error(err)
}
}