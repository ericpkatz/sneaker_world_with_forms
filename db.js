const pg = require('pg');

const client = new pg.Client('postgres://localhost/sneaker_world_db');

const createBrand = async(name)=> {
  return (await client.query(`
  INSERT INTO brands(name) values($1) returning *
  `, [name])).rows[0];
};

const getBrands = async()=> {
  return (await client.query('SELECT * from brands')).rows;
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
  name VARCHAR(100)
);

CREATE TABLE sneakers(
  id INTEGER PRIMARY KEY,
  name VARCHAR(100),
  brand_id INTEGER REFERENCES brands(id)
);

CREATE TABLE collectors(
  id INTEGER PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE ownership(
  id INTEGER PRIMARY KEY,
  size INTEGER,
  condition VARCHAR(10),
  sneaker_id INTEGER REFERENCES sneakers(id),
  collector_id INTEGER REFERENCES collectors(id)
);
  `;
  await client.query(SQL);
};

module.exports = {
  client,
  getBrands,
  createBrand,
  syncAndSeed
};
