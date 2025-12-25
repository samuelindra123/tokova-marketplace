import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    isActive: boolean;
    sortOrder: number;
    children?: Category[];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', parentId: '', sortOrder: 0 });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/admin/categories?includeInactive=true');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            // Only include parentId if it's not empty
            const payload = {
                name: formData.name,
                sortOrder: formData.sortOrder,
                ...(formData.parentId ? { parentId: formData.parentId } : {}),
            };

            if (editingCategory) {
                await api.put(`/admin/categories/${editingCategory.id}`, payload);
            } else {
                await api.post('/admin/categories', payload);
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', parentId: '', sortOrder: 0 });
            fetchCategories();
        } catch (err) {
            console.error('Failed to save category:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are your sure your want to delete this category?')) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            fetchCategories();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete category');
        }
    };

    const toggleActive = async (category: Category) => {
        try {
            await api.put(`/admin/categories/${category.id}`, { isActive: !category.isActive });
            fetchCategories();
        } catch (err) {
            console.error('Failed to toggle category:', err);
        }
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, parentId: '', sortOrder: category.sortOrder });
        setShowModal(true);
    };

    const flatCategories = categories.flatMap(c => [c, ...(c.children || [])]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
                    <p className="text-slate-500">Manage product categories</p>
                </div>
                <button
                    onClick={() => { setEditingCategory(null); setFormData({ name: '', parentId: '', sortOrder: 0 }); setShowModal(true); }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500"
                >
                    + Add Category
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No categories yet</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {categories.map((category) => (
                            <CategoryRow
                                key={category.id}
                                category={category}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                                onToggle={toggleActive}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">
                            {editingCategory ? 'Edit Category' : 'New Category'}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Parent Category</label>
                                <select
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">None (Top Level)</option>
                                    {flatCategories.filter(c => c.id !== editingCategory?.id).map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                                <input
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CategoryRow({
    category,
    onEdit,
    onDelete,
    onToggle,
    level = 0
}: {
    category: Category;
    onEdit: (c: Category) => void;
    onDelete: (id: string) => void;
    onToggle: (c: Category) => void;
    level?: number;
}) {
    return (
        <>
            <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50" style={{ paddingLeft: `${24 + level * 24}px` }}>
                <div className="flex items-center gap-3">
                    {level > 0 && <span className="text-slate-300">└</span>}
                    <div>
                        <p className="font-medium text-slate-900">{category.name}</p>
                        <p className="text-sm text-slate-500">{category.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onToggle(category)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${category.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                            }`}
                    >
                        {category.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => onEdit(category)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Edit
                    </button>
                    <button onClick={() => onDelete(category.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Delete
                    </button>
                </div>
            </div>
            {category.children?.map((child) => (
                <CategoryRow
                    key={child.id}
                    category={child}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                    level={level + 1}
                />
            ))}
        </>
    );
}
