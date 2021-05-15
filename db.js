const pg = require('pg');

const client = new pg.Client('postgres://localhost/sneaker_world_db');

const createBrand = async(name)=> {
  return (await client.query(`
  INSERT INTO brands(name) values($1) returning *
  `, [name])).rows[0];
};

const createSneaker = async(name, brandId)=> {
  const SQL = 'INSERT INTO sneakers(name, brand_id) VALUES ($1, $2) RETURNING *';
  const response = await client.query(SQL, [name, brandId]);
  return response.rows[0];
};

const getBrands = async()=> {
  return (await client.query('SELECT * from brands')).rows;
};

const getSneakersByBrand = async(id)=> {
  return (await client.query(`
    SELECT * from sneakers 
    WHERE brand_id=$1
  `, [ id ])).rows;
};

const getBrand = async(id)=> {
  const response = await client.query('SELECT * FROM brands WHERE id = $1', [id]);
  return response.rows[0];
};

const syncAndSeed = async()=> {
  const SQL = `
  DROP TABLE IF EXISTS ownership;
DROP TABLE IF EXISTS sneakers;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS collectors;

CREATE TABLE brands(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE
);

CREATE TABLE sneakers(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  brand_id INTEGER REFERENCES brands(id)
);
  `;
  await client.query(SQL);
};

module.exports = {
  client,
  getBrands,
  getBrand,
  createBrand,
  createSneaker,
  getSneakersByBrand,
  syncAndSeed
};
