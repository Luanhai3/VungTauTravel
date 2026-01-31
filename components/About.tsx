"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X, MapPin, History, Mountain, Camera, Users, Building2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function About() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [showCursor1, setShowCursor1] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fullText1 = "Chào mừng đến với";
  const fullText2 = "Vũng Tàu";

  useEffect(() => {
    let i = 0;
    let j = 0;
    let timer2: NodeJS.Timeout;

    const timer1 = setInterval(() => {
      if (i <= fullText1.length) {
        setText1(fullText1.slice(0, i));
        i++;
      } else {
        clearInterval(timer1);
        setShowCursor1(false);
        timer2 = setInterval(() => {
          if (j <= fullText2.length) {
            setText2(fullText2.slice(0, j));
            j++;
          } else {
            clearInterval(timer2);
          }
        }, 100);
      }
    }, 50);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current && window.innerWidth >= 1024) {
        const scrolled = window.scrollY;
        imageRef.current.style.transform = `translateY(${scrolled * 0.08}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <section id="about" className="py-24 md:py-36 bg-[#F5FAFF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={imageRef} className="relative order-2 lg:order-1 will-change-transform">
            <div className="relative h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-teal-900/10">
              <Image
                src="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=1000"
                alt="Bờ biển Vũng Tàu xinh đẹp với sóng xanh và cát trắng"
                title="Vẻ đẹp thơ mộng của bờ biển Vũng Tàu"
                fill
                className={`object-cover transition-opacity duration-700 ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setIsImageLoaded(true)}
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-100 rounded-full -z-10 blur-3xl opacity-50"></div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-4">
              <h4 className="text-teal-600 font-bold tracking-widest uppercase text-xs">
                Giới thiệu
              </h4>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">
                {text1}
                {showCursor1 && <span className="animate-pulse">|</span>}
                <br />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400">
                  {text2}
                </span>
                {!showCursor1 && <span className="animate-pulse text-teal-500">|</span>}
              </h2>
            </div>

            <div className="space-y-6 text-lg text-slate-600 font-light leading-relaxed">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Vũng Tàu không chỉ là điểm đến, mà là nơi đánh thức mọi giác quan. Chỉ cách TP.HCM 2 giờ di chuyển, thành phố biển này chào đón bạn bằng tiếng sóng vỗ rì rào tại Bãi Sau, vẻ đẹp thơ mộng của Bãi Trước và những cung đường ven biển đẹp như tranh vẽ, nơi gió biển mang theo vị mặn mòi phả vào tâm hồn.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Hơn cả một thiên đường nghỉ dưỡng, Vũng Tàu là bản giao hưởng của văn hóa và lịch sử. Hãy thử một lần chinh phục đỉnh núi Nhỏ để chạm tay vào Tượng Chúa Kitô Vua, hay ngắm nhìn toàn cảnh thành phố từ Ngọn Hải Đăng cổ kính. Len lỏi qua những con hẻm nhỏ, bạn sẽ bắt gặp những ngôi chùa thanh tịnh và những biệt thự kiến trúc Pháp cổ điển đầy hoài niệm.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                Và đừng quên nuông chiều vị giác với thiên đường ẩm thực nơi đây. Từ chiếc bánh khọt vàng ươm giòn rụm, nồi lẩu cá đuối chua cay đậm đà, đến những bữa tiệc hải sản tươi ngon ngay bên bờ sóng. Dù là nhâm nhi ly cà phê ngắm hoàng hôn buông xuống hay hòa mình vào cuộc sống về đêm sôi động, Vũng Tàu luôn biết cách níu chân du khách bằng những trải nghiệm chân thật nhất.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
             <button
  onClick={() => setIsModalOpen(true)}
  className="group inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold backdrop-blur transition-all duration-300 hover:shadow-xl hover:scale-[1.04]"
>
  <span className="text-sm uppercase tracking-wide whitespace-nowrap">
    Khám phá ngay
  </span>
  <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-all" />
</button>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/50 backdrop-blur-lg">

          {/* Click backdrop to close */}
          <div 
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal container */}
          <div 
            className="
              relative w-full max-w-5xl h-screen md:h-[92vh]
              bg-gradient-to-b from-[#F8FBFF] via-white to-white
              md:rounded-[2.5rem]
              shadow-[0_40px_120px_-40px_rgba(0,0,0,0.25)]
              flex flex-col
              animate-in fade-in slide-in-from-bottom-6 zoom-in-95
              duration-300
            "
          >

            {/* Header (sticky, không scroll) */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 py-5 bg-white/80 backdrop-blur-xl border-b border-slate-100 rounded-t-[2.5rem]">
              <div className="text-sm uppercase tracking-widest text-teal-600 font-semibold">
                Vũng Tàu
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="
                  p-2 rounded-full
                  bg-slate-100 hover:bg-slate-200
                  transition-all duration-300
                  shadow-sm hover:shadow-md
                  group
                "
              >
                <X className="w-5 h-5 text-slate-600 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Scrollable content – CHỈ CHỖ NÀY ĐƯỢC SCROLL */}
            <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 md:py-14 scroll-smooth">
              
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 uppercase">
                  Thành Phố Vũng Tàu
                </h2>
                <p className="mt-5 text-xl md:text-2xl text-teal-600 font-light italic">
                  Bản giao hưởng giữa biển, lịch sử và nhịp sống hiện đại
                </p>
                <div className="mt-8 flex justify-center">
                  <span className="h-1.5 w-24 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400" />
                </div>
              </div>

              <div className="space-y-20 text-slate-700 leading-relaxed text-lg">
                 {/* Section 1: Overview */}
                 <section className="space-y-5">
                   <h3 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                     <MapPin className="w-6 h-6 text-teal-500" />
                     Giới thiệu tổng quan
                   </h3>
                   <p className="mb-4">Thành phố Vũng Tàu là một trong những đô thị biển nổi tiếng nhất miền Nam Việt Nam, thuộc tỉnh Bà Rịa – Vũng Tàu. Nằm cách TP.HCM khoảng 90 km, Vũng Tàu từ lâu đã trở thành điểm đến quen thuộc cho du khách trong và ngoài nước nhờ lợi thế biển đẹp, khí hậu ôn hòa, hạ tầng phát triển và bề dày lịch sử độc đáo.</p>
                   <p>Không ồn ào như các đô thị lớn, Vũng Tàu mang trong mình một nhịp sống vừa đủ chậm để nghỉ dưỡng, vừa đủ nhanh để phát triển kinh tế, du lịch và dịch vụ. Thành phố này là nơi giao thoa hài hòa giữa thiên nhiên, văn hóa biển và dấu ấn lịch sử qua nhiều thời kỳ.</p>
                 </section>

                 {/* Section 2: History */}
                 <section className="rounded-3xl bg-slate-50 p-8 md:p-10 space-y-5">
                   <h3 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                     <History className="w-6 h-6 text-teal-500" />
                     Lịch sử hình thành và phát triển
                   </h3>
                   <p className="mb-4">Tên gọi Vũng Tàu bắt nguồn từ thời xa xưa, khi nơi đây là vùng neo đậu tàu thuyền của ngư dân. Trước thế kỷ XVII, khu vực này chủ yếu là làng chài nhỏ ven biển, người dân sinh sống bằng nghề đánh bắt hải sản.</p>
                   <p className="mb-4">Đến thời nhà Nguyễn, Vũng Tàu bắt đầu giữ vai trò chiến lược quan trọng trong giao thương và phòng thủ biển. Dưới thời Pháp thuộc, thành phố được quy hoạch bài bản, trở thành khu nghỉ dưỡng cao cấp dành cho giới chức và thương nhân châu Âu. Những công trình kiến trúc cổ như Bạch Dinh, ngọn Hải Đăng Vũng Tàu hay hệ thống biệt thự ven biển vẫn còn tồn tại đến ngày nay như những chứng nhân lịch sử.</p>
                   <p>Sau năm 1975, Vũng Tàu bước vào giai đoạn phát triển mạnh mẽ, đặc biệt từ khi trở thành trung tâm dầu khí quốc gia. Từ một thành phố nghỉ mát, Vũng Tàu vươn mình thành đô thị biển hiện đại, đa ngành, đa lĩnh vực.</p>
                 </section>

                 {/* Section 3: Geography */}
                 <section className="space-y-5">
                   <h3 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                     <Mountain className="w-6 h-6 text-teal-500" />
                     Vị trí địa lý và điều kiện tự nhiên
                   </h3>
                   <p className="mb-4">Vũng Tàu sở hữu vị trí địa lý đặc biệt với ba mặt giáp biển, tạo nên hệ thống bãi biển đẹp trải dài từ trung tâm đến ngoại ô. Khí hậu nơi đây mang đặc trưng nhiệt đới gió mùa, nắng nhiều, ít bão, nhiệt độ trung bình quanh năm khoảng 25–27°C, rất lý tưởng cho du lịch và nghỉ dưỡng.</p>
                   <p>Thành phố có hai ngọn núi lớn là Núi Lớn và Núi Nhỏ, tạo nên địa hình độc đáo hiếm có ở các đô thị ven biển Việt Nam. Sự kết hợp giữa núi, biển và đô thị giúp Vũng Tàu luôn mang lại cảm giác thoáng đãng, dễ chịu.</p>
                 </section>

                 {/* Section 4: Highlights */}
                 <section className="space-y-8">
                   <h3 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                     <Camera className="w-6 h-6 text-teal-500" />
                     Những điểm du lịch nổi bật
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                       { title: "Bãi Sau (Bãi Thùy Vân)", desc: "Bãi biển nổi tiếng nhất với đường bờ biển dài, cát mịn và sóng vừa phải. Khu vực tập trung nhiều khách sạn, resort." },
                       { title: "Bãi Trước", desc: "Mang vẻ đẹp trầm lắng, thích hợp ngắm hoàng hôn. Gắn liền với nhiều công trình lịch sử và quảng trường trung tâm." },
                       { title: "Tượng Chúa Kitô Vua", desc: "Biểu tượng du lịch trên Núi Nhỏ. Cao hơn 30m, nơi du khách có thể phóng tầm mắt ngắm toàn cảnh thành phố." },
                       { title: "Hải đăng Vũng Tàu", desc: "Ngọn hải đăng cổ từ thế kỷ XIX, điểm check-in yêu thích với tầm nhìn rộng và không khí trong lành." },
                       { title: "Bạch Dinh", desc: "Công trình kiến trúc Pháp cổ, từng là nơi nghỉ dưỡng của toàn quyền Đông Dương. Lý tưởng cho người yêu lịch sử." }
                     ].map((item, idx) => (
                       <div 
                         key={idx} 
                         className="
                           rounded-2xl p-6
                           bg-white
                           shadow-sm hover:shadow-xl
                           transition-all duration-300
                           hover:-translate-y-1
                         "
                       >
                         <h4 className="font-semibold text-teal-700 mb-2">{item.title}</h4>
                         <p className="text-slate-600 text-base">{item.desc}</p>
                       </div>
                     ))}
                   </div>
                 </section>

                 {/* Section 5: Culture */}
                 <section className="rounded-3xl bg-teal-50 p-8 md:p-10 space-y-5">
                   <h3 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                     <Users className="w-6 h-6 text-teal-500" />
                     Văn hóa – Con người
                   </h3>
                   <p className="mb-4">Người Vũng Tàu mang đậm tính cách của cư dân miền biển: thân thiện, cởi mở, phóng khoáng và hiếu khách. Văn hóa biển thể hiện rõ qua các lễ hội truyền thống như Lễ Nghinh Ông, cầu cho mưa thuận gió hòa, đánh bắt bội thu.</p>
                   <p>Ẩm thực Vũng Tàu cũng là điểm nhấn khó quên với các món đặc sản như bánh khọt, hải sản tươi sống, lẩu cá đuối, hàu nướng, ốc biển đa dạng. Mỗi món ăn đều phản ánh sự gần gũi giữa con người và biển cả.</p>
                 </section>

                 {/* Section 6: Modern City */}
                 <section className="space-y-5">
                   <h3 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                     <Building2 className="w-6 h-6 text-teal-500" />
                     Thành phố hiện đại và năng động
                   </h3>
                   <p className="mb-4">Ngày nay, Vũng Tàu không chỉ là thành phố du lịch mà còn là trung tâm kinh tế quan trọng của khu vực Đông Nam Bộ. Hệ thống hạ tầng giao thông ngày càng hoàn thiện với cao tốc Biên Hòa – Vũng Tàu, cảng biển quốc tế Cái Mép – Thị Vải và các dự án đô thị quy mô lớn.</p>
                   <p className="mb-4 font-medium">Thành phố đang thu hút mạnh mẽ đầu tư vào các lĩnh vực:</p>
                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                     {["Du lịch nghỉ dưỡng cao cấp", "Bất động sản ven biển", "Dịch vụ – thương mại", "Công nghiệp dầu khí và logistics"].map((item, idx) => (
                       <li key={idx} className="flex items-center gap-2 text-slate-700">
                         <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                         {item}
                       </li>
                     ))}
                   </ul>
                   <p>Sự phát triển này giúp Vũng Tàu vừa giữ được nét đẹp tự nhiên, vừa mang diện mạo của một đô thị biển hiện đại, đáng sống.</p>
                 </section>

                 {/* Section 7: Why Choose */}
                 <section className="border-t border-slate-200 pt-14 space-y-8">
                   <h3 className="text-2xl font-bold text-center text-slate-900">Vì sao nên chọn Vũng Tàu làm điểm đến?</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[
                       "Khoảng cách gần TP.HCM, dễ di chuyển",
                       "Biển đẹp, khí hậu dễ chịu quanh năm",
                       "Đa dạng loại hình du lịch: nghỉ dưỡng, tâm linh, ẩm thực",
                       "Hạ tầng hiện đại, dịch vụ ngày càng chuyên nghiệp",
                       "Phù hợp cho du lịch ngắn ngày, dài ngày hoặc đầu tư lâu dài"
                     ].map((reason, idx) => (
                       <div key={idx} className="flex items-start gap-3">
                         <CheckCircle2 className="w-5 h-5 text-teal-500 mt-1" />
                         <span className="font-medium">{reason}</span>
                       </div>
                     ))}
                   </div>
                 </section>
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </section>
  );
}
