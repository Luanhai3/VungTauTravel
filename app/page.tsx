import { Suspense } from "react";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import PlaceCard from "@/components/PlaceCard";
import { getPlaces } from "@/lib/supabase/queries";
import ParallaxSection from "@/components/ParallaxSection";
import DepthCard from "@/components/DepthCard";
import StickySection from "@/components/StickySection";
import SlowSection from "@/components/SlowSection";
import FastSection from "@/components/FastSection";
import TextReveal from "@/components/TextReveal";
import TextParallax from "@/components/TextParallax";
import SceneSection from "@/components/SceneSection";
import AtmosphereSection from "@/components/AtmosphereSection";

async function FeaturedGrid() {
  const places = await getPlaces();

  return (
    <div className="perspective grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {places.slice(0, 6).map((place, i) => {
        const depthLevels = [0.3, 1.1, 0.5, 1.3, 0.4, 0.9];

        return (
          <DepthCard key={place.id} depth={depthLevels[i % depthLevels.length]}>
            <PlaceCard place={place} index={i} showCategory />
          </DepthCard>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero
        title="Khám phá Vũng Tàu"
        subtitle="Bãi biển, ẩm thực, cà phê và những địa điểm check-in đẹp nhất tại viên ngọc ven biển của Việt Nam."
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920"
        priority
      />

<SceneSection>
  <StickySection>
    <SlowSection>
      <TextParallax speed={0.4}>
        <div className="mx-auto max-w-5xl text-center leading-relaxed">
          <TextReveal>
            <h2 className="mb-10 text-7xl font-extrabold text-shimmer">
              Tại Sao Chọn Vũng Tàu?
            </h2>
          </TextReveal>
          <TextReveal delay={0.3}>
            <p className="text-xl text-white/80">
              Từ Bạch Dinh cổ kính nằm trên sườn Núi Lớn, tượng Chúa Kitô dang tay ôm trọn biển trời,
              đến Bãi Trước yên bình và Bãi Sau rì rào sóng vỗ, Vũng Tàu mang trong mình sự giao thoa
              giữa lịch sử, thiên nhiên và nhịp sống hiện đại.
            </p>
          </TextReveal>

          <TextReveal delay={0.6}>
            <p className="mt-6 text-xl text-white/80">
              Thành phố biển này không chỉ nổi tiếng với hải sản tươi ngon, những quán cà phê trên cao
              ngắm trọn hoàng hôn, mà còn là nơi lý tưởng cho những chuyến đi ngắn ngày rời xa phố thị.
            </p>
          </TextReveal>

          <TextReveal delay={0.9}>
            <p className="mt-6 text-xl text-white/80">
              Chỉ vài giờ di chuyển từ Sài Gòn, bạn đã có thể hít hà vị mặn của gió biển, tản bộ trên
              con đường ven biển lộng gió, và lưu lại những khoảnh khắc check-in đầy cảm hứng giữa
              thiên nhiên và kiến trúc độc đáo.
            </p>
          </TextReveal>

          <TextReveal delay={1.2}>
            <p className="mt-6 text-xl text-white/80">
              Vũng Tàu là điểm đến hoàn hảo cho một cuối tuần thư giãn, một buổi hẹn hò lãng mạn,
              hay đơn giản là chuyến đi để làm mới tâm hồn.
            </p>
          </TextReveal>
        </div>
      </TextParallax>
    </SlowSection>
  </StickySection>
</SceneSection>

<AtmosphereSection />

<SceneSection>
  <Section title="Featured spots" subtitle="Places, food & check-in ideas">
    <ParallaxSection>
      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-64 animate-pulse rounded-2xl bg-glass" />
            <div className="h-64 animate-pulse rounded-2xl bg-glass" />
            <div className="h-64 animate-pulse rounded-2xl bg-glass" />
          </div>
        }
      >
        <FeaturedGrid />
      </Suspense>
    </ParallaxSection>
  </Section>
</SceneSection>

    </>
  );
}
