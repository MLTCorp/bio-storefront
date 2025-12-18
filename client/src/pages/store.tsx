import { useState, useEffect, useMemo } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Loader2, Settings } from "lucide-react";
import { BackgroundEffect } from "@/components/background-effect";
import { ComponentRenderer } from "@/components/page-builder/component-renderer";
import { getThemeIdFromBackground, getTheme, type Theme } from "@/lib/themes";
import type { Page, PageComponent } from "@/types/database";

interface PageData extends Page {
  components: PageComponent[];
}

export default function StorePage() {
  const [, params] = useRoute("/:username");
  const [, navigate] = useLocation();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params?.username) return;

    fetch(`/api/pages/username/${params.username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setPage(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [params?.username]);

  // Get current theme based on background_value - MUST be before any early returns
  const theme = useMemo(() => {
    const themeId = getThemeIdFromBackground(page?.background_value);
    return getTheme(themeId);
  }, [page?.background_value]);

  // Apply theme background to body to eliminate white line at top
  useEffect(() => {
    document.body.style.background = theme.background.value;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    return () => {
      document.body.style.background = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, [theme]);

  if (loading) {
    return (
      <div
        className="min-h-screen pb-12 transition-colors duration-500"
        style={{ background: theme.background.value }}
      >
        <div className="max-w-[480px] mx-auto min-h-screen px-4 py-8 md:my-8 md:rounded-[32px]">
          {/* Skeleton Profile */}
          <div className="text-center mb-6 animate-pulse">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-300/30" />
            <div className="h-6 w-32 mx-auto mb-2 rounded bg-gray-300/30" />
            <div className="h-4 w-48 mx-auto rounded bg-gray-300/30" />
          </div>
          {/* Skeleton Components */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-300/20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: theme.background.value }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.text.primary }}>404</h1>
          <p className="mb-4" style={{ color: theme.text.secondary }}>Página não encontrada</p>
          <Link href="/">
            <button
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ background: theme.button.primary, color: theme.button.primaryText }}
            >
              Voltar ao início
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Get background style from theme
  const getBackgroundStyle = () => {
    return { background: theme.background.value };
  };

  // Get card/container style from theme
  const getContainerStyle = () => {
    return {
      background: theme.card.bg,
      backdropFilter: theme.card.blur > 0 ? `blur(${theme.card.blur}px)` : 'none',
      WebkitBackdropFilter: theme.card.blur > 0 ? `blur(${theme.card.blur}px)` : 'none',
      border: theme.card.border,
      boxShadow: theme.card.shadow,
      fontFamily: page.font_family || 'inherit',
    };
  };

  return (
    <div
      className="min-h-screen pb-12 transition-colors duration-500 relative"
      style={getBackgroundStyle()}
    >
      <BackgroundEffect theme={theme} />

      <motion.main
        className="max-w-[480px] mx-auto min-h-screen px-4 py-8 md:my-8 md:rounded-[32px] md:min-h-[calc(100vh-4rem)] relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={getContainerStyle()}
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <div
            className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg"
            style={{ border: `4px solid #9ca3af40` }}
          >
            {page.profile_image ? (
              <img
                src={page.profile_image}
                alt={page.profile_name}
                loading="eager"
                decoding="async"
                className="absolute object-cover"
                style={{
                  width: `${page.profile_image_scale || 100}%`,
                  height: `${page.profile_image_scale || 100}%`,
                  left: `${-((page.profile_image_scale || 100) - 100) * ((page.profile_image_position_x ?? 50) / 100)}%`,
                  top: `${-((page.profile_image_scale || 100) - 100) * ((page.profile_image_position_y ?? 50) / 100)}%`,
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: `${theme.text.accent}20`, color: theme.text.accent }}
              >
                {page.profile_name?.charAt(0) || '?'}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold" style={{ color: theme.text.primary }}>{page.profile_name}</h1>
          {page.profile_bio && (
            <p className="text-sm mt-1 whitespace-pre-line" style={{ color: theme.text.secondary }}>{page.profile_bio}</p>
          )}

          {page.whatsapp_number && (
            <a
              href={`https://wa.me/${page.whatsapp_number}?text=${encodeURIComponent(page.whatsapp_message || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Fale comigo no WhatsApp
            </a>
          )}
        </motion.div>

        {/* Dynamic Components */}
        {page.components && page.components.length > 0 && (
          <div className="space-y-4">
            {page.components
              .filter((c) => c.is_visible !== false)
              .map((component) => (
                <motion.div key={component.id} variants={itemVariants}>
                  <ComponentRenderer component={component} theme={theme} />
                </motion.div>
              ))}
          </div>
        )}

        {/* Footer */}
        <motion.footer variants={itemVariants} className="mt-12 text-center space-y-4 opacity-60">
          <p className="text-xs" style={{ color: theme.text.secondary }}>
            © 2025 {page.profile_name}. All rights reserved.
          </p>
          <div
            className="flex items-center justify-center gap-4 text-[10px] font-medium tracking-wide uppercase"
            style={{ color: theme.text.secondary }}
          >
            <a href="#" className="hover:opacity-70 transition-opacity">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:opacity-70 transition-opacity">Terms</a>
            <span>•</span>
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:opacity-70 transition-opacity inline-flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              Editar
            </button>
          </div>
        </motion.footer>
      </motion.main>
    </div>
  );
}
