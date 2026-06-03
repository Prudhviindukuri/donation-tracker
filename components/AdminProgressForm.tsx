"use client";

import { FormEvent, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface AdminProgressFormProps {
  onSuccess: () => void;
}

const inputClassName =
  "w-full rounded-lg border border-card-border bg-ivory px-4 py-2 text-text outline-none focus:border-saffron";

export default function AdminProgressForm({ onSuccess }: AdminProgressFormProps) {
  const { t, lang } = useLanguage();
  const [title, setTitle] = useState("");
  const [titleTe, setTitleTe] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const labelClass = `mb-1 block text-sm font-medium text-text ${
    lang === "te" ? "font-telugu" : ""
  }`;

  const handleFileChange = (selected: File | null) => {
    setFile(selected);
    if (preview) URL.revokeObjectURL(preview);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const uploadWithProgress = (formData: FormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/progress");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
          return;
        }
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.error || t("uploadFailed")));
        } catch {
          reject(new Error(t("uploadFailed")));
        }
      };

      xhr.onerror = () => reject(new Error(t("uploadFailed")));
      xhr.send(formData);
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setToast("");

    if (!title.trim() || !titleTe.trim()) {
      setError(t("titleRequired"));
      return;
    }

    if (!file) {
      setError(t("imageRequired"));
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("titleTe", titleTe.trim());
    formData.append("image", file);

    setUploading(true);
    setProgress(0);

    try {
      await uploadWithProgress(formData);
      setTitle("");
      setTitleTe("");
      handleFileChange(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setToast(t("uploadSuccess"));
      onSuccess();
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("uploadFailed"));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2
        className={`text-xl font-semibold text-text ${
          lang === "te" ? "font-telugu" : "font-heading"
        }`}
      >
        {t("uploadPhoto")}
      </h2>

      <div>
        <label htmlFor="photo-title-en" className={labelClass}>
          {t("photoTitleEn")}
        </label>
        <input
          id="photo-title-en"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="photo-title-te" className={labelClass}>
          {t("photoTitleTe")}
        </label>
        <input
          id="photo-title-te"
          type="text"
          value={titleTe}
          onChange={(e) => setTitleTe(e.target.value)}
          className={`${inputClassName} font-telugu`}
        />
      </div>

      <div>
        <label htmlFor="photo-image" className={labelClass}>
          {t("chooseImage")}
        </label>
        <input
          id="photo-image"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-text file:mr-4 file:rounded-lg file:border-0 file:bg-saffron file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-saffron/90"
        />
      </div>

      <div className="flex h-[200px] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-saffron bg-ivory/50">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <p className={`text-sm text-text/50 ${lang === "te" ? "font-telugu" : ""}`}>
            {t("chooseImage")}
          </p>
        )}
      </div>

      {uploading && (
        <div>
          <p className={`mb-1 text-sm text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
            {t("uploading")} {progress}%
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-card-border/40">
            <div
              className="h-full bg-saffron transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className={`text-sm text-red-700 ${lang === "te" ? "font-telugu" : ""}`}>
          {error}
        </p>
      )}

      {toast && (
        <p
          className={`rounded-lg border border-saffron/30 bg-saffron/10 px-4 py-2 text-sm text-saffron ${
            lang === "te" ? "font-telugu" : ""
          }`}
        >
          {toast}
        </p>
      )}

      <button
        type="submit"
        disabled={uploading}
        className={`rounded-lg bg-saffron px-6 py-2.5 font-medium text-white transition-colors hover:bg-saffron/90 disabled:cursor-not-allowed disabled:opacity-60 ${
          lang === "te" ? "font-telugu" : ""
        }`}
      >
        {uploading ? `${t("uploading")} ${progress}%` : t("uploadPhoto")}
      </button>
    </form>
  );
}
