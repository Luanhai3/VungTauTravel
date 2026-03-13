import React from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: { id: string; url: string }[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {images.map((img) => (
        <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:opacity-90 transition">
          <Image
            src={img.url}
            alt="Gallery image"
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}