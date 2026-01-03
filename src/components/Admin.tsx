import { useState } from "react";
import { Download, Plus, Trash2, LogOut, Shield, Package, FileText, ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
      
      // Update new product with file
      setNewProduct({
        ...newProduct,
        imageFile: file,
        imageUrl: `Uploaded: ${file.name}`
      });
      
      toast.success("Image uploaded successfully");
    }
  };

  const removeImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setNewProduct({
      ...newProduct,
      imageFile: undefined,
      imageUrl: ""
    });
  };

  const simulateImageUpload = (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would upload to a server and return a URL
        resolve(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newProduct.name)}&size=200&backgroundColor=007bff`);
      }, 1000);
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = newProduct.imageUrl;
    
    // If there's an image file, simulate upload (in real app, upload to server)
    if (newProduct.imageFile) {
      toast.loading("Uploading image...");
      try {
        imageUrl = await simulateImageUpload();
        toast.dismiss();
        toast.success("Image uploaded successfully");
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to upload image");
        return;
      }
    }

    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
      imageUrl
    };
    
    setProducts([...products, product]);
    setNewProduct({ name: "", price: 0, category: "", description: "", imageUrl: "" });
    removeImage(); // Clear preview
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
    setPreviewImage(product.imageUrl || null);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      let imageUrl = newProduct.imageUrl;
      
      // If there's a new image file, simulate upload
      if (newProduct.imageFile) {
        toast.loading("Uploading image...");
        try {
          imageUrl = await simulateImageUpload();
          toast.dismiss();
          toast.success("Image uploaded successfully");
        } catch (error) {
          toast.dismiss();
          toast.error("Failed to upload image");
          return;
        }
      }

      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...newProduct, 
              id: editingProduct.id, 
              imageUrl 
            }
          : p
      );
      
      setProducts(updatedProducts);
      setEditingProduct(null);
      setNewProduct({ name: "", price: 0, category: "", description: "", imageUrl: "" });
      removeImage(); // Clear preview
      toast.success("Product updated successfully");
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted");
  };

  const handleExportProducts = () => {
    // Remove File objects before exporting
    const exportableProducts = products.map(({ imageFile, ...rest }) => rest);
    const dataStr = JSON.stringify(exportableProducts, null, 2);
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
    // Remove File objects before exporting
    const exportableProducts = products.map(({ imageFile, ...rest }) => rest);
    const headers = ['ID', 'Name', 'Price', 'Category', 'Description', 'ImageURL'];
    const csvRows = [
      headers.join(','),
      ...exportableProducts.map(p => [
        p.id,
        `"${p.name}"`,
        p.price,
        `"${p.category}"`,
        `"${p.description}"`,
        `"${p.imageUrl || ''}"`
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
                      <th className="py-3 px-4 text-left">Product</th>
                      <th className="py-3 px-4 text-left">Category</th>
                      <th className="py-3 px-4 text-left">Price (R)</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {product.imageUrl ? (
                              <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.description}</p>
                            </div>
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
                  
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Image</label>
                    <div className="space-y-2">
                      {previewImage && (
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
                      )}
                      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {newProduct.imageFile && (
                        <p className="text-sm text-gray-600">
                          Selected: {newProduct.imageFile.name}
                        </p>
                      )}
                    </div>
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
