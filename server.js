const express = require('express');

const db = require('./db');
const {
  client,
  syncAndSeed,
  getBrands,
  getBrand,
  getSneakersByBrand,
  createBrand,
  createSneaker
} = db;

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res)=> res.redirect('/brands'));

app.use('/brands', require('./brands_router'));


const start = async()=> {
  try {
    await client.connect();
    await syncAndSeed();
    const brands = await Promise.all([
      createBrand('nike'),
      createBrand('converse'),
      createBrand('addidas')
    ]);
    console.log(await createSneaker('Air Jordan', brands[0].id));
    console.log(await createSneaker('Air Max', brands[0].id));
    console.log(await createSneaker('All Star', brands[1].id));

    console.log(await getSneakersByBrand(brands[0].id));
    //console.log(await getBrands());
    //console.log(await getBrand(brands[2].id));
    const port = process.env.PORT || 3000;
    console.log('synched and seeded');
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

start();
