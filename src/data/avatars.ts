import avatarKnight from "@/assets/avatar-knight.webp";
import avatarNinja from "@/assets/avatar-ninja.webp";
import avatarMage from "@/assets/avatar-mage.webp";
import avatarViking from "@/assets/avatar-viking.webp";
import avatarSamurai from "@/assets/avatar-samurai.webp";
import avatarRobot from "@/assets/avatar-robot.webp";

export interface Avatar {
  id: string;
  name: string;
  image: string;
}

export const avatars: Avatar[] = [
  { id: "knight", name: "Caballero", image: avatarKnight },
  { id: "ninja", name: "Ninja", image: avatarNinja },
  { id: "mage", name: "Mago", image: avatarMage },
  { id: "viking", name: "Vikingo", image: avatarViking },
  { id: "samurai", name: "Samurái", image: avatarSamurai },
  { id: "robot", name: "Robot", image: avatarRobot },
];
