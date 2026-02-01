export class CreateTransferLineDto {
    productId: string;
    quantity: number;
}

export class CreateTransferDto {
    sourceBranchId: string;
    lines: CreateTransferLineDto[];
}
