const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});

const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users
      WHERE users.email = $1`, [email])
    .then((result) => {
      
      if(result.rows.length === 0)
      {
        return null;
      }      
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getUserWithId = function (id) {
  //return Promise.resolve(users[id]);
   return pool
    .query(`SELECT * FROM users
      WHERE users.id = $1`, [id])
    .then((result) => {
      if(result.rows.length === 0)
      {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addUser = function (user) {
  console.log(user);
  return pool
  .query(`INSERT INTO users (name, email, password)
    VALUES ($1,$2,$3)
    RETURNING *;`, [user.name,user.email,user.password])
  .then ((result) => {
    console.log(result.rows);
    return result.rows[0];
  })
  .catch ((err) => {
    console.log(err.message);
  });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
  .query(`SELECT * FROM reservations
   JOIN properties ON properties.id = property_id
   JOIN users ON $1 = users.id
   LIMIT $2; `, [guest_id,limit])
   .then ((results) => {
    console.log(results.rows);
    return results.rows;
   })
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
 return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};