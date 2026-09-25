import axios from 'axios';

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
  images: string[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
 
}

// GET PRODUCTS
export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<ProductsResponse>(
    'https://dummyjson.com/products'
  );

  return response.data.products;
};

// UPDATE PRODUCT
export const updateProduct = async (
  id: number,
  productData: Partial<Product>
): Promise<Product> => {
  const response = await axios.put<Product>(
    `https://dummyjson.com/products/${id}`,
    productData
  );

  return response.data;
};
export const addProduct = async (
  product: Omit<Product, "id" | "rating" | "images">
): Promise<Product> => {
  const response = await axios.post<Product>(
    "https://dummyjson.com/products/add",
    product
  );

  return response.data;
};
// DELETE PRODUCT
export const deleteProduct = async (
  id: number
): Promise<Product> => {
  const response = await axios.delete<Product>(
    `https://dummyjson.com/products/${id}`
  );

  return response.data;
};