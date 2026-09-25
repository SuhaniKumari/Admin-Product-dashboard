"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  MoreHorizontal,
  Plus,
  Eye,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 4200 },
  { month: "Feb", sales: 5800 },
  { month: "Mar", sales: 4900 },
  { month: "Apr", sales: 7200 },
  { month: "May", sales: 6800 },
  { month: "Jun", sales: 8500 },
  { month: "Jul", sales: 9200 },
  { month: "Aug", sales: 8100 },
  { month: "Sep", sales: 10500 },
  { month: "Oct", sales: 11800 },
  { month: "Nov", sales: 12500 },
  { month: "Dec", sales: 14200 },
];

const recentOrders = [
  {
    id: "#ORD-1001",
    customer: "John Doe",
    product: "Wireless Headphones",
    amount: "$129.00",
    status: "Completed",
  },
  {
    id: "#ORD-1002",
    customer: "Sarah Wilson",
    product: "Smart Watch",
    amount: "$249.00",
    status: "Processing",
  },
  {
    id: "#ORD-1003",
    customer: "Michael Brown",
    product: "Gaming Keyboard",
    amount: "$89.00",
    status: "Completed",
  },
  {
    id: "#ORD-1004",
    customer: "Emily Davis",
    product: "Laptop Stand",
    amount: "$59.00",
    status: "Pending",
  },
  {
    id: "#ORD-1005",
    customer: "Robert Taylor",
    product: "USB-C Hub",
    amount: "$45.00",
    status: "Completed",
  },
];

const products = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    stock: 8,
    sales: 124,
  },
  {
    name: "Smart Watch",
    category: "Electronics",
    stock: 24,
    sales: 98,
  },
  {
    name: "Gaming Keyboard",
    category: "Accessories",
    stock: 42,
    sales: 76,
  },
  {
    name: "Laptop Stand",
    category: "Accessories",
    stock: 5,
    sales: 64,
  },
];

function StatCard({
  title,
  value,
  percentage,
  icon: Icon,
  iconClass,
  positive = true,
}: {
  title: string;
  value: string;
  percentage: string;
  icon: React.ElementType;
  iconClass: string;
  positive?: boolean;
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {value}
            </h3>

            <div className="mt-2 flex items-center gap-1 text-sm">
              {positive ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}

              <span
                className={
                  positive ? "text-emerald-600" : "text-red-500"
                }
              >
                {percentage}
              </span>

              <span className="text-muted-foreground">
                vs last month
              </span>
            </div>
          </div>

          <div className={`rounded-2xl p-3 ${iconClass}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800">
            <Eye className="h-4 w-4" />
            View Store
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$48,574"
          percentage="12.5%"
          icon={DollarSign}
          iconClass="bg-gradient-to-br from-violet-500 to-purple-600"
        />

        <StatCard
          title="Total Orders"
          value="1,248"
          percentage="8.2%"
          icon={ShoppingCart}
          iconClass="bg-gradient-to-br from-blue-500 to-cyan-500"
        />

        <StatCard
          title="Total Products"
          value="356"
          percentage="5.4%"
          icon={Package}
          iconClass="bg-gradient-to-br from-orange-500 to-amber-500"
        />

        <StatCard
          title="Customers"
          value="8,549"
          percentage="15.8%"
          icon={Users}
          iconClass="bg-gradient-to-br from-emerald-500 to-green-600"
        />
      </div>

      {/* Charts + Inventory */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* Sales Chart */}
        <Card className="border-0 shadow-sm xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales Overview</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Monthly sales performance
              </p>
            </div>

            <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </CardHeader>

          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `$${value / 1000}k`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value).toLocaleString()}`,
                      "Sales",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Status</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Product stock overview
                </p>
              </div>

              <Boxes className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {products.map((product) => {
              const lowStock = product.stock < 10;

              return (
                <div key={product.name}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {product.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        lowStock
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {product.stock} left
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        lowStock
                          ? "bg-red-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          product.stock * 2,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="mt-6 border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Latest orders from your customers
            </p>
          </div>

          <button className="text-sm font-medium text-indigo-600 hover:underline">
            View all
          </button>
        </CardHeader>

        <CardContent>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-0"
                  >
                    <td className="py-4 text-sm font-medium">
                      {order.id}
                    </td>

                    <td className="py-4 text-sm">
                      {order.customer}
                    </td>

                    <td className="py-4 text-sm text-muted-foreground">
                      {order.product}
                    </td>

                    <td className="py-4 text-sm font-semibold">
                      {order.amount}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border bg-white p-4 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      {order.id}
                    </p>

                    <p className="mt-1 text-sm">
                      {order.customer}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.product}
                    </p>
                  </div>

                  <span className="text-sm font-bold">
                    {order.amount}
                  </span>
                </div>

                <div className="mt-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}