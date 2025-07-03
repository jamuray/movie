import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

type Film = {
  id: number;
  image: string;
  judul: string;
  sutradara: string;
  tahun: number;
};

export default function Home() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ judul: '', sutradara: '', tahun: '', image: '' });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchFilms();
    // eslint-disable-next-line
  }, []);

  const fetchFilms = () => {
    setLoading(true);
    console.log("Mulai fetch...");
    axios.get('http://localhost:5000/api/film')
      .then(res => {
        console.log("Response:", res.data);
        if (res.data.success) {
          setFilms(res.data.data);
        } else {
          alert('Gagal mengambil data film');
        }
      })
      .catch((err) => {
        console.error("Error fetch:", err);
        alert('Gagal mengambil data film');
      })
      .finally(() => setLoading(false));
  };

  // Handler untuk tombol Tambah
  const handleTambah = () => {
    setForm({ judul: '', sutradara: '', tahun: '', image: '' });
    setIsEdit(false);
    setShowModal(true);
  };

  // Handler submit tambah film
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validasi sederhana
      if (!form.image.match(/\.(jpg|jpeg|png|webp)$/i)) {
        alert('Nama file gambar harus diakhiri .jpg, .jpeg, .png, atau .webp');
        return;
      }
      await axios.post('http://localhost:5000/api/film', {
        judul: form.judul,
        sutradara: form.sutradara,
        tahun: Number(form.tahun),
        image: form.image,
      });
      setShowModal(false);
      setForm({ judul: '', sutradara: '', tahun: '', image: '' });
      fetchFilms();
    } catch {
      alert('Gagal menambah film');
    }
  };

  // Handler untuk tombol Edit
  const handleEdit = () => {
    if (selectedFilm === null) {
      alert('Pilih film yang ingin diedit dengan mengklik card-nya.');
      return;
    }
    const film = films.find(f => f.id === selectedFilm);
    if (film) {
      setForm({
        judul: film.judul,
        sutradara: film.sutradara,
        tahun: String(film.tahun),
        image: film.image,
      });
      setIsEdit(true);
      setShowModal(true);
    }
  };

  // Handler submit edit film
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFilm === null) return;
    try {
      await axios.put(`http://localhost:5000/api/film/${selectedFilm}`, {
        judul: form.judul,
        sutradara: form.sutradara,
        tahun: Number(form.tahun),
        image: form.image,
      });
      setShowModal(false);
      setIsEdit(false);
      setForm({ judul: '', sutradara: '', tahun: '', image: '' });
      fetchFilms();
    } catch {
      alert('Gagal mengedit film');
    }
  };

  // Handler untuk tombol Hapus
  const handleHapus = () => {
    if (selectedFilm === null) {
      alert('Pilih film yang ingin dihapus dengan mengklik card-nya.');
      return;
    }
    if (confirm('Yakin ingin menghapus film ini?')) {
      axios.delete(`http://localhost:5000/api/film/${selectedFilm}`)
        .then(() => {
          fetchFilms();
          setSelectedFilm(null);
        })
        .catch(() => {
          alert('Gagal menghapus film');
        });
    }
  };

  if (loading) return <p style={{ color: '#fff', padding: 32 }}>Loading...</p>;

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#fff', fontFamily: 'Arial' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#062b51',
        padding: '10px 32px',
        height: 60,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/logo-film.png" alt="Logo" width={40} height={40} style={{ marginRight: 12 }} />
          <span style={{ fontSize: 24, fontWeight: 700, color: '#f7941e' }}>Jamoeraya's Cinema</span>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Movies</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }} onClick={handleTambah}>Tambah</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }} onClick={handleHapus}>Hapus</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }} onClick={handleEdit}>Edit</a>
        </nav>
      </header>

      {/* Modal Tambah/Edit Film */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <form onSubmit={isEdit ? handleEditSubmit : handleSubmit} style={{
            background: '#222', padding: 24, borderRadius: 8, minWidth: 320, color: '#fff', display: 'flex', flexDirection: 'column', gap: 12
          }}>
            <h3>{isEdit ? 'Edit Film' : 'Tambah Film'}</h3>
            <input
              type="text"
              placeholder="Judul"
              value={form.judul}
              onChange={e => setForm({ ...form, judul: e.target.value })}
              required
              style={{ padding: 8, borderRadius: 4, border: 'none' }}
            />
            <input
              type="text"
              placeholder="Sutradara"
              value={form.sutradara}
              onChange={e => setForm({ ...form, sutradara: e.target.value })}
              required
              style={{ padding: 8, borderRadius: 4, border: 'none' }}
            />
            <input
              type="number"
              placeholder="Tahun"
              value={form.tahun}
              onChange={e => setForm({ ...form, tahun: e.target.value })}
              required
              style={{ padding: 8, borderRadius: 4, border: 'none' }}
            />
            <input
              type="text"
              placeholder="Nama File Gambar (contoh: poster.jpg, harus ada di folder backend /images)"
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              required
              style={{ padding: 8, borderRadius: 4, border: 'none' }}
            />
            <span style={{ fontSize: 12, color: '#f7941e' }}>
              * Pastikan file gambar sudah ada di folder backend <b>/images</b>
            </span>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#f7941e', color: '#fff', fontWeight: 700 }}>
                {isEdit ? 'Update' : 'Simpan'}
              </button>
              <button type="button" onClick={() => { setShowModal(false); setIsEdit(false); }} style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#444', color: '#fff' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Section Film */}
      <section style={{ padding: '32px' }}>
        <h2 style={{ fontSize: 24, marginBottom: 20 }}>MOVIES IN THEATERS</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '20px',
        }}>
          {films.map(film => (
            <div
              key={film.id}
              onClick={() => setSelectedFilm(film.id)}
              style={{
                background: selectedFilm === film.id ? '#294c7a' : '#1c1c1c',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                transition: 'transform 0.2s, background 0.2s',
                border: selectedFilm === film.id ? '2px solid #f7941e' : 'none',
                cursor: 'pointer'
              }}
            >
              <img
                src={`http://localhost:5000/images/${film.image}`}
                alt={film.judul}
                style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
                onError={e => {
                  // Cegah infinite loop jika no-image.png juga tidak ada
                  if (e.currentTarget.src.indexOf('no-image.png') === -1) {
                    e.currentTarget.src = '/no-image.png';
                  }
                }}
              />
              <div style={{ padding: '12px' }}>
                <strong>{film.judul}</strong>
                <p style={{ fontSize: 12, color: '#ccc', margin: '4px 0' }}>
                  Sutradara: {film.sutradara}
                </p>
                <p style={{ fontSize: 12, color: '#ccc' }}>
                  Tahun: {film.tahun}
                </p>
                {/* Tambahkan Trial dan Play di bawah ini */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{
                    background: '#f7941e',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 12,
                    borderRadius: 4,
                    padding: '2px 8px'
                  }}>
                    Trial
                  </span>
                  <Link href={`/play/${film.id}`}>
                    <button
                      style={{
                        background: '#2196f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '4px 12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: 13
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      Play
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}