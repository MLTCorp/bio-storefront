import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";
import { useLocation, useParams } from "wouter";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Eye,
  Save,
  Loader2,
  Plus,
  Link as LinkIcon,
  Type,
  ShoppingBag,
  Video,
  Share2,
  MousePointer2,
  Upload,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { uploadImage } from "@/lib/supabase";
import type { Page, PageComponent, ComponentType, ComponentConfig } from "@/types/database";
import { SortableComponent } from "@/components/page-builder/sortable-component";
import { AddComponentMenu } from "@/components/page-builder/add-component-menu";
import { ProfileEditor } from "@/components/page-builder/profile-editor";
import { ComponentRenderer } from "@/components/page-builder/component-renderer";
import { BackgroundEffect } from "@/components/background-effect";

export default function PageEditorPage() {
  const { user, isLoaded } = useUser();
  const [, navigate] = useLocation();
  const params = useParams<{ pageId: string }>();
  const { toast } = useToast();

  const [page, setPage] = useState<Page | null>(null);
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch page data
  useEffect(() => {
    if (!isLoaded || !user || !params.pageId) return;

    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/pages/${params.pageId}`, {
          headers: {
            "x-clerk-user-id": user.id,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPage(data);
          setComponents(data.components || []);
        } else {
          toast({
            title: "Página não encontrada",
            className: "bg-red-600 text-white",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao buscar página:", error);
        toast({
          title: "Erro ao carregar página",
          className: "bg-red-600 text-white",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [isLoaded, user, params.pageId]);

  // Save page
  const handleSave = async (): Promise<boolean> => {
    if (!page || !user) return false;

    setSaving(true);

    try {
      // Save page
      await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify({
          profile_name: page.profile_name,
          profile_bio: page.profile_bio,
          profile_image: page.profile_image,
          profile_image_scale: page.profile_image_scale,
          whatsapp_number: page.whatsapp_number,
          whatsapp_message: page.whatsapp_message,
          background_type: page.background_type,
          background_value: page.background_value,
          font_family: page.font_family,
        }),
      });

      // Reorder components
      await fetch(`/api/pages/${page.id}/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify({
          componentIds: components.map((c) => c.id),
        }),
      });

      toast({
        title: "Salvo!",
        className: "bg-green-600 text-white",
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        className: "bg-red-600 text-white",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Handle preview button click
  const handlePreviewClick = () => {
    setShowSaveConfirm(true);
  };

  // Save and show preview
  const handleSaveAndPreview = async () => {
    setShowSaveConfirm(false);
    const saved = await handleSave();
    if (saved) {
      setShowPreview(true);
    }
  };

  // Just show preview without saving
  const handlePreviewWithoutSave = () => {
    setShowSaveConfirm(false);
    setShowPreview(true);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Add component
  const handleAddComponent = async (type: ComponentType) => {
    if (!page || !user) return;

    const defaultConfigs: Record<ComponentType, ComponentConfig> = {
      button: {
        type: "link",
        text: "Novo Botão",
        url: "",
        style: "large",
      },
      text: {
        content: "Seu texto aqui...",
        alignment: "center",
        size: "medium",
      },
      product: {
        id: crypto.randomUUID(),
        title: "Novo Produto",
        description: "Descrição do produto",
        image: "",
        imageScale: 100,
        discountPercent: 0,
        kits: [{ id: crypto.randomUUID(), label: "1 Un", price: 99, link: "" }],
      },
      video: {
        url: "",
        thumbnail: "",
        title: "",
        showTitle: false,
      },
      social: {
        links: [],
        style: "icons",
      },
      link: {
        text: "Novo Link",
        url: "",
        style: "large",
      },
    };

    try {
      const response = await fetch(`/api/pages/${page.id}/components`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify({
          type,
          config: defaultConfigs[type],
        }),
      });

      if (response.ok) {
        const newComponent = await response.json();
        setComponents([...components, newComponent]);
        toast({
          title: "Componente adicionado",
          className: "bg-green-600 text-white",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao adicionar componente",
        className: "bg-red-600 text-white",
      });
    }
  };

  // Update component
  const handleUpdateComponent = async (componentId: number, config: ComponentConfig) => {
    if (!user) return;

    try {
      await fetch(`/api/components/${componentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify({ config }),
      });

      setComponents(
        components.map((c) => (c.id === componentId ? { ...c, config } : c))
      );
    } catch (error) {
      toast({
        title: "Erro ao atualizar componente",
        className: "bg-red-600 text-white",
      });
    }
  };

  // Delete component
  const handleDeleteComponent = async (componentId: number) => {
    if (!user) return;

    try {
      await fetch(`/api/components/${componentId}`, {
        method: "DELETE",
        headers: {
          "x-clerk-user-id": user.id,
        },
      });

      setComponents(components.filter((c) => c.id !== componentId));
      toast({
        title: "Componente removido",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover componente",
        className: "bg-red-600 text-white",
      });
    }
  };

  // Toggle component visibility
  const handleToggleVisibility = async (componentId: number) => {
    if (!user) return;

    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    const newVisibility = component.is_visible === false ? true : false;

    try {
      await fetch(`/api/components/${componentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify({ is_visible: newVisibility }),
      });

      setComponents(
        components.map((c) =>
          c.id === componentId ? { ...c, is_visible: newVisibility } : c
        )
      );
    } catch (error) {
      toast({
        title: "Erro ao alterar visibilidade",
        className: "bg-red-600 text-white",
      });
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !page) return;

    setUploadingProfile(true);
    try {
      const url = await uploadImage(file, "profile");
      if (url) {
        setPage({ ...page, profile_image: url });
        toast({
          title: "Imagem enviada!",
          className: "bg-green-600 text-white",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no upload",
        className: "bg-red-600 text-white",
      });
    } finally {
      setUploadingProfile(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-100">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium text-gray-700">@{page.username}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviewClick}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  Salvar
                </Button>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="max-w-lg mx-auto p-4 pb-24">
            {/* Preview Container */}
            <div
              className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[600px]"
              style={{
                backgroundColor: page.background_value || "#ffffff",
                fontFamily: page.font_family || "Inter",
              }}
            >
              {/* Profile Section */}
              <ProfileEditor
                page={page}
                onUpdate={(updates) => setPage({ ...page, ...updates })}
                onImageUpload={handleProfileImageUpload}
                uploading={uploadingProfile}
              />

              {/* Components List */}
              <div className="px-4 pb-4 space-y-3">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={components.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {components.map((component) => (
                      <SortableComponent
                        key={component.id}
                        component={component}
                        onUpdate={(config) => handleUpdateComponent(component.id, config)}
                        onDelete={() => handleDeleteComponent(component.id)}
                        onToggleVisibility={() => handleToggleVisibility(component.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>

            {/* Add Component Menu */}
            <AddComponentMenu onAdd={handleAddComponent} />

            {/* Personalization Section */}
            <Card className="mt-4">
              <button
                className="w-full p-4 flex items-center justify-between text-left"
                onClick={() => setShowPersonalization(!showPersonalization)}
              >
                <span className="font-medium">Personalização</span>
                {showPersonalization ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {showPersonalization && (
                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Tema</label>
                    <div className="grid grid-cols-5 gap-2">
                      {/* Light Theme */}
                      <button
                        onClick={() => setPage({ ...page, background_value: "#ffffff" })}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                          page.background_value === "#ffffff" || !page.background_value
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-1">
                          <div className="w-4 h-4 rounded-full bg-gray-200 mb-1" />
                          <div className="w-6 h-1 bg-gray-300 rounded mb-0.5" />
                          <div className="w-5 h-1 bg-gray-200 rounded mb-1" />
                          <div className="w-full px-1 space-y-0.5">
                            <div className="h-1.5 bg-gray-100 rounded" />
                            <div className="h-1.5 bg-gray-100 rounded" />
                          </div>
                        </div>
                        <span className="absolute bottom-0.5 left-0 right-0 text-[8px] font-medium text-gray-600 text-center">Light</span>
                      </button>

                      {/* Dark Theme */}
                      <button
                        onClick={() => setPage({ ...page, background_value: "#1a1a2e" })}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                          page.background_value === "#1a1a2e"
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="absolute inset-0 bg-[#1a1a2e] flex flex-col items-center justify-center p-1">
                          <div className="w-4 h-4 rounded-full bg-gray-600 mb-1" />
                          <div className="w-6 h-1 bg-gray-500 rounded mb-0.5" />
                          <div className="w-5 h-1 bg-gray-600 rounded mb-1" />
                          <div className="w-full px-1 space-y-0.5">
                            <div className="h-1.5 bg-gray-700 rounded" />
                            <div className="h-1.5 bg-gray-700 rounded" />
                          </div>
                        </div>
                        <span className="absolute bottom-0.5 left-0 right-0 text-[8px] font-medium text-gray-400 text-center">Dark</span>
                      </button>

                      {/* Futurista Theme */}
                      <button
                        onClick={() => setPage({ ...page, background_value: "#0f0f23" })}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                          page.background_value === "#0f0f23"
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="absolute inset-0 bg-[#0f0f23] flex flex-col items-center justify-center p-1">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 mb-1" />
                          <div className="w-6 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded mb-0.5" />
                          <div className="w-5 h-1 bg-purple-500/50 rounded mb-1" />
                          <div className="w-full px-1 space-y-0.5">
                            <div className="h-1.5 bg-cyan-500/30 rounded" />
                            <div className="h-1.5 bg-purple-500/30 rounded" />
                          </div>
                        </div>
                        <span className="absolute bottom-0.5 left-0 right-0 text-[8px] font-medium text-cyan-400 text-center">Cyber</span>
                      </button>

                      {/* Girl Theme */}
                      <button
                        onClick={() => setPage({ ...page, background_value: "#fdf2f8" })}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                          page.background_value === "#fdf2f8"
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="absolute inset-0 bg-[#fdf2f8] flex flex-col items-center justify-center p-1">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 mb-1" />
                          <div className="w-6 h-1 bg-pink-400 rounded mb-0.5" />
                          <div className="w-5 h-1 bg-pink-300 rounded mb-1" />
                          <div className="w-full px-1 space-y-0.5">
                            <div className="h-1.5 bg-pink-200 rounded" />
                            <div className="h-1.5 bg-rose-200 rounded" />
                          </div>
                        </div>
                        <span className="absolute bottom-0.5 left-0 right-0 text-[8px] font-medium text-pink-500 text-center">Rosa</span>
                      </button>

                      {/* Saúde Theme */}
                      <button
                        onClick={() => setPage({ ...page, background_value: "#f0fdf4" })}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                          page.background_value === "#f0fdf4"
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="absolute inset-0 bg-[#f0fdf4] flex flex-col items-center justify-center p-1">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-1" />
                          <div className="w-6 h-1 bg-green-500 rounded mb-0.5" />
                          <div className="w-5 h-1 bg-green-400 rounded mb-1" />
                          <div className="w-full px-1 space-y-0.5">
                            <div className="h-1.5 bg-green-200 rounded" />
                            <div className="h-1.5 bg-emerald-200 rounded" />
                          </div>
                        </div>
                        <span className="absolute bottom-0.5 left-0 right-0 text-[8px] font-medium text-green-600 text-center">Saude</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fonte</label>
                    <select
                      value={page.font_family || "Inter"}
                      onChange={(e) =>
                        setPage({ ...page, font_family: e.target.value })
                      }
                      className="w-full h-9 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Playfair Display">Playfair Display</option>
                    </select>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Templates Section */}
            <Card className="mt-4">
              <button
                className="w-full p-4 flex items-center justify-between text-left"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <span className="font-medium">Templates</span>
                {showTemplates ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {showTemplates && (
                <CardContent className="pt-0 space-y-4">
                  <Button variant="outline" className="w-full">
                    Salvar como Template
                  </Button>
                  <Button variant="outline" className="w-full">
                    Importar Template
                  </Button>
                </CardContent>
              )}
            </Card>
          </main>
        </div>

        {/* Save Confirmation Dialog */}
        <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Salvar e visualizar?</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja salvar as alterações antes de visualizar a página?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowSaveConfirm(false)}>
                Cancelar
              </AlertDialogCancel>
              <Button
                variant="outline"
                onClick={handlePreviewWithoutSave}
              >
                Ver sem salvar
              </Button>
              <AlertDialogAction onClick={handleSaveAndPreview} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Salvar e ver
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-[520px] h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="sticky top-0 z-50 bg-white border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-sm font-medium">
                    Preview - @{page.username}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Você ainda está editando sua página
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Preview Content */}
            <div
              className="overflow-y-auto h-full"
              style={{
                backgroundColor: page.background_value || '#ffffff',
                fontFamily: page.font_family || 'Inter'
              }}
            >
              <div className="relative min-h-full pb-8">
                <BackgroundEffect />

                {/* Profile Header */}
                <div className="text-center py-6 px-4">
                  <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {page.profile_image ? (
                      <img
                        src={page.profile_image}
                        alt={page.profile_name}
                        className="w-full h-full object-cover"
                        style={{ transform: `scale(${(page.profile_image_scale || 100) / 100})` }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary">
                        {page.profile_name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{page.profile_name}</h2>
                  {page.profile_bio && (
                    <p className="text-sm text-muted-foreground mt-1">{page.profile_bio}</p>
                  )}

                  {page.whatsapp_number && (
                    <a
                      href={`https://wa.me/${page.whatsapp_number}?text=${encodeURIComponent(page.whatsapp_message || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium text-sm transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Fale comigo no WhatsApp
                    </a>
                  )}
                </div>

                {/* Dynamic Components */}
                {components && components.length > 0 && (
                  <div className="space-y-3 px-4">
                    {components
                      .filter((c) => c.is_visible !== false)
                      .map((component) => (
                        <div key={component.id}>
                          <ComponentRenderer component={component} />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SignedIn>
    </>
  );
}
