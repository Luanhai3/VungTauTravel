import Footer from "@/components/Footer";
import { ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật - Vũng Tàu Travel",
  description: "Cam kết bảo vệ quyền riêng tư và thông tin cá nhân của người dùng trên Vũng Tàu Travel.",
};

export default function PrivacyPage() {
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
              <ShieldCheck className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Chính sách bảo mật
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Cam kết bảo vệ quyền riêng tư của người dùng Vũng Tàu Travel
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-slate-600 prose-headings:text-slate-900 prose-strong:text-slate-900">
            <p>
              Vũng Tàu Travel cam kết bảo vệ quyền riêng tư của bạn. Chính sách này
              mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân
              của người dùng khi truy cập và sử dụng dịch vụ.
            </p>

            <h3>1. Thu thập thông tin</h3>
            <p>
              Chúng tôi có thể thu thập thông tin cá nhân như họ tên, địa chỉ
              email khi bạn đăng ký tài khoản, đăng ký nhận thông tin hoặc liên hệ
              với chúng tôi. Ngoài ra, một số dữ liệu phi cá nhân như địa chỉ IP,
              loại trình duyệt cũng có thể được ghi nhận nhằm cải thiện trải
              nghiệm người dùng.
            </p>

            <h3>2. Mục đích sử dụng thông tin</h3>
            <ul>
              <li>Cung cấp, vận hành và cải thiện chất lượng dịch vụ.</li>
              <li>
                Gửi thông báo, tin tức du lịch hoặc ưu đãi khi bạn cho phép.
              </li>
              <li>Hỗ trợ người dùng và xử lý các yêu cầu liên quan.</li>
              <li>Phân tích và tối ưu hóa trải nghiệm website.</li>
            </ul>

            <h3>3. Bảo mật thông tin</h3>
            <p>
              Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo
              vệ dữ liệu cá nhân của bạn khỏi truy cập trái phép, mất mát hoặc
              tiết lộ. Tuy nhiên, không có hệ thống nào an toàn tuyệt đối trên
              môi trường internet.
            </p>

            <h3>4. Chia sẻ thông tin</h3>
            <p>
              Chúng tôi không bán, trao đổi hoặc chia sẻ thông tin cá nhân của
              người dùng cho bên thứ ba, trừ trường hợp có sự đồng ý của bạn hoặc
              theo yêu cầu của cơ quan có thẩm quyền theo quy định pháp luật.
            </p>

            <h3>5. Cookie</h3>
            <p>
              Website có thể sử dụng cookie nhằm ghi nhớ tùy chọn của người dùng
              và nâng cao trải nghiệm truy cập. Bạn hoàn toàn có thể điều chỉnh
              hoặc tắt cookie thông qua cài đặt trình duyệt.
            </p>

            <h3>6. Liên hệ</h3>
            <p>
              Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến chính sách
              bảo mật, vui lòng liên hệ với chúng tôi qua email:
              <br />
              <strong>hoangthienluan17@gmail.com</strong>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
