import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Điều khoản sử dụng</h1>
          
          <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
            <p>Chào mừng bạn đến với Vũng Tàu Travel. Khi truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Quyền sở hữu trí tuệ</h3>
            <p>Tất cả nội dung trên website này, bao gồm văn bản, hình ảnh, đồ họa, logo và mã nguồn đều thuộc quyền sở hữu của Vũng Tàu Travel hoặc các bên cấp phép. Bạn không được sao chép, sửa đổi, phân phối hoặc sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn bản.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Trách nhiệm người dùng</h3>
            <p>Bạn cam kết sử dụng website cho các mục đích hợp pháp và không vi phạm quyền lợi của bất kỳ bên thứ ba nào. Bạn không được thực hiện các hành vi gây hại đến hệ thống, phát tán phần mềm độc hại hoặc thu thập dữ liệu trái phép.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Nội dung do người dùng đóng góp</h3>
            <p>Khi bạn gửi bình luận, đánh giá hoặc hình ảnh lên website, bạn cấp cho chúng tôi quyền sử dụng, hiển thị và phân phối nội dung đó. Bạn chịu trách nhiệm hoàn toàn về tính chính xác và hợp pháp của nội dung mình đăng tải.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Miễn trừ trách nhiệm</h3>
            <p>Chúng tôi nỗ lực cung cấp thông tin chính xác nhất về du lịch Vũng Tàu, tuy nhiên không đảm bảo tính hoàn thiện tuyệt đối. Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng thông tin trên website.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Thay đổi điều khoản</h3>
            <p>Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Việc bạn tiếp tục sử dụng website sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
