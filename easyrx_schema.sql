--
-- PostgreSQL database dump
--

\restrict TyPxm0Xu14ybGqIgH8qKs3fD1FivBMUAW0GDjkr0rRQVccDWcQg4B2TIEnO74un

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-27 13:57:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16625)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5577 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 16804)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    audit_id bigint NOT NULL,
    company_id bigint NOT NULL,
    user_id bigint,
    branch_id bigint,
    action character varying(50) NOT NULL,
    entity_type character varying(100) NOT NULL,
    entity_id character varying(100) NOT NULL,
    before_data jsonb,
    after_data jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    device_id character varying(100)
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16803)
-- Name: audit_logs_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_audit_id_seq OWNER TO postgres;

--
-- TOC entry 5578 (class 0 OID 0)
-- Dependencies: 233
-- Name: audit_logs_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_audit_id_seq OWNED BY public.audit_logs.audit_id;


--
-- TOC entry 223 (class 1259 OID 16679)
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    branch_id bigint NOT NULL,
    company_id bigint NOT NULL,
    name character varying(200) NOT NULL,
    code character varying(50),
    address text,
    city character varying(100),
    is_warehouse boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16678)
-- Name: branches_branch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branches_branch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_branch_id_seq OWNER TO postgres;

--
-- TOC entry 5579 (class 0 OID 0)
-- Dependencies: 222
-- Name: branches_branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branches_branch_id_seq OWNED BY public.branches.branch_id;


--
-- TOC entry 238 (class 1259 OID 16856)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id bigint NOT NULL,
    company_id bigint NOT NULL,
    name character varying(150) NOT NULL,
    parent_id bigint
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16855)
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- TOC entry 5580 (class 0 OID 0)
-- Dependencies: 237
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- TOC entry 282 (class 1259 OID 17570)
-- Name: chart_of_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chart_of_accounts (
    account_id bigint NOT NULL,
    company_id bigint NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    account_type character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.chart_of_accounts OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 17569)
-- Name: chart_of_accounts_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chart_of_accounts_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chart_of_accounts_account_id_seq OWNER TO postgres;

--
-- TOC entry 5581 (class 0 OID 0)
-- Dependencies: 281
-- Name: chart_of_accounts_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chart_of_accounts_account_id_seq OWNED BY public.chart_of_accounts.account_id;


--
-- TOC entry 221 (class 1259 OID 16664)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    company_id bigint NOT NULL,
    name character varying(200) NOT NULL,
    code character varying(50),
    tax_number character varying(50),
    country character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16663)
-- Name: companies_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_company_id_seq OWNER TO postgres;

--
-- TOC entry 5582 (class 0 OID 0)
-- Dependencies: 220
-- Name: companies_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_company_id_seq OWNED BY public.companies.company_id;


--
-- TOC entry 276 (class 1259 OID 17460)
-- Name: controlled_drug_register; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.controlled_drug_register (
    entry_id bigint NOT NULL,
    sale_line_id bigint NOT NULL,
    prescription_id bigint,
    patient_id bigint,
    pharmacist_id bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.controlled_drug_register OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 17459)
-- Name: controlled_drug_register_entry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.controlled_drug_register_entry_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.controlled_drug_register_entry_id_seq OWNER TO postgres;

--
-- TOC entry 5583 (class 0 OID 0)
-- Dependencies: 275
-- Name: controlled_drug_register_entry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.controlled_drug_register_entry_id_seq OWNED BY public.controlled_drug_register.entry_id;


--
-- TOC entry 225 (class 1259 OID 16702)
-- Name: counters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.counters (
    counter_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    device_id character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.counters OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16701)
-- Name: counters_counter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.counters_counter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.counters_counter_id_seq OWNER TO postgres;

--
-- TOC entry 5584 (class 0 OID 0)
-- Dependencies: 224
-- Name: counters_counter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.counters_counter_id_seq OWNED BY public.counters.counter_id;


--
-- TOC entry 245 (class 1259 OID 16950)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    customer_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint,
    full_name character varying(200),
    phone character varying(50),
    email character varying(200),
    address text,
    is_patient boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16949)
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_customer_id_seq OWNER TO postgres;

--
-- TOC entry 5585 (class 0 OID 0)
-- Dependencies: 244
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- TOC entry 287 (class 1259 OID 17645)
-- Name: device_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_registrations (
    device_id character varying(100) NOT NULL,
    branch_id bigint NOT NULL,
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_seen_at timestamp without time zone
);


ALTER TABLE public.device_registrations OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16722)
-- Name: fiscal_years; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiscal_years (
    fiscal_year_id bigint NOT NULL,
    company_id bigint NOT NULL,
    year_label character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_closed boolean DEFAULT false
);


ALTER TABLE public.fiscal_years OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16721)
-- Name: fiscal_years_fiscal_year_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fiscal_years_fiscal_year_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fiscal_years_fiscal_year_id_seq OWNER TO postgres;

--
-- TOC entry 5586 (class 0 OID 0)
-- Dependencies: 226
-- Name: fiscal_years_fiscal_year_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fiscal_years_fiscal_year_id_seq OWNED BY public.fiscal_years.fiscal_year_id;


--
-- TOC entry 258 (class 1259 OID 17141)
-- Name: grn_headers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grn_headers (
    grn_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    supplier_id bigint NOT NULL,
    po_id bigint,
    invoice_no character varying(100),
    received_date date NOT NULL,
    status character varying(30) NOT NULL,
    created_by bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    posted_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.grn_headers OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 17140)
-- Name: grn_headers_grn_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grn_headers_grn_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grn_headers_grn_id_seq OWNER TO postgres;

--
-- TOC entry 5587 (class 0 OID 0)
-- Dependencies: 257
-- Name: grn_headers_grn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grn_headers_grn_id_seq OWNED BY public.grn_headers.grn_id;


--
-- TOC entry 260 (class 1259 OID 17183)
-- Name: grn_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grn_lines (
    grn_line_id bigint NOT NULL,
    grn_id bigint NOT NULL,
    product_id bigint NOT NULL,
    batch_id bigint,
    received_qty numeric(14,3) NOT NULL,
    unit_cost numeric(14,4) NOT NULL
);


ALTER TABLE public.grn_lines OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 17182)
-- Name: grn_lines_grn_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grn_lines_grn_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grn_lines_grn_line_id_seq OWNER TO postgres;

--
-- TOC entry 5588 (class 0 OID 0)
-- Dependencies: 259
-- Name: grn_lines_grn_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grn_lines_grn_line_id_seq OWNED BY public.grn_lines.grn_line_id;


--
-- TOC entry 252 (class 1259 OID 17032)
-- Name: inventory_ledger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_ledger (
    movement_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    warehouse_id bigint,
    product_id bigint NOT NULL,
    batch_id bigint,
    movement_type character varying(30) NOT NULL,
    qty_in numeric(14,3) DEFAULT 0,
    qty_out numeric(14,3) DEFAULT 0,
    unit_cost numeric(14,4),
    unit_price numeric(14,4),
    reference_doctype character varying(50),
    reference_docid bigint,
    created_by bigint,
    posted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.inventory_ledger OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 17031)
-- Name: inventory_ledger_movement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_ledger_movement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_ledger_movement_id_seq OWNER TO postgres;

--
-- TOC entry 5589 (class 0 OID 0)
-- Dependencies: 251
-- Name: inventory_ledger_movement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_ledger_movement_id_seq OWNED BY public.inventory_ledger.movement_id;


--
-- TOC entry 284 (class 1259 OID 17592)
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_entries (
    journal_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint,
    journal_date date NOT NULL,
    source_doctype character varying(50),
    source_docid bigint,
    status character varying(30) NOT NULL,
    created_by bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    posted_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.journal_entries OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 17591)
-- Name: journal_entries_journal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.journal_entries_journal_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.journal_entries_journal_id_seq OWNER TO postgres;

--
-- TOC entry 5590 (class 0 OID 0)
-- Dependencies: 283
-- Name: journal_entries_journal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.journal_entries_journal_id_seq OWNED BY public.journal_entries.journal_id;


--
-- TOC entry 286 (class 1259 OID 17622)
-- Name: journal_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_lines (
    journal_line_id bigint NOT NULL,
    journal_id bigint NOT NULL,
    account_id bigint NOT NULL,
    debit numeric(14,2) DEFAULT 0,
    credit numeric(14,2) DEFAULT 0,
    description character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.journal_lines OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 17621)
-- Name: journal_lines_journal_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.journal_lines_journal_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.journal_lines_journal_line_id_seq OWNER TO postgres;

--
-- TOC entry 5591 (class 0 OID 0)
-- Dependencies: 285
-- Name: journal_lines_journal_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.journal_lines_journal_line_id_seq OWNED BY public.journal_lines.journal_line_id;


--
-- TOC entry 236 (class 1259 OID 16835)
-- Name: manufacturers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturers (
    manufacturer_id bigint NOT NULL,
    company_id bigint NOT NULL,
    name character varying(200) NOT NULL,
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.manufacturers OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16834)
-- Name: manufacturers_manufacturer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturers_manufacturer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.manufacturers_manufacturer_id_seq OWNER TO postgres;

--
-- TOC entry 5592 (class 0 OID 0)
-- Dependencies: 235
-- Name: manufacturers_manufacturer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturers_manufacturer_id_seq OWNED BY public.manufacturers.manufacturer_id;


--
-- TOC entry 246 (class 1259 OID 16975)
-- Name: patient_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_profiles (
    customer_id bigint NOT NULL,
    date_of_birth date,
    gender character varying(10),
    allergies text,
    conditions text,
    notes text
);


ALTER TABLE public.patient_profiles OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 17282)
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    prescription_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    customer_id bigint,
    prescriber_name character varying(200),
    prescription_ref character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 17281)
-- Name: prescriptions_prescription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescriptions_prescription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescriptions_prescription_id_seq OWNER TO postgres;

--
-- TOC entry 5593 (class 0 OID 0)
-- Dependencies: 265
-- Name: prescriptions_prescription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescriptions_prescription_id_seq OWNED BY public.prescriptions.prescription_id;


--
-- TOC entry 241 (class 1259 OID 16914)
-- Name: product_barcodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_barcodes (
    barcode character varying(100) NOT NULL,
    product_id bigint NOT NULL,
    barcode_type character varying(20) NOT NULL
);


ALTER TABLE public.product_barcodes OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 16989)
-- Name: product_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_batches (
    batch_id bigint NOT NULL,
    product_id bigint NOT NULL,
    batch_no character varying(100) NOT NULL,
    expiry_date date,
    is_quarantined boolean DEFAULT false,
    is_expired boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.product_batches OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16988)
-- Name: product_batches_batch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_batches_batch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_batches_batch_id_seq OWNER TO postgres;

--
-- TOC entry 5594 (class 0 OID 0)
-- Dependencies: 247
-- Name: product_batches_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_batches_batch_id_seq OWNED BY public.product_batches.batch_id;


--
-- TOC entry 240 (class 1259 OID 16876)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id bigint NOT NULL,
    company_id bigint NOT NULL,
    brand_name character varying(200) NOT NULL,
    generic_name character varying(200),
    strength character varying(100),
    dosage_form character varying(100),
    manufacturer_id bigint,
    pack_structure character varying(200) NOT NULL,
    sale_unit character varying(50) NOT NULL,
    purchase_unit character varying(50) NOT NULL,
    is_medicine boolean DEFAULT false NOT NULL,
    is_controlled boolean DEFAULT false,
    is_cold_chain boolean DEFAULT false,
    category_id bigint,
    min_stock numeric(14,3),
    max_stock numeric(14,3),
    reorder_point numeric(14,3),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16875)
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- TOC entry 5595 (class 0 OID 0)
-- Dependencies: 239
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- TOC entry 264 (class 1259 OID 17255)
-- Name: purchase_invoice_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_invoice_lines (
    purchase_invoice_line_id bigint NOT NULL,
    purchase_invoice_id bigint NOT NULL,
    product_id bigint NOT NULL,
    batch_id bigint,
    qty numeric(14,3) NOT NULL,
    unit_price numeric(14,4) NOT NULL,
    discount numeric(14,2),
    tax_amount numeric(14,2),
    line_total numeric(14,2)
);


ALTER TABLE public.purchase_invoice_lines OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 17254)
-- Name: purchase_invoice_lines_purchase_invoice_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_invoice_lines_purchase_invoice_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_invoice_lines_purchase_invoice_line_id_seq OWNER TO postgres;

--
-- TOC entry 5596 (class 0 OID 0)
-- Dependencies: 263
-- Name: purchase_invoice_lines_purchase_invoice_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_invoice_lines_purchase_invoice_line_id_seq OWNED BY public.purchase_invoice_lines.purchase_invoice_line_id;


--
-- TOC entry 262 (class 1259 OID 17210)
-- Name: purchase_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_invoices (
    purchase_invoice_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    supplier_id bigint NOT NULL,
    grn_id bigint,
    invoice_no character varying(100) NOT NULL,
    invoice_date date NOT NULL,
    gross_total numeric(14,2),
    discount_total numeric(14,2),
    tax_total numeric(14,2),
    net_total numeric(14,2),
    status character varying(30) NOT NULL,
    created_by bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    posted_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.purchase_invoices OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 17209)
-- Name: purchase_invoices_purchase_invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_invoices_purchase_invoice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_invoices_purchase_invoice_id_seq OWNER TO postgres;

--
-- TOC entry 5597 (class 0 OID 0)
-- Dependencies: 261
-- Name: purchase_invoices_purchase_invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_invoices_purchase_invoice_id_seq OWNED BY public.purchase_invoices.purchase_invoice_id;


--
-- TOC entry 256 (class 1259 OID 17119)
-- Name: purchase_order_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_lines (
    po_line_id bigint NOT NULL,
    po_id bigint NOT NULL,
    product_id bigint NOT NULL,
    ordered_qty numeric(14,3) NOT NULL,
    purchase_unit character varying(50) NOT NULL,
    expected_unit_cost numeric(14,4)
);


ALTER TABLE public.purchase_order_lines OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 17118)
-- Name: purchase_order_lines_po_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_order_lines_po_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_order_lines_po_line_id_seq OWNER TO postgres;

--
-- TOC entry 5598 (class 0 OID 0)
-- Dependencies: 255
-- Name: purchase_order_lines_po_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_order_lines_po_line_id_seq OWNED BY public.purchase_order_lines.po_line_id;


--
-- TOC entry 254 (class 1259 OID 17080)
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_orders (
    po_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    supplier_id bigint NOT NULL,
    po_number character varying(50) NOT NULL,
    status character varying(30) NOT NULL,
    expected_date date,
    created_by bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 17079)
-- Name: purchase_orders_po_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_orders_po_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_orders_po_id_seq OWNER TO postgres;

--
-- TOC entry 5599 (class 0 OID 0)
-- Dependencies: 253
-- Name: purchase_orders_po_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_orders_po_id_seq OWNED BY public.purchase_orders.po_id;


--
-- TOC entry 229 (class 1259 OID 16740)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id bigint NOT NULL,
    company_id bigint NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    is_system_role boolean DEFAULT false
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16739)
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_role_id_seq OWNER TO postgres;

--
-- TOC entry 5600 (class 0 OID 0)
-- Dependencies: 228
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- TOC entry 270 (class 1259 OID 17362)
-- Name: sales_invoice_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_invoice_lines (
    sale_line_id bigint NOT NULL,
    sale_id bigint NOT NULL,
    product_id bigint NOT NULL,
    batch_id bigint,
    qty numeric(14,3) NOT NULL,
    unit_price numeric(14,4) NOT NULL,
    discount numeric(14,2),
    tax_amount numeric(14,2),
    line_total numeric(14,2),
    is_controlled boolean DEFAULT false
);


ALTER TABLE public.sales_invoice_lines OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 17361)
-- Name: sales_invoice_lines_sale_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_invoice_lines_sale_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_invoice_lines_sale_line_id_seq OWNER TO postgres;

--
-- TOC entry 5601 (class 0 OID 0)
-- Dependencies: 269
-- Name: sales_invoice_lines_sale_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_invoice_lines_sale_line_id_seq OWNED BY public.sales_invoice_lines.sale_line_id;


--
-- TOC entry 268 (class 1259 OID 17314)
-- Name: sales_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_invoices (
    sale_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    counter_id bigint,
    customer_id bigint,
    prescription_id bigint,
    sale_number character varying(50),
    sale_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    gross_total numeric(14,2),
    discount_total numeric(14,2),
    tax_total numeric(14,2),
    net_total numeric(14,2),
    payment_method character varying(30) NOT NULL,
    status character varying(30) NOT NULL,
    created_by bigint,
    posted_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sales_invoices OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 17313)
-- Name: sales_invoices_sale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_invoices_sale_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_invoices_sale_id_seq OWNER TO postgres;

--
-- TOC entry 5602 (class 0 OID 0)
-- Dependencies: 267
-- Name: sales_invoices_sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_invoices_sale_id_seq OWNED BY public.sales_invoices.sale_id;


--
-- TOC entry 274 (class 1259 OID 17428)
-- Name: sales_return_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_return_lines (
    return_line_id bigint NOT NULL,
    return_id bigint NOT NULL,
    sale_line_id bigint,
    product_id bigint NOT NULL,
    batch_id bigint,
    qty numeric(14,3) NOT NULL,
    line_total numeric(14,2),
    to_quarantine boolean DEFAULT true
);


ALTER TABLE public.sales_return_lines OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 17427)
-- Name: sales_return_lines_return_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_return_lines_return_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_return_lines_return_line_id_seq OWNER TO postgres;

--
-- TOC entry 5603 (class 0 OID 0)
-- Dependencies: 273
-- Name: sales_return_lines_return_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_return_lines_return_line_id_seq OWNED BY public.sales_return_lines.return_line_id;


--
-- TOC entry 272 (class 1259 OID 17390)
-- Name: sales_returns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_returns (
    return_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    original_sale_id bigint,
    return_number character varying(50),
    return_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reason text,
    created_by bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sales_returns OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 17389)
-- Name: sales_returns_return_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_returns_return_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_returns_return_id_seq OWNER TO postgres;

--
-- TOC entry 5604 (class 0 OID 0)
-- Dependencies: 271
-- Name: sales_returns_return_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_returns_return_id_seq OWNED BY public.sales_returns.return_id;


--
-- TOC entry 280 (class 1259 OID 17544)
-- Name: stock_transfer_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_transfer_lines (
    transfer_line_id bigint NOT NULL,
    transfer_id bigint NOT NULL,
    product_id bigint NOT NULL,
    batch_id bigint,
    qty_requested numeric(14,3) NOT NULL,
    qty_dispatched numeric(14,3),
    qty_received numeric(14,3)
);


ALTER TABLE public.stock_transfer_lines OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 17543)
-- Name: stock_transfer_lines_transfer_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_transfer_lines_transfer_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_transfer_lines_transfer_line_id_seq OWNER TO postgres;

--
-- TOC entry 5605 (class 0 OID 0)
-- Dependencies: 279
-- Name: stock_transfer_lines_transfer_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_transfer_lines_transfer_line_id_seq OWNED BY public.stock_transfer_lines.transfer_line_id;


--
-- TOC entry 278 (class 1259 OID 17491)
-- Name: stock_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_transfers (
    transfer_id bigint NOT NULL,
    company_id bigint NOT NULL,
    source_branch_id bigint NOT NULL,
    dest_branch_id bigint NOT NULL,
    status character varying(30) NOT NULL,
    requested_by bigint,
    approved_by bigint,
    dispatched_by bigint,
    received_by bigint,
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dispatched_at timestamp without time zone,
    received_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.stock_transfers OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 17490)
-- Name: stock_transfers_transfer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_transfers_transfer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_transfers_transfer_id_seq OWNER TO postgres;

--
-- TOC entry 5606 (class 0 OID 0)
-- Dependencies: 277
-- Name: stock_transfers_transfer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_transfers_transfer_id_seq OWNED BY public.stock_transfers.transfer_id;


--
-- TOC entry 243 (class 1259 OID 16928)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    supplier_id bigint NOT NULL,
    company_id bigint NOT NULL,
    name character varying(200) NOT NULL,
    contact_person character varying(200),
    phone character varying(50),
    email character varying(200),
    address text,
    lead_time_days integer,
    return_policy text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16927)
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_supplier_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_supplier_id_seq OWNER TO postgres;

--
-- TOC entry 5607 (class 0 OID 0)
-- Dependencies: 242
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_supplier_id_seq OWNED BY public.suppliers.supplier_id;


--
-- TOC entry 289 (class 1259 OID 17660)
-- Name: sync_queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sync_queue (
    queue_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    device_id character varying(100),
    entity_type character varying(50) NOT NULL,
    local_uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    payload jsonb NOT NULL,
    status character varying(30) NOT NULL,
    retry_count integer DEFAULT 0,
    last_attempt_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sync_queue OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 17659)
-- Name: sync_queue_queue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sync_queue_queue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sync_queue_queue_id_seq OWNER TO postgres;

--
-- TOC entry 5608 (class 0 OID 0)
-- Dependencies: 288
-- Name: sync_queue_queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sync_queue_queue_id_seq OWNED BY public.sync_queue.queue_id;


--
-- TOC entry 232 (class 1259 OID 16786)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16757)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    company_id bigint NOT NULL,
    branch_id bigint,
    username character varying(100) NOT NULL,
    full_name character varying(200),
    email character varying(200),
    password_hash text NOT NULL,
    is_active boolean DEFAULT true,
    last_login_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16756)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5609 (class 0 OID 0)
-- Dependencies: 230
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 250 (class 1259 OID 17012)
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    warehouse_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 17011)
-- Name: warehouses_warehouse_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.warehouses_warehouse_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.warehouses_warehouse_id_seq OWNER TO postgres;

--
-- TOC entry 5610 (class 0 OID 0)
-- Dependencies: 249
-- Name: warehouses_warehouse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.warehouses_warehouse_id_seq OWNED BY public.warehouses.warehouse_id;


--
-- TOC entry 5090 (class 2604 OID 16807)
-- Name: audit_logs audit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN audit_id SET DEFAULT nextval('public.audit_logs_audit_id_seq'::regclass);


--
-- TOC entry 5073 (class 2604 OID 16682)
-- Name: branches branch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches ALTER COLUMN branch_id SET DEFAULT nextval('public.branches_branch_id_seq'::regclass);


--
-- TOC entry 5095 (class 2604 OID 16859)
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- TOC entry 5158 (class 2604 OID 17573)
-- Name: chart_of_accounts account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chart_of_accounts ALTER COLUMN account_id SET DEFAULT nextval('public.chart_of_accounts_account_id_seq'::regclass);


--
-- TOC entry 5070 (class 2604 OID 16667)
-- Name: companies company_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN company_id SET DEFAULT nextval('public.companies_company_id_seq'::regclass);


--
-- TOC entry 5151 (class 2604 OID 17463)
-- Name: controlled_drug_register entry_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controlled_drug_register ALTER COLUMN entry_id SET DEFAULT nextval('public.controlled_drug_register_entry_id_seq'::regclass);


--
-- TOC entry 5078 (class 2604 OID 16705)
-- Name: counters counter_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.counters ALTER COLUMN counter_id SET DEFAULT nextval('public.counters_counter_id_seq'::regclass);


--
-- TOC entry 5107 (class 2604 OID 16953)
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- TOC entry 5082 (class 2604 OID 16725)
-- Name: fiscal_years fiscal_year_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiscal_years ALTER COLUMN fiscal_year_id SET DEFAULT nextval('public.fiscal_years_fiscal_year_id_seq'::regclass);


--
-- TOC entry 5129 (class 2604 OID 17144)
-- Name: grn_headers grn_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_headers ALTER COLUMN grn_id SET DEFAULT nextval('public.grn_headers_grn_id_seq'::regclass);


--
-- TOC entry 5132 (class 2604 OID 17186)
-- Name: grn_lines grn_line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_lines ALTER COLUMN grn_line_id SET DEFAULT nextval('public.grn_lines_grn_line_id_seq'::regclass);


--
-- TOC entry 5120 (class 2604 OID 17035)
-- Name: inventory_ledger movement_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_ledger ALTER COLUMN movement_id SET DEFAULT nextval('public.inventory_ledger_movement_id_seq'::regclass);


--
-- TOC entry 5162 (class 2604 OID 17595)
-- Name: journal_entries journal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries ALTER COLUMN journal_id SET DEFAULT nextval('public.journal_entries_journal_id_seq'::regclass);


--
-- TOC entry 5165 (class 2604 OID 17625)
-- Name: journal_lines journal_line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_lines ALTER COLUMN journal_line_id SET DEFAULT nextval('public.journal_lines_journal_line_id_seq'::regclass);


--
-- TOC entry 5092 (class 2604 OID 16838)
-- Name: manufacturers manufacturer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturers ALTER COLUMN manufacturer_id SET DEFAULT nextval('public.manufacturers_manufacturer_id_seq'::regclass);


--
-- TOC entry 5137 (class 2604 OID 17285)
-- Name: prescriptions prescription_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions ALTER COLUMN prescription_id SET DEFAULT nextval('public.prescriptions_prescription_id_seq'::regclass);


--
-- TOC entry 5111 (class 2604 OID 16992)
-- Name: product_batches batch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_batches ALTER COLUMN batch_id SET DEFAULT nextval('public.product_batches_batch_id_seq'::regclass);


--
-- TOC entry 5096 (class 2604 OID 16879)
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- TOC entry 5136 (class 2604 OID 17258)
-- Name: purchase_invoice_lines purchase_invoice_line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoice_lines ALTER COLUMN purchase_invoice_line_id SET DEFAULT nextval('public.purchase_invoice_lines_purchase_invoice_line_id_seq'::regclass);


--
-- TOC entry 5133 (class 2604 OID 17213)
-- Name: purchase_invoices purchase_invoice_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoices ALTER COLUMN purchase_invoice_id SET DEFAULT nextval('public.purchase_invoices_purchase_invoice_id_seq'::regclass);


--
-- TOC entry 5128 (class 2604 OID 17122)
-- Name: purchase_order_lines po_line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_lines ALTER COLUMN po_line_id SET DEFAULT nextval('public.purchase_order_lines_po_line_id_seq'::regclass);


--
-- TOC entry 5125 (class 2604 OID 17083)
-- Name: purchase_orders po_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders ALTER COLUMN po_id SET DEFAULT nextval('public.purchase_orders_po_id_seq'::regclass);


--
-- TOC entry 5084 (class 2604 OID 16743)
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- TOC entry 5143 (class 2604 OID 17365)
-- Name: sales_invoice_lines sale_line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoice_lines ALTER COLUMN sale_line_id SET DEFAULT nextval('public.sales_invoice_lines_sale_line_id_seq'::regclass);


--
-- TOC entry 5139 (class 2604 OID 17317)
-- Name: sales_invoices sale_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoices ALTER COLUMN sale_id SET DEFAULT nextval('public.sales_invoices_sale_id_seq'::regclass);


--
-- TOC entry 5149 (class 2604 OID 17431)
-- Name: sales_return_lines return_line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_lines ALTER COLUMN return_line_id SET DEFAULT nextval('public.sales_return_lines_return_line_id_seq'::regclass);


--
-- TOC entry 5145 (class 2604 OID 17393)
-- Name: sales_returns return_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns ALTER COLUMN return_id SET DEFAULT nextval('public.sales_returns_return_id_seq'::regclass);


--
-- TOC entry 5157 (class 2604 OID 17547)
-- Name: stock_transfer_lines transfer_line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfer_lines ALTER COLUMN transfer_line_id SET DEFAULT nextval('public.stock_transfer_lines_transfer_line_id_seq'::regclass);


--
-- TOC entry 5153 (class 2604 OID 17494)
-- Name: stock_transfers transfer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers ALTER COLUMN transfer_id SET DEFAULT nextval('public.stock_transfers_transfer_id_seq'::regclass);


--
-- TOC entry 5103 (class 2604 OID 16931)
-- Name: suppliers supplier_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN supplier_id SET DEFAULT nextval('public.suppliers_supplier_id_seq'::regclass);


--
-- TOC entry 5170 (class 2604 OID 17663)
-- Name: sync_queue queue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_queue ALTER COLUMN queue_id SET DEFAULT nextval('public.sync_queue_queue_id_seq'::regclass);


--
-- TOC entry 5086 (class 2604 OID 16760)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5116 (class 2604 OID 17015)
-- Name: warehouses warehouse_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses ALTER COLUMN warehouse_id SET DEFAULT nextval('public.warehouses_warehouse_id_seq'::regclass);


--
-- TOC entry 5516 (class 0 OID 16804)
-- Dependencies: 234
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (audit_id, company_id, user_id, branch_id, action, entity_type, entity_id, before_data, after_data, created_at, device_id) FROM stdin;
\.


--
-- TOC entry 5505 (class 0 OID 16679)
-- Dependencies: 223
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (branch_id, company_id, name, code, address, city, is_warehouse, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5520 (class 0 OID 16856)
-- Dependencies: 238
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, company_id, name, parent_id) FROM stdin;
\.


--
-- TOC entry 5564 (class 0 OID 17570)
-- Dependencies: 282
-- Data for Name: chart_of_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chart_of_accounts (account_id, company_id, code, name, account_type, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5503 (class 0 OID 16664)
-- Dependencies: 221
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (company_id, name, code, tax_number, country, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5558 (class 0 OID 17460)
-- Dependencies: 276
-- Data for Name: controlled_drug_register; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.controlled_drug_register (entry_id, sale_line_id, prescription_id, patient_id, pharmacist_id, created_at) FROM stdin;
\.


--
-- TOC entry 5507 (class 0 OID 16702)
-- Dependencies: 225
-- Data for Name: counters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.counters (counter_id, branch_id, name, device_id, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5527 (class 0 OID 16950)
-- Dependencies: 245
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (customer_id, company_id, branch_id, full_name, phone, email, address, is_patient, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5569 (class 0 OID 17645)
-- Dependencies: 287
-- Data for Name: device_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.device_registrations (device_id, branch_id, registered_at, last_seen_at) FROM stdin;
\.


--
-- TOC entry 5509 (class 0 OID 16722)
-- Dependencies: 227
-- Data for Name: fiscal_years; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiscal_years (fiscal_year_id, company_id, year_label, start_date, end_date, is_closed) FROM stdin;
\.


--
-- TOC entry 5540 (class 0 OID 17141)
-- Dependencies: 258
-- Data for Name: grn_headers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grn_headers (grn_id, company_id, branch_id, supplier_id, po_id, invoice_no, received_date, status, created_by, created_at, posted_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5542 (class 0 OID 17183)
-- Dependencies: 260
-- Data for Name: grn_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grn_lines (grn_line_id, grn_id, product_id, batch_id, received_qty, unit_cost) FROM stdin;
\.


--
-- TOC entry 5534 (class 0 OID 17032)
-- Dependencies: 252
-- Data for Name: inventory_ledger; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_ledger (movement_id, company_id, branch_id, warehouse_id, product_id, batch_id, movement_type, qty_in, qty_out, unit_cost, unit_price, reference_doctype, reference_docid, created_by, posted_at, created_at) FROM stdin;
\.


--
-- TOC entry 5566 (class 0 OID 17592)
-- Dependencies: 284
-- Data for Name: journal_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_entries (journal_id, company_id, branch_id, journal_date, source_doctype, source_docid, status, created_by, created_at, posted_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5568 (class 0 OID 17622)
-- Dependencies: 286
-- Data for Name: journal_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_lines (journal_line_id, journal_id, account_id, debit, credit, description, created_at) FROM stdin;
\.


--
-- TOC entry 5518 (class 0 OID 16835)
-- Dependencies: 236
-- Data for Name: manufacturers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturers (manufacturer_id, company_id, name, address, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5528 (class 0 OID 16975)
-- Dependencies: 246
-- Data for Name: patient_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_profiles (customer_id, date_of_birth, gender, allergies, conditions, notes) FROM stdin;
\.


--
-- TOC entry 5548 (class 0 OID 17282)
-- Dependencies: 266
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (prescription_id, company_id, branch_id, customer_id, prescriber_name, prescription_ref, created_at, created_by) FROM stdin;
\.


--
-- TOC entry 5523 (class 0 OID 16914)
-- Dependencies: 241
-- Data for Name: product_barcodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_barcodes (barcode, product_id, barcode_type) FROM stdin;
\.


--
-- TOC entry 5530 (class 0 OID 16989)
-- Dependencies: 248
-- Data for Name: product_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_batches (batch_id, product_id, batch_no, expiry_date, is_quarantined, is_expired, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5522 (class 0 OID 16876)
-- Dependencies: 240
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, company_id, brand_name, generic_name, strength, dosage_form, manufacturer_id, pack_structure, sale_unit, purchase_unit, is_medicine, is_controlled, is_cold_chain, category_id, min_stock, max_stock, reorder_point, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5546 (class 0 OID 17255)
-- Dependencies: 264
-- Data for Name: purchase_invoice_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_invoice_lines (purchase_invoice_line_id, purchase_invoice_id, product_id, batch_id, qty, unit_price, discount, tax_amount, line_total) FROM stdin;
\.


--
-- TOC entry 5544 (class 0 OID 17210)
-- Dependencies: 262
-- Data for Name: purchase_invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_invoices (purchase_invoice_id, company_id, branch_id, supplier_id, grn_id, invoice_no, invoice_date, gross_total, discount_total, tax_total, net_total, status, created_by, created_at, posted_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5538 (class 0 OID 17119)
-- Dependencies: 256
-- Data for Name: purchase_order_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_lines (po_line_id, po_id, product_id, ordered_qty, purchase_unit, expected_unit_cost) FROM stdin;
\.


--
-- TOC entry 5536 (class 0 OID 17080)
-- Dependencies: 254
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_orders (po_id, company_id, branch_id, supplier_id, po_number, status, expected_date, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5511 (class 0 OID 16740)
-- Dependencies: 229
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, company_id, code, name, is_system_role) FROM stdin;
\.


--
-- TOC entry 5552 (class 0 OID 17362)
-- Dependencies: 270
-- Data for Name: sales_invoice_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_invoice_lines (sale_line_id, sale_id, product_id, batch_id, qty, unit_price, discount, tax_amount, line_total, is_controlled) FROM stdin;
\.


--
-- TOC entry 5550 (class 0 OID 17314)
-- Dependencies: 268
-- Data for Name: sales_invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_invoices (sale_id, company_id, branch_id, counter_id, customer_id, prescription_id, sale_number, sale_date, gross_total, discount_total, tax_total, net_total, payment_method, status, created_by, posted_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5556 (class 0 OID 17428)
-- Dependencies: 274
-- Data for Name: sales_return_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_return_lines (return_line_id, return_id, sale_line_id, product_id, batch_id, qty, line_total, to_quarantine) FROM stdin;
\.


--
-- TOC entry 5554 (class 0 OID 17390)
-- Dependencies: 272
-- Data for Name: sales_returns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_returns (return_id, company_id, branch_id, original_sale_id, return_number, return_date, reason, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5562 (class 0 OID 17544)
-- Dependencies: 280
-- Data for Name: stock_transfer_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_transfer_lines (transfer_line_id, transfer_id, product_id, batch_id, qty_requested, qty_dispatched, qty_received) FROM stdin;
\.


--
-- TOC entry 5560 (class 0 OID 17491)
-- Dependencies: 278
-- Data for Name: stock_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_transfers (transfer_id, company_id, source_branch_id, dest_branch_id, status, requested_by, approved_by, dispatched_by, received_by, requested_at, dispatched_at, received_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5525 (class 0 OID 16928)
-- Dependencies: 243
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (supplier_id, company_id, name, contact_person, phone, email, address, lead_time_days, return_policy, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5571 (class 0 OID 17660)
-- Dependencies: 289
-- Data for Name: sync_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sync_queue (queue_id, branch_id, device_id, entity_type, local_uuid, payload, status, retry_count, last_attempt_at, created_at) FROM stdin;
\.


--
-- TOC entry 5514 (class 0 OID 16786)
-- Dependencies: 232
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
\.


--
-- TOC entry 5513 (class 0 OID 16757)
-- Dependencies: 231
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, company_id, branch_id, username, full_name, email, password_hash, is_active, last_login_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5532 (class 0 OID 17012)
-- Dependencies: 250
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (warehouse_id, branch_id, name, is_default, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5611 (class 0 OID 0)
-- Dependencies: 233
-- Name: audit_logs_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_audit_id_seq', 1, false);


--
-- TOC entry 5612 (class 0 OID 0)
-- Dependencies: 222
-- Name: branches_branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branches_branch_id_seq', 1, false);


--
-- TOC entry 5613 (class 0 OID 0)
-- Dependencies: 237
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 1, false);


--
-- TOC entry 5614 (class 0 OID 0)
-- Dependencies: 281
-- Name: chart_of_accounts_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chart_of_accounts_account_id_seq', 1, false);


--
-- TOC entry 5615 (class 0 OID 0)
-- Dependencies: 220
-- Name: companies_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_company_id_seq', 1, false);


--
-- TOC entry 5616 (class 0 OID 0)
-- Dependencies: 275
-- Name: controlled_drug_register_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.controlled_drug_register_entry_id_seq', 1, false);


--
-- TOC entry 5617 (class 0 OID 0)
-- Dependencies: 224
-- Name: counters_counter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.counters_counter_id_seq', 1, false);


--
-- TOC entry 5618 (class 0 OID 0)
-- Dependencies: 244
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_customer_id_seq', 1, false);


--
-- TOC entry 5619 (class 0 OID 0)
-- Dependencies: 226
-- Name: fiscal_years_fiscal_year_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fiscal_years_fiscal_year_id_seq', 1, false);


--
-- TOC entry 5620 (class 0 OID 0)
-- Dependencies: 257
-- Name: grn_headers_grn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grn_headers_grn_id_seq', 1, false);


--
-- TOC entry 5621 (class 0 OID 0)
-- Dependencies: 259
-- Name: grn_lines_grn_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grn_lines_grn_line_id_seq', 1, false);


--
-- TOC entry 5622 (class 0 OID 0)
-- Dependencies: 251
-- Name: inventory_ledger_movement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_ledger_movement_id_seq', 1, false);


--
-- TOC entry 5623 (class 0 OID 0)
-- Dependencies: 283
-- Name: journal_entries_journal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.journal_entries_journal_id_seq', 1, false);


--
-- TOC entry 5624 (class 0 OID 0)
-- Dependencies: 285
-- Name: journal_lines_journal_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.journal_lines_journal_line_id_seq', 1, false);


--
-- TOC entry 5625 (class 0 OID 0)
-- Dependencies: 235
-- Name: manufacturers_manufacturer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturers_manufacturer_id_seq', 1, false);


--
-- TOC entry 5626 (class 0 OID 0)
-- Dependencies: 265
-- Name: prescriptions_prescription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_prescription_id_seq', 1, false);


--
-- TOC entry 5627 (class 0 OID 0)
-- Dependencies: 247
-- Name: product_batches_batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_batches_batch_id_seq', 1, false);


--
-- TOC entry 5628 (class 0 OID 0)
-- Dependencies: 239
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 1, false);


--
-- TOC entry 5629 (class 0 OID 0)
-- Dependencies: 263
-- Name: purchase_invoice_lines_purchase_invoice_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_invoice_lines_purchase_invoice_line_id_seq', 1, false);


--
-- TOC entry 5630 (class 0 OID 0)
-- Dependencies: 261
-- Name: purchase_invoices_purchase_invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_invoices_purchase_invoice_id_seq', 1, false);


--
-- TOC entry 5631 (class 0 OID 0)
-- Dependencies: 255
-- Name: purchase_order_lines_po_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_order_lines_po_line_id_seq', 1, false);


--
-- TOC entry 5632 (class 0 OID 0)
-- Dependencies: 253
-- Name: purchase_orders_po_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_orders_po_id_seq', 1, false);


--
-- TOC entry 5633 (class 0 OID 0)
-- Dependencies: 228
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 1, false);


--
-- TOC entry 5634 (class 0 OID 0)
-- Dependencies: 269
-- Name: sales_invoice_lines_sale_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_invoice_lines_sale_line_id_seq', 1, false);


--
-- TOC entry 5635 (class 0 OID 0)
-- Dependencies: 267
-- Name: sales_invoices_sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_invoices_sale_id_seq', 1, false);


--
-- TOC entry 5636 (class 0 OID 0)
-- Dependencies: 273
-- Name: sales_return_lines_return_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_return_lines_return_line_id_seq', 1, false);


--
-- TOC entry 5637 (class 0 OID 0)
-- Dependencies: 271
-- Name: sales_returns_return_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_returns_return_id_seq', 1, false);


--
-- TOC entry 5638 (class 0 OID 0)
-- Dependencies: 279
-- Name: stock_transfer_lines_transfer_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_transfer_lines_transfer_line_id_seq', 1, false);


--
-- TOC entry 5639 (class 0 OID 0)
-- Dependencies: 277
-- Name: stock_transfers_transfer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_transfers_transfer_id_seq', 1, false);


--
-- TOC entry 5640 (class 0 OID 0)
-- Dependencies: 242
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_supplier_id_seq', 1, false);


--
-- TOC entry 5641 (class 0 OID 0)
-- Dependencies: 288
-- Name: sync_queue_queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sync_queue_queue_id_seq', 1, false);


--
-- TOC entry 5642 (class 0 OID 0)
-- Dependencies: 230
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- TOC entry 5643 (class 0 OID 0)
-- Dependencies: 249
-- Name: warehouses_warehouse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.warehouses_warehouse_id_seq', 1, false);


--
-- TOC entry 5193 (class 2606 OID 16818)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (audit_id);


--
-- TOC entry 5179 (class 2606 OID 16695)
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (branch_id);


--
-- TOC entry 5197 (class 2606 OID 16864)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 5249 (class 2606 OID 17585)
-- Name: chart_of_accounts chart_of_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_pkey PRIMARY KEY (account_id);


--
-- TOC entry 5175 (class 2606 OID 16677)
-- Name: companies companies_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_code_key UNIQUE (code);


--
-- TOC entry 5177 (class 2606 OID 16675)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (company_id);


--
-- TOC entry 5243 (class 2606 OID 17469)
-- Name: controlled_drug_register controlled_drug_register_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controlled_drug_register
    ADD CONSTRAINT controlled_drug_register_pkey PRIMARY KEY (entry_id);


--
-- TOC entry 5181 (class 2606 OID 16715)
-- Name: counters counters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_pkey PRIMARY KEY (counter_id);


--
-- TOC entry 5205 (class 2606 OID 16964)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 5255 (class 2606 OID 17653)
-- Name: device_registrations device_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_registrations
    ADD CONSTRAINT device_registrations_pkey PRIMARY KEY (device_id);


--
-- TOC entry 5183 (class 2606 OID 16733)
-- Name: fiscal_years fiscal_years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiscal_years
    ADD CONSTRAINT fiscal_years_pkey PRIMARY KEY (fiscal_year_id);


--
-- TOC entry 5223 (class 2606 OID 17156)
-- Name: grn_headers grn_headers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_headers
    ADD CONSTRAINT grn_headers_pkey PRIMARY KEY (grn_id);


--
-- TOC entry 5225 (class 2606 OID 17193)
-- Name: grn_lines grn_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_lines
    ADD CONSTRAINT grn_lines_pkey PRIMARY KEY (grn_line_id);


--
-- TOC entry 5215 (class 2606 OID 17048)
-- Name: inventory_ledger inventory_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_ledger
    ADD CONSTRAINT inventory_ledger_pkey PRIMARY KEY (movement_id);


--
-- TOC entry 5251 (class 2606 OID 17605)
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (journal_id);


--
-- TOC entry 5253 (class 2606 OID 17634)
-- Name: journal_lines journal_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_lines
    ADD CONSTRAINT journal_lines_pkey PRIMARY KEY (journal_line_id);


--
-- TOC entry 5195 (class 2606 OID 16849)
-- Name: manufacturers manufacturers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturers
    ADD CONSTRAINT manufacturers_pkey PRIMARY KEY (manufacturer_id);


--
-- TOC entry 5207 (class 2606 OID 16982)
-- Name: patient_profiles patient_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_profiles
    ADD CONSTRAINT patient_profiles_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 5233 (class 2606 OID 17292)
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (prescription_id);


--
-- TOC entry 5201 (class 2606 OID 16921)
-- Name: product_barcodes product_barcodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_barcodes
    ADD CONSTRAINT product_barcodes_pkey PRIMARY KEY (barcode);


--
-- TOC entry 5209 (class 2606 OID 17003)
-- Name: product_batches product_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_batches
    ADD CONSTRAINT product_batches_pkey PRIMARY KEY (batch_id);


--
-- TOC entry 5211 (class 2606 OID 17005)
-- Name: product_batches product_batches_product_id_batch_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_batches
    ADD CONSTRAINT product_batches_product_id_batch_no_key UNIQUE (product_id, batch_no);


--
-- TOC entry 5199 (class 2606 OID 16898)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- TOC entry 5231 (class 2606 OID 17265)
-- Name: purchase_invoice_lines purchase_invoice_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoice_lines
    ADD CONSTRAINT purchase_invoice_lines_pkey PRIMARY KEY (purchase_invoice_line_id);


--
-- TOC entry 5227 (class 2606 OID 17226)
-- Name: purchase_invoices purchase_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoices
    ADD CONSTRAINT purchase_invoices_pkey PRIMARY KEY (purchase_invoice_id);


--
-- TOC entry 5229 (class 2606 OID 17228)
-- Name: purchase_invoices purchase_invoices_supplier_id_invoice_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoices
    ADD CONSTRAINT purchase_invoices_supplier_id_invoice_no_key UNIQUE (supplier_id, invoice_no);


--
-- TOC entry 5221 (class 2606 OID 17129)
-- Name: purchase_order_lines purchase_order_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_pkey PRIMARY KEY (po_line_id);


--
-- TOC entry 5217 (class 2606 OID 17097)
-- Name: purchase_orders purchase_orders_company_id_po_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_company_id_po_number_key UNIQUE (company_id, po_number);


--
-- TOC entry 5219 (class 2606 OID 17095)
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (po_id);


--
-- TOC entry 5185 (class 2606 OID 16750)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- TOC entry 5237 (class 2606 OID 17373)
-- Name: sales_invoice_lines sales_invoice_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoice_lines
    ADD CONSTRAINT sales_invoice_lines_pkey PRIMARY KEY (sale_line_id);


--
-- TOC entry 5235 (class 2606 OID 17330)
-- Name: sales_invoices sales_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoices
    ADD CONSTRAINT sales_invoices_pkey PRIMARY KEY (sale_id);


--
-- TOC entry 5241 (class 2606 OID 17438)
-- Name: sales_return_lines sales_return_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_lines
    ADD CONSTRAINT sales_return_lines_pkey PRIMARY KEY (return_line_id);


--
-- TOC entry 5239 (class 2606 OID 17406)
-- Name: sales_returns sales_returns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_pkey PRIMARY KEY (return_id);


--
-- TOC entry 5247 (class 2606 OID 17553)
-- Name: stock_transfer_lines stock_transfer_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfer_lines
    ADD CONSTRAINT stock_transfer_lines_pkey PRIMARY KEY (transfer_line_id);


--
-- TOC entry 5245 (class 2606 OID 17507)
-- Name: stock_transfers stock_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_pkey PRIMARY KEY (transfer_id);


--
-- TOC entry 5203 (class 2606 OID 16943)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id);


--
-- TOC entry 5257 (class 2606 OID 17679)
-- Name: sync_queue sync_queue_branch_id_local_uuid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_queue
    ADD CONSTRAINT sync_queue_branch_id_local_uuid_key UNIQUE (branch_id, local_uuid);


--
-- TOC entry 5259 (class 2606 OID 17677)
-- Name: sync_queue sync_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_queue
    ADD CONSTRAINT sync_queue_pkey PRIMARY KEY (queue_id);


--
-- TOC entry 5191 (class 2606 OID 16792)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- TOC entry 5187 (class 2606 OID 16773)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5189 (class 2606 OID 16775)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 5213 (class 2606 OID 17025)
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (warehouse_id);


--
-- TOC entry 5268 (class 2606 OID 16829)
-- Name: audit_logs audit_logs_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5269 (class 2606 OID 16819)
-- Name: audit_logs audit_logs_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5270 (class 2606 OID 16824)
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 5260 (class 2606 OID 16696)
-- Name: branches branches_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5272 (class 2606 OID 16865)
-- Name: categories categories_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5273 (class 2606 OID 16870)
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(category_id);


--
-- TOC entry 5347 (class 2606 OID 17586)
-- Name: chart_of_accounts chart_of_accounts_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5333 (class 2606 OID 17480)
-- Name: controlled_drug_register controlled_drug_register_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controlled_drug_register
    ADD CONSTRAINT controlled_drug_register_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 5334 (class 2606 OID 17485)
-- Name: controlled_drug_register controlled_drug_register_pharmacist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controlled_drug_register
    ADD CONSTRAINT controlled_drug_register_pharmacist_id_fkey FOREIGN KEY (pharmacist_id) REFERENCES public.users(user_id);


--
-- TOC entry 5335 (class 2606 OID 17475)
-- Name: controlled_drug_register controlled_drug_register_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controlled_drug_register
    ADD CONSTRAINT controlled_drug_register_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescriptions(prescription_id);


--
-- TOC entry 5336 (class 2606 OID 17470)
-- Name: controlled_drug_register controlled_drug_register_sale_line_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controlled_drug_register
    ADD CONSTRAINT controlled_drug_register_sale_line_id_fkey FOREIGN KEY (sale_line_id) REFERENCES public.sales_invoice_lines(sale_line_id);


--
-- TOC entry 5261 (class 2606 OID 16716)
-- Name: counters counters_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5279 (class 2606 OID 16970)
-- Name: customers customers_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5280 (class 2606 OID 16965)
-- Name: customers customers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5353 (class 2606 OID 17654)
-- Name: device_registrations device_registrations_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_registrations
    ADD CONSTRAINT device_registrations_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5262 (class 2606 OID 16734)
-- Name: fiscal_years fiscal_years_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiscal_years
    ADD CONSTRAINT fiscal_years_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5296 (class 2606 OID 17162)
-- Name: grn_headers grn_headers_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_headers
    ADD CONSTRAINT grn_headers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5297 (class 2606 OID 17157)
-- Name: grn_headers grn_headers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_headers
    ADD CONSTRAINT grn_headers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5298 (class 2606 OID 17177)
-- Name: grn_headers grn_headers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_headers
    ADD CONSTRAINT grn_headers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 5299 (class 2606 OID 17172)
-- Name: grn_headers grn_headers_po_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_headers
    ADD CONSTRAINT grn_headers_po_id_fkey FOREIGN KEY (po_id) REFERENCES public.purchase_orders(po_id);


--
-- TOC entry 5300 (class 2606 OID 17167)
-- Name: grn_headers grn_headers_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_headers
    ADD CONSTRAINT grn_headers_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id);


--
-- TOC entry 5301 (class 2606 OID 17204)
-- Name: grn_lines grn_lines_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_lines
    ADD CONSTRAINT grn_lines_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(batch_id);


--
-- TOC entry 5302 (class 2606 OID 17194)
-- Name: grn_lines grn_lines_grn_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_lines
    ADD CONSTRAINT grn_lines_grn_id_fkey FOREIGN KEY (grn_id) REFERENCES public.grn_headers(grn_id);


--
-- TOC entry 5303 (class 2606 OID 17199)
-- Name: grn_lines grn_lines_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_lines
    ADD CONSTRAINT grn_lines_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 5284 (class 2606 OID 17069)
-- Name: inventory_ledger inventory_ledger_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_ledger
    ADD CONSTRAINT inventory_ledger_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(batch_id);


--
-- TOC entry 5285 (class 2606 OID 17054)
-- Name: inventory_ledger inventory_ledger_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_ledger
    ADD CONSTRAINT inventory_ledger_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5286 (class 2606 OID 17049)
-- Name: inventory_ledger inventory_ledger_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_ledger
    ADD CONSTRAINT inventory_ledger_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5287 (class 2606 OID 17074)
-- Name: inventory_ledger inventory_ledger_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_ledger
    ADD CONSTRAINT inventory_ledger_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 5288 (class 2606 OID 17064)
-- Name: inventory_ledger inventory_ledger_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_ledger
    ADD CONSTRAINT inventory_ledger_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 5289 (class 2606 OID 17059)
-- Name: inventory_ledger inventory_ledger_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_ledger
    ADD CONSTRAINT inventory_ledger_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(warehouse_id);


--
-- TOC entry 5348 (class 2606 OID 17611)
-- Name: journal_entries journal_entries_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5349 (class 2606 OID 17606)
-- Name: journal_entries journal_entries_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5350 (class 2606 OID 17616)
-- Name: journal_entries journal_entries_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 5351 (class 2606 OID 17640)
-- Name: journal_lines journal_lines_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_lines
    ADD CONSTRAINT journal_lines_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.chart_of_accounts(account_id);


--
-- TOC entry 5352 (class 2606 OID 17635)
-- Name: journal_lines journal_lines_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_lines
    ADD CONSTRAINT journal_lines_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.journal_entries(journal_id);


--
-- TOC entry 5271 (class 2606 OID 16850)
-- Name: manufacturers manufacturers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturers
    ADD CONSTRAINT manufacturers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5281 (class 2606 OID 16983)
-- Name: patient_profiles patient_profiles_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_profiles
    ADD CONSTRAINT patient_profiles_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 5312 (class 2606 OID 17298)
-- Name: prescriptions prescriptions_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5313 (class 2606 OID 17293)
-- Name: prescriptions prescriptions_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5314 (class 2606 OID 17308)
-- Name: prescriptions prescriptions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 5315 (class 2606 OID 17303)
-- Name: prescriptions prescriptions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 5277 (class 2606 OID 16922)
-- Name: product_barcodes product_barcodes_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_barcodes
    ADD CONSTRAINT product_barcodes_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 5282 (class 2606 OID 17006)
-- Name: product_batches product_batches_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_batches
    ADD CONSTRAINT product_batches_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 5274 (class 2606 OID 16909)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- TOC entry 5275 (class 2606 OID 16899)
-- Name: products products_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5276 (class 2606 OID 16904)
-- Name: products products_manufacturer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_manufacturer_id_fkey FOREIGN KEY (manufacturer_id) REFERENCES public.manufacturers(manufacturer_id);


--
-- TOC entry 5309 (class 2606 OID 17276)
-- Name: purchase_invoice_lines purchase_invoice_lines_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoice_lines
    ADD CONSTRAINT purchase_invoice_lines_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(batch_id);


--
-- TOC entry 5310 (class 2606 OID 17271)
-- Name: purchase_invoice_lines purchase_invoice_lines_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoice_lines
    ADD CONSTRAINT purchase_invoice_lines_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 5311 (class 2606 OID 17266)
-- Name: purchase_invoice_lines purchase_invoice_lines_purchase_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoice_lines
    ADD CONSTRAINT purchase_invoice_lines_purchase_invoice_id_fkey FOREIGN KEY (purchase_invoice_id) REFERENCES public.purchase_invoices(purchase_invoice_id);


--
-- TOC entry 5304 (class 2606 OID 17234)
-- Name: purchase_invoices purchase_invoices_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoices
    ADD CONSTRAINT purchase_invoices_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5305 (class 2606 OID 17229)
-- Name: purchase_invoices purchase_invoices_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoices
    ADD CONSTRAINT purchase_invoices_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5306 (class 2606 OID 17249)
-- Name: purchase_invoices purchase_invoices_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoices
    ADD CONSTRAINT purchase_invoices_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 5307 (class 2606 OID 17244)
-- Name: purchase_invoices purchase_invoices_grn_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoices
    ADD CONSTRAINT purchase_invoices_grn_id_fkey FOREIGN KEY (grn_id) REFERENCES public.grn_headers(grn_id);


--
-- TOC entry 5308 (class 2606 OID 17239)
-- Name: purchase_invoices purchase_invoices_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_invoices
    ADD CONSTRAINT purchase_invoices_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id);


--
-- TOC entry 5294 (class 2606 OID 17130)
-- Name: purchase_order_lines purchase_order_lines_po_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_po_id_fkey FOREIGN KEY (po_id) REFERENCES public.purchase_orders(po_id);


--
-- TOC entry 5295 (class 2606 OID 17135)
-- Name: purchase_order_lines purchase_order_lines_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 5290 (class 2606 OID 17103)
-- Name: purchase_orders purchase_orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5291 (class 2606 OID 17098)
-- Name: purchase_orders purchase_orders_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5292 (class 2606 OID 17113)
-- Name: purchase_orders purchase_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 5293 (class 2606 OID 17108)
-- Name: purchase_orders purchase_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id);


--
-- TOC entry 5263 (class 2606 OID 16751)
-- Name: roles roles_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5322 (class 2606 OID 17384)
-- Name: sales_invoice_lines sales_invoice_lines_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoice_lines
    ADD CONSTRAINT sales_invoice_lines_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(batch_id);


--
-- TOC entry 5323 (class 2606 OID 17379)
-- Name: sales_invoice_lines sales_invoice_lines_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoice_lines
    ADD CONSTRAINT sales_invoice_lines_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 5324 (class 2606 OID 17374)
-- Name: sales_invoice_lines sales_invoice_lines_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoice_lines
    ADD CONSTRAINT sales_invoice_lines_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales_invoices(sale_id);


--
-- TOC entry 5316 (class 2606 OID 17336)
-- Name: sales_invoices sales_invoices_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoices
    ADD CONSTRAINT sales_invoices_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5317 (class 2606 OID 17331)
-- Name: sales_invoices sales_invoices_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoices
    ADD CONSTRAINT sales_invoices_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5318 (class 2606 OID 17341)
-- Name: sales_invoices sales_invoices_counter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoices
    ADD CONSTRAINT sales_invoices_counter_id_fkey FOREIGN KEY (counter_id) REFERENCES public.counters(counter_id);


--
-- TOC entry 5319 (class 2606 OID 17356)
-- Name: sales_invoices sales_invoices_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoices
    ADD CONSTRAINT sales_invoices_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 5320 (class 2606 OID 17346)
-- Name: sales_invoices sales_invoices_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoices
    ADD CONSTRAINT sales_invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- TOC entry 5321 (class 2606 OID 17351)
-- Name: sales_invoices sales_invoices_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_invoices
    ADD CONSTRAINT sales_invoices_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescriptions(prescription_id);


--
-- TOC entry 5329 (class 2606 OID 17454)
-- Name: sales_return_lines sales_return_lines_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_lines
    ADD CONSTRAINT sales_return_lines_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(batch_id);


--
-- TOC entry 5330 (class 2606 OID 17449)
-- Name: sales_return_lines sales_return_lines_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_lines
    ADD CONSTRAINT sales_return_lines_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 5331 (class 2606 OID 17439)
-- Name: sales_return_lines sales_return_lines_return_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_lines
    ADD CONSTRAINT sales_return_lines_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.sales_returns(return_id);


--
-- TOC entry 5332 (class 2606 OID 17444)
-- Name: sales_return_lines sales_return_lines_sale_line_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_lines
    ADD CONSTRAINT sales_return_lines_sale_line_id_fkey FOREIGN KEY (sale_line_id) REFERENCES public.sales_invoice_lines(sale_line_id);


--
-- TOC entry 5325 (class 2606 OID 17412)
-- Name: sales_returns sales_returns_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5326 (class 2606 OID 17407)
-- Name: sales_returns sales_returns_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5327 (class 2606 OID 17422)
-- Name: sales_returns sales_returns_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 5328 (class 2606 OID 17417)
-- Name: sales_returns sales_returns_original_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_original_sale_id_fkey FOREIGN KEY (original_sale_id) REFERENCES public.sales_invoices(sale_id);


--
-- TOC entry 5344 (class 2606 OID 17564)
-- Name: stock_transfer_lines stock_transfer_lines_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfer_lines
    ADD CONSTRAINT stock_transfer_lines_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(batch_id);


--
-- TOC entry 5345 (class 2606 OID 17559)
-- Name: stock_transfer_lines stock_transfer_lines_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfer_lines
    ADD CONSTRAINT stock_transfer_lines_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 5346 (class 2606 OID 17554)
-- Name: stock_transfer_lines stock_transfer_lines_transfer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfer_lines
    ADD CONSTRAINT stock_transfer_lines_transfer_id_fkey FOREIGN KEY (transfer_id) REFERENCES public.stock_transfers(transfer_id);


--
-- TOC entry 5337 (class 2606 OID 17528)
-- Name: stock_transfers stock_transfers_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(user_id);


--
-- TOC entry 5338 (class 2606 OID 17508)
-- Name: stock_transfers stock_transfers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5339 (class 2606 OID 17518)
-- Name: stock_transfers stock_transfers_dest_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_dest_branch_id_fkey FOREIGN KEY (dest_branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5340 (class 2606 OID 17533)
-- Name: stock_transfers stock_transfers_dispatched_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_dispatched_by_fkey FOREIGN KEY (dispatched_by) REFERENCES public.users(user_id);


--
-- TOC entry 5341 (class 2606 OID 17538)
-- Name: stock_transfers stock_transfers_received_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.users(user_id);


--
-- TOC entry 5342 (class 2606 OID 17523)
-- Name: stock_transfers stock_transfers_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(user_id);


--
-- TOC entry 5343 (class 2606 OID 17513)
-- Name: stock_transfers stock_transfers_source_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_source_branch_id_fkey FOREIGN KEY (source_branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5278 (class 2606 OID 16944)
-- Name: suppliers suppliers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5354 (class 2606 OID 17680)
-- Name: sync_queue sync_queue_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_queue
    ADD CONSTRAINT sync_queue_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5266 (class 2606 OID 16798)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- TOC entry 5267 (class 2606 OID 16793)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 5264 (class 2606 OID 16781)
-- Name: users users_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


--
-- TOC entry 5265 (class 2606 OID 16776)
-- Name: users users_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- TOC entry 5283 (class 2606 OID 17026)
-- Name: warehouses warehouses_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(branch_id);


-- Completed on 2026-01-27 13:57:02

--
-- PostgreSQL database dump complete
--

\unrestrict TyPxm0Xu14ybGqIgH8qKs3fD1FivBMUAW0GDjkr0rRQVccDWcQg4B2TIEnO74un

