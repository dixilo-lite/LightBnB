SELECT reservations.id, properties.title, reservations.start_date, properties.cost_per_night, AVG(rating) as average_rating
FROM reservations
JOIN properties on reservations.property_id = property.id
JOIN property_reviews on property.id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
limit 10;