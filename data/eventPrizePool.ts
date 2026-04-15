export interface PrizePool {
    eventNo: number;
    first: number;
    second?: number;
    // third: number;
}

export const eventPrizePool: PrizePool[] = [
    // DANCE
    { eventNo: 1, first: 2000},
    { eventNo: 2, first: 2000},
    { eventNo: 3, first: 5000},
    { eventNo: 4, first: 5000},
    { eventNo: 5, first: 2000},

    // FASHION
    { eventNo: 6, first: 30000, second: 20000},

    // FINE ARTS
    { eventNo: 7, first: 2000},
    { eventNo: 8, first: 2000},
    { eventNo: 9, first: 2000},
    { eventNo: 10, first: 2000},
    { eventNo: 11, first: 2000},
    { eventNo: 12, first: 2000},

    // GENERAL EVENTS
    { eventNo: 13, first: 5000},
    { eventNo: 14, first: 2000},
    { eventNo: 15, first: 5000},

    // LITERARY
    { eventNo: 16, first: 2000},
    { eventNo: 17, first: 2000},
    { eventNo: 18, first: 2000},
    { eventNo: 19, first: 2000},

    // MUSIC
    { eventNo: 20, first: 5000},
    { eventNo: 21, first: 2000},
    { eventNo: 22, first: 2000},
    { eventNo: 23, first: 2000},
    { eventNo: 24, first: 2000},
    { eventNo: 25, first: 2000},

    // SPORTS
    { eventNo: 26, first: 5000},
    { eventNo: 27, first: 5000},
    { eventNo: 28, first: 5000},
    { eventNo: 29, first: 5000},
    { eventNo: 30, first: 2000},
    { eventNo: 31, first: 6000, second: 4000},
    { eventNo: 32, first: 5000},
    { eventNo: 33, first: 5000},

    // TECHNICAL
    { eventNo: 34, first: 2000},
    { eventNo: 35, first: 2500},
    { eventNo: 36, first: 10000},
    { eventNo: 37, first: 5000},
    { eventNo: 38, first: 2000},
    { eventNo: 39, first: 2000},
    { eventNo: 40, first: 5000},
    { eventNo: 41, first: 10000},

    // THEATRE
    { eventNo: 42, first: 5000},
    { eventNo: 43, first: 2000},
    { eventNo: 44, first: 2000},
    { eventNo: 45, first: 5000},
];
