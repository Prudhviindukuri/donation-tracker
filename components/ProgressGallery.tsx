"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ProgressImage, formatDate } from "@/lib/translations";

export default function ProgressGallery() {
  const { t, lang } = useLanguage();
  const [images, setImages] = useState<ProgressImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch("/api/progress", { cache: "no-store" });
      if (response.ok) {
        setImages(await response.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + images.length) % images.length
        );
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((i) =>
          i === null ? null : (i + 1) % images.length
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxIndex, images.length]);

  const activeImage =
    lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <section className="card">
      <h2
        className={`mb-6 text-2xl font-semibold text-text ${
          lang === "te" ? "font-telugu" : "font-heading"
        }`}
      >
        {t("progressTitle")}
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-xl border border-card-border bg-white shadow-sm"
            >
              <div className="aspect-[4/3] animate-pulse bg-card-border/40" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-2/3 animate-pulse rounded bg-card-border/40" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-card-border/30" />
              </div>
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <p className={`text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
          {t("noPhotos")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group overflow-hidden rounded-xl border border-card-border bg-white text-left shadow-sm transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={image.imageUrl}
                  alt={lang === "te" ? image.titleTe : image.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p
                  className={`font-medium text-text ${
                    lang === "te" ? "font-telugu" : ""
                  }`}
                >
                  {lang === "te" ? image.titleTe : image.title}
                </p>
                <p className="mt-1 text-sm text-text/60">
                  {formatDate(image.uploadedAt)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeImage && lightboxIndex !== null && (
        <div
          className="lightbox-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
            aria-label={t("close")}
          >
            ×
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + images.length) % images.length
              );
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-3 py-4 text-2xl text-white transition-colors hover:bg-white/20 sm:left-4"
            aria-label={t("previousPhoto")}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % images.length);
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-3 py-4 text-2xl text-white transition-colors hover:bg-white/20 sm:right-4"
            aria-label={t("nextPhoto")}
          >
            ›
          </button>

          <div
            className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-[90vw] max-w-5xl">
              <Image
                src={activeImage.imageUrl}
                alt={lang === "te" ? activeImage.titleTe : activeImage.title}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            <div className="mt-4 text-center text-white">
              <p className={lang === "te" ? "font-telugu text-lg" : "text-lg"}>
                {lang === "te" ? activeImage.titleTe : activeImage.title}
              </p>
              <p className="mt-1 text-sm text-white/70">
                {formatDate(activeImage.uploadedAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
