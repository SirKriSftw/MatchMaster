export interface Match {
    matchId?: number;
    tournamentId: number;
    winnerId?: number;
    matchTitle: string;
    description: string;
    matchStart: Date;
    nextMatch?: number;
  }
  