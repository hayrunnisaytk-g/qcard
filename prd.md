# 📱 QuickContact: Mini VCF & QR Generator PRD

Bu belge, kullanıcıların kişisel bilgilerini ve sosyal medya hesaplarını içeren bir dijital kartvizit (VCF) oluşturup bunu QR kod ile paylaşmalarını sağlayan web uygulamasının gereksinimlerini tanımlar.

---

## 1. Proje Vizyonu
Kullanıcıların herhangi bir kayıt işlemiyle uğraşmadan, saniyeler içinde dijital kimliklerini oluşturup fiziksel temas kurdukları kişilere telefon rehberine hızlıca ekletebilmelerini sağlamak.

## 2. Temel Kullanıcı Senaryosu (User Flow)
1. **Veri Girişi:** Kullanıcı web sayfasına girer, isim, telefon ve sosyal medya linklerini doldurur. (Tüm alanlar opsiyoneldir).
2. **Önizleme:** Bilgiler girildikçe kartvizit tasarımı canlı olarak güncellenir.
3. **QR Oluşturma:** "QR Kod Oluştur" butonuna basıldığında girilen veriler VCF formatına paketlenir.
4. **Paylaşım:** Ekranda beliren QR kod karşı tarafa okutulur veya `.vcf` dosyası olarak telefona indirilir.

---

## 3. Fonksiyonel Gereksinimler

### 3.1. Akıllı Form Yapısı
- **Sıfır Zorunluluk:** Kullanıcı sadece tek bir alan (örn: sadece Instagram linki) doldursa bile sistem çalışmalıdır.
- **Sosyal Medya Desteği:** - LinkedIn, Instagram, X (Twitter), GitHub, WhatsApp, Web Sitesi.
    - Bu alanlar için ikon destekli özel giriş kutuları.
- **Profil Fotoğrafı (Opsiyonel):** Base64 formatında VCF içerisine gömülecek fotoğraf yükleme alanı.

### 3.2. Teknik Çıktılar
- **VCF Motoru:** Girilen veriler `vCard 3.0` standartlarında bir metin dosyasına dönüştürülmelidir.
- **QR Kod:** VCF içeriği dinamik olarak bir QR koda basılmalıdır. QR kod içeriği vCard formatında olduğu için telefon kameraları bunu otomatik "Kişi" olarak algılar.

---

## 4. Teknik Mimari (Tech Stack)

Uygulama tamamen **Client-Side** (istemci taraflı) çalışacak şekilde tasarlanacaktır. Bu sayede sunucu maliyeti olmaz ve kullanıcı verileri gizli tutulur.

| Bileşen | Önerilen Teknoloji |
| :--- | :--- |
| **Frontend** | React.js veya HTML5 / Tailwind CSS |
| **VCF Kütüphanesi** | `vcard-creator` veya Custom JS Logic |
| **QR Generator** | `qrcode.react` veya `kjua` |
| **Deployment** | Vercel, Netlify veya GitHub Pages |

---

## 5. Tasarım ve Kullanıcı Deneyimi (UI/UX)
- **Mobile-First:** Arayüz tamamen mobil cihazlara uygun (responsive) olmalıdır.
- **Modern UI:** Pastel tonlar, yuvarlatılmış köşeler ve temiz tipografi.
- **Copy-to-Clipboard:** QR kodun altındaki VCF linkini manuel kopyalama seçeneği.

---

## 6. Geliştirme Yol Haritası (Roadmap)

- [ ] **Milestone 1:** Temel form yapısının ve veri objesinin kurulması.
- [ ] **Milestone 2:** Verilerin vCard formatına dönüştüren fonksiyonun yazılması.
- [ ] **Milestone 3:** QR kod kütüphanesi entegrasyonu ve test edilmesi.
- [ ] **Milestone 4:** Sosyal medya ikonları ve görsel iyileştirmeler.
- [ ] **Milestone 5:** Canlıya alma (Deployment).

---

> **Not:** Bu proje kişisel veri güvenliği gereği hiçbir veriyi veritabanında saklamaz. Her şey kullanıcının tarayıcısında gerçekleşir ve biter.
