import { Metadata } from 'next';
import { ThanksForm } from '@/components/thanks/thanks-form';

export const metadata: Metadata = {
  title: 'Teşekkür Yaz | Teşekkürvar',
  description: 'İyi deneyiminizi paylaşın ve şirketlere teşekkür edin.',
};

export default function ThanksWritePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">💙 Teşekkür Yaz</h1>
          <p className="mt-2 text-gray-600">İyi deneyiminizi paylaşın ve şirketlere teşekkür edin</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <ThanksForm />
        </div>
      </div>
    </div>
  );
}
