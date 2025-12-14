import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useConfig } from "@/lib/store";
import { useCheckout } from "@/hooks/use-checkout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Star,
  Shield,
  Truck,
  CreditCard,
  Loader2,
  MessageCircle
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { BackgroundEffect } from "@/components/background-effect";

export default function ProdutoPage() {
  const [, params] = useRoute("/produto/:id");
  const { config, isLoading } = useConfig();
  const { checkout, loading: checkoutLoading } = useCheckout();
  const [selectedKit, setSelectedKit] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const product = config.products.find(p => p.id === params?.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto no encontrado</h1>
          <Link href="/">
            <Button>Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedKitData = product.kits.find(k => k.id === selectedKit);
  const finalPrice = selectedKitData
    ? product.discountPercent > 0
      ? selectedKitData.price * (1 - product.discountPercent / 100)
      : selectedKitData.price
    : 0;

  const handleCheckout = async () => {
    if (!selectedKitData) return;

    await checkout([
      {
        name: `${product.title} - ${selectedKitData.label}`,
        price: finalPrice,
        quantity: 1,
        image: product.image,
      }
    ]);
  };

  const handleWhatsApp = () => {
    const message = selectedKitData
      ? `Olá! Tenho interesse no ${product.title} - ${selectedKitData.label} por R$ ${finalPrice.toFixed(2)}`
      : `Olá! Tenho interesse no ${product.title}`;
    window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundEffect />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Entrar</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">

            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="sticky top-24">
                <div className="bg-white rounded-3xl shadow-xl p-8 aspect-square flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                    style={{ transform: `scale(${(product.imageScale || 100) / 100})` }}
                  />
                </div>

                {product.discountPercent > 0 && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    -{product.discountPercent}% OFF
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-lg text-gray-600">{product.description}</p>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Compra Segura</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Frete Grátis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.9 (500+ avaliações)</span>
                </div>
              </div>

              {/* Kit Selection */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Escolha sua opção:</h3>
                <div className="grid gap-3">
                  {product.kits.map((kit) => {
                    const kitFinalPrice = product.discountPercent > 0
                      ? kit.price * (1 - product.discountPercent / 100)
                      : kit.price;

                    return (
                      <Card
                        key={kit.id}
                        className={`p-4 cursor-pointer transition-all border-2 ${
                          selectedKit === kit.id
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedKit(kit.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedKit === kit.id
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}>
                              {selectedKit === kit.id && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="font-medium">{kit.label}</span>
                          </div>
                          <div className="text-right">
                            {product.discountPercent > 0 && (
                              <span className="text-sm text-gray-400 line-through mr-2">
                                R$ {kit.price.toFixed(2)}
                              </span>
                            )}
                            <span className="text-lg font-bold text-primary">
                              R$ {kitFinalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                  disabled={!selectedKit || checkoutLoading}
                  onClick={handleCheckout}
                >
                  {checkoutLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="w-5 h-5 mr-2" />
                  )}
                  {checkoutLoading ? 'Processando...' : 'Comprar Agora'}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-lg font-semibold border-2"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Tirar Dúvidas no WhatsApp
                </Button>
              </div>

              {/* Payment Methods */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 text-center">
                  Pagamento seguro via <strong>Stripe</strong> - Cartão, Boleto ou PIX
                </p>
              </div>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            <Card className="p-6 text-center bg-white/80 backdrop-blur">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Garantia de 30 Dias</h3>
              <p className="text-sm text-gray-600">
                Se não gostar, devolvemos 100% do seu dinheiro
              </p>
            </Card>

            <Card className="p-6 text-center bg-white/80 backdrop-blur">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-sm text-gray-600">
                Enviamos para todo o Brasil com rastreamento
              </p>
            </Card>

            <Card className="p-6 text-center bg-white/80 backdrop-blur">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">+10.000 Clientes</h3>
              <p className="text-sm text-gray-600">
                Milhares de pessoas já transformaram suas vidas
              </p>
            </Card>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
