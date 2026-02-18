-- Update New York Providers
UPDATE providers SET latitude = 40.739772, longitude = -73.990494 WHERE slug = 'manhattan-aesthetics-ny';
UPDATE providers SET latitude = 40.761569, longitude = -73.971661 WHERE slug = 'nyc-dermatology';
UPDATE providers SET latitude = 40.768681, longitude = -73.967283 WHERE slug = 'fifth-avenue-med-spa';

-- Update Los Angeles Providers
UPDATE providers SET latitude = 34.067332, longitude = -118.401494 WHERE slug = 'beverly-hills-aesthetics';
UPDATE providers SET latitude = 34.062147, longitude = -118.300645 WHERE slug = 'la-dermatology-center';
UPDATE providers SET latitude = 34.084478, longitude = -118.384196 WHERE slug = 'west-hollywood-med-spa';

-- Update Miami Providers
UPDATE providers SET latitude = 25.770281, longitude = -80.132717 WHERE slug = 'south-beach-aesthetics';
UPDATE providers SET latitude = 25.767931, longitude = -80.189574 WHERE slug = 'miami-dermatology';
UPDATE providers SET latitude = 25.749666, longitude = -80.259740 WHERE slug = 'coral-gables-med-spa';
