const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.My_DB}:${process.env.My_Pass}@cluster0.8cqdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
      await client.connect();
      const database = client.db("priceDb");
      const salesCollection = database.collection("salesCollection");
      
        app.get("/information", async (req, res) => {
            const finding = salesCollection.find({});
            console.log(finding);
            const result = await finding.toArray();
            res.json(result);
        })

        app.put("/sales", async (req, res) => {
            const id = req.params.id;
            // console.log(req);
            const updateSales = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    current_sales: updateSales.current_sales,
                    total_sales: updateSales.current_sales,

                },
            };
            const result = await salesCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });
     //checking catagory name
        app.get('/information/:category', async (req, res) => {
            const category = req.params.parent.category.category_name;
            const query = {category: category};
            const category_n = await salesCollection.findOne(query);
            if(category_n?.category_name)
            {
                res.json(category_n);
            }
           
          })

          app.delete('/information/:id', async (req, res) =>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            console.log(query);
            const result = await salesCollection.deleteOne(query);
            res.json(result);
          })
        

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/', async(req, res)=>{
    app.send("Tata server is running");
})
app.listen(port, ()=>{
    console.log("listen on port "+ port);
});