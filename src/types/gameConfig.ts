export type GameType =
  | "spaceDefender"
  | "coinCollector"
  | "bubblePopper"
  | "targetShooter"
  | "runnerDash"
  | "memoryMatch";

export type GameConfig = {
  gameType: GameType;
  brand: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
    products?: string[];
  };
  copy: {
    startHeadline: string;
    endWinHeadline: string;
    gameElements?: string[];
  };
  settings: {
    enemySpawnRate: number;
    playerSpeed: number;
    maxLives: number;
  };
};

export const DEFAULT_CONFIG: GameConfig = {
  gameType: "memoryMatch",
  brand: {
    name: "Your Company",
    primaryColor: "#6366f1",
    secondaryColor: "#818cf8",
    accentColor: "#4f46e5",
  },
  copy: {
    startHeadline: "Match {companyName}'s products!",
    endWinHeadline: "You mastered {companyName}!",
  },
  settings: {
    enemySpawnRate: 1500,
    playerSpeed: 6,
    maxLives: 3,
  },
};
