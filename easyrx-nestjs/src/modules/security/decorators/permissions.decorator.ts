import { SetMetadata } from '@nestjs/common';

export enum PermissionCode {
  // POS Permissions
  POS_SALE = 'POS:SALE',
  POS_DISPENSE = 'POS:DISPENSE',
  POS_DISPENSE_CONTROLLED = 'POS:DISPENSE_CONTROLLED',

  // Inventory Permissions
  INVENTORY_ADJUST = 'INVENTORY:ADJUST',
  INVENTORY_TRANSFER_APPROVE = 'INVENTORY:TRANSFER_APPROVE',
  INVENTORY_VIEW = 'INVENTORY:VIEW',
  INVENTORY_TRANSACT = 'INVENTORY:TRANSACT',
  INVENTORY_MANAGE = 'INVENTORY:MANAGE',
  STOCK_OVERRIDE_NEGATIVE = 'STOCK:OVERRIDE_NEGATIVE',

  // Purchase Permissions
  PURCHASE_AI_APPROVE = 'PURCHASE:AI_APPROVE',
  PURCHASE_GRN_POST = 'PURCHASE:GRN_POST',

  // Report Permissions
  REPORT_FINANCIAL = 'REPORT:FINANCIAL',
  REPORT_INVENTORY = 'REPORT:INVENTORY',

  // Audit Permissions
  AUDIT_VIEW = 'AUDIT:VIEW',
  AUDIT_EXPORT = 'AUDIT:EXPORT',

  // User Management
  USER_MANAGE = 'USER:MANAGE',
  USER_CHANGE_ROLE = 'USER:CHANGE_ROLE',

  // Supplier & Purchase
  SUPPLIER_MANAGE = 'SUPPLIER:MANAGE',
  PURCHASE_ORDER_MANAGE = 'PURCHASE_ORDER:MANAGE',

  // Company & Branch Management
  COMPANY_MANAGE = 'COMPANY:MANAGE',
  BRANCH_MANAGE = 'BRANCH:MANAGE',

  // Pharmacy Management
  PHARMACY_MANAGE = 'PHARMACY:MANAGE',

  // Accounting
  ACCOUNTING_VIEW = 'ACCOUNTING:VIEW',
  ACCOUNTING_MANAGE = 'ACCOUNTING:MANAGE',
}

export enum UserRole {
  CASHIER = 'CASHIER',
  PHARMACIST = 'PHARMACIST',
  INVENTORY_OFFICER = 'INVENTORY_OFFICER',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  HO_ADMIN = 'HO_ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  AUDITOR = 'AUDITOR',
}

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const ROLE_PERMISSIONS: Record<UserRole, PermissionCode[]> = {
  [UserRole.CASHIER]: [PermissionCode.POS_SALE],

  [UserRole.PHARMACIST]: [
    PermissionCode.POS_SALE,
    PermissionCode.POS_DISPENSE,
    PermissionCode.POS_DISPENSE_CONTROLLED,
  ],

  [UserRole.INVENTORY_OFFICER]: [
    PermissionCode.POS_SALE,
    PermissionCode.POS_DISPENSE,
    PermissionCode.INVENTORY_ADJUST,
    PermissionCode.REPORT_INVENTORY,
  ],

  [UserRole.BRANCH_MANAGER]: [
    PermissionCode.POS_SALE,
    PermissionCode.POS_DISPENSE,
    PermissionCode.INVENTORY_ADJUST,
    PermissionCode.INVENTORY_TRANSFER_APPROVE,
    PermissionCode.PURCHASE_AI_APPROVE,
    PermissionCode.REPORT_FINANCIAL,
    PermissionCode.REPORT_INVENTORY,
  ],

  [UserRole.HO_ADMIN]: Object.values(PermissionCode),

  [UserRole.ACCOUNTANT]: [
    PermissionCode.REPORT_FINANCIAL,
    PermissionCode.AUDIT_VIEW,
  ],

  [UserRole.AUDITOR]: [
    PermissionCode.AUDIT_VIEW,
    PermissionCode.AUDIT_EXPORT,
    PermissionCode.REPORT_FINANCIAL,
  ],
};
