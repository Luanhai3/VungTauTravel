import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Chính sách bảo mật</h1>
          
          <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
            <p>Vũng Tàu Travel cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của người dùng.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Thu thập thông tin</h3>
            <p>Chúng tôi có thể thu thập thông tin cá nhân như tên, địa chỉ email khi bạn đăng ký tài khoản, đăng ký nhận tin hoặc liên hệ với chúng tôi. Ngoài ra, chúng tôi cũng thu thập dữ liệu phi cá nhân như địa chỉ IP, loại trình duyệt để cải thiện trải nghiệm người dùng.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Sử dụng thông tin</h3>
            <p>Thông tin của bạn được sử dụng để:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cung cấp và cải thiện dịch vụ.</li>
              <li>Gửi thông báo, tin tức du lịch và ưu đãi (nếu bạn đăng ký).</li>
              <li>Hỗ trợ và giải đáp thắc mắc của người dùng.</li>
              <li>Phân tích xu hướng sử dụng để tối ưu hóa website.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Bảo mật thông tin</h3>
            <p>Chúng tôi áp dụng các biện pháp an ninh kỹ thuật để bảo vệ dữ liệu của bạn khỏi truy cập trái phép, mất mát hoặc phá hủy. Tuy nhiên, không có phương thức truyền tải nào trên internet là an toàn tuyệt đối.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Chia sẻ thông tin</h3>
            <p>Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, trừ khi có sự đồng ý của bạn hoặc theo yêu cầu của pháp luật.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Cookie</h3>
            <p>Website sử dụng cookie để lưu trữ tùy chọn của người dùng và nâng cao trải nghiệm duyệt web. Bạn có thể tắt cookie trong cài đặt trình duyệt của mình.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Liên hệ</h3>
            <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: contact@vungtau.com.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
