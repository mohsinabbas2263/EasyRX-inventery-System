import { Request } from 'express';

export interface UserPayload {
    userId: string;
    branchId?: string;
    companyId: string;
    role: string;
    permissions: string[];
}

export interface RequestWithUser extends Request {
    user: UserPayload;
}
