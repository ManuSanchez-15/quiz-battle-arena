import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/data/avatars";

interface FighterProps {
  avatar: Avatar;
  player: 1 | 2;
  isAttacking: boolean;
  isHurt: boolean;
  isIdle: boolean;
  dashDistance?: number;
}

// Create explosion sound using Web Audio API
const playExplosionSound = () => {
  try {
    const ctx = new AudioContext();
    const duration = 0.35;

    // Noise burst
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Low frequency oscillator for punch
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + duration);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.6, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Filter for noise
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);

    noise.connect(filter).connect(noiseGain).connect(ctx.destination);
    osc.connect(oscGain).connect(ctx.destination);

    noise.start();
    osc.start();
    noise.stop(ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio not available, silently ignore
  }
};

const Fighter = ({ avatar, player, isAttacking, isHurt, isIdle, dashDistance = 300 }: FighterProps) => {
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (isAttacking && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      setTimeout(() => playExplosionSound(), 250);
    }
    if (!isAttacking) {
      hasPlayedSound.current = false;
    }
  }, [isAttacking]);

  const getAnimation = () => {
    if (isAttacking) {
      const dist = player === 1 ? dashDistance : -dashDistance;
      return {
        x: [0, dist, dist, 0],
        scale: [1, 1.1, 1.1, 1],
        rotate: player === 1 ? [0, 3, 0, 0] : [0, -3, 0, 0],
      };
    }
    if (isHurt) {
      return {
        x: player === 1 ? [0, -20, 0] : [0, 20, 0],
        scale: [1, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
        opacity: [1, 0.2, 1, 0.2, 1, 0.2, 1, 0.2],
        filter: [
          "brightness(1)",
          "brightness(3) saturate(0)",
          "brightness(1)",
          "brightness(1)",
          "brightness(1)",
          "brightness(1)",
          "brightness(1)",
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
        isAttacking
          ? { duration: 0.6, times: [0, 0.4, 0.6, 1], ease: "easeOut" }
          : isIdle
            ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
            : isHurt
              ? { duration: 2, ease: "easeOut" }
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
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.8, 2.5], y: -20 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          💥
        </motion.div>
      )}
    </motion.div>
  );
};

export default Fighter;
