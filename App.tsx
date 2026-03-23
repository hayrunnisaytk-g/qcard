import React, { useMemo, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { buildVcfString, type ContactFormData } from "./lib/vcf"

const trimToUndefined = (value: string): string | undefined => {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

const mimeToVCardPhotoType = (mime: string): ContactFormData["photoMimeType"] => {
  if (mime === "image/jpeg") return "JPEG"
  if (mime === "image/png") return "PNG"
  if (mime === "image/gif") return "GIF"
  return undefined
}

const getFileBaseName = (data: ContactFormData): string => {
  const first = (data.firstName ?? "").trim()
  const last = (data.lastName ?? "").trim()
  const full = `${first} ${last}`.trim()
  return full ? full.replace(/\s+/g, "_") : "quickcontact"
}

export default function App() {
  const [form, setForm] = useState<ContactFormData>({})
  const [generatedPayload, setGeneratedPayload] = useState<string>("")
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle")

  const vcfLive = useMemo(() => buildVcfString(form), [form])

  const handleTextChange = (key: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const next = trimToUndefined(event.target.value)
    setForm((prev) => ({ ...prev, [key]: next }))
    if (key === "phone" || key === "instagram") {
      setCopyState("idle")
    }
  }

  const handleGenerateQr = () => {
    setGeneratedPayload(vcfLive)
  }

  const handleCopyVcf = async () => {
    try {
      await navigator.clipboard.writeText(vcfLive)
      setCopyState("success")
      window.setTimeout(() => setCopyState("idle"), 1200)
    } catch {
      setCopyState("error")
      window.setTimeout(() => setCopyState("idle"), 2000)
    }
  }

  const handleDownloadVcf = () => {
    const fileBase = getFileBaseName(form)
    const blob = new Blob([vcfLive], { type: "text/vcard;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileBase}.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const photoType = mimeToVCardPhotoType(file.type)

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== "string") return

      const base64Part = result.includes(",") ? result.split(",")[1] : result
      setForm((prev) => ({
        ...prev,
        photoBase64: base64Part,
        photoMimeType: photoType ?? prev.photoMimeType ?? "JPEG"
      }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white p-4">
      <div className="mx-auto max-w-md space-y-4">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-slate-900">QuickContact</h1>
          <p className="text-sm text-slate-600">VCF üret, QR ile paylaş</p>
        </header>

        <section className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Bilgilerin</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="firstName">
                Ad
              </label>
              <input
                id="firstName"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                placeholder="Örn: Ada"
                value={form.firstName ?? ""}
                onChange={handleTextChange("firstName")}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="lastName">
                Soyad
              </label>
              <input
                id="lastName"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                placeholder="Örn: Lovelace"
                value={form.lastName ?? ""}
                onChange={handleTextChange("lastName")}
              />
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="phone">
                Telefon
              </label>
              <input
                id="phone"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                placeholder="Örn: +90 555 111 2233"
                value={form.phone ?? ""}
                onChange={handleTextChange("phone")}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="email">
                E-posta
              </label>
              <input
                id="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                placeholder="Örn: ada@example.com"
                value={form.email ?? ""}
                onChange={handleTextChange("email")}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="website">
                Web Sitesi
              </label>
              <input
                id="website"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                placeholder="https://example.com"
                value={form.website ?? ""}
                onChange={handleTextChange("website")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700" htmlFor="instagram">
                  Instagram
                </label>
                <input
                  id="instagram"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                  placeholder="https://instagram.com/..."
                  value={form.instagram ?? ""}
                  onChange={handleTextChange("instagram")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700" htmlFor="linkedin">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedin ?? ""}
                  onChange={handleTextChange("linkedin")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700" htmlFor="twitter">
                  X (Twitter)
                </label>
                <input
                  id="twitter"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                  placeholder="https://x.com/..."
                  value={form.twitter ?? ""}
                  onChange={handleTextChange("twitter")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700" htmlFor="github">
                  GitHub
                </label>
                <input
                  id="github"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                  placeholder="https://github.com/..."
                  value={form.github ?? ""}
                  onChange={handleTextChange("github")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700" htmlFor="whatsapp">
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                  placeholder="https://wa.me/..."
                  value={form.whatsapp ?? ""}
                  onChange={handleTextChange("whatsapp")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700" htmlFor="organization">
                  Firma (opsiyonel)
                </label>
                <input
                  id="organization"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                  placeholder="Örn: Acme"
                  value={form.organization ?? ""}
                  onChange={handleTextChange("organization")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-700">Profil fotoğrafı</p>
                  <p className="text-xs text-slate-500">Opsiyonel, Base64 olarak gömülür</p>
                </div>
                <label className="shrink-0 cursor-pointer rounded-xl bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700">
                  Yükle
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    aria-label="Profil fotoğrafı yükle"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                aria-label="QR Kod Oluştur"
                className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                onClick={handleGenerateQr}
              >
                QR Kod Oluştur
              </button>

              <button
                type="button"
                aria-label="VCF'yi Kopyala"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-200"
                onClick={handleCopyVcf}
              >
                {copyState === "success" ? "Kopyalandı" : copyState === "error" ? "Kopyalanamadı" : "VCF'yi Kopyala"}
              </button>

              <button
                type="button"
                aria-label="VCF dosyası indir"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-200"
                onClick={handleDownloadVcf}
              >
                .vcf indir
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">QR & Önizleme</h2>
              <p className="text-xs text-slate-500">Telefon kameranız vCard’ı kişi olarak algılar</p>
            </div>
            <div className="text-right text-xs text-slate-500">{generatedPayload ? "QR hazır" : "QR için butona bas"}</div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl bg-white p-3">
              {generatedPayload ? (
                <QRCodeSVG value={generatedPayload} size={196} bgColor="#ffffff" fgColor="#111827" />
              ) : (
                <div className="flex h-[196px] w-[196px] items-center justify-center rounded-xl border border-dashed border-slate-300 text-center text-sm text-slate-500">
                  QR oluşturmak için
                  <br />
                  <span className="font-semibold text-slate-700">“QR Kod Oluştur”</span>
                </div>
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block text-xs font-medium text-slate-700" htmlFor="vcfPreview">
                Canlı vCard (QR içeriği)
              </label>
              <textarea
                id="vcfPreview"
                className="h-48 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                readOnly
                value={vcfLive}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

