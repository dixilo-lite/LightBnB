INSERT INTO users (name,email,password)
VALUES ('Eva Stanley', 'sebastianguerra@ymail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer' , 'jacksonrose@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dominic Parks', 'victoriablackwell@outlook.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id,title,description,thumbnail_photo_url,cover_photo_url,cost_per_night,parking_spaces,number_of_bathrooms,number_of_bedrooms,country,street,city,province,post_code,active)
VALUES (1 , 'Speed lamp' , 'description' , 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350' , 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg' , 93061 , 6 , 4 , 8 , 'Canada'  , '536 Namsub Highway' , 'Sotboske', 'Quebec', '28142' , true),
(1 , 'Blank corner'      , 'description' , 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350' , 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg' , 85234 , 6 , 6 ,7 , 'Canada'  , '651 Nami Road' , 'Bohbatev' , 'Alberta'  , '83680'  ,true),
(2 , 'Habit mix'         , 'description' , 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350' , 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg' , 46058 , 0 ,5 , 6 , 'Canada' , '1650 Hejto Center', 'Genwezuj' , 'Newfoundland And Labrador' , '44583' , true);

INSERT INTO reservations (start_date,end_date,property_id,guest_id)
VALUES ( '2018-09-11' , '2018-09-26', 2 , 3),
('2019-01-04' , '2019-02-01', 2 ,2),
('2023-10-01' , '2023-10-14', 1 ,3);

INSERT INTO property_reviews (guest_id,property_id,reservation_id,rating,message)
VALUES ( 3 , 2 , 1 , 3 , 'messages'),
( 2 , 2 , 2 , 4 , 'messages'),
( 3 , 1 , 3 , 4 , 'messages');


const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  /*let resolvedUser = null;
  for (const userId in users) {
    const user = users[userId];
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      resolvedUser = user;
    }
  }
  return Promise.resolve(resolvedUser);*/
  return pool
    .query(`SELECT * FROM users
      WHERE users.email = $1`, [email])
    .then((result) => {
      
      if(result.rows.length === 0)
      {
        return null;
      }
      console.log(result.rows[0]);
      
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  //return Promise.resolve(users[id]);
   return pool
    .query(`SELECT * FROM users
      WHERE users.id = $1`, [id])
    .then((result) => {
      console.log(result.rows);
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

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
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
