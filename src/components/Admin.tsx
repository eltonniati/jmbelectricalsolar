import { useState, useRef, useEffect } from "react";
import { Download, Plus, Trash2, LogOut, Shield, Package, FileText, ArrowLeft, Upload, X, Image, Camera, ShoppingCart, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock_quantity?: number;
  is_active?: boolean;
}

interface CompletedJob {
  id: string;
  title: string;
  location: string;
  image: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

interface AdminProps {
  onLogout: () => void;
  onBackToSite: () => void;
  onUpdateProducts: (products: Product[]) => void;
}

const Admin = ({ onLogout, onBackToSite, onUpdateProducts }: AdminProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<'products' | 'jobs' | 'orders'>('products');
  const [isLoading, setIsLoading] = useState(false);
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    image: "",
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Completed jobs state
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [newJob, setNewJob] = useState<Omit<CompletedJob, "id">>({
    title: "",
    location: "",
    image: "",
    description: "",
  });
  const [editingJob, setEditingJob] = useState<CompletedJob | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch products from database
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } else {
      setProducts(data || []);
      onUpdateProducts(data || []);
    }
  };

  // Fetch completed jobs from database
  const fetchCompletedJobs = async () => {
    const { data, error } = await supabase
      .from('completed_jobs')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load completed jobs');
    } else {
      setCompletedJobs(data || []);
    }
  };

  // Fetch orders from database
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } else {
      setOrders(data || []);
    }
  };

  // Fetch order items for a specific order
  const fetchOrderItems = async (orderId: string) => {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (error) {
      console.error('Error fetching order items:', error);
      return [];
    }
    return data || [];
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchCompletedJobs();
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "jmb2024") {
      setIsAuthenticated(true);
      toast.success("Welcome to Admin Panel");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt !== 'jpg' && fileExt !== 'jpeg' && fileExt !== 'png') {
        toast.error("Only JPG and PNG images are allowed");
        return null;
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload image');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG and PNG images are allowed");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setSelectedFile(file);
    }
  };

  const removeImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setSelectedFile(null);
    if (activeTab === 'products') {
      setNewProduct({ ...newProduct, image: "" });
    } else if (activeTab === 'jobs') {
      setNewJob({ ...newJob, image: "" });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Product CRUD operations
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let finalImage = newProduct.image;
    
    if (selectedFile) {
      const uploadedUrl = await uploadImageToStorage(selectedFile);
      if (uploadedUrl) {
        finalImage = uploadedUrl;
      } else {
        setIsLoading(false);
        return;
      }
    }

    if (!finalImage) {
      toast.error("Please provide an image URL or upload an image");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('products')
      .insert({
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        image: finalImage,
        stock_quantity: 0,
        is_active: true,
      });

    if (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } else {
      toast.success("Product added successfully");
      setNewProduct({ name: "", description: "", price: 0, image: "" });
      removeImage();
      fetchProducts();
    }
    setIsLoading(false);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsLoading(true);

    let finalImage = newProduct.image;
    
    if (selectedFile) {
      const uploadedUrl = await uploadImageToStorage(selectedFile);
      if (uploadedUrl) {
        finalImage = uploadedUrl;
      } else {
        setIsLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        image: finalImage,
      })
      .eq('id', editingProduct.id);

    if (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } else {
      toast.success("Product updated successfully");
      setEditingProduct(null);
      setNewProduct({ name: "", description: "", price: 0, image: "" });
      removeImage();
      fetchProducts();
    }
    setIsLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } else {
      toast.success("Product deleted");
      fetchProducts();
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description || "",
      price: product.price,
      image: product.image || "",
    });
    setPreviewImage(product.image || null);
    setSelectedFile(null);
  };

  // Completed Jobs CRUD operations
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let finalImage = newJob.image;
    
    if (selectedFile) {
      const uploadedUrl = await uploadImageToStorage(selectedFile);
      if (uploadedUrl) {
        finalImage = uploadedUrl;
      } else {
        setIsLoading(false);
        return;
      }
    }

    if (!finalImage) {
      toast.error("Please provide an image URL or upload an image");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('completed_jobs')
      .insert({
        title: newJob.title,
        location: newJob.location,
        image: finalImage,
        description: newJob.description,
        sort_order: completedJobs.length + 1,
        is_active: true,
      });

    if (error) {
      console.error('Error adding job:', error);
      toast.error('Failed to add completed job');
    } else {
      toast.success("Completed job added successfully");
      setNewJob({ title: "", location: "", image: "", description: "" });
      removeImage();
      fetchCompletedJobs();
    }
    setIsLoading(false);
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    setIsLoading(true);

    let finalImage = newJob.image;
    
    if (selectedFile) {
      const uploadedUrl = await uploadImageToStorage(selectedFile);
      if (uploadedUrl) {
        finalImage = uploadedUrl;
      } else {
        setIsLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from('completed_jobs')
      .update({
        title: newJob.title,
        location: newJob.location,
        image: finalImage,
        description: newJob.description,
      })
      .eq('id', editingJob.id);

    if (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update completed job');
    } else {
      toast.success("Completed job updated successfully");
      setEditingJob(null);
      setNewJob({ title: "", location: "", image: "", description: "" });
      removeImage();
      fetchCompletedJobs();
    }
    setIsLoading(false);
  };

  const handleDeleteJob = async (id: string) => {
    const { error } = await supabase
      .from('completed_jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete completed job');
    } else {
      toast.success("Completed job deleted");
      fetchCompletedJobs();
    }
  };

  const handleEditJob = (job: CompletedJob) => {
    setEditingJob(job);
    setNewJob({
      title: job.title,
      location: job.location,
      image: job.image || "",
      description: job.description || "",
    });
    setPreviewImage(job.image || null);
    setSelectedFile(null);
    setActiveTab('jobs');
  };

  // Order operations
  const handleViewOrder = async (order: Order) => {
    const items = await fetchOrderItems(order.id);
    setSelectedOrder({ ...order, order_items: items });
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } else {
      toast.success("Order status updated");
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <p className="text-sm text-gray-600">Manage products, jobs & orders</p>
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

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="inline w-5 h-5 mr-2" />
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === 'jobs'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Camera className="inline w-5 h-5 mr-2" />
              Completed Jobs ({completedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingCart className="inline w-5 h-5 mr-2" />
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <h2 className="text-xl font-poppins font-bold flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Products
                  </h2>
                  <button
                    onClick={handleExportProducts}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    <Download size={18} />
                    Export JSON
                  </button>
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
                            <span className="font-bold text-primary">R{Number(product.price).toFixed(2)}</span>
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
                      <label className="block text-sm font-medium mb-1">Product Image (JPG/PNG only) *</label>
                      
                      {previewImage ? (
                        <div className="relative mb-2">
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-40 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors mb-2"
                        >
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-400">JPG or PNG only, max 5MB</p>
                        </div>
                      )}
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      
                      <p className="text-xs text-gray-500 mt-2">Or enter image URL:</p>
                      <input
                        type="url"
                        value={newProduct.image}
                        onChange={(e) => {
                          setNewProduct({...newProduct, image: e.target.value});
                          if (e.target.value) {
                            setPreviewImage(e.target.value);
                            setSelectedFile(null);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || uploadingImage}
                      className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {uploadingImage ? 'Uploading...' : isLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
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
        )}

        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-poppins font-bold mb-6 flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  Completed Jobs Gallery
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-gray-200">
                        <img 
                          src={job.image} 
                          alt={job.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.location}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditJob(job)}
                            className="text-blue-500 hover:text-blue-700 px-3 py-1 border border-blue-500 rounded hover:bg-blue-50 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h2 className="text-xl font-poppins font-bold mb-6 flex items-center gap-2">
                  {editingJob ? 'Edit Job' : 'Add Completed Job'}
                  <Plus className="w-6 h-6" />
                </h2>
                <form onSubmit={editingJob ? handleUpdateJob : handleAddJob}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Job Title *</label>
                      <input
                        type="text"
                        value={newJob.title}
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., Solar Installation - Residential"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location *</label>
                      <input
                        type="text"
                        value={newJob.location}
                        onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., Johannesburg, Gauteng"
                        required
                      />
                    </div>
                    
                    {/* Image Upload Section */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Job Image (JPG/PNG only) *</label>
                      
                      {previewImage ? (
                        <div className="relative mb-2">
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-40 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors mb-2"
                        >
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-400">JPG or PNG only, max 5MB</p>
                        </div>
                      )}
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      
                      <p className="text-xs text-gray-500 mt-2">Or enter image URL:</p>
                      <input
                        type="url"
                        value={newJob.image}
                        onChange={(e) => {
                          setNewJob({...newJob, image: e.target.value});
                          if (e.target.value) {
                            setPreviewImage(e.target.value);
                            setSelectedFile(null);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description (optional)</label>
                      <textarea
                        value={newJob.description}
                        onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        placeholder="Brief description of the project..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading || uploadingImage}
                      className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {uploadingImage ? 'Uploading...' : isLoading ? 'Saving...' : editingJob ? 'Update Job' : 'Add Completed Job'}
                    </button>
                    {editingJob && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingJob(null);
                          setNewJob({ title: "", location: "", image: "", description: "" });
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
        )}

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-poppins font-bold mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  Customer Orders
                </h2>

                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-4 text-left">Order Date</th>
                          <th className="py-3 px-4 text-left">Customer</th>
                          <th className="py-3 px-4 text-left">Total</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              {new Date(order.created_at).toLocaleDateString('en-ZA', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-gray-600">{order.customer_email}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-primary">R{Number(order.total_amount).toFixed(2)}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="text-blue-500 hover:text-blue-700 px-3 py-1 border border-blue-500 rounded hover:bg-blue-50 transition-colors text-sm flex items-center gap-1"
                              >
                                <Eye size={14} />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              {selectedOrder ? (
                <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                  <h2 className="text-xl font-poppins font-bold mb-4">Order Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="font-medium">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.customer_email}</p>
                    </div>
                    {selectedOrder.customer_phone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedOrder.customer_phone}</p>
                      </div>
                    )}
                    {selectedOrder.customer_address && (
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{selectedOrder.customer_address}</p>
                      </div>
                    )}
                    {selectedOrder.notes && (
                      <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="font-medium">{selectedOrder.notes}</p>
                      </div>
                    )}
                    
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-500 mb-2">Order Items</p>
                      {selectedOrder.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between py-2 border-b">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-gray-600">
                              R{Number(item.product_price).toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold">R{Number(item.subtotal).toFixed(2)}</p>
                        </div>
                      ))}
                      <div className="flex justify-between py-3 font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">R{Number(selectedOrder.total_amount).toFixed(2)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Update Status</label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="w-full bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                  <h2 className="text-xl font-poppins font-bold mb-4">Order Summary</h2>
                  <div className="space-y-4 text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-300" />
                    <p className="text-gray-500">Select an order to view details</p>
                    
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{orders.length}</p>
                          <p className="text-sm text-gray-500">Total Orders</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">
                            {orders.filter(o => o.status === 'pending').length}
                          </p>
                          <p className="text-sm text-gray-500">Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;