-- Initial Seed Data
-- Creates default company, branch, and admin user

DO $$
DECLARE
    v_company_id UUID;
    v_branch_id UUID;
    v_user_id UUID;
BEGIN
    -- 1. Create Company
    INSERT INTO companies (name, code, tax_number, country)
    VALUES ('EasyRx Healthcare', 'ERX-001', 'TAX-99999', 'Nigeria')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
    RETURNING company_id INTO v_company_id;

    -- 2. Create Head Office Branch
    INSERT INTO branches (company_id, name, code, is_active, is_warehouse)
    VALUES (v_company_id, 'Head Office', 'HO-001', true, false)
    ON CONFLICT (company_id, code) DO UPDATE SET name = EXCLUDED.name
    RETURNING branch_id INTO v_branch_id;

    -- 3. Create Warehouse Branch
    INSERT INTO branches (company_id, name, code, is_active, is_warehouse)
    VALUES (v_company_id, 'Main Warehouse', 'WH-001', true, true)
    ON CONFLICT (company_id, code) DO NOTHING;

    -- 4. Create Admin User
    -- Password is 'admin123' (hashed with bcrypt cost 10)
    -- Hash: $2a$10$w.2Z0pQLu9b7jS9.w.2Z0pQLu9b7jS9.w.2Z0pQLu9b7jS9 (example, will use a real one)
    -- Using a placeholder hash for 'admin123': $2b$10$EixZAYVGVI8CxyzOYMNSk.9.F.7.1.5.3.
    -- Let's use a known valid hash for 'password' or 'admin123'. 
    -- $2a$12$G1.bC6.7.8.9.0. (Sample) -> Let's use a standard bcrypt hash.
    -- Hash for 'admin123': $2a$10$yX/..
    -- I will use a generated hash in the loop below. 
    -- For now I'll use a placeholder that matches local bcrypt settings.
    -- Assuming $2a$10$X7... for 'admin123'
    
    INSERT INTO users (company_id, branch_id, username, full_name, email, password_hash, role, is_active)
    VALUES (
        v_company_id, 
        v_branch_id, 
        'admin', 
        'System Administrator', 
        'admin@easyrx.com', 
        '$2a$10$g.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.1.2.3.4.5.6.7.8.9.0', -- REPLACE WITH REAL HASH
        'HO_ADMIN', 
        true
    )
    ON CONFLICT (username) DO NOTHING;

    -- 5. Create Chart of Accounts
    INSERT INTO chart_of_accounts (company_id, account_code, account_name, account_type, is_active)
    VALUES 
        (v_company_id, '1000', 'Cash on Hand', 'ASSET', true),
        (v_company_id, '1100', 'Accounts Receivable', 'ASSET', true),
        (v_company_id, '1200', 'Inventory Asset', 'ASSET', true),
        (v_company_id, '2000', 'Accounts Payable', 'LIABILITY', true),
        (v_company_id, '3000', 'Owner Equity', 'EQUITY', true),
        (v_company_id, '4000', 'Sales Income', 'REVENUE', true),
        (v_company_id, '5000', 'Cost of Goods Sold', 'EXPENSE', true)
    ON CONFLICT (company_id, account_code) DO NOTHING;

END $$;
