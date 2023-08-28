import { MatchService } from './match.service';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    getAllMatchHistory(): Promise<object[]>;
    createMatchHistory(data: {
        winnerId: number;
        loserId: number;
    }): Promise<object>;
}
