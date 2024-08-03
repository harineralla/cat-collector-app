select * from cats where id=252

delete from cats

SELECT * FROM cats
-- SELECT * FROM cats where favorite =  false ORDER BY id

ALTER TABLE cats
ADD COLUMN breed_id TEXT,
ADD COLUMN breed_name TEXT,
ADD COLUMN cfa_url TEXT,
ADD COLUMN vetstreet_url TEXT,
ADD COLUMN vcahospitals_url TEXT,
ADD COLUMN origin TEXT,
ADD COLUMN life_span TEXT,
ADD COLUMN alt_names TEXT


SELECT * FROM cats WHERE favorite = false AND breed_name = 'Bombay' ORDER BY id;
