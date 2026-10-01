const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Whipped Shea & Rosehip Body Butter",
      slug: "whipped-shea-rosehip-body-butter",
      description:
        "A thick, cloud-whipped butter built on raw shea and cold-pressed rosehip oil. Melts in on contact, leaves skin soft without sitting greasy.",
      priceKobo: 850000, // ₦8,500
      imageUrl: "https://res.cloudinary.com/demo/image/upload/shea_butter.jpg",
      stock: 40
    },
    {
      name: "Golden Hour Glow Oil",
      slug: "golden-hour-glow-oil",
      description:
        "Dry-touch facial and body oil with marula, jojoba and a trace of 24k mica for a soft shimmer. A few drops after moisturizer.",
      priceKobo: 1200000, // ₦12,000
      imageUrl: "https://res.cloudinary.com/demo/image/upload/glow_oil.jpg",
      stock: 25
    },
    {
      name: "Coffee & Clay Polishing Scrub",
      slug: "coffee-clay-polishing-scrub",
      description:
        "Fine-ground Nigerian coffee and kaolin clay buff away rough patches without tearing at skin. Rinse-clean, no oily film.",
      priceKobo: 700000, // ₦7,000
      imageUrl: "https://res.cloudinary.com/demo/image/upload/coffee_scrub.jpg",
      stock: 60
    },
    {
      name: "Rose Clay Hydrating Mask",
      slug: "rose-clay-hydrating-mask",
      description:
        "A gentler clay mask cut with rosewater and glycerin, made for skin that clay usually leaves tight. Ten minutes, rinse, glow.",
      priceKobo: 950000, // ₦9,500
      imageUrl: "https://res.cloudinary.com/demo/image/upload/rose_mask.jpg",
      stock: 30
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
