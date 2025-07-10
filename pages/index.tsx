import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Tambahkan font Google Fonts (misal Orbitron) di _app.tsx atau _document.tsx untuk hasil maksimal
// <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet" />

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
  const [search, setSearch] = useState('');
  const [bgType, setBgType] = useState<'gradient' | 'image'>('gradient');
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #0f2027 0%, #2c5364 100%)');
  const [bgImage, setBgImage] = useState('');
  const router = useRouter();

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

  // Filter film sesuai pencarian
  const filteredFilms = films.filter(film =>
    film.judul.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ color: '#fff', padding: 32 }}>Loading...</p>;

  return (
    <div
      style={{
        background: bgType === 'gradient' ? bgGradient : `background(${bgImage}) center/cover no-repeat`,
        minHeight: '100vh',
        color: '#fff',
        fontFamily: "'Orbitron', Arial, sans-serif",
        letterSpacing: 1.2,
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        background: 'rgba(10,24,61,0.85)',
        boxShadow: '0 4px 24px #00ffe7a0',
        padding: '10px 32px',
        height: 70,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '2px solid #00ffe7'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            style={{
              marginRight: 18,
              filter: 'drop-shadow(0 0 8px #00ffe7)',
              background: '#0f2027',
              borderRadius: '50%',
              border: '2px solid #00ffe7',
              boxShadow: '0 0 16px #00ffe7a0'
            }}
          />
          <span style={{
            fontSize: 28,
            fontWeight: 900,
            color: '#00ffe7',
            textShadow: '0 0 12px #00ffe7, 0 0 24px #0ff',
            letterSpacing: 2
          }}>
            Jamoeraya's Cinema
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#" style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 1,
            transition: 'color 0.2s',
            textShadow: '0 0 8px #00ffe7'
          }}></a>
          <button
            onClick={() => router.push('/form-tambah')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(90deg, #00ffe7 0%, #00bfff 100%)',
              color: '#222',
              fontWeight: 900,
              fontSize: 18,
              border: 'none',
              borderRadius: 8,
              padding: '8px 20px',
              cursor: 'pointer',
              boxShadow: '0 0 12px #00ffe7a0',
              letterSpacing: 1,
              textShadow: '0 0 8px #00ffe7',
              transition: 'background 0.2s'
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 900, marginTop: -2 }}>+</span>
            Tambah Data
          </button>
        </nav>
      </header>

      {/* Modal Tambah/Edit Film */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
          backdropFilter: 'blur(4px)'
        }}>
          <form onSubmit={isEdit ? handleEditSubmit : handleSubmit} style={{
            background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
            boxShadow: '0 0 32px #00ffe7a0',
            padding: 32,
            borderRadius: 16,
            minWidth: 340,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            border: '2px solid #00ffe7'
          }}>
            <h3 style={{
              color: '#00ffe7',
              textShadow: '0 0 8px #00ffe7',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 2
            }}>{isEdit ? 'Edit Film' : 'Tambah Film'}</h3>
            <input
              type="text"
              placeholder="Judul"
              value={form.judul}
              onChange={e => setForm({ ...form, judul: e.target.value })}
              required
              style={{
                padding: 10,
                borderRadius: 6,
                border: '1px solid #00ffe7',
                background: '#181818',
                color: '#fff',
                fontSize: 16,
                outline: 'none',
                boxShadow: '0 0 8px #00ffe7a0'
              }}
            />
            <input
              type="text"
              placeholder="Sutradara"
              value={form.sutradara}
              onChange={e => setForm({ ...form, sutradara: e.target.value })}
              required
              style={{
                padding: 10,
                borderRadius: 6,
                border: '1px solid #00ffe7',
                background: '#181818',
                color: '#fff',
                fontSize: 16,
                outline: 'none',
                boxShadow: '0 0 8px #00ffe7a0'
              }}
            />
            <input
              type="number"
              placeholder="Tahun"
              value={form.tahun}
              onChange={e => setForm({ ...form, tahun: e.target.value })}
              required
              style={{
                padding: 10,
                borderRadius: 6,
                border: '1px solid #00ffe7',
                background: '#181818',
                color: '#fff',
                fontSize: 16,
                outline: 'none',
                boxShadow: '0 0 8px #00ffe7a0'
              }}
            />
            <input
              type="text"
              placeholder="Nama File Gambar (contoh: poster.jpg, harus ada di folder backend /images)"
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              required
              style={{
                padding: 10,
                borderRadius: 6,
                border: '1px solid #00ffe7',
                background: '#181818',
                color: '#fff',
                fontSize: 16,
                outline: 'none',
                boxShadow: '0 0 8px #00ffe7a0'
              }}
            />
            <span style={{ fontSize: 13, color: '#00ffe7', textShadow: '0 0 6px #00ffe7' }}>
              * Pastikan file gambar sudah ada di folder backend <b>/images</b>
            </span>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <button type="submit" style={{
                padding: '10px 24px',
                borderRadius: 6,
                border: 'none',
                background: 'linear-gradient(90deg, #00ffe7 0%, #00bfff 100%)',
                color: '#222',
                fontWeight: 900,
                fontSize: 16,
                letterSpacing: 1,
                boxShadow: '0 0 12px #00ffe7a0',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}>
                {isEdit ? 'Update' : 'Simpan'}
              </button>
              <button type="button" onClick={() => { setShowModal(false); setIsEdit(false); }} style={{
                padding: '10px 24px',
                borderRadius: 6,
                border: 'none',
                background: 'linear-gradient(90deg, #232526 0%, #414345 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 1,
                boxShadow: '0 0 8px #ff00c8a0',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Pencarian */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 16px 0' }}>
        <input
          type="text"
          placeholder="Cari film yang ingin ditonton..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: '2px solid #00ffe7',
            background: '#181818',
            color: '#fff',
            fontSize: 18,
            minWidth: 320,
            boxShadow: '0 0 12px #00ffe7a0',
            outline: 'none',
            letterSpacing: 1
          }}
        />
      </div>

      {/* Section Film */}
      <section style={{ padding: '40px 5vw' }}>
        <h2 style={{
          fontSize: 30,
          marginBottom: 28,
          color: '#00ffe7',
          textShadow: '0 0 16px #00ffe7, 0 0 32px #0ff',
          fontWeight: 900,
          letterSpacing: 2
        }}>MOVIES IN THEATERS</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '32px',
        }}>
          {filteredFilms.length === 0 ? (
            <div style={{ color: '#00ffe7', fontSize: 22, gridColumn: '1/-1', textAlign: 'center' }}>
              Film tidak ditemukan.
            </div>
          ) : (
            filteredFilms.map(film => (
              <div
                key={film.id}
                onClick={() => setSelectedFilm(film.id)}
                style={{
                  background: selectedFilm === film.id
                    ? 'linear-gradient(135deg, #00ffe7 0%, #232526 100%)'
                    : 'rgba(30,30,40,0.85)',
                  borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: selectedFilm === film.id
                    ? '0 0 32px #00ffe7a0, 0 0 8px #fff'
                    : '0 2px 12px #00ffe740',
                  border: selectedFilm === film.id
                    ? '2.5px solid #00ffe7'
                    : '1.5px solid #232526',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {/* Tombol Delete */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (confirm('Yakin ingin menghapus film ini?')) {
                      axios.delete(`http://localhost:5000/api/film/${film.id}`)
                        .then(() => {
                          fetchFilms();
                          setSelectedFilm(null);
                        })
                        .catch(() => {
                          alert('Gagal menghapus film');
                        });
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(30,30,40,0.85)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    color: '#ff0055',
                    fontSize: 20,
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 0 8px #ff0055a0',
                    zIndex: 2,
                    transition: 'background 0.2s'
                  }}
                  title="Hapus film"
                >
                  ❌
                </button>
                {/* Tombol Edit */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    router.push(`/form-edit/${film.id}`);
                  }}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 50, // beri jarak dari tombol delete
                    background: 'rgba(30,30,40,0.85)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    color: '#00bfff',
                    fontSize: 20,
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 0 8px #00bfff70',
                    zIndex: 2,
                    transition: 'background 0.2s'
                  }}
                  title="Edit film"
                >
                  ✏️
                </button>
                <img
                  src={`http://localhost:5000/images/${film.image}`}
                  alt={film.judul}
                  style={{
                    width: '100%',
                    height: 260,
                    objectFit: 'cover',
                    display: 'block',
                    filter: selectedFilm === film.id ? 'drop-shadow(0 0 16px #00ffe7)' : 'none',
                    transition: 'filter 0.2s'
                  }}
                  onError={e => {
                    if (e.currentTarget.src.indexOf('no-image.png') === -1) {
                      e.currentTarget.src = '/no-image.png';
                    }
                  }}
                />
                <div style={{
                  padding: '18px 14px',
                  background: 'rgba(10,24,61,0.85)',
                  borderBottomLeftRadius: 18,
                  borderBottomRightRadius: 18,
                  borderTop: '1.5px solid #00ffe7'
                }}>
                  <strong style={{
                    fontSize: 18,
                    color: '#fff',
                    textShadow: '0 0 8px #00ffe7'
                  }}>{film.judul}</strong>
                  <p style={{ fontSize: 13, color: '#00ffe7', margin: '6px 0 2px 0', textShadow: '0 0 4px #00ffe7' }}>
                    Sutradara: {film.sutradara}
                  </p>
                  <p style={{ fontSize: 13, color: '#fff', textShadow: '0 0 4px #fff700' }}>
                    Tahun: {film.tahun}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                    <a href={`/play/${film.id}`}>
                      <button
                        style={{
                          background: 'linear-gradient(90deg, #ff00c8 0%, #00ffe7 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 28px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          fontSize: 15,
                          boxShadow: '0 0 12px #00ffe7a0',
                          letterSpacing: 1,
                          transition: 'background 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        Tonton
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Menu Custom Background */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '24px 32px 0 32px' }}>
        <label>
          <input
            type="radio"
            checked={bgType === 'gradient'}
            onChange={() => setBgType('gradient')}
          /> Gradient
        </label>
        <input
          type="text"
          value={bgGradient}
          onChange={e => setBgGradient(e.target.value)}
          disabled={bgType !== 'gradient'}
          style={{ width: 320, padding: 6, borderRadius: 6, border: '1px solid #00ffe7' }}
          placeholder="CSS Gradient, contoh: linear-gradient(135deg, #0f2027 0%, #2c5364 100%)"
        />
        <label>
          <input
            type="radio"
            checked={bgType === 'image'}
            onChange={() => setBgType('image')}
          /> Gambar
        </label>
        <input
          type="text"
          value={bgImage}
          onChange={e => setBgImage(e.target.value)}
          disabled={bgType !== 'image'}
          style={{ width: 220, padding: 6, borderRadius: 6, border: '1px solidrgb(0, 217, 255)' }}
          placeholder="background.jpg, contoh: /background.jpg"
        />
      </div>
    </div>
  );
}