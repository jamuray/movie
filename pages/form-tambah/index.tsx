import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function FormTambah() {
  const [form, setForm] = useState({ judul: '', sutradara: '', tahun: '', image: null as File | null });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('judul', form.judul);
    data.append('sutradara', form.sutradara);
    data.append('tahun', form.tahun);
    if (form.image) data.append('image', form.image);

    try {
      await axios.post('http://localhost:5000/api/film', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Berhasil menambah film!');
      router.push('/');
    } catch (err: any) {
      alert('Gagal menambah film\n' + (err?.response?.data?.message || ''));
      console.log(err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{
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
        }}>Tambah Film</h3>
        <input
          type="text"
          name="judul"
          placeholder="Judul"
          value={form.judul}
          onChange={handleChange}
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
          name="tahun"
          placeholder="Tahun"
          value={form.tahun}
          onChange={handleChange}
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
          name="sutradara"
          placeholder="Sutradara"
          value={form.sutradara}
          onChange={handleChange}
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
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
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