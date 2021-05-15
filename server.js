const express = require('express');

const db = require('./db');
const { client, syncAndSeed, getBrands, createBrand } = db;

const app = express();

app.get('/', async(req, res, next)=> {
  try {
    const brands = await getBrands();
    res.send(`
      <html>
        <body>
          <ul>
            ${
              brands.map( brand => {
                return `
                  <li>
                    <a href='/brands/${brand.id}'>
                      ${ brand.name }
                    </a>
                  </li>
                `;
              }).join('')
            }
          </ul>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

const start = async()=> {
  try {
    await client.connect();
    await syncAndSeed();
    const brands = await Promise.all([
      createBrand('nike'),
      createBrand('converse'),
      createBrand('addidas')
    ]);
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
