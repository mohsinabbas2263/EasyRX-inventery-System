Inventory Ledger Rules (Expert Final)
1) Ledger is the ONLY truth

Stock on hand is computed as:

By batch:

SUM(qty_in - qty_out) grouped by (company_id, branch_id, product_id, batch_id)

For product total:

sum across all batches.

2) Append-only enforcement

No UPDATE/DELETE after posting.

Corrections happen via reversal documents generating new ledger lines.

DB enforcement options

Revoke UPDATE/DELETE on ledger table at DB role level, OR

Trigger to block UPDATE/DELETE.

3) Exactly one direction per row (DB CHECK)

CHECK((qty_in = 0 AND qty_out > 0) OR (qty_out = 0 AND qty_in > 0))

4) Medicine requires batch + expiry (service + DB)

DB cannot easily CHECK products.is_medicine from ledger row (cross-table).

Enforce in service layer:

if product is medicine → batch_id NOT NULL and batches.expiry_date NOT NULL

(Optional) enforce with constraint triggers (advanced).

5) No expired sales

Service validates batches.expiry_date >= today (or policy).

6) No negative stock (default)

Must be enforced in the posting transaction (next section).
