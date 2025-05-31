"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, Building2, User } from "lucide-react"
import StudentLogin from "@/components/student-login"
import AdminLogin from "@/components/admin-login"
import { motion } from "framer-motion"

export default function HomePage() {
  const [userType, setUserType] = useState<"student" | "admin" | null>(null)

  if (userType === "student") {
    return <StudentLogin onBack={() => setUserType(null)} />
  }

  if (userType === "admin") {
    return <AdminLogin onBack={() => setUserType(null)} />
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Sistema de Questões
            </h1>
            <p className="text-lg text-gray-600">Plataforma interativa de aprendizado com ranking em tempo real</p>
          </motion.div>

          <motion.div className="flex justify-center" variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="w-full max-w-md">
              <Card
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-300 hover:scale-105"
                onClick={() => setUserType("student")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-purple-600" />
                  </div>
                  <CardTitle className="text-3xl mb-2">Área do Aluno</CardTitle>
                  <CardDescription className="text-base">
                    Acesse para responder questões e ver sua colocação no ranking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    size="lg"
                  >
                    Começar Agora
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-500 mb-4">Sistema desenvolvido para facilitar o aprendizado interativo</p>
            <button
              onClick={() => setUserType("admin")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
            >
              Acesso administrativo
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
<motion.footer
  className="bg-white border-t border-gray-200 py-8 px-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      {/* Secretaria de Educação - Com animação de flutuação */}
      <motion.div 
        className="flex flex-col items-center text-center"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md mb-4 relative">
          <motion.img
            src="/images/secretaria-educacao.jpg"
            alt="Secretaria de Educação"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-education.jpg";
              e.target.className = "absolute inset-0 w-full h-full object-contain p-2";
            }}
          />
        </div>
        <h3 className="font-semibold text-gray-800 text-lg">Secretaria de Educação</h3>
        <p className="text-sm text-gray-600 mt-1">Uiraúna - PB</p>
      </motion.div>

      {/* Escola Lica Duarte - Com animação de pulso */}
      <motion.div
        className="flex flex-col items-center text-center"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", damping: 10 }}
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md mb-4 bg-gradient-to-br from-green-50 to-green-100">
          <motion.img
            src="/images/lica-duarte.jpg"
            alt="Escola Lica Duarte"
            className="w-full h-full object-cover"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-school.png";
              e.target.className = "w-full h-full object-contain p-3";
            }}
          />
        </div>
        <h3 className="font-semibold text-gray-800 text-lg">Escola Lica Duarte</h3>
        <p className="text-sm text-gray-600 mt-1">Educação de Qualidade</p>
      </motion.div>

      {/* Desenvolvedor - Com animação de rotação sutil */}
      <motion.div
        className="flex flex-col items-center text-center"
        whileHover={{ rotate: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md mb-4 bg-gradient-to-br from-purple-50 to-indigo-100">
          <motion.img
            src="/images/perfil.jpg"
            alt="Desenvolvedores"
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-profile.png";
              e.target.className = "w-full h-full object-contain p-2 bg-white";
            }}
          />
        </div>
        <h3 className="font-semibold text-gray-800 text-lg">Desenvolvido por</h3>
        <div className="text-sm text-gray-600 space-y-1 mt-1">
          <p>Professor Luis Fernando</p>
          <p>Alexandre dos Santos</p>
        </div>
      </motion.div>
    </div>

    {/* Rodapé inferior com animação de fade */}
    <motion.div
      className="mt-8 pt-6 border-t border-gray-100"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="text-center">
        <p className="text-xs text-gray-500">© 2025 Sistema de Questões - Todos os direitos reservados</p>
        <p className="text-xs text-gray-400 mt-2">
          Desenvolvido para promover a educação digital em Uiraúna - PB
        </p>
      </div>
    </motion.div>
  </div>
</motion.footer>
    </div>
  )
}
