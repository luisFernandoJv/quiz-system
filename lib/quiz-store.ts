"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Question {
  id: string
  description: string
  imageUrl?: string
  options: string[]
  correctAnswer: string
  isActive: boolean
}

export interface StudentAnswer {
  id: string
  studentName: string
  studentAge: string
  studentSchool: string
  questionId: string
  answer: string
  timestamp: Date
}

interface QuizStore {
  questions: Question[]
  studentAnswers: StudentAnswer[]
  addQuestion: (question: Question) => void
  removeQuestion: (id: string) => void
  toggleQuestionActive: (id: string) => void
  addStudentAnswer: (answer: StudentAnswer) => void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      questions: [
        {
          id: "1",
          description: "Qual é a capital do Brasil?",
          imageUrl: "/placeholder.svg?height=200&width=300",
          options: ["São Paulo", "Rio de Janeiro", "Brasília", "Belo Horizonte"],
          correctAnswer: "Brasília",
          isActive: true,
        },
        {
          id: "2",
          description: "Quanto é 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: "4",
          isActive: false,
        },
      ],
      studentAnswers: [],
      addQuestion: (question) =>
        set((state) => ({
          questions: [...state.questions, question],
        })),
      removeQuestion: (id) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id),
        })),
      toggleQuestionActive: (id) =>
        set((state) => ({
          questions: state.questions.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q)),
        })),
      addStudentAnswer: (answer) =>
        set((state) => ({
          studentAnswers: [...state.studentAnswers, answer],
        })),
    }),
    {
      name: "quiz-storage",
    },
  ),
)
