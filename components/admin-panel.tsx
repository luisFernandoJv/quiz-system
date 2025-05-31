"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Eye, Trash2, Users, BarChart3, FileQuestion, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { useQuizStore, type Question } from "@/lib/quiz-store"
import RankingBoard from "./ranking-board"

interface AdminPanelProps {
  onBack: () => void
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState<"dashboard" | "add-question" | "ranking">("dashboard")
  const { questions, addQuestion, toggleQuestionActive, removeQuestion, studentAnswers } = useQuizStore()

  const [newQuestion, setNewQuestion] = useState({
    description: "",
    imageUrl: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  })

  const handleAddQuestion = () => {
    if (newQuestion.description && newQuestion.options.every((opt) => opt.trim()) && newQuestion.correctAnswer) {
      const question: Question = {
        id: (questions.length + 1).toString(),
        description: newQuestion.description,
        imageUrl: newQuestion.imageUrl || undefined,
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer,
        isActive: false,
      }

      addQuestion(question)
      setNewQuestion({
        description: "",
        imageUrl: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      })
      setCurrentView("dashboard")
    }
  }

  const totalStudents = new Set(studentAnswers.map((a) => a.studentName)).size
  const activeQuestions = questions.filter((q) => q.isActive).length

  if (currentView === "ranking") {
    return <RankingBoard onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "add-question") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => setCurrentView("dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Nova Questão</h1>
            <div></div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileQuestion className="w-5 h-5 mr-2 text-green-600" />
                  Adicionar Questão
                </CardTitle>
                <CardDescription>Preencha todos os campos para criar uma nova questão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="description">Descrição da Questão</Label>
                  <Textarea
                    id="description"
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Digite a descrição completa da questão..."
                    className="min-h-[100px] border-green-200 focus:border-green-400"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
                  <Input
                    id="imageUrl"
                    value={newQuestion.imageUrl}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="border-green-200 focus:border-green-400"
                  />
                  {newQuestion.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={newQuestion.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-xs rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </motion.div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label>Alternativas</Label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Label className="w-8 text-green-700">{String.fromCharCode(65 + index)})</Label>
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options]
                          newOptions[index] = e.target.value
                          setNewQuestion((prev) => ({ ...prev, options: newOptions }))
                        }}
                        placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                        className="border-green-200 focus:border-green-400"
                      />
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="correctAnswer">Resposta Correta</Label>
                  <select
                    id="correctAnswer"
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                    className="w-full p-2 border border-green-200 focus:border-green-400 rounded-md"
                  >
                    <option value="">Selecione a resposta correta</option>
                    {newQuestion.options.map(
                      (option, index) =>
                        option.trim() && (
                          <option key={index} value={option}>
                            {String.fromCharCode(65 + index)}) {option}
                          </option>
                        ),
                    )}
                  </select>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setCurrentView("dashboard")}
                    className="border-green-200 hover:border-green-400 hover:bg-green-50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddQuestion}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    Adicionar Questão
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <Button variant="ghost" onClick={onBack} className="sm:self-start">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sair
          </Button>
          <motion.h1
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Painel Administrativo
          </motion.h1>
          <div className="sm:w-[68px]"></div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Questões</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{questions.length}</div>
                <p className="text-xs text-muted-foreground">{activeQuestions} ativas</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alunos Participando</CardTitle>
                <Users className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">{studentAnswers.length} respostas totais</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questões Ativas</CardTitle>
                <Eye className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeQuestions}</div>
                <p className="text-xs text-muted-foreground">Disponíveis para resposta</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-2 border-green-100 hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-green-600" />
                  Ações Rápidas
                </CardTitle>
                <CardDescription>Gerencie questões e visualize dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setCurrentView("add-question")}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Nova Questão
                </Button>
                <Button
                  onClick={() => setCurrentView("ranking")}
                  variant="outline"
                  className="w-full border-green-200 hover:border-green-400 hover:bg-green-50"
                  size="lg"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Ranking dos Alunos
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-2 border-teal-100 hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-teal-600" />
                  Estatísticas
                </CardTitle>
                <CardDescription>Resumo da atividade atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Taxa de participação:</span>
                    <span className="font-medium">{totalStudents > 0 ? "100%" : "0%"}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-teal-50 rounded-lg">
                    <span className="text-sm text-gray-600">Média de respostas:</span>
                    <span className="font-medium">
                      {totalStudents > 0 ? Math.round(studentAnswers.length / totalStudents) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-emerald-50 rounded-lg">
                    <span className="text-sm text-gray-600">Questões pendentes:</span>
                    <span className="font-medium">{questions.length - activeQuestions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileQuestion className="w-5 h-5 mr-2 text-green-600" />
                Gerenciar Questões
              </CardTitle>
              <CardDescription>Ative/desative questões e gerencie o banco de dados</CardDescription>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <Plus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhuma questão cadastrada</p>
                  <Button
                    onClick={() => setCurrentView("add-question")}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    Adicionar Primeira Questão
                  </Button>
                </div>
              ) : (
                <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
                  {questions.map((question, idx) => (
                    <motion.div
                      key={question.id}
                      variants={item}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 border-green-100 rounded-lg hover:border-green-200 hover:bg-green-50 transition-all"
                    >
                      <div className="flex-1 mb-4 sm:mb-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="border-green-200 bg-white">
                            Questão {question.id}
                          </Badge>
                          {question.isActive ? (
                            <Badge variant="default" className="bg-green-600">
                              Ativa
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-200">
                              Inativa
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{question.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Resposta: {question.correctAnswer}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`switch-${question.id}`} className="text-sm">
                            {question.isActive ? "Ativa" : "Inativa"}
                          </Label>
                          <Switch
                            id={`switch-${question.id}`}
                            checked={question.isActive}
                            onCheckedChange={() => toggleQuestionActive(question.id)}
                          />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removeQuestion(question.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
