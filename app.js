import express from 'express'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'
import Restaurants from './models/restaurants.js'
// import { createRequire } from 'module' // Bring in the ability to create the 'require' method
// const require = createRequire(import.meta.url) // construct the require method
// const restaurantList = require('./restaurant.json') // use the require method

const app = express()
const port = 3000
mongoose.connect(process.env.MONGODB_URI_RES)
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected! good')
})

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))

// view all restaurants (GET '/')
app.get('/', (req, res) => {
  Restaurants.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// go to add-new page
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
// add new restaurant: POST '/restaurants and redirect to '/'
app.post('/restaurants', (req, res) => {
  return Restaurants.create(req.body)
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
})

// view detail of a certain restaurant
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurants.findById(id)
  .lean()
  .then(restaurant => res.render('show', { restaurant }))
  .catch(error => console.log(error))
})

// go to edit page
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurants.findById(id)
  .lean()
  .then(restaurant => res.render('edit', { restaurant }))
  .catch(error => console.log(error))
})
// update detail info after edit
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurants.findByIdAndUpdate(id, req.body)
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
}) 

// delete a certain restaurant
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurants.findByIdAndDelete(id, req.body)
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
})

// search
// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   Restaurants.find()
//   .lean()
//   .then(restaurant => {
//     const restaurants = restaurant.filter(restaurant => 
//     restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || 
//     restaurant.category.includes(keyword)
//   )
//   res.render('index', { restaurant: restaurants, keyword: keyword })
// })
//   .catch(error => console.log(error))  
// })


app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
