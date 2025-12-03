"use client";

import { GameConfig } from "@/types/gameConfig";
import SpaceDefenderGame from "./SpaceDefenderGame";
import CoinCollectorGame from "./CoinCollectorGame";
import BubblePopperGame from "./BubblePopperGame";
import TargetShooterGame from "./TargetShooterGame";
import RunnerDashGame from "./RunnerDashGame";
import MemoryMatchGame from "./MemoryMatchGame";

interface Props {
  config: GameConfig;
}

export default function ArcadeGame({ config }: Props) {
  switch (config.gameType) {
    case "spaceDefender":
      return <SpaceDefenderGame config={config} />;
    case "coinCollector":
      return <CoinCollectorGame config={config} />;
    case "bubblePopper":
      return <BubblePopperGame config={config} />;
    case "targetShooter":
      return <TargetShooterGame config={config} />;
    case "runnerDash":
      return <RunnerDashGame config={config} />;
    case "memoryMatch":
      return <MemoryMatchGame config={config} />;
    default:
      return <SpaceDefenderGame config={config} />;
  }
}
