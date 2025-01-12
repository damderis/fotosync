import { useStorage } from '@/hooks/useStorage';

export default function ImageUpload() {
  const { upload, uploading, error } = useStorage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const path = `images/${file.name}`;
      const url = await upload(file, path);
      console.log('Uploaded file URL:', url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
} 