import { useState, useEffect } from "react";
import { useUser, UserButton, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ExternalLink,
  Save,
  Upload,
  Link as LinkIcon,
  Percent,
  Flame,
  Loader2,
  Eye,
  Copy,
  Check,
  Plus,
  Trash2,
  Video,
  Instagram,
  Globe,
  Facebook,
  Youtube,
  Twitter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/supabase";
import { KitLinksModal } from "@/components/kit-links-modal";
import type { ChangeEvent } from "react";
import type { ProductKit } from "@/lib/store";

interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

interface StoreData {
  id: number;
  username: string;
  profile_name: string;
  profile_bio: string;
  profile_image: string;
  profile_image_scale: number;
  video_url: string;
  video_thumbnail: string;
  show_video: boolean;
  whatsapp_number: string;
  whatsapp_message: string;
  discount_percent: number;
  products: any[];
  links: SocialLink[];
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linksModalProduct, setLinksModalProduct] = useState<any | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) return;

    fetchStore();
  }, [isLoaded, user]);

  const fetchStore = async () => {
    try {
      const res = await fetch("/api/user/store", {
        headers: { "x-clerk-user-id": user!.id },
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.needsOnboarding) {
          setLocation("/onboarding");
          return;
        }
        throw new Error(data.error);
      }

      const data = await res.json();
      setStore(data);
    } catch (error) {
      console.error("Error fetching store:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!store || !user) return;

    setSaving(true);
    try {
      const res = await fetch("/api/user/store", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify(store),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast({
        title: "Salvo!",
        description: "Suas alterações foram salvas.",
        className: "bg-green-600 text-white border-none",
        duration: 1500,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar.",
        className: "bg-red-600 text-white border-none",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateStore = (updates: Partial<StoreData>) => {
    setStore((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const updateProduct = (productId: string, updates: any) => {
    if (!store) return;
    const products = store.products.map((p) =>
      p.id === productId ? { ...p, ...updates } : p
    );
    updateStore({ products });
  };

  const updateProductKit = (productId: string, kitId: string, updates: any) => {
    if (!store) return;
    const products = store.products.map((p) => {
      if (p.id === productId) {
        const kits = p.kits.map((k: any) =>
          k.id === kitId ? { ...k, ...updates } : k
        );
        return { ...p, kits };
      }
      return p;
    });
    updateStore({ products });
  };

  // Link management functions
  const addLink = () => {
    if (!store) return;
    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      label: "",
      url: "",
      icon: "link",
    };
    updateStore({ links: [...(store.links || []), newLink] });
  };

  const updateLink = (linkId: string, updates: Partial<SocialLink>) => {
    if (!store) return;
    const links = (store.links || []).map((link) =>
      link.id === linkId ? { ...link, ...updates } : link
    );
    updateStore({ links });
  };

  const removeLink = (linkId: string) => {
    if (!store) return;
    const links = (store.links || []).filter((link) => link.id !== linkId);
    updateStore({ links });
  };

  // Product management functions
  const addProduct = () => {
    if (!store) return;
    const newProduct = {
      id: `product-${Date.now()}`,
      title: "Novo Produto",
      description: "Descrição do produto",
      image: "",
      imageScale: 100,
      discountPercent: 0,
      kits: [
        { id: `kit-${Date.now()}-1`, label: "1 Unidade", price: 97, link: "" },
        { id: `kit-${Date.now()}-2`, label: "3 Unidades", price: 197, link: "" },
        { id: `kit-${Date.now()}-3`, label: "5 Unidades", price: 297, link: "" },
      ],
    };
    updateStore({ products: [...store.products, newProduct] });
  };

  const removeProduct = (productId: string) => {
    if (!store) return;
    const products = store.products.filter((p) => p.id !== productId);
    updateStore({ products });
  };

  const addKit = (productId: string) => {
    if (!store) return;
    const products = store.products.map((p) => {
      if (p.id === productId) {
        const newKit = {
          id: `kit-${Date.now()}`,
          label: "Novo Kit",
          price: 0,
          link: "",
        };
        return { ...p, kits: [...p.kits, newKit] };
      }
      return p;
    });
    updateStore({ products });
  };

  const removeKit = (productId: string, kitId: string) => {
    if (!store) return;
    const products = store.products.map((p) => {
      if (p.id === productId) {
        return { ...p, kits: p.kits.filter((k: any) => k.id !== kitId) };
      }
      return p;
    });
    updateStore({ products });
  };

  const saveKitLinks = (productId: string, kits: ProductKit[]) => {
    if (!store) return;
    const products = store.products.map((p) =>
      p.id === productId ? { ...p, kits } : p
    );
    updateStore({ products });
    toast({
      title: "Links salvos!",
      description: "Os links foram atualizados. Clique em Salvar para persistir.",
      className: "bg-blue-600 text-white border-none",
      duration: 2000,
    });
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: "profile" | "product",
    productId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = field === "profile" ? "profile" : `product-${productId}`;
    setUploadingImage(uploadKey);

    try {
      const folder = field === "profile" ? "profile" : "products";
      const publicUrl = await uploadImage(file, folder);

      if (publicUrl) {
        if (field === "profile") {
          updateStore({ profile_image: publicUrl });
        } else if (productId) {
          updateProduct(productId, { image: publicUrl });
        }
        toast({
          title: "Imagem enviada!",
          className: "bg-green-600 text-white border-none",
          duration: 1500,
        });
      }
    } catch (error) {
      toast({
        title: "Erro no upload",
        className: "bg-red-600 text-white border-none",
      });
    } finally {
      setUploadingImage(null);
    }
  };

  const copyLink = () => {
    if (!store) return;
    navigator.clipboard.writeText(`${window.location.origin}/${store.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        {store && (
          <div className="min-h-screen bg-gray-50/50 p-4 pb-24 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Minha Página</h1>
                    <p className="text-xs text-muted-foreground">/{store.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={copyLink}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Link href={`/${store.username}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </Link>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
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
                        {store.profile_image ? (
                          <img
                            src={store.profile_image}
                            alt="Profile"
                            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                            style={{ transform: `scale(${store.profile_image_scale / 100})` }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary">
                            {store.profile_name.charAt(0)}
                          </div>
                        )}
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                            uploadingImage === "profile"
                              ? "opacity-100 bg-black/50"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {uploadingImage === "profile" ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          ) : (
                            <Upload className="w-6 h-6 text-white drop-shadow-md" />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleImageUpload(e, "profile")}
                          disabled={uploadingImage === "profile"}
                        />
                      </div>
                      <div className="w-full space-y-1">
                        <Label className="text-[10px] text-muted-foreground text-center block">
                          Zoom
                        </Label>
                        <Slider
                          defaultValue={[store.profile_image_scale]}
                          min={50}
                          max={200}
                          step={5}
                          onValueChange={(vals) =>
                            updateStore({ profile_image_scale: vals[0] })
                          }
                          className="w-20"
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome de Exibição</Label>
                        <Input
                          id="name"
                          value={store.profile_name}
                          onChange={(e) => updateStore({ profile_name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="whatsapp">WhatsApp (apenas números)</Label>
                        <Input
                          id="whatsapp"
                          placeholder="5511999999999"
                          value={store.whatsapp_number}
                          onChange={(e) => updateStore({ whatsapp_number: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={store.profile_bio}
                      onChange={(e) => updateStore({ profile_bio: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="video">YouTube Video URL</Label>
                    <Input
                      id="video"
                      placeholder="https://youtube.com/..."
                      value={store.video_url}
                      onChange={(e) => updateStore({ video_url: e.target.value })}
                    />
                  </div>

                  {/* Video Thumbnail Upload */}
                  <div className="grid gap-2">
                    <Label>Capa do Vídeo</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-20 bg-gray-100 rounded-lg border border-border overflow-hidden group cursor-pointer">
                        {store.video_thumbnail ? (
                          <img
                            src={store.video_thumbnail}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <Video className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                            uploadingImage === "video-thumbnail"
                              ? "opacity-100 bg-black/50"
                              : "opacity-0 group-hover:opacity-100 bg-black/30"
                          }`}
                        >
                          {uploadingImage === "video-thumbnail" ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5 text-white drop-shadow-md" />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingImage("video-thumbnail");
                            try {
                              const publicUrl = await uploadImage(file, "profile");
                              if (publicUrl) {
                                updateStore({ video_thumbnail: publicUrl });
                                toast({
                                  title: "Capa enviada!",
                                  className: "bg-green-600 text-white border-none",
                                  duration: 1500,
                                });
                              }
                            } catch (error) {
                              toast({
                                title: "Erro no upload",
                                className: "bg-red-600 text-white border-none",
                              });
                            } finally {
                              setUploadingImage(null);
                            }
                          }}
                          disabled={uploadingImage === "video-thumbnail"}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Imagem que aparece antes do vídeo começar. Recomendado: 16:9 (1280x720).
                        </p>
                        {store.video_thumbnail && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 mt-1 h-7 px-2"
                            onClick={() => updateStore({ video_thumbnail: "" })}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remover
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Video Visibility Toggle */}
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 flex-1">
                      <Video className={`w-4 h-4 ${store.show_video !== false ? "text-blue-500" : "text-gray-300"}`} />
                      <div className="flex flex-col">
                        <Label className="text-xs font-medium">Mostrar Vídeo</Label>
                        <span className="text-[10px] text-muted-foreground">Exibir vídeo na página</span>
                      </div>
                    </div>
                    <Switch
                      checked={store.show_video !== false}
                      onCheckedChange={(checked) => updateStore({ show_video: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Links Section */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Links</CardTitle>
                      <CardDescription>Redes sociais e outros links</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={addLink}>
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(!store.links || store.links.length === 0) ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum link adicionado. Clique em "Adicionar" para criar um.
                    </p>
                  ) : (
                    store.links.map((link) => (
                      <div key={link.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Select
                          value={link.icon || "link"}
                          onValueChange={(value) => updateLink(link.id, { icon: value })}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">
                              <div className="flex items-center gap-2">
                                <Instagram className="w-4 h-4" />
                                Instagram
                              </div>
                            </SelectItem>
                            <SelectItem value="facebook">
                              <div className="flex items-center gap-2">
                                <Facebook className="w-4 h-4" />
                                Facebook
                              </div>
                            </SelectItem>
                            <SelectItem value="youtube">
                              <div className="flex items-center gap-2">
                                <Youtube className="w-4 h-4" />
                                YouTube
                              </div>
                            </SelectItem>
                            <SelectItem value="twitter">
                              <div className="flex items-center gap-2">
                                <Twitter className="w-4 h-4" />
                                Twitter/X
                              </div>
                            </SelectItem>
                            <SelectItem value="globe">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Website
                              </div>
                            </SelectItem>
                            <SelectItem value="link">
                              <div className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                Outro
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={link.label}
                          onChange={(e) => updateLink(link.id, { label: e.target.value })}
                          placeholder="Nome do link"
                          className="flex-1"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) => updateLink(link.id, { url: e.target.value })}
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeLink(link.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Products Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-semibold">Produtos & Kits</h2>
                  <Button variant="outline" size="sm" onClick={addProduct}>
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Produto
                  </Button>
                </div>

                {store.products.length === 0 && (
                  <Card className="border-none shadow-sm">
                    <CardContent className="py-8">
                      <p className="text-sm text-muted-foreground text-center">
                        Nenhum produto adicionado. Clique em "Adicionar Produto" para criar um.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {store.products.map((product) => (
                  <Card key={product.id} className="overflow-hidden border-none shadow-sm">
                    <CardHeader className="bg-gray-50/50 pb-4">
                      <div className="flex items-center gap-6 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative w-20 h-20 bg-white rounded-lg border border-border flex items-center justify-center group overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt="Product"
                                className="max-w-full max-h-full object-contain p-1 transition-transform"
                                style={{ transform: `scale(${product.imageScale / 100})` }}
                              />
                            ) : (
                              <Upload className="w-6 h-6 text-gray-300" />
                            )}
                            <Input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              onChange={(e) => handleImageUpload(e, "product", product.id)}
                              disabled={uploadingImage === `product-${product.id}`}
                            />
                            <div
                              className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity pointer-events-none ${
                                uploadingImage === `product-${product.id}`
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              {uploadingImage === `product-${product.id}` ? (
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="w-full space-y-1">
                            <Label className="text-[10px] text-muted-foreground text-center block">
                              Zoom
                            </Label>
                            <Slider
                              defaultValue={[product.imageScale || 100]}
                              min={50}
                              max={400}
                              step={10}
                              onValueChange={(vals) =>
                                updateProduct(product.id, { imageScale: vals[0] })
                              }
                              className="w-20"
                            />
                          </div>
                        </div>

                        <div className="flex-1 grid gap-3">
                          <Input
                            value={product.title}
                            onChange={(e) =>
                              updateProduct(product.id, { title: e.target.value })
                            }
                            className="font-semibold"
                            placeholder="Nome do Produto"
                          />
                          <Input
                            value={product.description}
                            onChange={(e) =>
                              updateProduct(product.id, { description: e.target.value })
                            }
                            className="text-xs text-muted-foreground h-8"
                            placeholder="Descrição curta"
                          />

                          {/* Discount Toggle */}
                          <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                            <div className="flex items-center gap-2 flex-1">
                              <Flame
                                className={`w-4 h-4 ${
                                  product.discountPercent > 0
                                    ? "text-orange-500"
                                    : "text-gray-300"
                                }`}
                              />
                              <div className="flex flex-col">
                                <Label className="text-xs font-medium">Desconto Ativo</Label>
                                <span className="text-[10px] text-muted-foreground">
                                  Oferta do dia
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={product.discountPercent > 0}
                                onCheckedChange={(checked) =>
                                  updateProduct(product.id, {
                                    discountPercent: checked ? 10 : 0,
                                  })
                                }
                              />
                              {product.discountPercent > 0 && (
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    value={product.discountPercent}
                                    onChange={(e) =>
                                      updateProduct(product.id, {
                                        discountPercent: Math.min(
                                          100,
                                          Math.max(0, Number(e.target.value))
                                        ),
                                      })
                                    }
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
                        {product.kits.map((kit: any) => (
                          <div
                            key={kit.id}
                            className="p-3 flex items-center gap-3 hover:bg-gray-50/30 transition-colors"
                          >
                            {/* Kit Name & Price */}
                            <div className="flex-1 flex items-center gap-2">
                              <Input
                                value={kit.label}
                                onChange={(e) =>
                                  updateProductKit(product.id, kit.id, {
                                    label: e.target.value,
                                  })
                                }
                                className="h-8 text-sm flex-1 max-w-[120px]"
                                placeholder="Nome do kit"
                              />
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">R$</span>
                                <Input
                                  type="number"
                                  value={kit.price}
                                  onChange={(e) =>
                                    updateProductKit(product.id, kit.id, {
                                      price: Number(e.target.value),
                                    })
                                  }
                                  className="h-8 text-sm w-20"
                                />
                              </div>
                            </div>

                            {/* Discount Price Preview */}
                            {product.discountPercent > 0 && (
                              <div className="text-right">
                                <span className="text-[10px] text-muted-foreground block">
                                  -{product.discountPercent}%
                                </span>
                                <span className="text-sm font-bold text-green-600">
                                  R$ {(kit.price * (1 - product.discountPercent / 100)).toFixed(0)}
                                </span>
                              </div>
                            )}

                            {/* Link Status Indicator */}
                            <div className="flex items-center gap-1">
                              {kit.link ? (
                                <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                  Link ✓
                                </span>
                              ) : (
                                <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                                  Sem link
                                </span>
                              )}
                            </div>

                            {/* Remove Kit Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 h-7 w-7"
                              onClick={() => removeKit(product.id, kit.id)}
                              disabled={product.kits.length <= 1}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="p-3 flex justify-between border-t border-dashed border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => addKit(product.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Adicionar Kit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primary hover:bg-primary/5"
                            onClick={() => setLinksModalProduct(product)}
                          >
                            <LinkIcon className="w-4 h-4 mr-1" />
                            Configurar Links
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Kit Links Modal */}
        {linksModalProduct && (
          <KitLinksModal
            open={!!linksModalProduct}
            onOpenChange={(open) => !open && setLinksModalProduct(null)}
            product={linksModalProduct}
            onSave={saveKitLinks}
          />
        )}
      </SignedIn>
    </>
  );
}
