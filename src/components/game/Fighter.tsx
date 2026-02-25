import { motion } from "framer-motion";
import { Avatar } from "@/data/avatars";

interface FighterProps {
  avatar: Avatar;
  player: 1 | 2;
  isAttacking: boolean;
  isHurt: boolean;
  isIdle: boolean;
}

const Fighter = ({ avatar, player, isAttacking, isHurt, isIdle }: FighterProps) => {
  const getAnimation = () => {
    if (isAttacking) {
      return {
        x: player === 1 ? [0, 60, 0] : [0, -60, 0],
        scale: [1, 1.15, 1],
        rotate: player === 1 ? [0, 5, 0] : [0, -5, 0],
      };
    }
    if (isHurt) {
      return {
        x: player === 1 ? [0, -20, 0] : [0, 20, 0],
        filter: [
          "brightness(1)",
          "brightness(3) saturate(0)",
          "brightness(1)",
        ],
      };
    }
    if (isIdle) {
      return {
        y: [0, -6, 0],
      };
    }
    return {};
  };

  return (
    <motion.div
      className="relative"
      animate={getAnimation()}
      transition={
        isIdle
          ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
          : { duration: 0.4, ease: "easeOut" }
      }
    >
      <img
        src={avatar.image}
        alt={avatar.name}
        className={`w-28 h-28 md:w-40 md:h-40 object-contain drop-shadow-lg ${
          player === 2 ? "-scale-x-100" : ""
        }`}
      />
      {isAttacking && (
        <motion.div
          className={`absolute top-1/2 ${
            player === 1 ? "-right-8" : "-left-8"
          } font-arcade text-accent text-shadow-neon-gold text-lg`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [1, 0], scale: [0.5, 1.5], y: -20 }}
          transition={{ duration: 0.6 }}
        >
          💥
        </motion.div>
      )}
    </motion.div>
  );
};

export default Fighter;
