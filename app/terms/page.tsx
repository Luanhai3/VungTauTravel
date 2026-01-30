import Footer from "@/components/Footer";
import { FileText } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng - Vũng Tàu Travel",
  description: "Quy định và điều kiện khi sử dụng dịch vụ và nội dung trên Vũng Tàu Travel.",
};

export default function TermsPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden
      bg-[#F5FAFF]"
    >
      {/* Background Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="relative pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-white/60 backdrop-blur-2xl
          p-8 md:p-12 rounded-3xl shadow-2xl shadow-teal-900/5
          border border-white/60"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center
              bg-teal-50 border border-teal-100 shadow-sm"
            >
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Điều khoản sử dụng
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Quy định và điều kiện khi sử dụng nền tảng Vũng Tàu Travel
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-slate-600 prose-headings:text-slate-900 prose-strong:text-slate-900">
            <p>
              Chào mừng bạn đến với <strong>Vũng Tàu Travel</strong>. Khi truy cập
              và sử dụng website này, bạn đồng ý tuân thủ các điều khoản và điều
              kiện được nêu dưới đây. Vui lòng đọc kỹ trước khi tiếp tục sử dụng
              dịch vụ.
            </p>

            <h3>1. Quyền sở hữu trí tuệ</h3>
            <p>
              Toàn bộ nội dung trên website, bao gồm nhưng không giới hạn ở văn
              bản, hình ảnh, đồ họa, logo và mã nguồn, đều thuộc quyền sở hữu của
              Vũng Tàu Travel hoặc các bên cấp phép hợp pháp. Người dùng không
              được sao chép, chỉnh sửa, phân phối hoặc sử dụng cho mục đích
              thương mại khi chưa có sự đồng ý bằng văn bản.
            </p>

            <h3>2. Trách nhiệm của người dùng</h3>
            <p>
              Người dùng cam kết sử dụng website cho các mục đích hợp pháp, không
              vi phạm pháp luật, thuần phong mỹ tục và quyền lợi của bên thứ ba.
              Nghiêm cấm các hành vi gây ảnh hưởng đến hệ thống, phát tán mã độc,
              tấn công hoặc thu thập dữ liệu trái phép.
            </p>

            <h3>3. Nội dung do người dùng cung cấp</h3>
            <p>
              Khi bạn gửi bình luận, đánh giá, hình ảnh hoặc nội dung khác lên
              website, bạn đồng ý cấp cho Vũng Tàu Travel quyền sử dụng, hiển thị,
              chỉnh sửa và phân phối nội dung đó cho mục đích vận hành và quảng
              bá dịch vụ. Bạn chịu hoàn toàn trách nhiệm về tính hợp pháp và độ
              chính xác của nội dung đã đăng tải.
            </p>

            <h3>4. Miễn trừ trách nhiệm</h3>
            <p>
              Chúng tôi luôn nỗ lực cung cấp thông tin du lịch chính xác và cập
              nhật, tuy nhiên không cam kết tuyệt đối về tính đầy đủ hoặc không
              có sai sót. Vũng Tàu Travel không chịu trách nhiệm đối với bất kỳ
              thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ việc sử dụng
              thông tin trên website.
            </p>

            <h3>5. Thay đổi điều khoản</h3>
            <p>
              Chúng tôi có quyền điều chỉnh, bổ sung hoặc thay đổi các điều khoản
              sử dụng này vào bất kỳ thời điểm nào. Việc bạn tiếp tục sử dụng
              website sau khi các thay đổi được công bố đồng nghĩa với việc bạn
              chấp nhận và tuân thủ các điều khoản đã được cập nhật.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
