const router = require('express').Router();

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

router.get('/:id', async(req, res, next)=> {
  try {
    const brand = await getBrand(req.params.id);
    const sneakers = await getSneakersByBrand(req.params.id);
    res.send(`
      <html>
        <head>
        </head>
        <body>
          <a href='/brands'>All Brands</a>
          <h1>${ brand.name }</h1> 
          <ul>
            ${
              sneakers.map( sneaker => {
                return `
                  <li>
                    ${ sneaker.name }
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

router.get('/', async(req, res, next)=> {
  try {
    const brands = await getBrands();
    res.send(`
      <html>
        <body>
          <form method='POST'>
            <input name='name' />
            <button>Create Brand</button>
          </form>
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

router.post('/', async(req, res, next)=> {
  try {
    const brand = await createBrand(req.body.name);
    res.redirect(`/brands/${brand.id}`);
  }
  catch(ex){
    next(ex);
  }

});

module.exports = router;
