export interface TowerDefenseConfig {
  brand: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
  };
  copy: {
    startHeadline: string;
    winHeadline: string;
    loseHeadline: string;
    gameElements: string[];
  };
  settings: {
    startingMoney: number;
    totalWaves: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
}

export interface FormData {
  firstName: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  products: string;
  email: string;
  logoBase64?: string;
}

export const GAME_URL = 'https://tower-defense-arcade.vercel.app';

export function generateGameConfig(formData: FormData): TowerDefenseConfig {
  const products = formData.products
    .split(',')
    .map(p => p.trim())
    .filter(Boolean);

  const gameElements = products.length >= 2
    ? products.slice(0, 4)
    : ['Analytics', 'Security', 'Support', 'Marketing'];

  return {
    brand: {
      name: formData.companyName,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      accentColor: formData.primaryColor,
      logoUrl: formData.logoBase64 || undefined,
    },
    copy: {
      startHeadline: `Defend ${formData.companyName}!`,
      winHeadline: `${formData.companyName} is Protected!`,
      loseHeadline: 'Try Again!',
      gameElements,
    },
    settings: {
      startingMoney: 500,
      totalWaves: 10,
      difficulty: 'medium',
    },
  };
}

export function encodeConfig(config: TowerDefenseConfig): string {
  return btoa(JSON.stringify(config));
}
