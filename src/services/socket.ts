import { io, Socket } from "socket.io-client"

const SERVER_URL = "http://localhost:3001"

// On définit le type des événements côté client
export interface ServerToClientEvents {
  game_created: (roomCode: string) => void
  players_update: (players: string[]) => void
  new_question: (question: QuestionEvent) => void
  question_result: (data: QuestionResultEvent) => void
  game_over: (scores: Score[]) => void
  error: (msg: string) => void
}

export interface ClientToServerEvents {
  create_game: () => void
  join_game: (data: { roomCode: string; name: string }) => void
  start_game: (roomCode: string) => void
  answer: (data: { roomCode: string; answer: string }) => void
}

export interface QuestionEvent {
  index: number
  total: number
  question: string
  duration: number
}

export interface QuestionResultEvent {
  correctAnswer: string
  scores: Score[]
}

export interface Score {
  name: string
  score: number
}

// Connexion typée
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SERVER_URL)