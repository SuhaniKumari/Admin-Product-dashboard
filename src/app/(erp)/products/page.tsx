'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

import {
  Box,
  Chip,
  CircularProgress,
  Typography,
  Button
} from '@mui/material';

import AppTable, {
  AppTableColumn,
} from '@/src/components/Apptable';

import {
  getProducts,
  Product,
  deleteProduct,
updateProduct
} from '@/src/api/productapi';
import AddProductDialog from '@/src/features/products/Addproduct';
import { toast } from '@/components/ui/toast';
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
 const [showAddDialog, setShowAddDialog] = useState(false)
 const [showAddProduct, setShowAddProduct] = useState(false);
const categories = useMemo(() => {
  return Array.from(
    new Set(
      products.map(
        (product) => product.category
      )
    )
  ).sort();
}, [products]);
  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(
        'Failed to fetch products:',
        error
      );
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = async (product: Product) => {
  try {
    const updatedProduct = await updateProduct(product.id, {
      title: 'Updated Product',
      price: 500,
    });

    setProducts((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id
          ? updatedProduct
          : item
      )
    );
  } catch (error) {
    console.error('Failed to update product:', error);
  }
};
const handleDelete = async (product: Product) => {
  try {
    await deleteProduct(product.id);

    setProducts((prev) =>
      prev.filter((item) => item.id !== product.id)
    );
    toast.add({
  title: "Product Deleted!",
  
})
  } catch (error) {
    console.error('Failed to delete product:', error);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // Table columns
  const columns: AppTableColumn<Product>[] = [
    {
      id: 'id',
      label: 'ID',
      sortable: true,
      minWidth: 70,
    },
  {
  id: 'thumbnail',
  label: 'Image',
  minWidth: 100,

  render: (row) => (
    <Avatar
      variant="rounded"
      className="h-12 w-12"
    >
      <AvatarImage
        src={row.thumbnail}
        alt={row.title}
        className="object-cover"
      />

      <AvatarFallback>
        {row.title.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  ),
},

    {
      id: 'title',
      label: 'Product',
      sortable: true,
      minWidth: 220,

      render: (row) => (
        <Box>
          <Typography
            variant="body2"
           sx = {{ fontWeight: 600}}
          >
            {row.title}
          </Typography>

          
        </Box>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      sortable: true,
      minWidth: 220,

      render: (row) => (
        <Box>

          <Typography
            variant="body2"
            sx = {{ fontWeight: 600}}
          >
            {row.category}
          </Typography>
        </Box>
      ),
    },

    {
      id: 'price',
      label: 'Price',
      sortable: true,
      align: 'right',

      render: (row) => (
        <Typography sx = {{fontWeight : 600}}>
          ${row.price}
        </Typography>
      ),
    },

    {
      id: 'stock',
      label: 'Stock',
      sortable: true,
      align: 'center',

      render: (row) => (
        <Chip
          label={row.stock}
          size="small"
          color={
            row.stock > 20
              ? 'success'
              : row.stock > 0
                ? 'warning'
                : 'error'
          }
        />
      ),
    },

    {
      id: 'rating',
      label: 'Rating',
      sortable: true,
      align: 'center',

      render: (row) => (
        <Typography>
          ⭐ {row.rating}
        </Typography>
      ),
    },
  ];
const handleProductAdded = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev])
  }
  return (
  <Box sx={{ p: { xs: 2, sm: 3 } }}>

    {/* ================= DESKTOP ================= */}
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
      <AppTable
        title="Products"
        description="Manage and monitor all your products"
        columns={columns}
        rows={products}
        getRowId={(row) => row.id}
        loading={loading}
        searchPlaceholder="Search products..."
         filterLabel="Category"
  filterOptions={categories}
  filterValue={category}
  onFilterChange={setCategory}
        onAdd={() => {
          setShowAddDialog(true)
        }}
        addButtonText="Add Product"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>


    {/* ================= MOBILE ================= */}
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>

      {/* Mobile Header */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Products
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}
          >
            Manage and monitor all your products
          </Typography>
        </Box>

        <Button
          variant="contained"
            onClick={() => setShowAddDialog(true)}
        >
          Add Product
        </Button>
      </Box>


      {/* Loading */}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (

        /* Product Cards */
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {products.map((product) => (

            <Card key={product.id}>

             <CardHeader className="pb-3">
  <div className="flex items-start justify-between gap-3">

    {/* Product info */}
    <div className="flex min-w-0 items-center gap-3">

      {/* Product Image */}
      <Avatar
        variant="rounded"
        className="h-14 w-14 shrink-0"
      >
        <AvatarImage
          src={product.thumbnail}
          alt={product.title}
          className="object-cover"
        />

        <AvatarFallback>
          {product.title.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Title */}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          #{product.id}
        </p>

        <CardTitle className="truncate text-base">
          {product.title}
        </CardTitle>
      </div>

    </div>

    {/* Stock */}
    <Chip
      label={product.stock}
      size="small"
      color={
        product.stock > 20
          ? 'success'
          : product.stock > 0
            ? 'warning'
            : 'error'
      }
    />

  </div>
</CardHeader>


              <CardContent>

                {/* Category */}
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: 'text.secondary',
                    }}
                  >
                    Category
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                  >
                    {product.category}
                  </Typography>
                </Box>


                {/* Price + Rating */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: 'text.secondary',
                      }}
                    >
                      Price
                    </Typography>

                    <Typography
                      sx={{ fontWeight: 700 }}
                    >
                      ${product.price}
                    </Typography>
                  </Box>


                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: 'text.secondary',
                      }}
                    >
                      Rating
                    </Typography>

                    <Typography sx={{ fontWeight: 600 }}>
                      ⭐ {product.rating}
                    </Typography>
                  </Box>
                </Box>


                {/* Actions */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() =>
                      handleEdit(product)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      handleDelete(product)
                    }
                  >
                    Delete
                  </Button>
                </Box>

              </CardContent>

            </Card>

          ))}

          {/* Empty State */}
          {products.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 5,
              }}
            >
              <Typography color="text.secondary">
                No products found
              </Typography>
            </Box>
          )}

        </Box>
      )}

    </Box>
   <AddProductDialog
  open={showAddDialog}
  onOpenChange={setShowAddDialog}
  onProductAdded={handleProductAdded}
/>
  </Box>
  );
}