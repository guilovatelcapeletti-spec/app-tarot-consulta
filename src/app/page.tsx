"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Sparkles, Moon, Sun, Eye, Heart, Crown, Zap, Settings, CreditCard, Smartphone, DollarSign, Plus, Trash2, Edit } from 'lucide-react'

// Dados das cartas de tarot
const tarotCards = [
  { id: 1, name: "O Louco", meaning: "Novos começos, espontaneidade, fé no universo", image: "🃏" },
  { id: 2, name: "O Mago", meaning: "Manifestação, poder pessoal, ação", image: "🎩" },
  { id: 3, name: "A Sacerdotisa", meaning: "Intuição, mistério, conhecimento oculto", image: "🌙" },
  { id: 4, name: "A Imperatriz", meaning: "Fertilidade, feminilidade, abundância", image: "👑" },
  { id: 5, name: "O Imperador", meaning: "Autoridade, estrutura, controle", image: "⚔️" },
  { id: 6, name: "O Hierofante", meaning: "Tradição, conformidade, moralidade", image: "🏛️" },
  { id: 7, name: "Os Amantes", meaning: "Amor, harmonia, relacionamentos", image: "💕" },
  { id: 8, name: "O Carro", meaning: "Controle, determinação, direção", image: "🏇" },
  { id: 9, name: "A Força", meaning: "Força interior, bravura, compaixão", image: "🦁" },
  { id: 10, name: "O Eremita", meaning: "Busca interior, introspecção, orientação", image: "🕯️" },
  { id: 11, name: "A Roda da Fortuna", meaning: "Boa sorte, karma, ciclos da vida", image: "🎡" },
  { id: 12, name: "A Justiça", meaning: "Justiça, fairness, verdade", image: "⚖️" },
  { id: 13, name: "O Enforcado", meaning: "Suspensão, restrição, sacrifício", image: "🙃" },
  { id: 14, name: "A Morte", meaning: "Fim, transformação, transição", image: "💀" },
  { id: 15, name: "A Temperança", meaning: "Equilíbrio, moderação, paciência", image: "🍷" },
  { id: 16, name: "O Diabo", meaning: "Escravidão, materialismo, ignorância", image: "😈" },
  { id: 17, name: "A Torre", meaning: "Mudança súbita, revelação, despertar", image: "🏗️" },
  { id: 18, name: "A Estrela", meaning: "Esperança, fé, propósito", image: "⭐" },
  { id: 19, name: "A Lua", meaning: "Ilusão, medo, ansiedade", image: "🌙" },
  { id: 20, name: "O Sol", meaning: "Alegria, sucesso, vitalidade", image: "☀️" },
  { id: 21, name: "O Julgamento", meaning: "Julgamento, renascimento, despertar interior", image: "📯" },
  { id: 22, name: "O Mundo", meaning: "Conclusão, realização, viagem", image: "🌍" }
]

interface Question {
  id: number
  question: string
  selectedCards: typeof tarotCards[]
}

interface PaymentMethod {
  id: number
  name: string
  type: 'pix' | 'card' | 'digital_wallet' | 'bank_transfer'
  details: {
    pixKey?: string
    accountName?: string
    bankName?: string
    agency?: string
    account?: string
    walletId?: string
  }
  isActive: boolean
}

export default function TarotApp() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [selectedCards, setSelectedCards] = useState<typeof tarotCards[]>([])
  const [showCards, setShowCards] = useState(false)
  const [shuffledCards, setShuffledCards] = useState<typeof tarotCards[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [guruAccount, setGuruAccount] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [journeyStarted, setJourneyStarted] = useState(false)
  
  // Estados do Admin
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      name: "PIX Principal",
      type: "pix",
      details: {
        pixKey: "admin@oraculo.com",
        accountName: "Oráculo Místico"
      },
      isActive: true
    }
  ])
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null)
  const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<PaymentMethod>>({
    name: '',
    type: 'pix',
    details: {},
    isActive: true
  })
  const [consultationPrice, setConsultationPrice] = useState(27.00)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  // Embaralhar cartas quando mostrar o leque
  useEffect(() => {
    if (showCards) {
      setShuffledCards([...tarotCards].sort(() => Math.random() - 0.5))
    }
  }, [showCards])

  const addQuestion = () => {
    if (currentQuestion.trim() && selectedCards.length === 3 && questions.length < 25) {
      const newQuestion: Question = {
        id: Date.now(),
        question: currentQuestion.trim(),
        selectedCards: [...selectedCards]
      }
      setQuestions([...questions, newQuestion])
      setCurrentQuestion('')
      setSelectedCards([])
      setShowCards(false)
    }
  }

  const handleCardSelect = (card: typeof tarotCards[0]) => {
    if (selectedCards.length < 3 && !selectedCards.find(c => c.id === card.id)) {
      setSelectedCards([...selectedCards, card])
    }
  }

  const removeSelectedCard = (cardId: number) => {
    setSelectedCards(selectedCards.filter(c => c.id !== cardId))
  }

  const handlePayment = () => {
    if (guruAccount.trim()) {
      // Aqui seria a integração real com Digital Manager Guru
      setIsPaid(true)
      setShowPayment(false)
    }
  }

  const startJourney = () => {
    setJourneyStarted(true)
    setTimeout(() => {
      const questionSection = document.querySelector('[data-question-section]');
      if (questionSection) {
        questionSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100)
  }

  // Funções do Admin
  const authenticateAdmin = () => {
    if (adminPassword === 'admin123') { // Em produção, usar hash seguro
      setIsAdminAuthenticated(true)
      setAdminPassword('')
    } else {
      alert('Senha incorreta!')
    }
  }

  const addPaymentMethod = () => {
    if (newPaymentMethod.name && newPaymentMethod.type) {
      const method: PaymentMethod = {
        id: Date.now(),
        name: newPaymentMethod.name,
        type: newPaymentMethod.type as PaymentMethod['type'],
        details: newPaymentMethod.details || {},
        isActive: newPaymentMethod.isActive || true
      }
      setPaymentMethods([...paymentMethods, method])
      setNewPaymentMethod({ name: '', type: 'pix', details: {}, isActive: true })
      setShowAddPayment(false)
    }
  }

  const updatePaymentMethod = () => {
    if (editingPayment) {
      setPaymentMethods(paymentMethods.map(pm => 
        pm.id === editingPayment.id ? editingPayment : pm
      ))
      setEditingPayment(null)
    }
  }

  const deletePaymentMethod = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este método de pagamento?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id))
    }
  }

  const togglePaymentMethodStatus = (id: number) => {
    setPaymentMethods(paymentMethods.map(pm => 
      pm.id === id ? { ...pm, isActive: !pm.isActive } : pm
    ))
  }

  const getPaymentMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'pix': return <Smartphone className="w-4 h-4" />
      case 'card': return <CreditCard className="w-4 h-4" />
      case 'digital_wallet': return <Smartphone className="w-4 h-4" />
      case 'bank_transfer': return <DollarSign className="w-4 h-4" />
      default: return <DollarSign className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-800 to-indigo-800 p-6 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Oráculo Místico
                </h1>
                <p className="text-purple-200">Descubra os segredos do seu destino</p>
              </div>
            </div>
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              size="icon"
              className="border-purple-300 text-purple-300 hover:bg-purple-700"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Seção de Apresentação */}
        <Card className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex gap-2">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                <Moon className="w-8 h-8 text-purple-300" />
                <Eye className="w-8 h-8 text-indigo-300" />
                <Sun className="w-8 h-8 text-orange-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-transparent">
              Desvende os Mistérios do Seu Futuro
            </h2>
            <p className="text-lg text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Conecte-se com a sabedoria ancestral do Tarot. Faça até <span className="text-yellow-300 font-bold">25 perguntas</span> e 
              receba respostas profundas através de <span className="text-yellow-300 font-bold">3 cartas sagradas</span> escolhidas por sua intuição.
            </p>
            
            {/* Botão de Início Destacado */}
            <div className="mb-8">
              <Button
                onClick={startJourney}
                className="group relative bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-yellow-400/50 hover:border-yellow-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span>Iniciar Consulta Mística</span>
                  <Eye className="w-6 h-6 animate-pulse" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full opacity-30 group-hover:opacity-50 blur transition-all duration-300 -z-10"></div>
              </Button>
              <p className="text-sm text-yellow-300 mt-3 animate-pulse">
                ✨ Clique para começar sua jornada de descobertas ✨
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2">
                <Crown className="w-4 h-4 mr-2" />
                Consulta Completa
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Amor & Relacionamentos
              </Badge>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Carreira & Sucesso
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contador de Perguntas - só aparece após iniciar a jornada */}
        {journeyStarted && (
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-purple-500/30">
              <span className="text-purple-200">Perguntas realizadas:</span>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg px-4 py-2">
                {questions.length}/25
              </Badge>
            </div>
          </div>
        )}

        {/* Formulário de Pergunta - só aparece após iniciar a jornada */}
        {journeyStarted && questions.length < 25 && (
          <Card className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border-purple-500/30 backdrop-blur-sm" data-question-section>
            <CardHeader>
              <CardTitle className="text-xl text-center text-purple-100">
                Faça sua pergunta ao oráculo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="question" className="text-purple-200 mb-2 block">
                  Qual é a sua pergunta?
                </Label>
                <Textarea
                  id="question"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  placeholder="Digite sua pergunta aqui... (ex: Como será meu futuro amoroso?)"
                  className="bg-purple-900/50 border-purple-500/50 text-white placeholder-purple-300 min-h-[100px]"
                />
              </div>

              {/* Cartas Selecionadas */}
              {selectedCards.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-purple-200">
                    Cartas escolhidas ({selectedCards.length}/3):
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {selectedCards.map((card, index) => (
                      <div
                        key={card.id}
                        className="relative bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-3"
                      >
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          {index + 1}
                        </Badge>
                        <div className="text-2xl">{card.image}</div>
                        <span className="text-yellow-300 font-medium">Carta Selecionada</span>
                        <Button
                          onClick={() => removeSelectedCard(card.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 ml-2"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setShowCards(true)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  disabled={!currentQuestion.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Escolher 3 Cartas do Destino
                </Button>
                <Button
                  onClick={addQuestion}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  disabled={!currentQuestion.trim() || selectedCards.length !== 3}
                >
                  Adicionar Pergunta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leque de Cartas Místico */}
        {showCards && (
          <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-indigo-200">
                🔮 Escolha 3 Cartas do Destino 🔮
              </CardTitle>
              <p className="text-center text-indigo-300 text-sm">
                Passe o mouse sobre as cartas e deixe sua intuição guiá-lo. Escolha 3 cartas sem ver o que são.
              </p>
              <div className="text-center">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  {selectedCards.length}/3 cartas selecionadas
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-8">
              {/* Leque de Cartas */}
              <div className="relative flex justify-center items-end h-64 overflow-hidden">
                <div className="relative w-full max-w-4xl">
                  {shuffledCards.slice(0, 15).map((card, index) => {
                    const totalCards = 15
                    const angle = (index - (totalCards - 1) / 2) * 8 // Ângulo de rotação
                    const translateX = (index - (totalCards - 1) / 2) * 25 // Espaçamento horizontal
                    const translateY = Math.abs(index - (totalCards - 1) / 2) * 5 // Curvatura do leque
                    const isSelected = selectedCards.find(c => c.id === card.id)
                    const isHovered = hoveredCard === index
                    
                    return (
                      <div
                        key={card.id}
                        className={`absolute bottom-0 left-1/2 cursor-pointer transition-all duration-300 ${
                          isSelected ? 'opacity-50 pointer-events-none' : ''
                        }`}
                        style={{
                          transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) rotate(${angle}deg) ${
                            isHovered ? 'translateY(-20px) scale(1.1)' : ''
                          }`,
                          zIndex: isHovered ? 50 : totalCards - Math.abs(index - (totalCards - 1) / 2)
                        }}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => selectedCards.length < 3 && !isSelected && handleCardSelect(card)}
                      >
                        {/* Verso da Carta */}
                        <div className={`w-20 h-32 rounded-lg border-2 transition-all duration-300 ${
                          isHovered 
                            ? 'border-yellow-400 shadow-2xl shadow-yellow-400/50' 
                            : 'border-purple-500/50'
                        } ${
                          isSelected 
                            ? 'bg-gradient-to-br from-gray-600 to-gray-800' 
                            : 'bg-gradient-to-br from-purple-800 to-indigo-800'
                        } flex items-center justify-center relative overflow-hidden`}>
                          {/* Padrão místico no verso */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-indigo-600/30"></div>
                          <div className="relative text-center">
                            <div className="text-2xl mb-1">🌟</div>
                            <div className="text-xs text-purple-200 font-bold">TAROT</div>
                          </div>
                          
                          {/* Efeito de brilho no hover */}
                          {isHovered && (
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
                          )}
                        </div>
                        
                        {/* Indicador de seleção */}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Instruções */}
              <div className="text-center mt-8 space-y-2">
                <p className="text-indigo-200">
                  {selectedCards.length === 0 && "✨ Passe o mouse sobre as cartas e escolha 3 que chamem sua atenção"}
                  {selectedCards.length > 0 && selectedCards.length < 3 && `🎯 Escolha mais ${3 - selectedCards.length} carta${3 - selectedCards.length > 1 ? 's' : ''}`}
                  {selectedCards.length === 3 && "🌟 Perfeito! Suas 3 cartas do destino foram escolhidas"}
                </p>
                {selectedCards.length === 3 && (
                  <Button
                    onClick={() => setShowCards(false)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white mt-4"
                  >
                    Confirmar Seleção
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Perguntas */}
        {questions.length > 0 && (
          <Card className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-100">Suas Perguntas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-start gap-4">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-purple-100 mb-3">{q.question}</p>
                        <div className="flex items-center gap-3 text-sm text-purple-300">
                          <span className="font-medium">3 cartas selecionadas:</span>
                          {q.selectedCards.map((card, cardIndex) => (
                            <div key={card.id} className="flex items-center gap-1">
                              <span>🌟</span>
                              <span>Carta {cardIndex + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seção de Pagamento */}
        {questions.length > 0 && !isPaid && (
          <Card className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🔮</div>
                <h3 className="text-2xl font-bold text-green-300 mb-2">
                  Desbloqueie suas respostas místicas
                </h3>
                <p className="text-green-100 mb-4">
                  Suas perguntas foram registradas pelo oráculo. Para revelar as cartas escolhidas e suas respostas sagradas, 
                  complete o pagamento seguro.
                </p>
                <div className="text-3xl font-bold text-yellow-300 mb-6">
                  R$ {consultationPrice.toFixed(2)}
                </div>
              </div>
              <Button
                onClick={() => setShowPayment(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg px-8 py-3"
              >
                Revelar Respostas Agora
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Respostas (após pagamento) */}
        {isPaid && questions.length > 0 && (
          <Card className="bg-gradient-to-br from-yellow-800/50 to-orange-800/50 border-yellow-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-yellow-300 text-2xl">
                🌟 Suas Respostas Místicas 🌟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg p-6 border border-yellow-500/20">
                    <div className="flex items-start gap-4 mb-6">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg px-3 py-1">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-bold text-yellow-200 mb-4 text-lg">{q.question}</h4>
                        
                        {/* Tiragem de 3 Cartas */}
                        <div className="grid md:grid-cols-3 gap-4">
                          {q.selectedCards.map((card, cardIndex) => (
                            <div key={card.id} className="bg-gradient-to-br from-yellow-800/50 to-orange-800/50 rounded-lg p-4 border border-yellow-500/30">
                              <div className="text-center mb-3">
                                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white mb-2">
                                  {cardIndex === 0 ? 'Passado' : cardIndex === 1 ? 'Presente' : 'Futuro'}
                                </Badge>
                              </div>
                              <div className="flex flex-col items-center gap-3">
                                <span className="text-4xl">{card.image}</span>
                                <div className="text-center">
                                  <h5 className="font-bold text-yellow-300 mb-1">{card.name}</h5>
                                  <p className="text-sm text-yellow-200 mb-3">{card.meaning}</p>
                                </div>
                              </div>
                              <Separator className="my-3 bg-yellow-500/30" />
                              <div className="text-yellow-100 text-sm">
                                <p className="leading-relaxed">
                                  {cardIndex === 0 && `No contexto do seu passado, ${card.name.toLowerCase()} revela as influências que moldaram sua situação atual. ${card.meaning.toLowerCase()} são as energias que estiveram presentes em sua jornada.`}
                                  {cardIndex === 1 && `Para o momento presente, ${card.name.toLowerCase()} indica que ${card.meaning.toLowerCase()} são as forças ativas em sua vida agora. Esta carta mostra onde você está neste momento.`}
                                  {cardIndex === 2 && `Olhando para o futuro, ${card.name.toLowerCase()} sugere que ${card.meaning.toLowerCase()} serão as energias que se manifestarão. Mantenha-se aberto às possibilidades.`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Interpretação Geral */}
                        <div className="mt-6 bg-gradient-to-br from-yellow-700/30 to-orange-700/30 rounded-lg p-4 border border-yellow-500/20">
                          <h6 className="font-bold text-yellow-300 mb-2">🔮 Interpretação Completa:</h6>
                          <p className="text-yellow-100 leading-relaxed">
                            A combinação dessas três cartas revela uma jornada completa para sua pergunta. 
                            O passado mostra as bases, o presente indica onde focar sua energia agora, 
                            e o futuro aponta para as possibilidades que se abrem. Confie em sua intuição 
                            e permita que essas energias guiem seus próximos passos.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de Pagamento */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-purple-200">
              Pagamento Seguro
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <p className="text-purple-200 mb-4">
                Complete o pagamento para desbloquear suas respostas místicas
              </p>
              <div className="text-2xl font-bold text-yellow-300">R$ {consultationPrice.toFixed(2)}</div>
            </div>
            
            {/* Métodos de Pagamento Disponíveis */}
            <div className="space-y-3">
              <Label className="text-purple-200">Escolha o método de pagamento:</Label>
              {paymentMethods.filter(pm => pm.isActive).map((method) => (
                <div key={method.id} className="bg-purple-800/50 rounded-lg p-3 border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    {getPaymentMethodIcon(method.type)}
                    <span className="font-medium text-purple-100">{method.name}</span>
                  </div>
                  {method.type === 'pix' && method.details.pixKey && (
                    <div className="text-sm text-purple-300">
                      <p>Chave PIX: {method.details.pixKey}</p>
                      {method.details.accountName && <p>Nome: {method.details.accountName}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div>
              <Label htmlFor="guru-account" className="text-purple-200">
                Comprovante de Pagamento
              </Label>
              <Input
                id="guru-account"
                value={guruAccount}
                onChange={(e) => setGuruAccount(e.target.value)}
                placeholder="Cole aqui o comprovante ou ID da transação"
                className="bg-purple-800/50 border-purple-500/50 text-white placeholder-purple-300"
              />
            </div>
            <Button
              onClick={handlePayment}
              disabled={!guruAccount.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              Confirmar Pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Configurações do Administrador */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-500/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-purple-200">
              Painel do Administrador
            </DialogTitle>
          </DialogHeader>
          
          {!isAdminAuthenticated ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-password" className="text-purple-200">
                  Senha do Administrador
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Digite a senha de administrador"
                  className="bg-purple-800/50 border-purple-500/50 text-white placeholder-purple-300"
                  onKeyPress={(e) => e.key === 'Enter' && authenticateAdmin()}
                />
              </div>
              <Button 
                onClick={authenticateAdmin}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                Entrar
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="payment-methods" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-purple-800/50">
                <TabsTrigger value="payment-methods" className="text-purple-200">Formas de Pagamento</TabsTrigger>
                <TabsTrigger value="pricing" className="text-purple-200">Preços</TabsTrigger>
                <TabsTrigger value="settings" className="text-purple-200">Configurações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="payment-methods" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-purple-200">Métodos de Pagamento</h3>
                  <Button
                    onClick={() => setShowAddPayment(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Método
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getPaymentMethodIcon(method.type)}
                          <div>
                            <h4 className="font-medium text-purple-100">{method.name}</h4>
                            <p className="text-sm text-purple-300 capitalize">{method.type.replace('_', ' ')}</p>
                          </div>
                          <Badge className={method.isActive ? "bg-green-500" : "bg-red-500"}>
                            {method.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => togglePaymentMethodStatus(method.id)}
                            variant="outline"
                            size="sm"
                            className="border-purple-500/50 text-purple-200"
                          >
                            {method.isActive ? "Desativar" : "Ativar"}
                          </Button>
                          <Button
                            onClick={() => setEditingPayment(method)}
                            variant="outline"
                            size="sm"
                            className="border-purple-500/50 text-purple-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deletePaymentMethod(method.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Detalhes do método */}
                      <div className="mt-3 text-sm text-purple-300">
                        {method.type === 'pix' && (
                          <div>
                            {method.details.pixKey && <p>Chave PIX: {method.details.pixKey}</p>}
                            {method.details.accountName && <p>Nome da Conta: {method.details.accountName}</p>}
                          </div>
                        )}
                        {method.type === 'bank_transfer' && (
                          <div>
                            {method.details.bankName && <p>Banco: {method.details.bankName}</p>}
                            {method.details.agency && <p>Agência: {method.details.agency}</p>}
                            {method.details.account && <p>Conta: {method.details.account}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-200">Configuração de Preços</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="consultation-price" className="text-purple-200">
                      Preço da Consulta (R$)
                    </Label>
                    <Input
                      id="consultation-price"
                      type="number"
                      step="0.01"
                      value={consultationPrice}
                      onChange={(e) => setConsultationPrice(parseFloat(e.target.value) || 0)}
                      className="bg-purple-800/50 border-purple-500/50 text-white"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    Salvar Preços
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-200">Configurações Gerais</h3>
                <div className="space-y-4">
                  <Button 
                    onClick={() => setIsAdminAuthenticated(false)}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    Sair do Painel Admin
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para Adicionar/Editar Método de Pagamento */}
      <Dialog open={showAddPayment || editingPayment !== null} onOpenChange={(open) => {
        if (!open) {
          setShowAddPayment(false)
          setEditingPayment(null)
          setNewPaymentMethod({ name: '', type: 'pix', details: {}, isActive: true })
        }
      }}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-purple-200">
              {editingPayment ? 'Editar Método de Pagamento' : 'Adicionar Método de Pagamento'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-purple-200">Nome do Método</Label>
              <Input
                value={editingPayment ? editingPayment.name : newPaymentMethod.name}
                onChange={(e) => {
                  if (editingPayment) {
                    setEditingPayment({ ...editingPayment, name: e.target.value })
                  } else {
                    setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })
                  }
                }}
                placeholder="Ex: PIX Principal, Cartão Visa, etc."
                className="bg-purple-800/50 border-purple-500/50 text-white placeholder-purple-300"
              />
            </div>
            
            <div>
              <Label className="text-purple-200">Tipo de Pagamento</Label>
              <Select
                value={editingPayment ? editingPayment.type : newPaymentMethod.type}
                onValueChange={(value) => {
                  if (editingPayment) {
                    setEditingPayment({ ...editingPayment, type: value as PaymentMethod['type'] })
                  } else {
                    setNewPaymentMethod({ ...newPaymentMethod, type: value as PaymentMethod['type'] })
                  }
                }}
              >
                <SelectTrigger className="bg-purple-800/50 border-purple-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-purple-800 border-purple-500/50">
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="card">Cartão de Crédito/Débito</SelectItem>
                  <SelectItem value="digital_wallet">Carteira Digital</SelectItem>
                  <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Campos específicos por tipo */}
            {((editingPayment && editingPayment.type === 'pix') || (!editingPayment && newPaymentMethod.type === 'pix')) && (
              <>
                <div>
                  <Label className="text-purple-200">Chave PIX</Label>
                  <Input
                    value={editingPayment ? editingPayment.details.pixKey || '' : newPaymentMethod.details?.pixKey || ''}
                    onChange={(e) => {
                      if (editingPayment) {
                        setEditingPayment({
                          ...editingPayment,
                          details: { ...editingPayment.details, pixKey: e.target.value }
                        })
                      } else {
                        setNewPaymentMethod({
                          ...newPaymentMethod,
                          details: { ...newPaymentMethod.details, pixKey: e.target.value }
                        })
                      }
                    }}
                    placeholder="CPF, CNPJ, email ou telefone"
                    className="bg-purple-800/50 border-purple-500/50 text-white placeholder-purple-300"
                  />
                </div>
                <div>
                  <Label className="text-purple-200">Nome da Conta</Label>
                  <Input
                    value={editingPayment ? editingPayment.details.accountName || '' : newPaymentMethod.details?.accountName || ''}
                    onChange={(e) => {
                      if (editingPayment) {
                        setEditingPayment({
                          ...editingPayment,
                          details: { ...editingPayment.details, accountName: e.target.value }
                        })
                      } else {
                        setNewPaymentMethod({
                          ...newPaymentMethod,
                          details: { ...newPaymentMethod.details, accountName: e.target.value }
                        })
                      }
                    }}
                    placeholder="Nome do titular da conta"
                    className="bg-purple-800/50 border-purple-500/50 text-white placeholder-purple-300"
                  />
                </div>
              </>
            )}
            
            {((editingPayment && editingPayment.type === 'bank_transfer') || (!editingPayment && newPaymentMethod.type === 'bank_transfer')) && (
              <>
                <div>
                  <Label className="text-purple-200">Nome do Banco</Label>
                  <Input
                    value={editingPayment ? editingPayment.details.bankName || '' : newPaymentMethod.details?.bankName || ''}
                    onChange={(e) => {
                      if (editingPayment) {
                        setEditingPayment({
                          ...editingPayment,
                          details: { ...editingPayment.details, bankName: e.target.value }
                        })
                      } else {
                        setNewPaymentMethod({
                          ...newPaymentMethod,
                          details: { ...newPaymentMethod.details, bankName: e.target.value }
                        })
                      }
                    }}
                    placeholder="Ex: Banco do Brasil, Itaú, etc."
                    className="bg-purple-800/50 border-purple-500/50 text-white placeholder-purple-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-purple-200">Agência</Label>
                    <Input
                      value={editingPayment ? editingPayment.details.agency || '' : newPaymentMethod.details?.agency || ''}
                      onChange={(e) => {
                        if (editingPayment) {
                          setEditingPayment({
                            ...editingPayment,
                            details: { ...editingPayment.details, agency: e.target.value }
                          })
                        } else {
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            details: { ...newPaymentMethod.details, agency: e.target.value }
                          })
                        }
                      }}
                      placeholder="0000"
                      className="bg-purple-800/50 border-purple-500/50 text-white placeholder-purple-300"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-200">Conta</Label>
                    <Input
                      value={editingPayment ? editingPayment.details.account || '' : newPaymentMethod.details?.account || ''}
                      onChange={(e) => {
                        if (editingPayment) {
                          setEditingPayment({
                            ...editingPayment,
                            details: { ...editingPayment.details, account: e.target.value }
                          })
                        } else {
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            details: { ...newPaymentMethod.details, account: e.target.value }
                          })
                        }
                      }}
                      placeholder="00000-0"
                      className="bg-purple-800/50 border-purple-500/50 text-white placeholder-purple-300"
                    />
                  </div>
                </div>
              </>
            )}
            
            <Button
              onClick={editingPayment ? updatePaymentMethod : addPaymentMethod}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {editingPayment ? 'Atualizar Método' : 'Adicionar Método'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-purple-900 to-indigo-900 p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-4 mb-4">
            <Star className="w-6 h-6 text-yellow-400" />
            <Moon className="w-6 h-6 text-purple-300" />
            <Sun className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-purple-200 mb-2">
            © 2024 Oráculo Místico - Conectando você com a sabedoria ancestral
          </p>
          <p className="text-sm text-purple-300">
            Pagamentos processados com segurança através de múltiplos métodos
          </p>
        </div>
      </footer>
    </div>
  )
}