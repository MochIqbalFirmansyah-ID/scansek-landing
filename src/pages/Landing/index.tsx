import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Scan, Database, BarChart3, ShieldCheck } from 'lucide-react';

// Komponen
import Header from './components/Header';
import Footer from '../../components/layout/Footer';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <Scan size={36} className="text-primary-500" />,
      title: 'Pindai & Deteksi',
      description: 'Pindai barcode kemasan makanan dan deteksi kandungan gula secara otomatis dengan teknologi OCR canggih.',
    },
    {
      icon: <Database size={36} className="text-primary-500" />,
      title: 'Pantau & Lacak',
      description: 'Lacak konsumsi gula harian Anda dengan riwayat lengkap dan log pribadi.',
    },
    {
      icon: <BarChart3 size={36} className="text-primary-500" />,
      title: 'Visualisasi Data',
      description: 'Lihat pola konsumsi Anda melalui grafik interaktif dan analisis yang dipersonalisasi.',
    },
    {
      icon: <ShieldCheck size={36} className="text-primary-500" />,
      title: 'Aman & Privat',
      description: 'Data kesehatan Anda tetap aman dengan autentikasi terpercaya dan perlindungan data.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={isScrolled} />

      {/* Bagian Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Pemantauan <span className="text-primary-600">Gula Pintar</span> Jadi Lebih Mudah
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                ScanSek membantu Anda melacak konsumsi gula harian hanya dengan memindai kemasan makanan. Kendalikan kesehatan Anda dengan data akurat dan analisis yang bermanfaat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold text-lg transition-all hover:bg-primary-700 focus:ring-4 focus:ring-primary-300"
                >
                  Mulai Sekarang
                  <ChevronRight className="ml-2" size={20} />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-primary-600 border border-primary-200 font-semibold text-lg transition-all hover:bg-gray-50 focus:ring-4 focus:ring-gray-200"
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/6476591/pexels-photo-6476591.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Tangkapan Layar Aplikasi ScanSek" 
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Fitur */}
      <section id="features" className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ScanSek menggabungkan teknologi canggih dan desain ramah pengguna untuk membantu Anda memantau konsumsi gula secara efektif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-md transition-transform hover:translate-y-[-5px] hover:shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-heading text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bagian CTA */}
      <section className="py-16 px-4 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Memantau Konsumsi Gula Anda?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang telah mengontrol kesehatan mereka menggunakan alat pelacak dari ScanSek.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-primary-600 font-semibold text-lg transition-all hover:bg-gray-100 focus:ring-4 focus:ring-white/30"
          >
            Mulai Lacak Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
