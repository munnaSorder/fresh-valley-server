/*
* Title: Fresh Valley Server
* Description: This is a very simple project. There are some common rest API. Given assignments from this  project programming hero team.
* Author: Munna Islam
* Date: 05/12/21
*/

// require dependencies
const express = require('express')
const app = express();
const port = 5252;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const { ObjectId } = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://mCommerceDB:${process.env.DB_PASS}@cluster0.ddbes.mongodb.net/mCommerceDB?retryWrites=true&w=majority`;

// middleware
app.use(cors())
app.use(bodyParser.json())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    // db collection
  const productCollections = client.db("products").collection("items");
  const adminCollections = client.db("adminPanel").collection("list");
  const freshCard = client.db("freshCard").collection("items");
  const pendingOrder = client.db("pending").collection("order");

    // all product save in db api
    // app.post('/allProduct', (req, res) => {
    //     productCollections.insertMany(req.body)
    //     .then(result => console.log('add'))
    // })

    // initial load all products api
    app.get('/allProduct', (req, res) => {
      productCollections.find({})
      .toArray((err, docs) => {
        res.send(docs)
      })
    })

    // product search api
    app.get('/searchProducts/:name', (req, res) => {
      const reqWithRegExp = new RegExp("^" + req.params.name, 'i');
      productCollections.find({"name": reqWithRegExp})
      .toArray((err, docs) => {
        if(!err && docs) {
          res.status(200).send(docs)
        }else {
          res.status(404).send(err)
        }
      })
    })

    // load single product
    app.get('/singleProduct/:id', (req, res) => {
      productCollections.find({_id: ObjectId(req.params.id)})
      .toArray((err, docs) => {
        res.status(200).send(docs[0])
      })
    })

    // update product
    app.patch('/updateProduct/:id', (req, res) => {
      productCollections.updateOne({_id: ObjectId(req.params.id)},{
        $set: {
          name: req.body.name,
          price: req.body.price,
          photo: req.body.photo,
          weight: req.body.weight
        }
      })
      .then(result => res.send(result.modifiedCount > 0))
    })

    // add single product
    app.post('/addSingleProduct', (req, res) => {
      productCollections.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })


    // add item to card
    app.post('/addItem', (req, res) => {
      freshCard.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })

    // filter order
    app.get('/filterOrder/:email', (req, res) => {
      freshCard.find({email: req.params.email})
      .toArray((err, docs) => {
        res.status(200).send(docs)
      })
    })

    // increase card product quantity
    // app.patch('/increaseProductQuantity/:id', (req, res) => {
    //   freshCard.updateOne({_id: ObjectId(req.params.id)},{
    //     $set: { 
    //       quantity: req.body.quantity
    //     }
    //   })
    //   .then(result => res.send(result.modifiedCount > 0))
    // })
   
    // delete product
    app.delete('/deleteProduct/:id', (req, res) => {
      productCollections.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(result.deletedCount > 0)
      })
    })

    // add admin to db
    app.post('/addAdmin', (req, res) => {
      adminCollections.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })

    // get all admin collection
    app.get('/getAdminList', (req, res) => {
      adminCollections.find({})
      .toArray((err, docs) => {
        res.status(200).send(docs)
      })
    })

     // remove admin
     app.delete('/removeAdmin/:id', (req, res) => {
      adminCollections.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(result.deletedCount > 0)
      })
    })

    app.post('/pendingOrder', (req, res) => {
      pendingOrder.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })

    app.get('/getPendingOrder/:email', (req, res) => {
      pendingOrder.find({email: req.params.email})
      .toArray((err, docs) => {
        res.send(docs)
      })
    })

    app.delete('/pendingOrderDelete/:email', (req, res) => {
      freshCard.deleteMany({email: req.params.email})
      .then(result => {
        res.send(result.deleteCount > 0)
      })
    })
    
});

// server default route
app.get('/', (req, res) => {
    res.send('server run success')
})

// run server
app.listen(process.env.PORT || port)