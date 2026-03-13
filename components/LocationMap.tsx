import React from 'react';

interface LocationMapProps {
  lat: number;
  lng: number;
  name?: string;
}

export default function LocationMap({ lat, lng, name }: LocationMapProps) {
  // Sử dụng iframe maps đơn giản. 
  // Trong thực tế bạn nên dùng Google Maps JavaScript API key để có trải nghiệm tốt nhất.
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=vi&z=15&output=embed`;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <iframe
        title={`Bản đồ ${name}`}
        width="100%"
        height="100%"
        src={mapUrl}
        loading="lazy"
        className="border-0"
      ></iframe>
    </div>
  );
}