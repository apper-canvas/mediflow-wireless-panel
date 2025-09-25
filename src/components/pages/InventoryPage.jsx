import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { medicineService } from "@/services/api/medicineService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const InventoryPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicineService.getAll();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (err) {
      setError("Failed to load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    let filtered = medicines;

    // Apply search filter
    if (searchTerm) {
filtered = filtered.filter(medicine =>
        medicine.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
filtered = filtered.filter(medicine => medicine.category_c === categoryFilter);
    }

    // Apply stock filter
if (stockFilter === "low") {
      filtered = filtered.filter(medicine => medicine.stock_c <= medicine.min_threshold_c);
    } else if (stockFilter === "out") {
      filtered = filtered.filter(medicine => medicine.stock_c === 0);
    }

    setFilteredMedicines(filtered);
  }, [searchTerm, categoryFilter, stockFilter, medicines]);

const getStockStatus = (medicine) => {
    if (medicine.stock_c === 0) return { status: "Out of Stock", variant: "error" };
    if (medicine.stock_c <= medicine.min_threshold_c) return { status: "Low Stock", variant: "warning" };
    return { status: "In Stock", variant: "success" };
  };

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow;
  };

  const getCategories = () => {
    const categories = [...new Set(medicines.map(m => m.category))];
    return categories.sort();
  };

const getLowStockCount = () => {
    return medicines.filter(m => m.stock_c <= m.min_threshold_c).length;
  };

const getOutOfStockCount = () => {
    return medicines.filter(m => m.stock_c === 0).length;
  };

const getTotalValue = () => {
    return medicines.reduce((sum, medicine) => sum + (medicine.stock_c * medicine.price_c), 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMedicines} />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Total Items</p>
                <p className="text-2xl font-bold text-primary-600">
                  {medicines.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Package" className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-warning-600">
                  {getLowStockCount()}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Out of Stock</p>
                <p className="text-2xl font-bold text-error-600">
                  {getOutOfStockCount()}
                </p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="XCircle" className="w-6 h-6 text-error-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold text-success-600">
                  ${getTotalValue().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory List */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Package" className="w-6 h-6" />
              Medicine Inventory
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBar
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">All Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <Button className="flex items-center gap-2">
                <ApperIcon name="Plus" className="w-4 h-4" />
                Add Medicine
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMedicines.length === 0 ? (
            <Empty
              title="No medicines found"
              description="Start by adding your first medicine or try adjusting your search criteria."
              icon="Package"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">Medicine</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">Expiry</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((medicine, index) => {
                    const stockStatus = getStockStatus(medicine);
                    const expiringSoon = isExpiringSoon(medicine.expiryDate);
                    
                    return (
                      <tr
                        key={medicine.Id}
                        className={`border-b border-secondary-100 hover:bg-secondary-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-secondary-25"
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-primary-500 rounded-lg flex items-center justify-center">
                              <ApperIcon name="Pill" className="w-5 h-5 text-white" />
                            </div>
                            <div>
<div className="font-medium text-secondary-900">{medicine.name_c}</div>
                              <div className="text-sm text-secondary-500">Min: {medicine.min_threshold_c}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-secondary-600">
                          <Badge variant="secondary" className="text-xs">
                            {medicine.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
<span className={`font-semibold ${
                            medicine.stock_c === 0 ? "text-error-600" :
                            medicine.stock_c <= medicine.min_threshold_c ? "text-warning-600" :
                            "text-success-600"
                          }`}>
                            {medicine.stock_c}
                          </span>
                        </td>
<td className="py-4 px-4 text-secondary-900">
                          ${medicine.price_c?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-4 px-4">
<div className={`text-sm ${expiringSoon ? "text-warning-600" : "text-secondary-600"}`}>
                            {medicine.expiry_date_c && !isNaN(new Date(medicine.expiry_date_c)) ? format(new Date(medicine.expiry_date_c), "MMM dd, yyyy") : "Invalid date"}
                            {expiringSoon && (
                              <div className="flex items-center gap-1 mt-1">
                                <ApperIcon name="AlertTriangle" className="w-3 h-3" />
                                <span className="text-xs">Expiring Soon</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={stockStatus.variant} className="text-xs">
                            {stockStatus.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <ApperIcon name="Edit" className="w-3 h-3" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button size="sm" variant="ghost" className="flex items-center gap-1 text-primary-600">
                              <ApperIcon name="Plus" className="w-3 h-3" />
                              <span className="hidden sm:inline">Restock</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;