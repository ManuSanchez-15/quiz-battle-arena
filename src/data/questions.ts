export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "¿Cuál es el planeta más grande del sistema solar?",
    options: ["Marte", "Júpiter", "Saturno", "Neptuno"],
    correctIndex: 1,
    category: "Ciencia",
  },
  {
    id: 2,
    question: "¿En qué año llegó el hombre a la Luna?",
    options: ["1965", "1969", "1972", "1968"],
    correctIndex: 1,
    category: "Historia",
  },
  {
    id: 3,
    question: "¿Cuál es el río más largo del mundo?",
    options: ["Nilo", "Amazonas", "Misisipi", "Yangtsé"],
    correctIndex: 1,
    category: "Geografía",
  },
  {
    id: 4,
    question: "¿Quién pintó la Mona Lisa?",
    options: ["Miguel Ángel", "Rafael", "Leonardo da Vinci", "Botticelli"],
    correctIndex: 2,
    category: "Arte",
  },
  {
    id: 5,
    question: "¿Cuántos huesos tiene el cuerpo humano adulto?",
    options: ["186", "206", "216", "196"],
    correctIndex: 1,
    category: "Ciencia",
  },
  {
    id: 6,
    question: "¿Cuál es el elemento químico más abundante en el universo?",
    options: ["Oxígeno", "Carbono", "Helio", "Hidrógeno"],
    correctIndex: 3,
    category: "Ciencia",
  },
  {
    id: 7,
    question: "¿En qué país se encuentra la Torre Eiffel?",
    options: ["Italia", "España", "Francia", "Alemania"],
    correctIndex: 2,
    category: "Geografía",
  },
  {
    id: 8,
    question: "¿Cuál es el animal terrestre más rápido?",
    options: ["León", "Guepardo", "Gacela", "Caballo"],
    correctIndex: 1,
    category: "Naturaleza",
  },
  {
    id: 9,
    question: "¿Cuántos continentes hay en la Tierra?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
    category: "Geografía",
  },
  {
    id: 10,
    question: "¿Quién escribió 'Don Quijote de la Mancha'?",
    options: ["Lope de Vega", "Cervantes", "Quevedo", "Calderón"],
    correctIndex: 1,
    category: "Literatura",
  },
  {
    id: 11,
    question: "¿Cuál es la fórmula del agua?",
    options: ["CO2", "H2O", "NaCl", "O2"],
    correctIndex: 1,
    category: "Ciencia",
  },
  {
    id: 12,
    question: "¿Cuántos jugadores tiene un equipo de fútbol en el campo?",
    options: ["9", "10", "11", "12"],
    correctIndex: 2,
    category: "Deportes",
  },
  {
    id: 13,
    question: "¿Cuál es el océano más grande del mundo?",
    options: ["Atlántico", "Índico", "Ártico", "Pacífico"],
    correctIndex: 3,
    category: "Geografía",
  },
  {
    id: 14,
    question: "¿Qué gas necesitan las plantas para la fotosíntesis?",
    options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Hidrógeno"],
    correctIndex: 2,
    category: "Ciencia",
  },
  {
    id: 15,
    question: "¿En qué año comenzó la Segunda Guerra Mundial?",
    options: ["1935", "1939", "1941", "1937"],
    correctIndex: 1,
    category: "Historia",
  },
];
