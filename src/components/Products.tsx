import { SunMedium, BatteryCharging, Lightbulb, Wrench } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Solar Panel Kit",
    description:
      "Complete 300W solar panel kit with inverter and mounting hardware.",
    price: 299.99,
    icon: SunMedium,
  },
  {
    id: "2",
    name: "EV Home Charger",
    description:
      "Level 2 electric vehicle home charging station with smart features.",
    price: 549.99,
    icon: BatteryCharging,
  },
  {
    id: "3",
    name: "LED Smart Bulbs (Pack of 4)",
    description:
      "Energy efficient smart bulbs compatible with Alexa and Google Home.",
    price: 39.99,
    icon: Lightbulb,
  },
  {
    id: "4",
    name: "Electrician Tool Kit",
    description:
      "Professional-grade tool set for electrical work, including voltage tester.",
    price: 189.99,
    icon: Wrench,
  },
];

interface ProductsProps {
  onAddToCart: (product: Product) => void;
}

const Products = ({ onAddToCart }: ProductsProps) => {
  return (
    <section id="products" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-secondary relative inline-block section-title-underline pb-4">
            Shop Electrical Items
          </h2>
          <p className="text-muted-foreground mt-6">
            Quality electrical products for DIY and professional use
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md hover:-translate-y-3 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                <product.icon className="w-32 h-32 text-muted-foreground/50 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-poppins font-semibold mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {product.description}
                </p>
                <div className="text-2xl font-bold text-accent mb-4">
                  ${product.price.toFixed(2)}
                </div>
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-accent text-accent-foreground py-3 rounded font-semibold hover:bg-accent/90 hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
