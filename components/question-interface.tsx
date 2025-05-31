"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, ImageIcon, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import type { Question } from "@/lib/quiz-store"

interface QuestionInterfaceProps {
  question: Question
  student: {
    name: string
    age: string
    school: string
  }
  onAnswer: (answer: string) => void
  onBack: () => void
}

export default function QuestionInterface({ question, student, onAnswer, onBack }: QuestionInterfaceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutos
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setProgress((timeLeft / 300) * 100)
  }, [timeLeft])

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer)
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <Button variant="ghost" onClick={onBack} className="sm:self-start">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              <Clock className="w-4 h-4 mr-1 text-purple-500" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-6 border-2 border-purple-100 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-purple-500" />
                  Questão {question.id}
                </CardTitle>
                <div className="text-sm text-gray-500 bg-purple-50 px-3 py-1 rounded-full">
                  {student.name} • {student.school}
                </div>
              </div>
              <div className="mt-2">
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <h3 className="text-lg font-medium mb-4 text-purple-800">Descrição:</h3>
                <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                  {question.description}
                </p>
              </motion.div>

              {question.imageUrl && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h3 className="text-lg font-medium mb-4 flex items-center text-purple-800">
                    <ImageIcon className="w-5 h-5 mr-2 text-purple-500" />
                    Imagem da Questão:
                  </h3>
                  <div className="border-2 border-purple-100 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={question.imageUrl || "/placeholder.svg"}
                      alt="Imagem da questão"
                      className="w-full max-w-2xl mx-auto"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div variants={container} initial="hidden" animate="show">
                <h3 className="text-lg font-medium mb-4 text-purple-800">Alternativas:</h3>
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
                  {question.options.map((option, index) => (
                    <motion.div key={index} variants={item}>
                      <div className="flex items-center space-x-2 p-4 border-2 border-purple-100 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          <span className="font-medium mr-2 text-purple-700">{String.fromCharCode(65 + index)})</span>
                          {option}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>
              </motion.div>

              <motion.div
                className="flex justify-end pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  size="lg"
                  className="px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Confirmar Resposta
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
