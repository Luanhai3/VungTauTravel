"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X, MapPin, History, Mountain, Camera, Users, Building2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function About() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [showCursor1, setShowCursor1] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
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
    <section id="about" className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={imageRef} className="relative order-2 lg:order-1 will-change-transform">
            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
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
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-100 rounded-full -z-10 blur-3xl opacity-50"></div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-4">
              <h4 className="text-primary-600 font-bold tracking-widest uppercase text-sm">
                Giới thiệu
              </h4>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight uppercase">
                {text1}
                {showCursor1 && <span className="animate-pulse">|</span>}
                <br />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                  {text2}
                </span>
                {!showCursor1 && <span className="animate-pulse text-primary-600">|</span>}
              </h2>
            </div>

            <div ref={textRef} className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
              <p 
                className={`transition-all duration-1000 ease-out transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Vũng Tàu không chỉ là điểm đến, mà là nơi đánh thức mọi giác quan. Chỉ cách TP.HCM 2 giờ di chuyển, thành phố biển này chào đón bạn bằng tiếng sóng vỗ rì rào tại Bãi Sau, vẻ đẹp thơ mộng của Bãi Trước và những cung đường ven biển đẹp như tranh vẽ, nơi gió biển mang theo vị mặn mòi phả vào tâm hồn.
              </p>
              <p 
                className={`transition-all duration-1000 ease-out transform delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Hơn cả một thiên đường nghỉ dưỡng, Vũng Tàu là bản giao hưởng của văn hóa và lịch sử. Hãy thử một lần chinh phục đỉnh núi Nhỏ để chạm tay vào Tượng Chúa Kitô Vua, hay ngắm nhìn toàn cảnh thành phố từ Ngọn Hải Đăng cổ kính. Len lỏi qua những con hẻm nhỏ, bạn sẽ bắt gặp những ngôi chùa thanh tịnh và những biệt thự kiến trúc Pháp cổ điển đầy hoài niệm.
              </p>
              <p 
                className={`transition-all duration-1000 ease-out transform delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Và đừng quên nuông chiều vị giác với thiên đường ẩm thực nơi đây. Từ chiếc bánh khọt vàng ươm giòn rụm, nồi lẩu cá đuối chua cay đậm đà, đến những bữa tiệc hải sản tươi ngon ngay bên bờ sóng. Dù là nhâm nhi ly cà phê ngắm hoàng hôn buông xuống hay hòa mình vào cuộc sống về đêm sôi động, Vũng Tàu luôn biết cách níu chân du khách bằng những trải nghiệm chân thật nhất.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-2 text-gray-900 font-bold uppercase tracking-wider hover:text-primary-600 transition-colors"
            >
              Khám phá ngay
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300 flex flex-col">
            <div className="sticky top-0 right-0 z-10 flex justify-end p-4 bg-gradient-to-b from-white via-white/90 to-transparent">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shadow-sm group"
              >
                <X className="w-6 h-6 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="px-6 pb-12 md:px-12 md:pb-16 -mt-6">
               <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight uppercase tracking-tight">
                   Thành Phố Vũng Tàu
                 </h2>
                 <p className="text-xl md:text-2xl text-primary-600 font-light italic">
                   Bản Giao Hưởng Giữa Biển, Lịch Sử Và Nhịp Sống Hiện Đại
                 </p>
                 <div className="w-24 h-1.5 bg-primary-600 mx-auto mt-8 rounded-full"></div>
               </div>

               <div className="space-y-12 text-gray-700 leading-relaxed text-lg">
                 {/* Section 1: Overview */}
                 <section>
                   <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                     <MapPin className="w-6 h-6 text-primary-600" />
                     Giới thiệu tổng quan
                   </h3>
                   <p className="mb-4">Thành phố Vũng Tàu là một trong những đô thị biển nổi tiếng nhất miền Nam Việt Nam, thuộc tỉnh Bà Rịa – Vũng Tàu. Nằm cách TP.HCM khoảng 90 km, Vũng Tàu từ lâu đã trở thành điểm đến quen thuộc cho du khách trong và ngoài nước nhờ lợi thế biển đẹp, khí hậu ôn hòa, hạ tầng phát triển và bề dày lịch sử độc đáo.</p>
                   <p>Không ồn ào như các đô thị lớn, Vũng Tàu mang trong mình một nhịp sống vừa đủ chậm để nghỉ dưỡng, vừa đủ nhanh để phát triển kinh tế, du lịch và dịch vụ. Thành phố này là nơi giao thoa hài hòa giữa thiên nhiên, văn hóa biển và dấu ấn lịch sử qua nhiều thời kỳ.</p>
                 </section>

                 {/* Section 2: History */}
                 <section className="bg-gray-50 p-6 rounded-2xl">
                   <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                     <History className="w-6 h-6 text-primary-600" />
                     Lịch sử hình thành và phát triển
                   </h3>
                   <p className="mb-4">Tên gọi Vũng Tàu bắt nguồn từ thời xa xưa, khi nơi đây là vùng neo đậu tàu thuyền của ngư dân. Trước thế kỷ XVII, khu vực này chủ yếu là làng chài nhỏ ven biển, người dân sinh sống bằng nghề đánh bắt hải sản.</p>
                   <p className="mb-4">Đến thời nhà Nguyễn, Vũng Tàu bắt đầu giữ vai trò chiến lược quan trọng trong giao thương và phòng thủ biển. Dưới thời Pháp thuộc, thành phố được quy hoạch bài bản, trở thành khu nghỉ dưỡng cao cấp dành cho giới chức và thương nhân châu Âu. Những công trình kiến trúc cổ như Bạch Dinh, ngọn Hải Đăng Vũng Tàu hay hệ thống biệt thự ven biển vẫn còn tồn tại đến ngày nay như những chứng nhân lịch sử.</p>
                   <p>Sau năm 1975, Vũng Tàu bước vào giai đoạn phát triển mạnh mẽ, đặc biệt từ khi trở thành trung tâm dầu khí quốc gia. Từ một thành phố nghỉ mát, Vũng Tàu vươn mình thành đô thị biển hiện đại, đa ngành, đa lĩnh vực.</p>
                 </section>

                 {/* Section 3: Geography */}
                 <section>
                   <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                     <Mountain className="w-6 h-6 text-primary-600" />
                     Vị trí địa lý và điều kiện tự nhiên
                   </h3>
                   <p className="mb-4">Vũng Tàu sở hữu vị trí địa lý đặc biệt với ba mặt giáp biển, tạo nên hệ thống bãi biển đẹp trải dài từ trung tâm đến ngoại ô. Khí hậu nơi đây mang đặc trưng nhiệt đới gió mùa, nắng nhiều, ít bão, nhiệt độ trung bình quanh năm khoảng 25–27°C, rất lý tưởng cho du lịch và nghỉ dưỡng.</p>
                   <p>Thành phố có hai ngọn núi lớn là Núi Lớn và Núi Nhỏ, tạo nên địa hình độc đáo hiếm có ở các đô thị ven biển Việt Nam. Sự kết hợp giữa núi, biển và đô thị giúp Vũng Tàu luôn mang lại cảm giác thoáng đãng, dễ chịu.</p>
                 </section>

                 {/* Section 4: Highlights */}
                 <section>
                   <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                     <Camera className="w-6 h-6 text-primary-600" />
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
                       <div key={idx} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                         <h4 className="font-bold text-lg text-primary-700 mb-2">{item.title}</h4>
                         <p className="text-gray-600 text-base">{item.desc}</p>
                       </div>
                     ))}
                   </div>
                 </section>

                 {/* Section 5: Culture */}
                 <section className="bg-primary-50 p-8 rounded-2xl">
                   <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                     <Users className="w-6 h-6 text-primary-600" />
                     Văn hóa – Con người
                   </h3>
                   <p className="mb-4">Người Vũng Tàu mang đậm tính cách của cư dân miền biển: thân thiện, cởi mở, phóng khoáng và hiếu khách. Văn hóa biển thể hiện rõ qua các lễ hội truyền thống như Lễ Nghinh Ông, cầu cho mưa thuận gió hòa, đánh bắt bội thu.</p>
                   <p>Ẩm thực Vũng Tàu cũng là điểm nhấn khó quên với các món đặc sản như bánh khọt, hải sản tươi sống, lẩu cá đuối, hàu nướng, ốc biển đa dạng. Mỗi món ăn đều phản ánh sự gần gũi giữa con người và biển cả.</p>
                 </section>

                 {/* Section 6: Modern City */}
                 <section>
                   <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                     <Building2 className="w-6 h-6 text-primary-600" />
                     Thành phố hiện đại và năng động
                   </h3>
                   <p className="mb-4">Ngày nay, Vũng Tàu không chỉ là thành phố du lịch mà còn là trung tâm kinh tế quan trọng của khu vực Đông Nam Bộ. Hệ thống hạ tầng giao thông ngày càng hoàn thiện với cao tốc Biên Hòa – Vũng Tàu, cảng biển quốc tế Cái Mép – Thị Vải và các dự án đô thị quy mô lớn.</p>
                   <p className="mb-4 font-medium">Thành phố đang thu hút mạnh mẽ đầu tư vào các lĩnh vực:</p>
                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                     {["Du lịch nghỉ dưỡng cao cấp", "Bất động sản ven biển", "Dịch vụ – thương mại", "Công nghiệp dầu khí và logistics"].map((item, idx) => (
                       <li key={idx} className="flex items-center gap-2 text-gray-700">
                         <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                         {item}
                       </li>
                     ))}
                   </ul>
                   <p>Sự phát triển này giúp Vũng Tàu vừa giữ được nét đẹp tự nhiên, vừa mang diện mạo của một đô thị biển hiện đại, đáng sống.</p>
                 </section>

                 {/* Section 7: Why Choose */}
                 <section className="border-t border-gray-200 pt-8">
                   <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vì sao nên chọn Vũng Tàu làm điểm đến?</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[
                       "Khoảng cách gần TP.HCM, dễ di chuyển",
                       "Biển đẹp, khí hậu dễ chịu quanh năm",
                       "Đa dạng loại hình du lịch: nghỉ dưỡng, tâm linh, ẩm thực",
                       "Hạ tầng hiện đại, dịch vụ ngày càng chuyên nghiệp",
                       "Phù hợp cho du lịch ngắn ngày, dài ngày hoặc đầu tư lâu dài"
                     ].map((reason, idx) => (
                       <div key={idx} className="flex items-start gap-3">
                         <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                         <span className="text-gray-700 font-medium">{reason}</span>
                       </div>
                     ))}
                   </div>
                 </section>
               </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
