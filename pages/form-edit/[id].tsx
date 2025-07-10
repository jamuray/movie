import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FormEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({ judul: '', sutradara: '', tahun: '', image: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/film/${id}`)
        .then(res => {
          const film = res.data.data;
          setForm({
            judul: film.judul,
            sutradara: film.sutradara,
            tahun: String(film.tahun),
            image: film.image,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/film/${id}`, {
        judul: form.judul,
        sutradara: form.sutradara,
        tahun: Number(form.tahun),
        image: form.image,
      });
      alert('Berhasil mengedit film!');
      router.push('/');
    } catch {
      alert('Gagal mengedit film');
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: 32 }}>Loading...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form onSubmit={handleSubmit} style={{
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
        }}>Edit Film</h3>
        <input
          type="text"
          name="judul"
          placeholder="Judul"
          value={form.judul}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sutradara"
          placeholder="Sutradara"
          value={form.sutradara}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="tahun"
          placeholder="Tahun"
          value={form.tahun}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Nama File Gambar"
          value={form.image}
          onChange={handleChange}
          required
        />
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
            Simpan
          </button>
          <button type="button" onClick={() => router.push('/')} style={{
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
  );
}