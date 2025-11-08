import { FileUpload } from '@/components/file-upload';
import { requireUser } from '@/lib/auth-helpers';

export default async function UploadTestPage() {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dosya Yükleme Testi</h1>
          <p className="mt-2 text-sm text-gray-600">
            Hoş geldin, {user.name || user.email}! S3 upload sistemini test et.
          </p>
        </div>

        <div className="space-y-8">
          {/* Image Upload */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Resim Yükle</h2>
            <FileUpload
              type="image"
              maxSizeLabel="Maksimum: 5MB"
              acceptedFormats="JPEG, PNG, WebP"
              onUploadComplete={(url, key) => {
                console.log('Image uploaded:', { url, key });
              }}
            />
          </div>

          {/* Video Upload */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Video Yükle</h2>
            <FileUpload
              type="video"
              maxSizeLabel="Maksimum: 50MB"
              acceptedFormats="MP4"
              onUploadComplete={(url, key) => {
                console.log('Video uploaded:', { url, key });
              }}
            />
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-2 font-semibold text-blue-900">ℹ️ Bilgi</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-blue-800">
              <li>Presigned URL kullanılarak güvenli yükleme yapılır</li>
              <li>Dosyalar S3 uyumlu depolama servisine yüklenir</li>
              <li>MIME type ve boyut kontrolü otomatik yapılır</li>
              <li>Progress bar ile yükleme durumu takip edilir</li>
              <li>Yükleme tamamlandığında public URL döner</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
