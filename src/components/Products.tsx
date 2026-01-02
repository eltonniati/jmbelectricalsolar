export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "550W Mono Solar Panel",
    description: "High-efficiency monocrystalline solar panel for residential and commercial use.",
    price: 2899.99,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "5kW Hybrid Inverter",
    description: "Hybrid solar inverter with battery backup support and WiFi monitoring.",
    price: 18999.99,
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "10kWh Lithium Battery",
    description: "Long-lasting lithium-ion battery for solar energy storage.",
    price: 45999.99,
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Solar Panel Mounting Kit",
    description: "Complete roof mounting system for 4-6 solar panels with all hardware.",
    price: 1499.99,
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "3kW Inverter",
    description: "Pure sine wave inverter ideal for small homes and backup power.",
    price: 8999.99,
    image: "https://images.unsplash.com/photo-1597079910443-60c43fc25754?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Solar Cable Kit (50m)",
    description: "UV-resistant solar cables with MC4 connectors for panel connections.",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=300&fit=crop",
  },
  {
    id: "7",
    name: "400W Poly Solar Panel",
    description: "Affordable polycrystalline panel perfect for budget installations.",
    price: 1899.99,
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=300&fit=crop",
  },
  {
    id: "8",
    name: "Solar Charge Controller 60A",
    description: "MPPT charge controller for efficient battery charging.",
    price: 2499.99,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
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
            Solar & Electrical Products
          </h2>
          <p className="text-muted-foreground mt-6">
            Quality solar panels, inverters, and accessories for your energy needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md hover:-translate-y-3 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-poppins font-semibold mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {product.description}
                </p>
                <div className="text-2xl font-bold text-accent mb-4">
                  R{product.price.toFixed(2)}
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
