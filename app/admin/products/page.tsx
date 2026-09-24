'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Search, Watch, Check, X, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Product, ProductVariant, WatchCollection, MovementType } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [collection, setCollection] = useState<WatchCollection>('Men');
  const [basePrice, setBasePrice] = useState(380);
  const [movement, setMovement] = useState<MovementType>('Automatic');
  const [caseDiameter, setCaseDiameter] = useState('40mm');
  const [strapMaterial, setStrapMaterial] = useState('Italian Leather');
  const [dialColor, setDialColor] = useState('Obsidian Black');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'
  );

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      sku: 'FAR-VAR-1',
      colorName: 'Midnight Black',
      colorHex: '#111111',
      bandMaterial: 'Italian Leather',
      caseSize: '40mm',
      price: 380,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchProducts = () => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setProducts(res.products);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setDescription('');
    setCollection('Men');
    setBasePrice(380);
    setMovement('Automatic');
    setCaseDiameter('40mm');
    setStrapMaterial('Italian Leather');
    setDialColor('Obsidian Black');
    setFeaturedImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80');
    setVariants([
      {
        sku: 'FAR-' + Date.now().toString().slice(-4) + '-BLK',
        colorName: 'Midnight Black',
        colorHex: '#111111',
        bandMaterial: 'Italian Leather',
        caseSize: '40mm',
        price: 380,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setDescription(p.description);
    setCollection(p.collection);
    setBasePrice(p.basePrice);
    setMovement(p.movement);
    setCaseDiameter(p.caseDiameter);
    setStrapMaterial(p.strapMaterial);
    setDialColor(p.dialColor);
    setFeaturedImage(p.featuredImage);
    setVariants(p.variants && p.variants.length > 0 ? p.variants : []);
    setIsModalOpen(true);
  };

  const handleDelete = async (slugOrId: string) => {
    if (!confirm('Are you certain you wish to delete this timepiece from catalog?')) return;
    try {
      const res = await fetch(`/api/v1/products/${slugOrId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      name,
      slug: generatedSlug,
      description,
      shortDescription: description.slice(0, 120) + '...',
      collectionName: collection,
      collection,
      basePrice: Number(basePrice),
      movement,
      caseDiameter,
      strapMaterial,
      dialColor,
      featuredImage,
      images: [featuredImage],
      variants,
      status: 'active',
      isFeatured: true,
      isBestSeller: false,
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/v1/products/${editingProduct.slug || editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/v1/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const resData = await res.json();
      if (resData.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        setFeedback(resData.message || 'Error saving timepiece');
      }
    } catch (err: any) {
      setFeedback(err.message || 'Error communicating with server');
    } finally {
      setSaving(false);
    }
  };

  const addVariantRow = () => {
    setVariants([
      ...variants,
      {
        sku: 'FAR-' + Date.now().toString().slice(-4),
        colorName: 'Royal Silver',
        colorHex: '#D1D5DB',
        bandMaterial: 'Stainless Steel',
        caseSize: '40mm',
        price: basePrice,
        stock: 10,
        image: featuredImage,
      },
    ]);
  };

  const removeVariantRow = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.collection.toLowerCase().includes(q) || p.movement.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="hero-serif text-2xl sm:text-3xl text-text font-normal">
              Timepiece Catalog (CRUD)
            </h1>
            <p className="text-xs text-secondary mt-1">
              Manage luxury watch models, variant inventories, pricing, and movements.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={openCreateModal} className="flex items-center gap-1.5">
            <Plus size={16} /> Add New Timepiece
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-2.5 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter timepieces..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-border rounded-md text-text focus:outline-none focus:border-gold"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-secondary uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Watch Model</th>
                  <th className="py-3 px-4">Collection</th>
                  <th className="py-3 px-4">Caliber</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => {
                  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

                  return (
                    <tr key={product._id} className="hover:bg-surface/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-surface border border-border shrink-0">
                            <Image src={product.featuredImage} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-text">{product.name}</p>
                            <p className="text-[10px] text-secondary font-mono">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-text">{product.collection}</td>
                      <td className="py-3 px-4 text-secondary">{product.movement}</td>
                      <td className="py-3 px-4 font-bold text-text">${product.basePrice}</td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${totalStock <= 5 ? 'text-error' : 'text-text'}`}>
                          {totalStock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-secondary hover:text-gold rounded border border-border hover:border-gold"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug || product._id)}
                          className="p-1.5 text-secondary hover:text-error rounded border border-border hover:border-red-300"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: ADD / EDIT TIMEPIECE */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-base font-bold text-text uppercase tracking-wider">
                  {editingProduct ? 'Edit Timepiece' : 'Add New Master Timepiece'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-text">
                  <X size={18} />
                </button>
              </div>

              {feedback && (
                <div className="p-3 bg-red-50 text-error text-xs rounded border border-red-200">
                  {feedback}
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Model Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="FARHADIO Chrono Gold"
                      className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="farhadio-chrono-gold"
                      className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Hand-assembled luxury timepiece crafted from 316L steel..."
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Collection</label>
                    <select
                      value={collection}
                      onChange={(e) => setCollection(e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded bg-surface"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Smart">Smart</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Movement</label>
                    <select
                      value={movement}
                      onChange={(e) => setMovement(e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded bg-surface"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Quartz">Quartz</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Smart Digital">Smart Digital</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Base Price ($)</label>
                    <input
                      type="number"
                      required
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded bg-surface"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Case Diameter</label>
                    <input
                      type="text"
                      value={caseDiameter}
                      onChange={(e) => setCaseDiameter(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded bg-surface"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    required
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-surface"
                  />
                </div>

                {/* Variants Manager */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-text">
                      Product Variants & Stock ({variants.length})
                    </span>
                    <button
                      type="button"
                      onClick={addVariantRow}
                      className="text-xs text-gold hover:underline font-semibold"
                    >
                      + Add Variant
                    </button>
                  </div>

                  <div className="space-y-3">
                    {variants.map((v, idx) => (
                      <div key={idx} className="p-3 bg-surface rounded-md border border-border grid grid-cols-2 sm:grid-cols-6 gap-2 items-center">
                        <div>
                          <label className="text-[10px] text-secondary font-semibold block">Color Name</label>
                          <input
                            type="text"
                            value={v.colorName}
                            onChange={(e) => {
                              const n = [...variants];
                              n[idx].colorName = e.target.value;
                              setVariants(n);
                            }}
                            className="w-full px-2 py-1 text-xs border rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-secondary font-semibold block">Color Hex</label>
                          <input
                            type="text"
                            value={v.colorHex}
                            onChange={(e) => {
                              const n = [...variants];
                              n[idx].colorHex = e.target.value;
                              setVariants(n);
                            }}
                            className="w-full px-2 py-1 text-xs border rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-secondary font-semibold block">Case Size</label>
                          <input
                            type="text"
                            value={v.caseSize}
                            onChange={(e) => {
                              const n = [...variants];
                              n[idx].caseSize = e.target.value;
                              setVariants(n);
                            }}
                            className="w-full px-2 py-1 text-xs border rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-secondary font-semibold block">Price ($)</label>
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => {
                              const n = [...variants];
                              n[idx].price = Number(e.target.value);
                              setVariants(n);
                            }}
                            className="w-full px-2 py-1 text-xs border rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-secondary font-semibold block">Stock Units</label>
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => {
                              const n = [...variants];
                              n[idx].stock = Number(e.target.value);
                              setVariants(n);
                            }}
                            className="w-full px-2 py-1 text-xs border rounded bg-white"
                          />
                        </div>
                        <div className="pt-3">
                          <button
                            type="button"
                            onClick={() => removeVariantRow(idx)}
                            className="text-xs text-error hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end gap-2">
                  <Button variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit" isLoading={saving}>
                    {editingProduct ? 'Update Timepiece' : 'Publish Timepiece'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
