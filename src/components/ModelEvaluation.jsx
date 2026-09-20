import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';

const copy = {
  id: {
    title: 'Bagaimana model dievaluasi?',
    intro: 'Ringkasan metode dan keluaran yang tersimpan di notebook penelitian RestUP.',
    data: 'Data & fitur',
    dataBody: 'Kuesioner kebiasaan tidur mahasiswa. Enam fitur numerik/biner mencakup durasi, stres, kafein, layar, terbangun, dan suhu; latensi serta mood diubah dengan one-hot encoding. Nama dan nomor telepon tidak menjadi fitur model.',
    method: 'Pembagian & model',
    methodBody: 'Train/test 80:20 (random_state=12). Random Forest: 100 pohon, max_depth=5, min_samples_leaf=2, random_state=42. Notebook mencatat 63 sampel uji.',
    model: 'Model', accuracy: 'Akurasi', recall: 'Recall kelas Buruk',
    baseline: 'Baseline', balanced: 'Dengan bobot kelas seimbang',
    tradeoff: 'Pada hasil tersimpan, bobot kelas seimbang menaikkan recall kelas Buruk dari 83% menjadi 94%, sementara akurasi total turun dari 93,65% menjadi 92,06%. Ini menunjukkan pertukaran antara kedua metrik, bukan peningkatan di semua aspek.',
    limits: 'Batas evaluasi',
    limitsBody: 'Hasil ini berasal dari satu pembagian data; kode yang ditinjau belum menunjukkan cross-validation atau validasi eksternal. Label berasal dari kuesioner, sehingga hasil tidak membuktikan ketepatan diagnosis klinis maupun perubahan kualitas tidur pengguna.',
    snapshot: 'Catatan reproduksi: spreadsheet yang ditinjau berisi 317 respons, sedangkan keluaran notebook mencatat 63 sampel uji. Tabel ini merujuk keluaran tersimpan; snapshot data perlu disamakan sebelum hasil dapat direproduksi persis.',
    source: 'Lihat metode dan hasil di GitHub',
  },
  en: {
    title: 'How was the model evaluated?',
    intro: 'Methods and saved outputs from the RestUP research notebook.',
    data: 'Data & features',
    dataBody: 'A student sleep-habits questionnaire. Six numeric/binary features cover duration, stress, caffeine, screen time, awakenings, and temperature; latency and waking mood are one-hot encoded. Names and phone numbers are not model features.',
    method: 'Split & model',
    methodBody: '80:20 train/test split (random_state=12). Random Forest: 100 trees, max_depth=5, min_samples_leaf=2, random_state=42. The notebook reports 63 test samples.',
    model: 'Model', accuracy: 'Accuracy', recall: 'Poor-class recall',
    baseline: 'Baseline', balanced: 'Balanced class weights',
    tradeoff: 'In the saved results, balanced class weights raise Poor-class recall from 83% to 94%, while overall accuracy falls from 93.65% to 92.06%. This is a tradeoff between metrics, rather than an improvement in every measure.',
    limits: 'Evaluation limits',
    limitsBody: 'These results use a single data split; the reviewed code does not show cross-validation or external validation. Questionnaire labels do not establish clinical diagnostic accuracy or an improvement in users’ sleep.',
    snapshot: 'Reproduction note: the reviewed spreadsheet contains 317 responses, while the saved notebook reports 63 test samples. This table describes saved outputs; matching the dataset snapshot is necessary for exact reproduction.',
    source: 'View methods and results on GitHub',
  },
};

export default function ModelEvaluation({ evaluation }) {
  const { i18n } = useTranslation();
  if (!evaluation) return null;
  const language = i18n.resolvedLanguage === 'id' ? 'id' : 'en';
  const c = copy[language];
  const format = (value, digits = 0) => new Intl.NumberFormat(language, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
  return (
    <section aria-labelledby="model-evaluation-title" className="mb-12 rounded-xl border border-slate-200 p-5 dark:border-slate-700 sm:p-7">
      <h2 id="model-evaluation-title" className="text-2xl font-bold">{c.title}</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-300">{c.intro}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {[['data', 'dataBody'], ['method', 'methodBody']].map(([title, body]) => (
          <div key={title}><h3 className="font-semibold">{c[title]}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{c[body]}</p></div>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{c.title}</caption>
          <thead className="border-b border-slate-300 dark:border-slate-600"><tr>{['model', 'accuracy', 'recall'].map(key => <th key={key} scope="col" className="px-2 py-3">{c[key]}</th>)}</tr></thead>
          <tbody>
            <tr className="border-b border-slate-200 dark:border-slate-700"><th scope="row" className="px-2 py-3 font-medium">{c.baseline}</th><td className="px-2 py-3">{format(evaluation.baselineAccuracy, 2)}%</td><td className="px-2 py-3">{format(evaluation.baselinePoorRecall * 100)}%</td></tr>
            <tr className="bg-blue-50 dark:bg-blue-950/30"><th scope="row" className="px-2 py-3 font-medium">{c.balanced}</th><td className="px-2 py-3 font-bold">{format(evaluation.balancedAccuracy, 2)}%</td><td className="px-2 py-3 font-bold">{format(evaluation.balancedPoorRecall * 100)}%</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{c.tradeoff}</p>
      <details className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
        <summary className="min-h-7 cursor-pointer font-semibold">{c.limits}</summary>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{c.limitsBody}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{c.snapshot}</p>
      </details>
      <a href={evaluation.source} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-primary">{c.source}<ArrowUpRight size={17} aria-hidden="true" /></a>
    </section>
  );
}
