const benefits = [
  {
    icon: "🏖️",
    title: "Bãi biển đẹp",
    description: "Nhiều bãi biển trong xanh, sạch sẽ và yên bình",
  },
  {
    icon: "🍽️",
    title: "Ẩm thực phong phú",
    description: "Hải sản tươi ngon, đặc sản địa phương đa dạng",
  },
  {
    icon: "📷",
    title: "Nhiều điểm sống ảo",
    description: "Vô số góc check-in đẹp cho Instagram",
  },
  {
    icon: "💑",
    title: "Lý tưởng cho cặp đôi",
    description: "Không gian lãng mạn, hoàng hôn tuyệt đẹp",
  },
  {
    icon: "🚗",
    title: "Gần Sài Gòn",
    description: "Chỉ cách TP.HCM 2-3 giờ lái xe",
  },
  {
    icon: "💰",
    title: "Chi phí hợp lý",
    description: "Du lịch tiết kiệm, phù hợp mọi ngân sách",
  },
];

export default function WhyVisit() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tại sao nên đến Vũng Tàu?
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-6">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
