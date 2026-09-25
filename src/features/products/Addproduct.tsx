"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { addProduct, Product } from "@/src/api/productapi"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductAdded: (product: Product) => void
}

const AddProductDialog = ({
  open,
  onOpenChange,
  onProductAdded,
}: AddProductDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    thumbnail: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError("")
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      price: "",
      stock: "",
      thumbnail: "",
    })
    setError("")
  }

  const handleClose = () => {
    if (loading) return

    resetForm()
    onOpenChange(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError("Product name is required.")
      return
    }

    if (!formData.category.trim()) {
      setError("Category is required.")
      return
    }

    if (!formData.price) {
      setError("Price is required.")
      return
    }

    if (!formData.stock) {
      setError("Stock is required.")
      return
    }

    if (Number(formData.price) < 0) {
      setError("Price cannot be negative.")
      return
    }

    if (Number(formData.stock) < 0) {
      setError("Stock cannot be negative.")
      return
    }

    try {
      setLoading(true)
      setError("")

      const newProduct = await addProduct({
        title: formData.title.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        thumbnail:
          formData.thumbnail.trim() ||
          "https://dummyjson.com/image/150",
      })

      onProductAdded({
        ...newProduct,
        rating: newProduct.rating ?? 0,
      })

      resetForm()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to add product:", error)

      setError(
        error?.response?.data?.message ||
          "Failed to add product. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) {
          if (!value) {
            resetForm()
          }

          onOpenChange(value)
        }
      }}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Product
          </DialogTitle>

          <DialogDescription>
            Add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product name"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. smartphones"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Stock <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Image URL
            </label>

            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProductDialog