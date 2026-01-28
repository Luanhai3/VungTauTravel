import PlaceForm from "../place-form";

export default function AddPlacePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Thêm địa điểm mới</h1>
          <p className="text-gray-600 mt-1">Nhập thông tin chi tiết cho địa điểm.</p>
        </div>
        <PlaceForm />
      </div>
    </div>
  );
}
