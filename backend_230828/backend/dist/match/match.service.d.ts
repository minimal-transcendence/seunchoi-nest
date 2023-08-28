import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
export declare class MatchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllMatchHistory(): Promise<object[]>;
    createMatchHistory(data: Prisma.MatchHistoryUncheckedCreateInput): Promise<object>;
}
