import { useState } from "react";
import { motion } from "framer-motion";
import { avatars, Avatar } from "@/data/avatars";
import { Player } from "@/types/game";

interface SetupScreenProps {
  onStartGame: (p1: Player, p2: Player) => void;
}

const SetupScreen = ({ onStartGame }: SetupScreenProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p1Avatar, setP1Avatar] = useState<Avatar | null>(null);
  const [p2Avatar, setP2Avatar] = useState<Avatar | null>(null);

  const currentName = step === 1 ? p1Name : p2Name;
  const setCurrentName = step === 1 ? setP1Name : setP2Name;
  const currentAvatar = step === 1 ? p1Avatar : p2Avatar;
  const setCurrentAvatar = step === 1 ? setP1Avatar : setP2Avatar;
  const otherAvatar = step === 1 ? null : p1Avatar;

  const handleNext = () => {
    if (step === 1 && p1Name && p1Avatar) {
      setStep(2);
    } else if (step === 2 && p2Name && p2Avatar) {
      onStartGame(
        { name: p1Name, avatar: p1Avatar, health: 100, score: 0 },
        { name: p2Name, avatar: p2Avatar, health: 100, score: 0 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-arena flex flex-col items-center justify-center p-4">
      <motion.h1
        className="font-arcade text-2xl md:text-4xl text-accent text-shadow-neon-gold mb-2 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        QUIZ FIGHTERS
      </motion.h1>
      <motion.p
        className="text-muted-foreground font-body text-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ¡Responde y lucha!
      </motion.p>

      <motion.div
        key={step}
        className="w-full max-w-lg bg-card/80 backdrop-blur border border-border rounded-xl p-6"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
      >
        <h2
          className={`font-arcade text-sm mb-6 text-center ${
            step === 1 ? "text-primary text-shadow-neon-red" : "text-secondary text-shadow-neon-blue"
          }`}
        >
          JUGADOR {step}
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-muted-foreground mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            placeholder={`Nombre del Jugador ${step}`}
            maxLength={15}
            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-muted-foreground mb-3">
            Elige tu luchador
          </label>
          <div className="grid grid-cols-3 gap-3">
            {avatars.map((avatar) => {
              const isDisabled = otherAvatar?.id === avatar.id;
              const isSelected = currentAvatar?.id === avatar.id;
              return (
                <motion.button
                  key={avatar.id}
                  onClick={() => !isDisabled && setCurrentAvatar(avatar)}
                  disabled={isDisabled}
                  whileHover={!isDisabled ? { scale: 1.05 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                    isSelected
                      ? step === 1
                        ? "border-primary shadow-neon-red"
                        : "border-secondary shadow-neon-blue"
                      : isDisabled
                      ? "border-border opacity-30 cursor-not-allowed"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-full aspect-square object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-background/80 text-xs font-arcade py-1 text-center text-foreground">
                    {avatar.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.button
          onClick={handleNext}
          disabled={!currentName || !currentAvatar}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-lg font-arcade text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            step === 1
              ? "bg-primary text-primary-foreground shadow-neon-red"
              : "bg-secondary text-secondary-foreground shadow-neon-blue"
          }`}
        >
          {step === 1 ? "SIGUIENTE →" : "¡A LUCHAR!"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SetupScreen;
