import { useState } from "react";
import { useConfig } from "@/lib/store";
import { uploadImage } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, Upload, Link as LinkIcon, Percent, Flame, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";
import type { ChangeEvent } from "react";

export default function AdminPage() {
  const { config, updateConfig, updateProduct, updateProductKit, saveConfig } = useConfig();
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await saveConfig();
      toast({
        title: "Configurações salvas!",
        description: "Suas alterações foram aplicadas com sucesso.",
        className: "bg-green-600 text-white border-none",
        duration: 1500,
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        className: "bg-red-600 text-white border-none",
        duration: 3000,
      });
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'profile' | 'product', productId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadKey = field === 'profile' ? 'profile' : `product-${productId}`;
      setUploadingImage(uploadKey);

      try {
        const folder = field === 'profile' ? 'profile' : 'products';
        const publicUrl = await uploadImage(file, folder);

        if (publicUrl) {
          if (field === 'profile') {
            updateConfig({ profileImage: publicUrl });
          } else if (field === 'product' && productId) {
            updateProduct(productId, { image: publicUrl });
          }
          toast({
            title: "Imagem enviada!",
            description: "A imagem foi salva com sucesso.",
            className: "bg-green-600 text-white border-none",
            duration: 1500,
          });
        } else {
          toast({
            title: "Erro no upload",
            description: "Não foi possível enviar a imagem.",
            className: "bg-red-600 text-white border-none",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Erro no upload",
          description: "Ocorreu um erro ao enviar a imagem.",
          className: "bg-red-600 text-white border-none",
          duration: 3000,
        });
      } finally {
        setUploadingImage(null);
      }
    }
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
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
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Profile Section */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Perfil & Contato</CardTitle>
            <CardDescription>Informações principais e WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer flex flex-col items-center gap-2">
                <div className="relative w-20 h-20 rounded-full border border-border overflow-hidden">
                  <img 
                    src={config.profileImage} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    style={{ transform: `scale(${config.profileImageScale / 100})` }}
                  />
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${uploadingImage === 'profile' ? 'opacity-100 bg-black/50' : 'opacity-0 group-hover:opacity-100'}`}>
                    {uploadingImage === 'profile' ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 text-white drop-shadow-md" />
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                    disabled={uploadingImage === 'profile'}
                  />
                </div>
                <div className="w-full space-y-1">
                  <Label className="text-[10px] text-muted-foreground text-center block">Zoom</Label>
                  <Slider 
                     defaultValue={[config.profileImageScale]} 
                     min={50} 
                     max={200} 
                     step={5}
                     onValueChange={(vals) => updateConfig({ profileImageScale: vals[0] })}
                     className="w-20"
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome de Exibição</Label>
                  <Input 
                    id="name" 
                    value={config.profileName} 
                    onChange={(e) => updateConfig({ profileName: e.target.value })} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">WhatsApp (apenas números)</Label>
                  <Input 
                    id="whatsapp" 
                    placeholder="5511999999999"
                    value={config.whatsappNumber} 
                    onChange={(e) => updateConfig({ whatsappNumber: e.target.value })} 
                  />
                </div>
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

        {/* Products Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold px-1">Produtos & Kits</h2>
          
          {config.products.map((product) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-sm">
              <CardHeader className="bg-gray-50/50 pb-4">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-20 h-20 bg-white rounded-lg border border-border flex items-center justify-center group overflow-hidden">
                      <img
                        src={product.image}
                        alt="Product"
                        className="max-w-full max-h-full object-contain p-1 transition-transform"
                        style={{ transform: `scale(${product.imageScale / 100})` }}
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleImageUpload(e, 'product', product.id)}
                        disabled={uploadingImage === `product-${product.id}`}
                      />
                      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity pointer-events-none ${uploadingImage === `product-${product.id}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {uploadingImage === `product-${product.id}` ? (
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="w-full space-y-1">
                      <Label className="text-[10px] text-muted-foreground text-center block">Zoom</Label>
                      <Slider
                         defaultValue={[product.imageScale]}
                         min={50}
                         max={400}
                         step={10}
                         onValueChange={(vals) => updateProduct(product.id, { imageScale: vals[0] })}
                         className="w-20"
                      />
                    </div>
                  </div>

                  <div className="flex-1 grid gap-3">
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

                    {/* Discount Toggle */}
                    <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                      <div className="flex items-center gap-2 flex-1">
                        <Flame className={`w-4 h-4 ${product.discountPercent > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
                        <div className="flex flex-col">
                          <Label className="text-xs font-medium">Desconto Ativo</Label>
                          <span className="text-[10px] text-muted-foreground">Oferta do dia</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.discountPercent > 0}
                          onCheckedChange={(checked) => updateProduct(product.id, { discountPercent: checked ? 10 : 0 })}
                        />
                        {product.discountPercent > 0 && (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={product.discountPercent}
                              onChange={(e) => updateProduct(product.id, { discountPercent: Math.min(100, Math.max(0, Number(e.target.value))) })}
                              className="w-14 h-7 text-xs text-center font-bold"
                              min={0}
                              max={100}
                            />
                            <Percent className="w-3 h-3 text-orange-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {product.kits.map((kit) => (
                    <div key={kit.id} className="p-4 grid grid-cols-12 gap-3 items-center hover:bg-gray-50/30 transition-colors">
                      <div className="col-span-12 md:col-span-5 flex flex-col gap-2">
                         <div className="flex gap-2">
                           <div className="flex-1">
                              <Label className="text-xs text-muted-foreground mb-1 block">Nome do Kit</Label>
                              <Input 
                                value={kit.label} 
                                onChange={(e) => updateProductKit(product.id, kit.id, { label: e.target.value })}
                                className="h-8 text-sm"
                              />
                           </div>
                           <div className="w-24">
                              <Label className="text-xs text-muted-foreground mb-1 block">Preço (R$)</Label>
                              <Input 
                                type="number"
                                value={kit.price} 
                                onChange={(e) => updateProductKit(product.id, kit.id, { price: Number(e.target.value) })}
                                className="h-8 text-sm"
                              />
                           </div>
                         </div>
                         <div className="relative">
                            <LinkIcon className="w-3 h-3 absolute left-2.5 top-2.5 text-muted-foreground" />
                            <Input 
                              value={kit.link || ''} 
                              onChange={(e) => updateProductKit(product.id, kit.id, { link: e.target.value })}
                              className="h-8 text-xs pl-8 text-muted-foreground"
                              placeholder="Link de checkout (https://...)"
                            />
                         </div>
                      </div>
                      
                      {product.discountPercent > 0 && (
                         <div className="col-span-12 md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 md:gap-0 mt-1 md:mt-0">
                           <span className="text-[10px] text-muted-foreground">Com {product.discountPercent}% OFF:</span>
                           <span className="text-sm font-bold text-green-600">
                             R$ {(kit.price * (1 - product.discountPercent / 100)).toFixed(2)}
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
      </SignedIn>
    </>
  );
}
