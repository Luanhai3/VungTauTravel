import Hero from "@/components/Hero";
import Weather from "@/components/Weather";
import About from "@/components/About";
import Categories from "@/components/Categories";
import FeaturedPlaces from "@/components/FeaturedPlaces";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Weather />
      <About />
      <Categories />
      <FeaturedPlaces />
      <Gallery />
      <Footer />
    </main>
  );
}
