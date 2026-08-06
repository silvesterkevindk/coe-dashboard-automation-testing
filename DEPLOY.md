# Panduan Deploy Lengkap — COE Automation Testing Dashboard

Panduan langkah demi langkah men-deploy aplikasi ini dari **nol** (belum punya tools apa pun) hingga **running di Vercel** — untuk pengguna **Windows** maupun **macOS**.

> 🎯 Target akhir: aplikasi bisa diakses publik di `https://coeautomationtesting.vercel.app`.
> ⏱️ Perkiraan waktu: 30–45 menit (termasuk instalasi tools).
> 💰 Semua layanan yang dipakai **gratis**.

---

## Daftar Isi
1. [Gambaran & arsitektur](#1-gambaran--arsitektur)
2. [Yang perlu disiapkan (akun & tools)](#2-yang-perlu-disiapkan-akun--tools)
3. [Instalasi tools — Windows](#3-instalasi-tools--windows)
4. [Instalasi tools — macOS](#4-instalasi-tools--macos)
5. [Ambil kode aplikasi](#5-ambil-kode-aplikasi)
6. [Langkah A — Database Turso](#6-langkah-a--database-turso)
7. [Langkah B — Upload kode ke GitHub](#7-langkah-b--upload-kode-ke-github)
8. [Langkah C — Deploy ke Vercel](#8-langkah-c--deploy-ke-vercel)
9. [Langkah D — Verifikasi](#9-langkah-d--verifikasi)
10. [Update aplikasi setelah deploy](#10-update-aplikasi-setelah-deploy)
11. [Menjalankan di lokal (development)](#11-menjalankan-di-lokal-development)
12. [Environment Variables](#12-environment-variables)
13. [Troubleshooting](#13-troubleshooting)
14. [Checklist ringkas](#14-checklist-ringkas)

---

## 1. Gambaran & arsitektur

```
                     Browser pengguna
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │            VERCEL (hosting)           │
        │  Frontend React/Vite  → file statis   │
        │  /api/*  → Serverless Function (Express)│
        └───────────────────┬───────────────────┘
                            │ HTTPS (libSQL)
                            ▼
                ┌───────────────────────┐
                │   TURSO (database)    │
                │   SQLite cloud        │
                └───────────────────────┘
```

- **Frontend**: React + Vite → di-build jadi file statis, di-serve Vercel.
- **Backend**: Express jalan sebagai Serverless Function (`api/index.js`).
- **Database**: Turso (SQLite cloud, gratis). Tabel + data awal dibuat **otomatis** saat aplikasi pertama diakses.

---

## 2. Yang perlu disiapkan (akun & tools)

### Akun (daftar gratis, pakai email yang sama agar mudah)
| Layanan | Fungsi | Link |
|---------|--------|------|
| **GitHub** | Menyimpan kode | https://github.com |
| **Vercel** | Hosting aplikasi | https://vercel.com (login pakai GitHub) |
| **Turso** | Database | https://turso.tech (login pakai GitHub) |

### Tools yang di-install di komputer
| Tool | Fungsi | Versi minimal |
|------|--------|---------------|
| **Node.js** | Menjalankan & build aplikasi | 18 atau lebih baru |
| **Git** | Mengirim kode ke GitHub | terbaru |
| **Git** GUI / **GitHub Desktop** *(opsional)* | Alternatif Git tanpa perintah | terbaru |

> Turso **tidak wajib** di-install sebagai CLI — kita akan pakai **dashboard web Turso** (bisa dari OS mana pun). CLI hanya opsi tambahan untuk macOS/Linux.

---

## 3. Instalasi tools — Windows

> Buka aplikasi **PowerShell** (klik Start → ketik "PowerShell" → Enter). Semua perintah di bawah dijalankan di sini.

### 3.1 Node.js
**Cara termudah (installer):**
1. Buka https://nodejs.org → unduh versi **LTS** (tombol kiri).
2. Jalankan file `.msi`, klik **Next** sampai selesai (biarkan semua default, termasuk "Add to PATH").
3. **Tutup lalu buka lagi** PowerShell, cek:
   ```powershell
   node -v
   npm -v
   ```
   Muncul angka versi (mis. `v20.x.x`) = berhasil.

*Alternatif (jika punya winget):*
```powershell
winget install OpenJS.NodeJS.LTS
```

### 3.2 Git
1. Buka https://git-scm.com/download/win → unduh **64-bit Git for Windows Setup**.
2. Jalankan installer → klik **Next** terus (default aman). Ini juga memasang **Git Bash**.
3. Cek di PowerShell:
   ```powershell
   git --version
   ```

*Alternatif:* `winget install Git.Git`

### 3.3 (Opsional, disarankan untuk pemula) GitHub Desktop
Agar upload ke GitHub tanpa perintah:
- Unduh di https://desktop.github.com → install → login akun GitHub.

### 3.4 (Opsional) Editor kode
- VS Code: https://code.visualstudio.com

> ℹ️ **Turso CLI di Windows**: tidak ada installer native. Untuk Windows kita **gunakan dashboard web Turso** (Langkah A) — tidak perlu CLI. (Jika Anda punya WSL, CLI bisa dipasang dengan cara macOS.)

---

## 4. Instalasi tools — macOS

> Buka aplikasi **Terminal** (tekan `Cmd + Space`, ketik "Terminal", Enter).

### 4.1 Homebrew (package manager — memudahkan instalasi berikutnya)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Setelah selesai, ikuti instruksi "Next steps" yang muncul (menambahkan brew ke PATH). Cek:
```bash
brew --version
```

### 4.2 Node.js
```bash
brew install node
```
Cek:
```bash
node -v
npm -v
```
*Alternatif tanpa Homebrew:* unduh installer LTS di https://nodejs.org lalu jalankan `.pkg`.

### 4.3 Git
Biasanya sudah ada. Cek dulu:
```bash
git --version
```
Jika belum ada / diminta install Command Line Tools, jalankan:
```bash
xcode-select --install
```
*atau* `brew install git`.

### 4.4 (Opsional) Turso CLI
```bash
brew install tursodatabase/tap/turso
```
*atau:*
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### 4.5 (Opsional) Editor kode
- VS Code: https://code.visualstudio.com atau `brew install --cask visual-studio-code`.

---

## 5. Ambil kode aplikasi

**Jika Anda sudah punya folder project** (mis. `Dashboard Monitoring QA`), lewati bagian ini.

**Jika belum**, dan kodenya ada di GitHub, clone:
- 🍎 macOS (Terminal):
  ```bash
  cd ~/Documents
  git clone https://github.com/USERNAME/coe-automation-testing.git
  cd coe-automation-testing
  ```
- 🪟 Windows (PowerShell):
  ```powershell
  cd $HOME\Documents
  git clone https://github.com/USERNAME/coe-automation-testing.git
  cd coe-automation-testing
  ```

---

## 6. Langkah A — Database Turso

Cukup **sekali**. Kita pakai **dashboard web** (berlaku Windows & Mac).

### A.1 Buat database
1. Buka https://turso.tech → **Sign in** (pakai GitHub).
2. Masuk ke **Databases** → **Create Database**.
3. Nama: `coe-automation`. Region: pilih yang terdekat (mis. Singapore). → **Create**.

### A.2 Ambil URL database
1. Klik database `coe-automation`.
2. Cari bagian **Connect / URL** — salin nilai yang diawali `libsql://...`
   (contoh: `libsql://coe-automation-namaanda.turso.io`).
   → Ini **`TURSO_DATABASE_URL`**.

### A.3 Buat token
1. Di halaman database yang sama, cari **Tokens** → **Create Token** (biarkan default/Full Access).
2. Salin token yang muncul (string panjang). → Ini **`TURSO_AUTH_TOKEN`**.

> 📝 Simpan kedua nilai ini sementara (mis. Notepad/Notes). Dipakai di Langkah C. **Jangan** dibagikan ke publik.

<details>
<summary>Alternatif via CLI (macOS / Linux / WSL)</summary>

```bash
turso auth login
turso db create coe-automation
turso db show coe-automation --url      # → TURSO_DATABASE_URL
turso db tokens create coe-automation   # → TURSO_AUTH_TOKEN
```
</details>

---

## 7. Langkah B — Upload kode ke GitHub

### B.1 Buat repository kosong di GitHub
1. Buka https://github.com/new
2. **Repository name:** `coe-automation-testing`
3. Pilih **Private** (disarankan) atau Public.
4. **JANGAN** centang "Add a README / .gitignore / license".
5. **Create repository**.

### B.2 Upload kode

#### Opsi 1 — GitHub Desktop (paling mudah, Windows & Mac)
1. Buka **GitHub Desktop** → **File → Add local repository** → pilih folder project.
2. Jika diminta "create a repository", klik **create a repository** → **Create Repository**.
3. Tulis pesan commit (mis. `initial`) → **Commit to main**.
4. Klik **Publish repository** → pilih repo `coe-automation-testing` (atau publish baru) → **Publish**.

#### Opsi 2 — Perintah Git

- 🍎 macOS (Terminal):
  ```bash
  cd "/Users/bni/Documents/Dashboard Monitoring QA"
  git init
  git add .
  git commit -m "COE Automation Testing Dashboard"
  git branch -M main
  git remote add origin https://github.com/USERNAME/coe-automation-testing.git
  git push -u origin main
  ```
- 🪟 Windows (PowerShell) — sesuaikan path folder Anda:
  ```powershell
  cd "C:\Users\NAMA\Documents\Dashboard Monitoring QA"
  git init
  git add .
  git commit -m "COE Automation Testing Dashboard"
  git branch -M main
  git remote add origin https://github.com/USERNAME/coe-automation-testing.git
  git push -u origin main
  ```

> 🔑 Saat `git push` diminta login: username = akun GitHub, password = **Personal Access Token** (bukan password biasa).
> Buat token: **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate**, centang scope **`repo`**.

> ✅ Yang **tidak** ikut ter-upload (sudah diatur `.gitignore`): `node_modules/`, `dist/`, `.env`, database lokal `server/*.db`, dan `.vercel/`.

---

## 8. Langkah C — Deploy ke Vercel

### C.1 Import project
1. Buka https://vercel.com → login (via GitHub).
2. **Add New… → Project**.
3. Pilih repo `coe-automation-testing` → **Import**.

### C.2 Atur nama & framework
- **Project Name:** `coeautomationtesting` → domain jadi **`coeautomationtesting.vercel.app`**
  (jika nama sudah dipakai, ganti mis. `coe-automation-testing`).
- **Framework Preset:** terdeteksi otomatis **Vite**. Build Command & Output Directory biarkan default (sudah diatur di `vercel.json`).

### C.3 Isi Environment Variables
Buka bagian **Environment Variables**, tambahkan **3** ini:

| Name | Value |
|------|-------|
| `TURSO_DATABASE_URL` | URL dari **A.2** (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Token dari **A.3** |
| `JWT_SECRET` | Teks acak panjang (lihat cara buat di bawah) |

Cara membuat `JWT_SECRET` acak:
- 🍎 macOS: `openssl rand -hex 32`
- 🪟 Windows (PowerShell): `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Atau ketik bebas string acak panjang (≥ 32 karakter).

### C.4 Deploy
Klik **Deploy** → tunggu ± 1–2 menit.

---

## 9. Langkah D — Verifikasi

1. Buka **https://coeautomationtesting.vercel.app**
2. Muncul halaman **Login**.
3. Login: **`silvester`** / **`P@ssw0rd91`**
   (akun lain: `bachrul`, `marinda`, `thomas` — password `P@ssw0rd`; atau **Register** baru).
4. Dashboard tampil dengan data → backend & database tersambung. ✅

Cek backend (opsional), buka di browser:
`https://coeautomationtesting.vercel.app/api/health` → `{"ok":true,"service":"coe-dashboard-api"}`

---

## 10. Update aplikasi setelah deploy

Setiap ada perubahan kode, kirim ulang ke GitHub — Vercel otomatis deploy:
- GitHub Desktop: **Commit to main** → **Push origin**.
- Perintah:
  ```bash
  git add .
  git commit -m "deskripsi perubahan"
  git push
  ```

Rollback: Vercel → project → **Deployments** → pilih versi lama → **Promote to Production**.

---

## 11. Menjalankan di lokal (development)

Tanpa Turso pun bisa — lokal otomatis pakai file SQLite (`server/coe.db`).

- 🍎 macOS / 🪟 Windows:
  ```bash
  npm install
  npm run dev
  ```
- Buka: **http://localhost:5173** (API di http://localhost:4000).
- `npm run dev` menjalankan backend + frontend sekaligus.

Menghubungkan lokal ke Turso (opsional) — set env dulu:
- 🍎 macOS (Terminal):
  ```bash
  export TURSO_DATABASE_URL="libsql://...."
  export TURSO_AUTH_TOKEN="...."
  npm run dev
  ```
- 🪟 Windows (PowerShell):
  ```powershell
  $env:TURSO_DATABASE_URL="libsql://...."
  $env:TURSO_AUTH_TOKEN="...."
  npm run dev
  ```

Cek build produksi:
```bash
npm run build
```

---

## 12. Environment Variables

| Variabel | Wajib di produksi? | Fungsi |
|----------|--------------------|--------|
| `TURSO_DATABASE_URL` | ✅ Ya | Alamat database Turso. Kosong = pakai file SQLite lokal (hanya untuk dev). |
| `TURSO_AUTH_TOKEN` | ✅ Ya | Token autentikasi Turso. |
| `JWT_SECRET` | ✅ Ya | Kunci rahasia token login. Isi teks acak panjang. |
| `API_PORT` | ❌ Tidak | Port API saat dev lokal (default `4000`). Tidak dipakai di Vercel. |

Contoh tersedia di file `.env.example`.

---

## 13. Troubleshooting

**`node` / `git` tidak dikenali setelah install (Windows).**
Tutup semua PowerShell lalu buka lagi (agar PATH ter-refresh). Jika masih, restart komputer.

**Build Vercel gagal terkait `@libsql/client` (native).**
Edit `server/db.js`, ubah import:
```js
import { createClient } from '@libsql/client'
```
menjadi:
```js
import { createClient } from '@libsql/client/web'
```
Commit & push. (Varian `/web` khusus koneksi Turso via HTTP, tanpa binary native.)

**Data tidak muncul / error 500 saat pertama diakses.**
Pastikan **ketiga** Environment Variables terisi benar → Vercel: **Deployments → ⋯ → Redeploy**.

**Halaman putih / route seperti `/resources` error saat di-refresh.**
Pastikan `vercel.json` ada di root project (sudah tersedia). Redeploy.

**Nama `coeautomationtesting` sudah dipakai.**
Pilih nama project lain di Vercel; domain menyesuaikan.

**`git push` gagal (authentication failed).**
Gunakan Personal Access Token sebagai password (lihat B.2), atau pakai GitHub Desktop.

**Reset data ke kondisi awal (seed).**
Kosongkan tabel di dashboard Turso (menu SQL/Shell), jalankan:
```sql
DELETE FROM resources; DELETE FROM projects; DELETE FROM assignments; DELETE FROM meta; DELETE FROM users;
```
Lalu akses aplikasi lagi — seed (akun + data awal) dibuat ulang otomatis. ⚠️ Ini menghapus semua data termasuk akun.

---

## 14. Checklist ringkas

- [ ] Punya akun GitHub, Vercel, Turso
- [ ] Node.js ter-install (`node -v` keluar versi)
- [ ] Git ter-install (`git --version` keluar versi)
- [ ] Buat database Turso → salin **URL** + **Token**
- [ ] Buat repo GitHub kosong → upload kode
- [ ] Import ke Vercel → set nama `coeautomationtesting`
- [ ] Isi 3 Environment Variables (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`)
- [ ] Deploy → buka domain → login `silvester` / `P@ssw0rd91`

---

Selesai. Aplikasi Anda kini berjalan di **https://coeautomationtesting.vercel.app** 🎉
Butuh bantuan? Hubungi tim COE Automation Testing.
