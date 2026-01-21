import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/api';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unit_price: number;
  stock: number;
  reorder_level: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unit_price: '',
    stock: '',
    reorder_level: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      unit_price: '',
      stock: '',
      reorder_level: '',
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      unit_price: String(product.unit_price),
      stock: String(product.stock),
      reorder_level: String(product.reorder_level),
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.unit_price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        unit_price: parseFloat(formData.unit_price),
        stock: parseInt(formData.stock) || 0,
        reorder_level: parseInt(formData.reorder_level) || 10,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        alert('Product updated successfully');
      } else {
        await createProduct(payload);
        alert('Product created successfully');
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(id);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStockStatus = (stock: number, reorder: number) => {
    if (stock <= 0)
      return { text: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (stock <= reorder)
      return { text: 'Low Stock', color: 'bg-orange-100 text-orange-700' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Products</h1>
          <p className='text-gray-600 mt-2'>Manage your inventory products</p>
        </div>
        <button
          onClick={handleAdd}
          className='bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700'
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <Search size={20} className='text-gray-400' />
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {loading ? (
          <div className='text-center py-8 text-gray-500'>Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            No products found
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 px-4 text-gray-600 font-semibold'>
                    Product Name
                  </th>
                  <th className='text-left py-3 px-4 text-gray-600 font-semibold'>
                    SKU
                  </th>
                  <th className='text-left py-3 px-4 text-gray-600 font-semibold'>
                    Category
                  </th>
                  <th className='text-left py-3 px-4 text-gray-600 font-semibold'>
                    Price
                  </th>
                  <th className='text-left py-3 px-4 text-gray-600 font-semibold'>
                    Stock
                  </th>
                  <th className='text-left py-3 px-4 text-gray-600 font-semibold'>
                    Status
                  </th>
                  <th className='text-left py-3 px-4 text-gray-600 font-semibold'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(
                    product.stock,
                    product.reorder_level,
                  );
                  return (
                    <tr
                      key={product.id}
                      className='border-b border-gray-100 hover:bg-gray-50'
                    >
                      <td className='py-3 px-4 text-gray-900 font-medium'>
                        {product.name}
                      </td>
                      <td className='py-3 px-4 text-gray-600'>{product.sku}</td>
                      <td className='py-3 px-4 text-gray-600'>
                        {product.category}
                      </td>
                      <td className='py-3 px-4 text-gray-900'>
                        ${product.unit_price.toFixed(2)}
                      </td>
                      <td className='py-3 px-4 text-gray-900'>
                        {product.stock} units
                      </td>
                      <td className='py-3 px-4'>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td className='py-3 px-4'>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleEdit(product)}
                            className='text-blue-600 hover:text-blue-800 p-1'
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className='text-red-600 hover:text-red-800 p-1'
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Product Name *
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    SKU *
                  </label>
                  <input
                    type='text'
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category
                  </label>
                  <input
                    type='text'
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Unit Price ($) *
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={formData.unit_price}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_price: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Stock Quantity
                  </label>
                  <input
                    type='number'
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Reorder Level
                  </label>
                  <input
                    type='number'
                    value={formData.reorder_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reorder_level: e.target.value,
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='flex gap-4 mt-6'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium'
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
