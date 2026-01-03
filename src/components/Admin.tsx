import { useState } from "react";
import { Download, Plus, Trash2, LogOut, Shield, Package, FileText, ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
}

interface AdminProps {
  onLogout: () => void;
  onBackToSite: () => void;
}

const Admin = ({ onLogout, onBackToSite }: AdminProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Circuit Breaker", price: 450, category: "Safety", description: "20A Circuit Breaker" },
    { id: "2", name: "LED Light Bulb", price: 85, category: "Lighting", description: "15W LED Bulb" },
    { id: "3", name: "Electrical Wire", price: 320, category: "Wiring", description: "2.5mm Copper Wire" },
    { id: "4", name: "Solar Panel", price: 2500, category: "Solar", description: "400W Monocrystalline Panel" },
    { id: "5", name: "EV Charger", price: 8500, category: "EV", description: "Level 2 Home Charger" },
  ]);
  
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    category: "",
    description: "",
    imageUrl: "",
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "jmb2024") {
      setIsAuthenticated(true);
      toast.success("Welcome to Admin Panel");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
    };
    setProducts([...products, product]);
    setNewProduct({ name: "", price: 0, category: "", description: "", imageUrl: "" });
    toast.success("Product added successfully");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl || "",
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...newProduct, id: editingProduct.id }
          : p
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
      setNewProduct({ name: "", price: 0, category: "", description: "", imageUrl: "" });
      toast.success("Product updated successfully");
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted");
  };

  const handleExportProducts = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jmb-products-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Products exported as JSON");
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Price', 'Category', 'Description'];
    const csvRows = [
      headers.join(','),
      ...products.map(p => [
        p.id,
        `"${p.name}"`,
        p.price,
        `"${p.category}"`,
        `"${p.description}"`
      ].join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jmb-products-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Products exported as CSV");
  };

  const handleImportProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedProducts = JSON.parse(event.target?.result as string);
          if (Array.isArray(importedProducts)) {
            setProducts(importedProducts);
            toast.success("Products imported successfully");
          }
        } catch (error) {
          toast.error("Failed to import products. Invalid file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-poppins font-bold text-gray-800">JMB ELECTRICAL Admin</h2>
            <p className="text-gray-600 mt-2">Enter credentials to access admin panel</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary/90 transition-colors mb-4"
            >
              Login to Admin
            </button>
            <button
              type="button"
              onClick={onBackToSite}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-poppins font-bold">JMB ELECTRICAL Admin Panel</h1>
              <p className="text-sm text-gray-600">Manage products and inventory</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Site
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-poppins font-bold flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Product Management ({products.length} products)
                </h2>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                    <Upload size={18} />
                    Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportProducts}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleExportProducts}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    <Download size={18} />
                    Export JSON
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                  >
                    <FileText size={18} />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left">Product Name</th>
                      <th className="py-3 px-4 text-left">Category</th>
                      <th className="py-3 px-4 text-left">Price (R)</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-primary">R{product.price.toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-poppins font-bold mb-6 flex items-center gap-2">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
                <Plus className="w-6 h-6" />
              </h2>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (R) *</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Wiring">Wiring</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Safety">Safety</option>
                      <option value="Solar">Solar</option>
                      <option value="EV">EV Chargers</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                    <input
                      type="url"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setNewProduct({ name: "", price: 0, category: "", description: "", imageUrl: "" });
                      }}
                      className="w-full bg-gray-200 text-gray-700 py-3 rounded font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
