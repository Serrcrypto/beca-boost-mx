import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  PiggyBank, 
  TrendingUp, 
  Send, 
  BookOpen, 
  MessageCircle,
  User,
  Target,
  Award,
  ChevronRight,
  Plus
} from 'lucide-react';
import lumiAvatar from '@/assets/lumi-avatar.png';
import onboardingHero from '@/assets/onboarding-hero.png';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import ErrorBoundary from './ErrorBoundary';

type Screen = 'onboarding' | 'dashboard' | 'savings' | 'ai-chat' | 'education' | 'transfer';

const MobileApp = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [showAIChat, setShowAIChat] = useState(false);

  const screens = {
    onboarding: <OnboardingScreen onNext={() => setCurrentScreen('dashboard')} />,
    dashboard: <DashboardScreen onNavigate={setCurrentScreen} />,
    savings: <SavingsScreen onNavigate={setCurrentScreen} />,
    'ai-chat': <AIChatScreen onClose={() => setCurrentScreen('dashboard')} />,
    education: <EducationScreen onNavigate={setCurrentScreen} />,
    transfer: (
      <ErrorBoundary>
        <TransferScreen onNavigate={setCurrentScreen} />
      </ErrorBoundary>
    )
  };

  return (
    <div className="max-w-sm mx-auto bg-background min-h-screen relative overflow-hidden font-poppins">
      {/* Mobile Frame */}
      <div className="relative">
        {screens[currentScreen]}
        
        {/* Floating AI Button */}
        {currentScreen !== 'onboarding' && currentScreen !== 'ai-chat' && (
          <Button
            onClick={() => setCurrentScreen('ai-chat')}
            className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-secondary shadow-secondary animate-pulse-glow z-50"
            variant="secondary"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}
        
        {/* Bottom Navigation */}
        {currentScreen !== 'onboarding' && currentScreen !== 'ai-chat' && (
          <BottomNavigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </div>
    </div>
  );
};

const OnboardingScreen = ({ onNext }: { onNext: () => void }) => (
  <div className="p-6 min-h-screen flex flex-col justify-center items-center bg-gradient-hero text-center">
    <div className="mb-8 animate-float">
      <img src={onboardingHero} alt="Lumi Hero" className="w-80 h-44 object-cover rounded-2xl shadow-card" />
    </div>
    
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4 text-white">
        Convierte tu beca en tu futuro
      </h1>
      <p className="text-lg text-white/90 leading-relaxed">
        Aprende a administrar tu dinero, ahorra para tus metas y construye tu independencia financiera
      </p>
    </div>
    
    <Button 
      onClick={onNext}
      variant="outline"
      className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-lg py-6 px-8 rounded-2xl backdrop-blur-sm"
    >
      Comenzar mi viaje financiero
    </Button>
  </div>
);

const DashboardScreen = ({ onNavigate }: { onNavigate: (screen: Screen) => void }) => (
  <div className="p-6 pb-24 min-h-screen bg-background">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">¡Hola, Ana! 👋</h2>
        <p className="text-muted-foreground">Veamos tus finanzas hoy</p>
      </div>
      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-primary-foreground" />
      </div>
    </div>

    {/* Balance Card */}
    <Card className="p-6 mb-6 bg-gradient-primary rounded-2xl shadow-primary">
      <div className="text-center text-primary-foreground">
        <p className="text-sm opacity-90 mb-2">Saldo total disponible</p>
        <h3 className="text-3xl font-bold mb-4">$4,580.50 MXN</h3>
        <div className="flex justify-between text-sm">
          <span>Beca mensual: $3,200</span>
          <span>Ahorro: $1,380.50</span>
        </div>
      </div>
    </Card>

    {/* Quick Actions */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      <ActionCard
        icon={<PiggyBank className="w-6 h-6" />}
        title="Mi Beca"
        subtitle="Próximo pago: 15 días"
        onClick={() => {}}
        className="bg-gradient-secondary"
      />
      <ActionCard
        icon={<Target className="w-6 h-6" />}
        title="Ahorro"
        subtitle="3 metas activas"
        onClick={() => onNavigate('savings')}
        className="bg-gradient-primary"
      />
      <ActionCard
        icon={<TrendingUp className="w-6 h-6" />}
        title="Staking"
        subtitle="Gana 8% anual"
        onClick={() => {}}
        className="bg-accent text-accent-foreground"
      />
      <ActionCard
        icon={<Send className="w-6 h-6" />}
        title="Transferir"
        subtitle="Envía dinero"
        onClick={() => onNavigate('transfer')}
        className="bg-secondary text-secondary-foreground"
      />
    </div>

    {/* Progress Section */}
    <Card className="p-4 rounded-2xl shadow-card">
      <h4 className="font-semibold mb-3 text-foreground">Tu progreso este mes</h4>
      <div className="space-y-3">
        <ProgressItem label="Ahorro para laptop" progress={65} amount="$1,950" target="$3,000" />
        <ProgressItem label="Fondo de emergencia" progress={30} amount="$600" target="$2,000" />
      </div>
    </Card>
  </div>
);

const SavingsScreen = ({ onNavigate }: { onNavigate: (screen: Screen) => void }) => (
  <div className="p-6 pb-24 min-h-screen bg-background">
    {/* Header */}
    <div className="flex items-center mb-6">
      <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="mr-3 p-2">
        <ChevronRight className="w-5 h-5 rotate-180" />
      </Button>
      <h2 className="text-xl font-semibold">Mis Ahorros</h2>
    </div>

    {/* Total Savings */}
    <Card className="p-6 mb-6 bg-gradient-primary rounded-2xl shadow-primary">
      <div className="text-center text-primary-foreground">
        <p className="text-sm opacity-90 mb-2">Total ahorrado</p>
        <h3 className="text-3xl font-bold">$2,550.00</h3>
      </div>
    </Card>

    {/* Savings Goals */}
    <div className="space-y-4 mb-6">
      <SavingsGoal
        title="Viaje de graduación"
        progress={75}
        saved={2250}
        target={3000}
        deadline="4 meses"
        color="bg-secondary"
      />
      <SavingsGoal
        title="Laptop nueva"
        progress={45}
        saved={1350}
        target={3000}
        deadline="6 meses"
        color="bg-accent"
      />
      <SavingsGoal
        title="Fondo emergencia"
        progress={25}
        saved={500}
        target={2000}
        deadline="1 año"
        color="bg-success"
      />
    </div>

    {/* Add New Goal */}
    <Button 
      className="w-full py-6 rounded-2xl bg-muted hover:bg-muted/80 text-muted-foreground border-2 border-dashed border-border"
      variant="ghost"
    >
      <Plus className="w-5 h-5 mr-2" />
      Agregar nueva meta
    </Button>
  </div>
);

const AIChatScreen = ({ onClose }: { onClose: () => void }) => (
  <div className="min-h-screen bg-background flex flex-col">
    {/* Header */}
    <div className="p-4 border-b border-border bg-card">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onClose} className="mr-3 p-2">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </Button>
        <img src={lumiAvatar} alt="Lumi" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h3 className="font-semibold">Lumi</h3>
          <p className="text-sm text-muted-foreground">Tu coach financiero</p>
        </div>
      </div>
    </div>

    {/* Chat Messages */}
    <div className="flex-1 p-4 space-y-4">
      <ChatMessage
        isBot={true}
        message="¡Hola Ana! 👋 Soy Lumi, tu coach financiero personal. ¿En qué puedo ayudarte hoy?"
        avatar={lumiAvatar}
      />
      <ChatMessage
        isBot={false}
        message="Hola Lumi! Quiero ahorrar para mi viaje de graduación"
      />
      <ChatMessage
        isBot={true}
        message="¡Excelente meta! 🎓 ¿Para cuándo es tu graduación y cuánto estimas que necesitas para el viaje?"
        avatar={lumiAvatar}
      />
      
      {/* Quick Actions */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">¿Para qué quieres ahorrar?</p>
        <div className="flex flex-wrap gap-2">
          {['🎒 Viaje', '💻 Laptop', '🚨 Emergencias', '🎓 Estudios'].map((option) => (
            <Button key={option} variant="outline" size="sm" className="rounded-full">
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>

    {/* Input */}
    <div className="p-4 border-t border-border">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          className="flex-1 p-3 border border-border rounded-2xl bg-background"
        />
        <Button size="sm" className="rounded-full w-12 h-12 bg-gradient-primary">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

const EducationScreen = ({ onNavigate }: { onNavigate: (screen: Screen) => void }) => (
  <div className="p-6 pb-24 min-h-screen bg-background">
    {/* Header */}
    <div className="flex items-center mb-6">
      <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="mr-3 p-2">
        <ChevronRight className="w-5 h-5 rotate-180" />
      </Button>
      <h2 className="text-xl font-semibold">Educación Financiera</h2>
    </div>

    {/* Progress Overview */}
    <Card className="p-6 mb-6 bg-gradient-secondary rounded-2xl shadow-secondary">
      <div className="text-center text-secondary-foreground">
        <h3 className="text-lg font-semibold mb-2">Nivel 2: Intermedio</h3>
        <div className="w-full bg-white/20 rounded-full h-3 mb-2">
          <div className="bg-white h-3 rounded-full" style={{ width: '60%' }}></div>
        </div>
        <p className="text-sm opacity-90">3 de 5 cursos completados</p>
      </div>
    </Card>

    {/* Courses */}
    <div className="space-y-4">
      <CourseCard
        title="Aprende a presupuestar"
        description="Fundamentos del manejo de dinero"
        progress={100}
        badge="🏆 Completado"
        badgeColor="bg-success"
      />
      <CourseCard
        title="Inversiones básicas"
        description="Multiplica tu dinero de forma segura"
        progress={60}
        badge="📚 En progreso"
        badgeColor="bg-accent"
      />
      <CourseCard
        title="Staking en Stellar"
        description="Gana recompensas con tu dinero"
        progress={0}
        badge="🔒 Próximamente"
        badgeColor="bg-muted"
      />
    </div>
  </div>
);

const TransferScreen = ({ onNavigate }: { onNavigate: (screen: Screen) => void }) => {
  const {
    isConnected,
    isConnecting,
    publicKey,
    account,
    connect,
    disconnect,
    isTransactionPending,
    lastTransaction,
    sendPayment,
    validateAddress,
    getBalance,
    error,
    clearError
  } = useStellarWallet();

  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<'XLM' | 'USDC' | 'MXN'>('XLM');
  const [memo, setMemo] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [balance, setBalance] = useState('0');

  // Validate address when destination changes
  useEffect(() => {
    if (destination.trim()) {
      validateAddress(destination.trim()).then(setIsValidAddress);
    } else {
      setIsValidAddress(false);
    }
  }, [destination, validateAddress]);

  // Get balance when asset changes
  useEffect(() => {
    if (isConnected && publicKey) {
      getBalance(selectedAsset).then(setBalance);
    }
  }, [selectedAsset, isConnected, publicKey, getBalance]);

  const handleSend = async () => {
    if (!isValidAddress || !amount || parseFloat(amount) <= 0) return;

    try {
      const result = await sendPayment({
        destination: destination.trim(),
        amount: amount,
        asset: selectedAsset,
        memo: memo.trim()
      });

      if (result.success) {
        // Reset form
        setDestination('');
        setAmount('');
        setMemo('');
        // Refresh balance
        getBalance(selectedAsset).then(setBalance);
      }
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toFixed(4);
  };

  const getAssetSymbol = (asset: string) => {
    switch (asset) {
      case 'XLM': return 'XLM';
      case 'USDC': return 'USDC';
      case 'MXN': return 'MXN';
      default: return asset;
    }
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="mr-3 p-2">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </Button>
        <h2 className="text-xl font-semibold">Transferir</h2>
      </div>

      {/* Freighter Installation Info */}
      {!isConnected && (
        <Card className="p-4 rounded-2xl shadow-card mb-6 bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">¿Qué es Freighter?</h3>
            <p className="text-xs text-blue-700 mb-3">
              Freighter es una extensión de navegador que te permite interactuar con la red Stellar de forma segura.
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>• Instala la extensión desde freighter.app</p>
              <p>• Crea una cuenta en Stellar Testnet</p>
              <p>• Obtén XLM de prueba del faucet</p>
            </div>
          </div>
        </Card>
      )}

      {/* Wallet Connection Status */}
      <Card className="p-4 rounded-2xl shadow-card mb-6">
        {!isConnected ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Conecta tu wallet Stellar para enviar pagos
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Requiere la extensión Freighter instalada
            </p>
            <Button 
              onClick={connect} 
              disabled={isConnecting}
              className="w-full bg-gradient-primary"
            >
              {isConnecting ? 'Conectando...' : 'Conectar Freighter'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              <a href="https://freighter.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Instalar Freighter →
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Wallet conectada</p>
                <p className="text-xs font-mono text-foreground">
                  {typeof publicKey === 'string' ? `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}` : 'N/A'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={disconnect}>
                Desconectar
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Red: Stellar Testnet
            </div>
          </div>
        )}
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 rounded-2xl shadow-card mb-6 bg-destructive/10 border-destructive/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="ghost" size="sm" onClick={clearError}>
              ✕
            </Button>
          </div>
        </Card>
      )}

      {/* Transaction Success */}
      {lastTransaction?.success && (
        <Card className="p-4 rounded-2xl shadow-card mb-6 bg-green-500/10 border-green-500/20">
          <div className="text-center">
            <p className="text-sm text-green-600 font-semibold mb-2">¡Transacción exitosa!</p>
            <p className="text-xs text-green-600 font-mono">
              Hash: {lastTransaction.transactionHash?.slice(0, 16)}...
            </p>
          </div>
        </Card>
      )}

      {/* Asset Selection */}
      <Card className="p-4 rounded-2xl shadow-card mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Seleccionar activo</h3>
        <div className="grid grid-cols-3 gap-2">
          {(['XLM', 'USDC', 'MXN'] as const).map((asset) => (
            <Button
              key={asset}
              variant={selectedAsset === asset ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAsset(asset)}
              className={selectedAsset === asset ? "bg-gradient-primary" : ""}
            >
              {asset}
            </Button>
          ))}
        </div>
        {isConnected && (
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              Balance: {formatBalance(balance)} {getAssetSymbol(selectedAsset)}
            </p>
          </div>
        )}
      </Card>

      {/* Transfer Form */}
      <Card className="p-6 rounded-2xl shadow-card space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Dirección de destino
          </label>
          <input
            type="text"
            placeholder="GDQNY3PBO... (Stellar address)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={`w-full p-3 border rounded-xl bg-background ${
              destination && !isValidAddress 
                ? 'border-destructive' 
                : destination && isValidAddress 
                ? 'border-green-500' 
                : 'border-border'
            }`}
          />
          {destination && !isValidAddress && (
            <p className="text-xs text-destructive mt-1">Dirección inválida</p>
          )}
          {destination && isValidAddress && (
            <p className="text-xs text-green-600 mt-1">✓ Dirección válida</p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Monto</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.0000001"
              className="w-full p-3 border border-border rounded-xl bg-background text-right text-2xl font-semibold"
            />
            <span className="absolute left-3 top-3 text-muted-foreground">
              {getAssetSymbol(selectedAsset)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Máximo: {formatBalance(balance)} {getAssetSymbol(selectedAsset)}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Memo (opcional)
          </label>
          <input
            type="text"
            placeholder="Descripción del pago..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full p-3 border border-border rounded-xl bg-background"
            maxLength={28}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {memo.length}/28 caracteres
          </p>
        </div>

        <Button 
          onClick={handleSend}
          disabled={!isConnected || !isValidAddress || !amount || parseFloat(amount) <= 0 || isTransactionPending}
          className="w-full py-6 rounded-xl bg-gradient-primary text-lg font-semibold mt-6"
        >
          {isTransactionPending 
            ? 'Procesando...' 
            : `Enviar ${amount || '0.00'} ${getAssetSymbol(selectedAsset)}`
          }
        </Button>
      </Card>

      {/* Quick Send Contacts */}
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-3">Direcciones frecuentes</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Carlos', address: 'GDQNY3PBO...', avatar: '👨‍🎓' },
            { name: 'María', address: 'GDMGQBDB2F...', avatar: '👩‍🎓' },
            { name: 'Luis', address: 'GBBD47IF6L...', avatar: '👨‍💻' },
            { name: 'Ana', address: 'GDMGQBDB2F...', avatar: '👩‍🎨' }
          ].map((contact) => (
            <div 
              key={contact.name} 
              className="p-3 border border-border rounded-xl bg-background cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setDestination(contact.address)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-sm">
                  {contact.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{contact.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ActionCard = ({ icon, title, subtitle, onClick, className }: any) => (
  <Card 
    className={`p-4 rounded-2xl cursor-pointer transition-transform hover:scale-105 ${className}`}
    onClick={onClick}
  >
    <div className="text-center">
      <div className="mb-2">{icon}</div>
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs opacity-90">{subtitle}</p>
    </div>
  </Card>
);

const ProgressItem = ({ label, progress, amount, target }: any) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">{amount} / {target}</span>
    </div>
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

const SavingsGoal = ({ title, progress, saved, target, deadline, color }: any) => (
  <Card className="p-4 rounded-2xl shadow-card">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">Meta: {deadline}</p>
      </div>
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
    </div>
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span>${saved.toLocaleString()}</span>
        <span className="text-muted-foreground">${target.toLocaleString()}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
    <p className="text-sm text-muted-foreground">{progress}% completado</p>
  </Card>
);

const ChatMessage = ({ isBot, message, avatar }: any) => (
  <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
    <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      {isBot && (
        <img src={avatar} alt="Lumi" className="w-8 h-8 rounded-full mr-2 mt-1" />
      )}
      <div className={`p-3 rounded-2xl ${
        isBot 
          ? 'bg-card border border-border' 
          : 'bg-gradient-primary text-primary-foreground'
      }`}>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  </div>
);

const CourseCard = ({ title, description, progress, badge, badgeColor }: any) => (
  <Card className="p-4 rounded-2xl shadow-card">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full text-white ${badgeColor}`}>
        {badge}
      </span>
    </div>
    {progress > 0 && (
      <div className="mb-3">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-primary h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    )}
    <Button 
      variant={progress === 100 ? "secondary" : "default"} 
      size="sm" 
      className="w-full rounded-xl"
      disabled={progress === 0}
    >
      {progress === 100 ? 'Revisar' : progress === 0 ? 'Próximamente' : 'Continuar'}
    </Button>
  </Card>
);

const BottomNavigation = ({ currentScreen, onNavigate }: any) => (
  <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-card border-t border-border">
    <div className="flex justify-around items-center py-2">
      {[
        { id: 'dashboard', icon: Home, label: 'Inicio' },
        { id: 'savings', icon: PiggyBank, label: 'Ahorro' },
        { id: 'education', icon: BookOpen, label: 'Aprender' },
        { id: 'transfer', icon: Send, label: 'Enviar' }
      ].map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant="ghost"
          onClick={() => onNavigate(id)}
          className={`flex flex-col items-center py-3 px-4 ${
            currentScreen === id ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Icon className="w-5 h-5 mb-1" />
          <span className="text-xs">{label}</span>
        </Button>
      ))}
    </div>
  </div>
);

export default MobileApp;