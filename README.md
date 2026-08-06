# COE Automation Testing Dashboard — BNI

Dashboard monitoring untuk **QA Automation Lead**: pantau resource, project, assignment,
automation coverage, execution, heatmap, daily standup, dan executive overview dalam satu layar.

> **Status:** Prototype (Tahap 1). Data dummy tersimpan di **browser (localStorage)** — bisa
> ditambah & dihapus lewat UI. Tahap berikutnya: integrasi **TestRail** & **SquashTM**.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Chart | Recharts |
| Routing | React Router |
| Deploy | Docker + Nginx |

## Halaman

1. **Dashboard** — KPI strip, active project, team workload, today's alert
2. **Resource** — tabel resource + detail (activity timeline, task progress, standup) · CRUD
3. **Project** — kartu project + detail (trend harian, execution breakdown) · CRUD
4. **Assignment** — beban kerja per resource, deteksi overload · CRUD
5. **Automation** — coverage per project + status automation
6. **Execution** — eksekusi harian + trend pass rate
7. **Heatmap** — status mingguan tiap resource
8. **Daily Standup** — board kemarin/hari ini/blocker
9. **Executive** — overview eksekutif + delivery health

---

## Menjalankan secara lokal (development)

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Build produksi (static)

```bash
npm run build      # output ke folder dist/
npm run preview    # preview hasil build
```

---

## Deploy dengan Docker (server internal BNI)

### Opsi A — Docker Compose (paling mudah)

```bash
docker compose up -d --build
```

Akses di **http://<ip-server>:8080**

### Opsi B — Docker manual

```bash
docker build -t qa-automation-dashboard:1.0 .
docker run -d --name qa-dashboard -p 8080:80 --restart unless-stopped qa-automation-dashboard:1.0
```

Untuk ganti port, ubah `8080` (kiri) ke port yang diinginkan, mis. `-p 80:80`.

---

## Catatan data

- Data tersimpan per-browser di `localStorage` (key: `qa-dashboard-state-v1`).
- Tombol **"↺ Reset data dummy"** di sidebar mengembalikan ke data awal.
- Karena masih prototype, data **tidak** dibagikan antar user/komputer. Sinkronisasi
  lintas pengguna baru ada saat backend + integrasi TestRail/SquashTM ditambahkan (Tahap 2).

## Roadmap Tahap 2 (integrasi)

- Backend API (Node/Spring Boot) + PostgreSQL
- Konektor **TestRail** (total/executed/passed/failed/blocked)
- Konektor **SquashTM** (campaign, execution status)
- Auto-refresh terjadwal (cron) + autentikasi SSO (Entra ID/LDAP)
