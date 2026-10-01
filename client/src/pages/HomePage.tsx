import Hero from "@/components/Hero";
import BrandTicker from "@/components/BrandTicker";
import ProductGrid from "@/components/ProductGrid";
import SkincareRitual from "@/components/SkincareRitual";
import IngredientsSection from "@/components/IngredientsSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import NewsletterSection from "@/components/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandTicker />
      <ProductGrid />
      <SkincareRitual />
      <IngredientsSection />
      <ReviewsSection />
      <FAQSection />
      <NewsletterSection />
    </>
  );
}
