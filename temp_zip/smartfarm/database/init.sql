-- ============================================
--   SMARTFARM DATABASE SCHEMA (PostgreSQL)
-- ============================================

-- USERS & AUTH
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'farmer' CHECK (role IN ('farmer','buyer','admin')),
    google_id VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255),
    location VARCHAR(255),
    state VARCHAR(100),
    district VARCHAR(100),
    land_area_acres DECIMAL(10,2),
    soil_type VARCHAR(100),
    irrigation_type VARCHAR(100),
    bank_account VARCHAR(50),
    ifsc_code VARCHAR(20),
    kyc_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE buyer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCTS / MARKETPLACE
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    quantity_kg DECIMAL(10,2),
    unit VARCHAR(50) DEFAULT 'kg',
    images TEXT[],
    location VARCHAR(255),
    state VARCHAR(100),
    grade VARCHAR(50),
    organic BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','active','sold','rejected')),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    buyer_id UUID REFERENCES users(id),
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
    id VARCHAR(30) PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    buyer_id UUID REFERENCES users(id),
    farmer_id UUID REFERENCES users(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2),
    net_to_farmer DECIMAL(10,2),
    delivery_address TEXT,
    status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('confirmed','processing','shipped','in_transit','delivered','cancelled','refunded')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending','escrow','released','refunded')),
    payment_method VARCHAR(50),
    expected_delivery DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PAYMENTS & ESCROW
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(30) REFERENCES orders(id),
    user_id UUID REFERENCES users(id),
    type VARCHAR(30) CHECK (type IN ('payment','escrow_hold','escrow_release','withdrawal','commission','refund')),
    amount DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'INR',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE escrow_wallet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(30) REFERENCES orders(id) UNIQUE,
    amount DECIMAL(10,2),
    released BOOLEAN DEFAULT false,
    released_at TIMESTAMP,
    release_trigger VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE withdraw_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES users(id),
    amount DECIMAL(10,2),
    bank_account VARCHAR(50),
    ifsc_code VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ML PREDICTIONS
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(30) CHECK (type IN ('crop','rain','disease')),
    input_data JSONB,
    result JSONB,
    model_version VARCHAR(50),
    confidence DECIMAL(4,3),
    created_at TIMESTAMP DEFAULT NOW()
);

-- SUPPORT
CREATE TABLE support_tickets (
    id VARCHAR(20) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    category VARCHAR(100),
    subject VARCHAR(255),
    description TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
    assigned_to UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_farmer ON orders(farmer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_predictions_user ON predictions(user_id);

-- SEED DATA
INSERT INTO users (name, email, password_hash, role, email_verified) VALUES
('Admin User', 'admin@smartfarm.in', '$2a$10$placeholder_hash', 'admin', true),
('Demo Farmer', 'farmer@demo.com', '$2a$10$placeholder_hash', 'farmer', true),
('Demo Buyer', 'buyer@demo.com', '$2a$10$placeholder_hash', 'buyer', true);
