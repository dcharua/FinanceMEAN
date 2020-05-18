export class Saving{
    _id?: string;
    userId: string;
    bank: string;
    account: string;
    balance: number;
    start: Date;
    end: Date;
    interest: number;
    taxes: number;
    interest_balance?: number;
    taxes_paid?: number;
    total_balance?: number; 
}