import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      background: '#23272e',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      height: 64,
      borderBottom: '2px solid #ffb43a'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: 32 }}>
        <Image src="/logo-film.png" alt="Fandango" width={40} height={40} />
        <span style={{
          color: '#ffb43a',
          fontWeight: 700,
          fontSize: 28,
          marginLeft: 10,
          letterSpacing: 1
        }}>FANDANGO</span>
      </div>
      <input
        type="text"
        placeholder="Search by city, state, zip or movie"
        style={{
          flex: 1,
          maxWidth: 400,
          padding: '8px 16px',
          borderRadius: 20,
          border: 'none',
          marginRight: 32,
          fontSize: 16
        }}
      />
      <nav style={{ display: 'flex', gap: 24 }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Movies</Link>
        <Link href="/tambah" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Tambah</Link>
        {/* Hapus dan Edit akan di-handle di halaman utama */}
        <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Hapus</a>
        <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Edit</a>
        <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Sign In/Join</a>
      </nav>
    </header>
  );
}