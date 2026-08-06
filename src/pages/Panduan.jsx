import { Card } from '../components/ui.jsx'

// Panduan / manual penggunaan aplikasi — dikelompokkan per menu & fitur.
const SECTIONS = [
  {
    id: 'login',
    icon: '🔐',
    title: 'Login & Akun',
    desc: 'Pintu masuk aplikasi. Setiap pengguna punya akun sendiri.',
    items: [
      ['Sign In', 'Masukkan username & password lalu klik Masuk.'],
      ['Register', 'Buat akun baru: Nama Lengkap, Username (min. 3 karakter, unik), Role (opsional), Password (min. 6 karakter).'],
      ['Sesi', 'Setelah login Anda tetap masuk sampai menekan Logout — meski halaman di-refresh.'],
      ['Logout', 'Tombol ⏻ Logout di kanan atas, atau lewat halaman Profil.'],
    ],
  },
  {
    id: 'profil',
    icon: '🙍',
    title: 'Profil',
    desc: 'Klik nama Anda di pojok kanan atas untuk membuka Profil.',
    items: [
      ['Data akun', 'Menampilkan nama, username, dan jabatan Anda.'],
      ['Data pegawai', 'Jika akun tertaut ke data pegawai, ditampilkan NPP, Perusahaan, Jabatan, Tanggal Lahir, Join Date, dan Lama Bergabung.'],
      ['Aksi', '"Lihat data lengkap" menuju detail pegawai; tombol Logout untuk keluar.'],
    ],
  },
  {
    id: 'dashboard',
    icon: '📊',
    title: 'Dashboard',
    desc: 'Ringkasan cepat kondisi tim & project dalam satu layar.',
    items: [
      ['Kartu KPI', 'Jumlah Resource, Project, TC Executed, Automation Coverage, Defect Open, dan Avg Progress.'],
      ['Active Project', 'Progress tiap project dalam bentuk bar berwarna.'],
      ['Today’s Alert', 'Peringatan otomatis: resource idle/blocked/overload, project ahead schedule, coverage rendah, dll.'],
      ['Team Workload', 'Tingkat utilisasi (beban kerja) tiap anggota tim.'],
    ],
  },
  {
    id: 'resource',
    icon: '👥',
    title: 'Resource',
    desc: 'Data master pegawai — identitas & informasi kepegawaian.',
    items: [
      ['Kolom', 'NPP, Nama, Perusahaan, Tgl Lahir, Join Date, Lama Bergabung (dihitung otomatis sampai hari ini), No Telepon, Jabatan.'],
      ['No Telepon → WhatsApp', 'Nomor telepon di halaman detail bisa diklik langsung menuju chat WhatsApp (💬).'],
      ['Cari & Urutkan', 'Kotak "Cari nama" untuk mencari; klik judul kolom untuk mengurutkan naik/turun (↕ ▲ ▼).'],
      ['Pagination', 'Data dibagi per 10 baris — gunakan tombol halaman di bawah tabel.'],
      ['Tambah / Edit / Hapus', 'Tombol "+ Tambah Resource", ikon ✏️ untuk edit, dan 🗑 untuk hapus di kolom Aksi.'],
      ['Export', 'Unduh data (sesuai urutan & pencarian aktif) sebagai CSV atau PDF.'],
      ['Detail (view-only)', 'Klik nama untuk melihat detail lengkap. Halaman detail hanya untuk melihat — hapus dilakukan dari tabel.'],
      ['Catatan', 'Data operasional (project, task, progress, standup) diatur di menu Assignment, bukan di sini.'],
    ],
  },
  {
    id: 'organisasi',
    icon: '🏢',
    title: 'Organisasi',
    desc: 'Bagan struktur organisasi COE Automation Testing.',
    items: [
      ['Hierarki', 'Team Leader COE → Test Automation Manager → Test Automation Lead → B2B Automation.'],
      ['Pengelompokan B2B', 'Anggota B2B Automation ditampilkan di bawah Lead (PIC) masing-masing; yang belum di-set masuk kelompok "Belum ditentukan".'],
    ],
  },
  {
    id: 'project',
    icon: '📁',
    title: 'Project',
    desc: 'Daftar dan detail project pengujian.',
    items: [
      ['Kartu Project', 'Menampilkan progress, phase, platform, dan indikator risiko (Healthy / Medium / High Risk).'],
      ['Tambah / Edit / Hapus', 'Kelola project via tombol "+ Tambah Project", ✏️, dan 🗑.'],
      ['Detail', 'Klik project untuk melihat statistik lengkap: Total TC, Passed/Failed/Blocked, coverage, defect, serta grafik tren & breakdown eksekusi.'],
      ['Export', 'Unduh daftar project sebagai CSV / PDF.'],
    ],
  },
  {
    id: 'assignment',
    icon: '📋',
    title: 'Assignment',
    desc: 'Penugasan operasional per pegawai. Menentukan "siapa mengerjakan apa".',
    items: [
      ['Atur penugasan', 'Klik ✏️ pada pegawai untuk mengatur: Project (boleh lebih dari satu), Task hari ini, Status, Utilisasi, Progress, Manual & Automation Progress, serta Standup (Kemarin/Hari ini/Blocker).'],
      ['Sinkron otomatis', 'Data yang disimpan langsung tersimpan ke pegawai, sehingga otomatis muncul di Dashboard, Daily Standup, dan Heatmap.'],
      ['Cari, urutkan, export', 'Tersedia pencarian, pengurutan kolom, pagination, dan export CSV/PDF.'],
    ],
  },
  {
    id: 'automation',
    icon: '🤖',
    title: 'Automation',
    desc: 'Pantau cakupan (coverage) otomasi pengujian.',
    items: [
      ['Coverage', 'Overall coverage + grafik coverage otomasi per project.'],
      ['Status TC', 'Ringkasan Test Case otomasi: Ready, In Progress, Pending, dan Need Review.'],
    ],
  },
  {
    id: 'execution',
    icon: '✅',
    title: 'Execution',
    desc: 'Rekap eksekusi pengujian.',
    items: [
      ['Hari ini', 'Executed, Passed, Failed, Blocked, Not Complete, dan Pass Rate.'],
      ['Tren', 'Grafik tren pass rate dan volume eksekusi selama 5 hari kerja terakhir.'],
    ],
  },
  {
    id: 'heatmap',
    icon: '🔥',
    title: 'Heatmap',
    desc: 'Status mingguan tiap anggota secara sekilas.',
    items: [
      ['Warna', '🟩 hijau = on track, 🟨 kuning = perlu perhatian, 🟥 merah = bermasalah, ⬜ abu = cuti/libur.'],
      ['Kegunaan', 'Dalam 5 detik tahu siapa yang perlu perhatian pada hari tertentu (Senin–Jumat).'],
    ],
  },
  {
    id: 'standup',
    icon: '🗒️',
    title: 'Daily Standup',
    desc: 'Papan standup harian tiap anggota.',
    items: [
      ['Isi kartu', 'Ringkasan Kemarin, Hari ini, dan Blocker, beserta status kerja anggota.'],
      ['Penanda', 'Anggota dengan blocker ditandai garis & teks merah agar mudah terlihat.'],
      ['Sumber data', 'Diisi dari menu Assignment (bagian Standup).'],
    ],
  },
  {
    id: 'executive',
    icon: '🏛️',
    title: 'Executive',
    desc: 'Ringkasan level pimpinan lintas project & resource.',
    items: [
      ['Delivery Health', 'Status keseluruhan: 🟢 GOOD, 🟡 WATCH, atau 🔴 AT RISK.'],
      ['KPI ringkas', 'Projects, Resource, Automation, Pass Rate, Open Defect, Critical.'],
      ['Grafik', 'Gauge automation coverage dan progress per project (warna bar = tingkat risiko).'],
    ],
  },
  {
    id: 'umum',
    icon: '⚙️',
    title: 'Fitur Umum',
    desc: 'Fitur yang tersedia di berbagai halaman.',
    items: [
      ['Tema Light / Dark', 'Ubah tampilan lewat toggle "Tampilan" di bagian bawah sidebar. Pilihan tersimpan otomatis.'],
      ['Muat ulang data', 'Tombol "↻ Muat ulang data" di sidebar untuk mengambil data terbaru dari server.'],
      ['Export CSV / PDF', 'Tersedia di menu yang berbentuk tabel (Resource, Project, Assignment, dll).'],
      ['Penyimpanan', 'Semua perubahan tersimpan permanen di database — aman meski browser ditutup.'],
    ],
  },
]

export default function Panduan() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-bni-navy dark:text-white">Panduan Penggunaan Aplikasi</h2>
        <p className="text-sm text-slate-400">Penjelasan setiap menu dan fitur COE Automation Testing Dashboard.</p>
      </div>

      {/* Daftar isi */}
      <Card>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Daftar Isi</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-bni-orange rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span>{s.icon}</span>
              <span className="truncate">{s.title}</span>
            </a>
          ))}
        </div>
      </Card>

      {/* Bagian per menu */}
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-24">
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-bni-orange/10 flex items-center justify-center text-xl">{s.icon}</div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-bni-navy dark:text-white">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5">
              {s.items.map(([label, detail], i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-bni-teal mt-0.5">▸</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    <b className="text-slate-700 dark:text-slate-200">{label}.</b> {detail}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ))}

      <p className="text-center text-xs text-slate-400 pt-2">
        Butuh bantuan lebih lanjut? Hubungi tim COE Automation Testing.
      </p>
    </div>
  )
}
