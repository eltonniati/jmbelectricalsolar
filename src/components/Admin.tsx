import { useState, useRef } from "react";
import { Download, Plus, Trash2, LogOut, Shield, Package, FileText, ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";

// Match the Product interface from your products page
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Changed from imageUrl to image
}

interface AdminProps {
  onLogout: () => void;
  onBackToSite: () => void;
  onUpdateProducts: (products: Product[]) => void; // New prop to update products in parent
}

const Admin = ({ onLogout, onBackToSite, onUpdateProducts }: AdminProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [products, setProducts] = useState<Product[]>([
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
  ]);
  
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    image: "",
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update parent component when products change
  const updateProductsAndNotify = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    onUpdateProducts(updatedProducts); // Notify parent component
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "jmb2024") {
      setIsAuthenticated(true);
      toast.success("Welcome to Admin Panel");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      // For now, we'll keep it as a preview and store a placeholder
      // In a real app, you would upload this to a server and get a URL
      setNewProduct({
        ...newProduct,
        image: `Uploaded: ${file.name} - (In real app, this would be server URL)`
      });
      
      toast.success("Image uploaded successfully - Note: In full implementation, this would upload to server");
    }
  };

  const removeImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setNewProduct({
      ...newProduct,
      image: ""
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, if image is a file upload message, use a placeholder
    let finalImage = newProduct.image;
    if (newProduct.image.startsWith("Uploaded:")) {
      // Use a placeholder image from Unsplash based on product name
      const encodedName = encodeURIComponent(newProduct.name);
      finalImage = `https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop&text=${encodedName}`;
    }
    
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
      image: finalImage
    };
    
    const updatedProducts = [...products, product];
    updateProductsAndNotify(updatedProducts);
    
    // Reset form
    setNewProduct({ name: "", description: "", price: 0, image: "" });
    removeImage();
    toast.success("Product added successfully");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image || "",
    });
    setPreviewImage(product.image || null);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      let finalImage = newProduct.image;
      if (newProduct.image.startsWith("Uploaded:")) {
        const encodedName = encodeURIComponent(newProduct.name);
        finalImage = `https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop&text=${encodedName}`;
      }
      
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...newProduct, 
              id: editingProduct.id, 
              image: finalImage
            }
          : p
      );
      
      updateProductsAndNotify(updatedProducts);
      setEditingProduct(null);
      setNewProduct({ name: "", description: "", price: 0, image: "" });
      removeImage();
      toast.success("Product updated successfully");
    }
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    updateProductsAndNotify(updatedProducts);
    toast.success("Product deleted");
  };

  const handleExportProducts = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solar-products-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Products exported as JSON");
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'Price', 'Image'];
    const csvRows = [
      headers.join(','),
      ...products.map(p => [
        p.id,
        `"${p.name}"`,
        `"${p.description}"`,
        p.price,
        `"${p.image}"`
      ].join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solar-products-${new Date().toISOString().split('T')[0]}.csv`;
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
            // Validate imported products match the Product interface
            const validProducts = importedProducts.filter(p => 
              p.id && p.name && p.description && p.price !== undefined && p.image
            );
            
            if (validProducts.length === importedProducts.length) {
              updateProductsAndNotify(importedProducts);
              toast.success("Products imported successfully");
            } else {
              toast.error("Some products have invalid format. Please check your JSON file.");
            }
          } else {
            toast.error("Invalid file format. Expected an array of products.");
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
              <p className="text-sm text-gray-600">Manage solar and electrical products</p>
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
                  Solar & Electrical Products ({products.length} products)
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
                      <th className="py-3 px-4 text-left">Product</th>
                      <th className="py-3 px-4 text-left">Price (R)</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-primary">R{product.price.toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-500 hover:text-blue-700 px-3 py-1 border border-blue-500 rounded hover:bg-blue-50 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
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
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      required
                    />
                  </div>
                  
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Image *</label>
                    <div className="space-y-2">
                      {previewImage ? (
                        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : newProduct.image ? (
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={newProduct.image}
                            alt="Current"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : null}
                      
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <div className="flex items-center justify-center gap-2">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Upload Image</span>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        
                        <div className="text-center text-xs text-gray-500">
                          OR
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium mb-1">Image URL *</label>
                          <input
                            type="url"
                            value={newProduct.image}
                            onChange={(e) => {
                              setNewProduct({...newProduct, image: e.target.value});
                              if (previewImage) {
                                URL.revokeObjectURL(previewImage);
                                setPreviewImage(null);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="https://example.com/image.jpg"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter image URL or upload a file
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary/90 transition-colors mt-4"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setNewProduct({ name: "", description: "", price: 0, image: "" });
                        removeImage();
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
