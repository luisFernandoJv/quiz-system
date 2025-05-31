"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Medal, Award, Crown } from "lucide-react"
import { motion } from "framer-motion"
import { useQuizStore } from "@/lib/quiz-store"

interface RankingBoardProps {
  onBack: () => void
  currentStudent?: string
}

export default function RankingBoard({ onBack, currentStudent }: RankingBoardProps) {
  const { questions, studentAnswers } = useQuizStore()

  // Calcular ranking
  const studentStats = studentAnswers.reduce(
    (acc, answer) => {
      const question = questions.find((q) => q.id === answer.questionId)
      const isCorrect = question && question.correctAnswer === answer.answer

      if (!acc[answer.studentName]) {
        acc[answer.studentName] = {
          name: answer.studentName,
          school: answer.studentSchool,
          age: answer.studentAge,
          totalAnswers: 0,
          correctAnswers: 0,
          score: 0,
        }
      }

      acc[answer.studentName].totalAnswers++
      if (isCorrect) {
        acc[answer.studentName].correctAnswers++
      }
      acc[answer.studentName].score = acc[answer.studentName].correctAnswers

      return acc
    },
    {} as Record<string, any>,
  )

  const ranking = Object.values(studentStats).sort((a: any, b: any) => {
    if (b.score !== a.score) return b.score - a.score
    return b.totalAnswers - a.totalAnswers
  })

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{position}</div>
        )
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <Button variant="ghost" onClick={onBack} className="sm:self-start">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <motion.h1
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Ranking Geral
          </motion.h1>
          <div className="sm:w-[68px]"></div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-6 border-2 border-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Classificação dos Alunos
              </CardTitle>
              <CardDescription>Ranking baseado no número de questões corretas</CardDescription>
            </CardHeader>
            <CardContent>
              {ranking.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum aluno respondeu questões ainda</p>
                </div>
              ) : (
                <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
                  {ranking.map((student: any, index) => (
                    <motion.div
                      key={student.name}
                      variants={item}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${getRankColor(
                        index + 1,
                      )} ${student.name === currentStudent ? "ring-2 ring-purple-500" : ""}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0
                              ? "bg-yellow-100"
                              : index === 1
                                ? "bg-gray-100"
                                : index === 2
                                  ? "bg-amber-100"
                                  : "bg-white"
                          }`}
                        >
                          {getRankIcon(index + 1)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{student.name}</h3>
                            {student.name === currentStudent && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                Você
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {student.school} • {student.age} anos
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{student.correctAnswers}</div>
                        <p className="text-sm text-gray-600">de {student.totalAnswers} questões</p>
                        <p className="text-xs text-gray-500">
                          {student.totalAnswers > 0
                            ? `${Math.round((student.correctAnswers / student.totalAnswers) * 100)}% de acerto`
                            : "0% de acerto"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-gray-500">
            Ranking atualizado em tempo real • Continue respondendo para subir na classificação!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
