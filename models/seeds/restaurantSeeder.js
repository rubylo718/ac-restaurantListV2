import Restaurants from '../restaurants.js'
import mongoose from 'mongoose'

import { createRequire } from 'module'
mongoose.connect(process.env.MONGODB_URI_RES)
const db = mongoose.connection // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url) // construct the require method
const restaurantList = require('../../restaurant.json') // use the require method

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected! run the seeder')
  Restaurants.create(restaurantList.results)
  console.log('done')
})
