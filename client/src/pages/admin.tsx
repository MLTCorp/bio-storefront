import { useConfig } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { ChangeEvent } from "react";

export default function AdminPage() {
  const { config, updateConfig, updateProduct, updateProductKit } = useConfig();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas alterações foram aplicadas com sucesso.",
      className: "bg-green-600 text-white border-none",
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, field: 'profile' | 'product', productId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (field === 'profile') {
        updateConfig({ profileImage: objectUrl });
      } else if (field === 'product' && productId) {
        updateProduct(productId, { image: objectUrl });
      }
    }
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
            <CardTitle>Perfil & Video</CardTitle>
            <CardDescription>Informações principais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <img 
                  src={config.profileImage} 
                  alt="Profile Preview" 
                  className="w-20 h-20 rounded-full object-cover border border-border group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <Input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => handleImageUpload(e, 'profile')}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="name">Nome de Exibição</Label>
                <Input 
                  id="name" 
                  value={config.profileName} 
                  onChange={(e) => updateConfig({ profileName: e.target.value })} 
                />
              </div>
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

            <div className="grid gap-2">
              <Label htmlFor="video">YouTube Video URL</Label>
              <Input 
                id="video" 
                placeholder="https://youtube.com/..."
                value={config.videoUrl} 
                onChange={(e) => updateConfig({ videoUrl: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Coupon Section */}
        <Card className="border-primary/20 shadow-sm bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Cupom & Ofertas</CardTitle>
            <CardDescription>Desconto global aplicado sobre o preço dos kits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Porcentagem de Desconto ({config.discountPercent}%)</Label>
                <span className="text-sm font-bold text-primary">{config.discountPercent}% OFF</span>
              </div>
              <Slider 
                defaultValue={[config.discountPercent]} 
                max={50} 
                step={5} 
                onValueChange={(vals) => updateConfig({ discountPercent: vals[0] })}
                className="py-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold px-1">Produtos & Kits</h2>
          
          {config.products.map((product) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-sm">
              <CardHeader className="bg-gray-50/50 pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-white rounded-lg border border-border flex items-center justify-center group overflow-hidden">
                    <img src={product.image} alt="Product" className="w-full h-full object-contain p-1" />
                    <Input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      onChange={(e) => handleImageUpload(e, 'product', product.id)}
                    />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 grid gap-2">
                    <Input 
                      value={product.title} 
                      onChange={(e) => updateProduct(product.id, { title: e.target.value })}
                      className="font-semibold"
                      placeholder="Nome do Produto"
                    />
                    <Input 
                      value={product.description} 
                      onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                      className="text-xs text-muted-foreground h-8"
                      placeholder="Descrição curta"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {product.kits.map((kit) => (
                    <div key={kit.id} className="p-4 grid grid-cols-12 gap-3 items-center hover:bg-gray-50/30 transition-colors">
                      <div className="col-span-6 md:col-span-5">
                        <Label className="text-xs text-muted-foreground mb-1 block">Nome do Kit</Label>
                        <Input 
                          value={kit.label} 
                          onChange={(e) => updateProductKit(product.id, kit.id, { label: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="col-span-6 md:col-span-4">
                         <Label className="text-xs text-muted-foreground mb-1 block">Preço (R$)</Label>
                         <Input 
                          type="number"
                          value={kit.price} 
                          onChange={(e) => updateProductKit(product.id, kit.id, { price: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                      </div>
                      {config.discountPercent > 0 && (
                         <div className="col-span-12 md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 md:gap-0 mt-1 md:mt-0">
                           <span className="text-[10px] text-muted-foreground">Com {config.discountPercent}% OFF:</span>
                           <span className="text-sm font-bold text-green-600">
                             R$ {(kit.price * (1 - config.discountPercent / 100)).toFixed(2)}
                           </span>
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
