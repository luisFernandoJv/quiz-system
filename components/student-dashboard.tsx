"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Users, Clock, Sparkles, Star } from "lucide-react"
import { motion } from "framer-motion"
import QuestionInterface from "./question-interface"
import RankingBoard from "./ranking-board"
import { useQuizStore } from "@/lib/quiz-store"

interface StudentDashboardProps {
  student: {
    name: string
    age: string
    school: string
  }
  onBack: () => void
}

export default function StudentDashboard({ student, onBack }: StudentDashboardProps) {
  const [currentView, setCurrentView] = useState<"dashboard" | "question" | "ranking">("dashboard")
  const { questions, studentAnswers, addStudentAnswer } = useQuizStore()
  const [showConfetti, setShowConfetti] = useState(false)

  const availableQuestions = questions.filter((q) => q.isActive)
  const answeredQuestions = studentAnswers.filter((a) => a.studentName === student.name)
  const correctAnswers = answeredQuestions.filter((a) => {
    const question = questions.find((q) => q.id === a.questionId)
    return question && question.correctAnswer === a.answer
  })

  const nextQuestion = availableQuestions.find((q) => !answeredQuestions.some((a) => a.questionId === q.id))

  // Calcular posição no ranking
  const studentStats = studentAnswers.reduce(
    (acc, answer) => {
      const question = questions.find((q) => q.id === answer.questionId)
      const isCorrect = question && question.correctAnswer === answer.answer

      if (!acc[answer.studentName]) {
        acc[answer.studentName] = {
          name: answer.studentName,
          correctAnswers: 0,
        }
      }

      if (isCorrect) {
        acc[answer.studentName].correctAnswers++
      }

      return acc
    },
    {} as Record<string, { name: string; correctAnswers: number }>,
  )

  const ranking = Object.values(studentStats).sort((a, b) => b.correctAnswers - a.correctAnswers)
  const studentRank = ranking.findIndex((s) => s.name === student.name) + 1

  if (currentView === "question" && nextQuestion) {
    return (
      <QuestionInterface
        question={nextQuestion}
        student={student}
        onAnswer={(answer) => {
          addStudentAnswer({
            id: Date.now().toString(),
            studentName: student.name,
            studentAge: student.age,
            studentSchool: student.school,
            questionId: nextQuestion.id,
            answer,
            timestamp: new Date(),
          })

          // Show success message if answer is correct
          if (answer === nextQuestion.correctAnswer) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }

          setCurrentView("dashboard")
        }}
        onBack={() => setCurrentView("dashboard")}
      />
    )
  }

  if (currentView === "ranking") {
    return <RankingBoard onBack={() => setCurrentView("dashboard")} currentStudent={student.name} />
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          🎉 Resposta correta! Parabéns!
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <Button variant="ghost" onClick={onBack} className="sm:self-start">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sair
          </Button>
          <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Olá, {student.name}!
            </h1>
            <p className="text-gray-600">
              {student.school} • {student.age} anos
            </p>
          </motion.div>
          <div className="sm:w-[68px]"></div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questões Respondidas</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{answeredQuestions.length}</div>
                <p className="text-xs text-muted-foreground">de {availableQuestions.length} disponíveis</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Acertos</CardTitle>
                <Trophy className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{correctAnswers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {answeredQuestions.length > 0
                    ? `${Math.round((correctAnswers.length / answeredQuestions.length) * 100)}% de aproveitamento`
                    : "Nenhuma questão respondida"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posição no Ranking</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">#{studentRank || "-"}</div>
                <p className="text-xs text-muted-foreground">Entre todos os alunos</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-2 border-purple-100 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                    Próxima Questão
                  </CardTitle>
                </div>
                <CardDescription>
                  {nextQuestion
                    ? "Há uma nova questão disponível para responder"
                    : "Você respondeu todas as questões disponíveis"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nextQuestion ? (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      Questão {nextQuestion.id}
                    </Badge>
                    <p className="text-sm text-gray-600 line-clamp-2">{nextQuestion.description}</p>
                    <Button
                      onClick={() => setCurrentView("question")}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      size="lg"
                    >
                      Responder Questão
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600">Parabéns! Você completou todas as questões disponíveis.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-2 border-blue-100 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-blue-500" />
                    Ranking Geral
                  </CardTitle>
                </div>
                <CardDescription>Veja sua posição entre todos os alunos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{correctAnswers.length}</div>
                    <p className="text-sm text-gray-600">questões corretas</p>
                  </div>
                  <Button
                    onClick={() => setCurrentView("ranking")}
                    variant="outline"
                    className="w-full border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                    size="lg"
                  >
                    Ver Ranking Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
