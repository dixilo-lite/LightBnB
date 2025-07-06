SELECT properties.city, COUNT(reservations) as total_reservations
FROM reservations
JOIN properties ON property_id = property.id
GROUP BY properties.city
ORDER BY total_reservations DESC;