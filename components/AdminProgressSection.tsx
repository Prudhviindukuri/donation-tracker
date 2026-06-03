"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import AdminProgressForm from "@/components/AdminProgressForm";
import { useLanguage } from "@/components/LanguageProvider";
import { ProgressImage, formatDate } from "@/lib/translations";

export default function AdminProgressSection() {
  const { t, lang } = useLanguage();
  const [images, setImages] = useState<ProgressImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setLoading(true);
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

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("deleteConfirm"))) return;

    const response = await fetch(`/api/admin/progress/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchImages();
    }
  };

  return (
    <div className="space-y-6">
      <AdminProgressForm onSuccess={fetchImages} />

      <section className="card">
        <h2
          className={`mb-4 text-xl font-semibold text-text ${
            lang === "te" ? "font-telugu" : "font-heading"
          }`}
        >
          {t("progressTitle")}
        </h2>

        {loading ? (
          <p className={`text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
            {t("loading")}
          </p>
        ) : images.length === 0 ? (
          <p className={`text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
            {t("noPhotos")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-card-border text-text/70">
                  <th className="pb-3 pr-4 font-medium">{t("photoTitleEn")}</th>
                  <th className="pb-3 pr-4 font-medium">{t("date")}</th>
                  <th className="pb-3 font-medium">{t("delete")}</th>
                </tr>
              </thead>
              <tbody>
                {images.map((image) => (
                  <tr
                    key={image.id}
                    className="border-b border-card-border/60 last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-lg border border-card-border">
                          <Image
                            src={image.imageUrl}
                            alt={image.title}
                            fill
                            className="object-cover"
                            sizes="50px"
                          />
                        </div>
                        <span className="font-medium text-text">
                          {image.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-text/80">
                      {formatDate(image.uploadedAt)}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(image.id)}
                        className="text-sm text-red-700 transition-colors hover:underline"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
