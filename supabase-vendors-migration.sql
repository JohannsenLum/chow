-- Create vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('food', 'services', 'retail')),
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    distance_km DECIMAL(5,2),
    image_url TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON public.vendors(rating);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON public.vendors(is_active);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Vendors are viewable by everyone" ON public.vendors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Vendors are insertable by authenticated users" ON public.vendors
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Vendors are updatable by authenticated users" ON public.vendors
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO public.vendors (name, description, category, rating, distance_km, image_url, address, phone, latitude, longitude) VALUES
('Crunchy Pet Foods', 'Customisable Food Products for all pet types', 'food', 5.0, 1.8, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200', '123 Serangoon Road, Singapore 556123', '+65 6123 4567', 1.3502, 103.8729),
('Kohepets', 'Pet store for food, treats and essentials', 'food', 4.8, 2.5, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200', '456 Hougang Avenue 8, Singapore 530456', '+65 6456 7890', 1.3521, 103.8755),
('Pet''s Galaxy Grooming', 'Cat Grooming Specialist with 15+ years experience', 'services', 4.9, 0.75, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200', '789 Ang Mo Kio Avenue 6, Singapore 560789', '+65 6789 0123', 1.3489, 103.8712),
('Wheeky Pet Grooming', 'Pet Groomer, 10+ years in business', 'services', 4.9, 2.5, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=200', '321 Bishan Street 11, Singapore 570321', '+65 6321 4567', 1.3515, 103.8742),
('PET TO DDHouse', 'Pet supplies store with wide selection', 'retail', 5.0, 2.1, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200', '654 Clementi Avenue 2, Singapore 120654', '+65 6654 3210', 1.3498, 103.8721),
('SG Pet Accessories', 'Affordable selection of Pet Accessories, Food and Toys', 'retail', 4.9, 7.8, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200', '987 Jurong East Street 24, Singapore 600987', '+65 6987 6543', 1.3505, 103.8738),
('Paws & Claws Vet Clinic', 'Complete veterinary care and emergency services', 'services', 4.7, 1.2, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200', '147 Tampines Street 11, Singapore 521147', '+65 6147 2580', 1.3518, 103.8748),
('Furry Friends Pet Store', 'Premium pet supplies and accessories', 'retail', 4.6, 0.9, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200', '258 Orchard Road, Singapore 238863', '+65 6258 3691', 1.3508, 103.8735),
('Healthy Paws Nutrition', 'Specialized nutrition and dietary supplements', 'food', 4.8, 1.5, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200', '369 Marine Parade Road, Singapore 440369', '+65 6369 1470', 1.3521, 103.8755),
('Pet Paradise Grooming', 'Full-service pet grooming and spa treatments', 'services', 4.5, 2.8, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=200', '741 Bedok North Street 1, Singapore 460741', '+65 6741 8520', 1.3489, 103.8712);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vendors_updated_at 
    BEFORE UPDATE ON public.vendors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 