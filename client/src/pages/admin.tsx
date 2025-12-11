import { useConfig } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { config, updateConfig, updateProduct } = useConfig();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas alterações foram aplicadas com sucesso.",
      className: "bg-green-600 text-white border-none",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 pb-24 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Configuração</h1>
              <p className="text-xs text-muted-foreground">Personalize sua página</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>

        {/* Profile Section */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Informações principais da bio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img 
                src={config.profileImage} 
                alt="Profile Preview" 
                className="w-16 h-16 rounded-full object-cover border border-border"
              />
              <div className="flex-1">
                <Label htmlFor="profile-image-url">URL da Foto de Perfil</Label>
                <Input 
                  id="profile-image-url" 
                  value={config.profileImage} 
                  onChange={(e) => updateConfig({ profileImage: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Nome de Exibição</Label>
              <Input 
                id="name" 
                value={config.profileName} 
                onChange={(e) => updateConfig({ profileName: e.target.value })} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={config.profileBio} 
                onChange={(e) => updateConfig({ profileBio: e.target.value })}
                rows={3} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Coupon Section */}
        <Card className="border-primary/20 shadow-sm bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Cupom & Ofertas</CardTitle>
            <CardDescription>Ative descontos globais para todos os produtos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Desconto Aplicado ({config.discountPercent}%)</Label>
                <span className="text-sm font-bold text-primary">{config.discountPercent}% OFF</span>
              </div>
              <Slider 
                defaultValue={[config.discountPercent]} 
                max={50} 
                step={5} 
                onValueChange={(vals) => updateConfig({ discountPercent: vals[0] })}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">
                Ao aumentar a porcentagem, os preços antigos serão riscados e os novos valores com desconto serão destacados automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold">Produtos</h2>
            {/* Add product functionality could be here */}
          </div>
          
          {config.products.map((product, index) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-sm">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-32 h-32 bg-white p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
                  <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" />
                </div>
                <CardContent className="flex-1 p-4 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`p-${product.id}-name`}>Nome do Produto</Label>
                    <Input 
                      id={`p-${product.id}-name`} 
                      value={product.title} 
                      onChange={(e) => updateProduct(product.id, { title: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`p-${product.id}-desc`}>Descrição Curta</Label>
                    <Input 
                      id={`p-${product.id}-desc`} 
                      value={product.description} 
                      onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`p-${product.id}-price`}>Preço Base (1 un)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                        <Input 
                          id={`p-${product.id}-price`} 
                          type="number" 
                          value={product.basePrice} 
                          onChange={(e) => updateProduct(product.id, { basePrice: Number(e.target.value) })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    {config.discountPercent > 0 && (
                      <div className="grid gap-2">
                        <Label>Com Desconto</Label>
                        <div className="h-10 px-3 py-2 bg-primary/10 rounded-md text-primary font-bold flex items-center">
                          R$ {(product.basePrice * (1 - config.discountPercent / 100)).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
