import { useEffect, useState } from "react"
import { socket } from "../services/socket"
import type {
  QuestionEvent,
  Score,
} from "../services/socket"

interface Props {
  playerName: string
}

const Question: React.FC<Props> = ({ playerName }) => {
  const [roomCode, setRoomCode] = useState<string>("")
  const [joined, setJoined] = useState<boolean>(false)
  const [players, setPlayers] = useState<string[]>([])
  const [question, setQuestion] = useState<QuestionEvent | null>(null)
  const [answer, setAnswer] = useState<string>("")
  const [scores, setScores] = useState<Score[]>([])
  const [error, setError] = useState<string | null>(null)

  // =========================
  // SOCKET LISTENERS
  // =========================
  useEffect(() => {
    socket.on("game_created", (code) => {
      setRoomCode(code)
      setJoined(true)
    })

    socket.on("players_update", (list) => {
      setPlayers(list)
      setJoined(true)
    })

    socket.on("new_question", (q) => {
      setQuestion(q)
      setAnswer("")
      setScores([])
    })

    socket.on("question_result", (data) => {
      setScores(data.scores)
    })

    socket.on("game_over", (finalScores) => {
      setScores(finalScores)
      setQuestion(null)
    })

    socket.on("error", (msg) => {
      setError(msg)
      setJoined(false)
    })

    return () => {
      socket.off("game_created")
      socket.off("players_update")
      socket.off("new_question")
      socket.off("question_result")
      socket.off("game_over")
      socket.off("error")
    }
  }, [])

  // =========================
  // ACTIONS
  // =========================
  const createGame = () => {
    setError(null)
    socket.emit("create_game")
  }

  const joinGame = () => {
    if (!roomCode || !playerName) return
    setError(null)

    socket.emit("join_game", {
      roomCode,
      name: playerName,
    })
  }

  const startGame = () => {
    socket.emit("start_game", roomCode)
  }

  const submitAnswer = () => {
    if (!answer.trim()) return

    socket.emit("answer", {
      roomCode,
      answer,
    })
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Quiz Multijoueur
      </h1>

      {/* ERREUR */}
      {error && (
        <p className="text-red-600 mb-2">
          {error}
        </p>
      )}

      {/* AVANT REJOINDRE */}
      {!joined && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Code de la room
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) =>
              setRoomCode(
                e.target.value.toUpperCase()
              )
            }
            placeholder="ABCDE"
            className="border px-2 py-1 rounded w-40 mb-2"
          />

          <div className="flex gap-2">
            <button
              onClick={joinGame}
              disabled={!roomCode}
            >
              Rejoindre
            </button>

            <button
              onClick={createGame}
            >
              Créer une partie
            </button>
          </div>
        </div>
      )}

      {/* LOBBY */}
      {joined && !question && scores.length === 0 && (
        <div className="mb-4">
          <p className="mb-1">
            Room : <b>{roomCode}</b>
          </p>

          <p className="mb-2">
            Joueurs :
            <br />
            {players.map((p) => (
              <span key={p} className="block">
                • {p}
              </span>
            ))}
          </p>

          <button
            onClick={startGame}
            className="px-3 py-1 bg-purple-600 text-white rounded"
          >
            Démarrer le jeu (host)
          </button>
        </div>
      )}

      {/* QUESTION */}
      {question && (
        <div className="mb-4">
          <p className="font-semibold mb-1">
            Question {question.index}/{question.total}
          </p>

          <p className="mb-2">
            {question.question}
          </p>

          <input
            type="text"
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            className="border px-2 py-1 rounded w-full mb-2"
            placeholder="Ta réponse..."
          />

          <button
            onClick={submitAnswer}
            className="px-3 py-1 bg-blue-700 text-white rounded"
          >
            Valider
          </button>
        </div>
      )}

      {/* SCORES */}
      {scores.length > 0 && (
        <div>
          <h2 className="font-bold mb-1">
            Scores
          </h2>

          <ul>
            {scores.map((s) => (
              <li key={s.name}>
                {s.name} : {s.score}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Question