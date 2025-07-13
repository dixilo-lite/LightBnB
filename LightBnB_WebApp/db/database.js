const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});

const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users
      WHERE users.email = $1`, [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getUserWithId = function(id) {
  //return Promise.resolve(users[id]);
  return pool
    .query(`SELECT * FROM users
      WHERE users.id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addUser = function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
   FROM reservations 
   JOIN properties on properties.id = reservations.property_id
   JOIN property_reviews on properties.id = property_reviews.property_id
   JOIN users on $1 = users.id
   GROUP BY properties.id, reservations.id
   ORDER BY reservations.start_date ASC
   LIMIT $2; `, [guest_id, limit])
    .then((results) => {
      return results.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews on properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}
    `;
  }
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `WHERE properties.owner_id = $${queryParams.length}
    `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`, `${options.maximum_price_per_night * 100}`);
    // checks if city is included in the SQL query
    if (queryParams.length === 3) {
      queryString += `AND properties.cost_per_night > $${queryParams.length - 1} AND properties.cost_per_night < $${queryParams.length}
      `;
    } else {
      queryString += `WHERE properties.cost_per_night > $${queryParams.length - 1} AND properties.cost_per_night < $${queryParams.length}
    `;
    }
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    //checks if city is included in the SQL query
    if (queryParams.length === 2) {
      queryString += `AND properties.cost_per_night > $${queryParams.length} 
      `;
    } else {
      queryString += `WHERE properties.cost_per_night > $${queryParams.length}
    `;
    }
  }
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    if (queryParams.length === 2) {
      queryString += `AND properties.cost_per_night < $${queryParams.length}
      `;
    } else {
      queryString += `WHERE properties.cost_per_night < $${queryParams.length}
    `;
    }
  }

  queryString += `GROUP BY properties.id
 `;
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);

    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams).then((res) => res.rows);
};

const addProperty = function(property) {
  return pool
    .query(`INSERT INTO properties (owner_id, title, description, thumbnail_photo_url,cover_photo_url,cost_per_night,street, city, province, post_code, country, parking_spaces, number_of_bathrooms,number_of_bedrooms)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING *;`, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};