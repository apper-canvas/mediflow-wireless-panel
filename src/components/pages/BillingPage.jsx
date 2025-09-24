import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { billService } from "@/services/api/billService";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const BillingPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [billsData, patientsData] = await Promise.all([
        billService.getAll(),
        patientService.getAll()
      ]);
      
      setBills(billsData);
      setFilteredBills(billsData);
      setPatients(patientsData);
    } catch (err) {
      setError("Failed to load billing information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = bills;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(bill => {
        const patient = patients.find(p => p.Id === parseInt(bill.patientId));
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "";
        
        return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               bill.Id.toString().includes(searchTerm);
      });
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }

    setFilteredBills(filtered);
  }, [searchTerm, statusFilter, bills, patients]);

  const handlePaymentUpdate = async (billId, status) => {
    try {
      const bill = bills.find(b => b.Id === billId);
      const updateData = {
        ...bill,
        status,
        paidAt: status === "paid" ? new Date().toISOString().split("T")[0] : null
      };
      
      await billService.update(billId, updateData);
      toast.success(`Bill marked as ${status}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update payment status");
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === parseInt(patientId));
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "paid": return "success";
      case "pending": return "warning";
      case "overdue": return "error";
      default: return "default";
    }
  };

  const getTotalRevenue = () => {
    return bills
      .filter(bill => bill.status === "paid")
      .reduce((sum, bill) => sum + bill.totalAmount, 0);
  };

  const getPendingAmount = () => {
    return bills
      .filter(bill => bill.status === "pending")
      .reduce((sum, bill) => sum + bill.totalAmount, 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-success-600">
                  ${getTotalRevenue().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Pending Amount</p>
                <p className="text-2xl font-bold text-warning-600">
                  ${getPendingAmount().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Total Bills</p>
                <p className="text-2xl font-bold text-primary-600">
                  {bills.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CreditCard" className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bills List */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="CreditCard" className="w-6 h-6" />
              Billing & Payments
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBar
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
              <Button className="flex items-center gap-2">
                <ApperIcon name="Plus" className="w-4 h-4" />
                Create Bill
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBills.length === 0 ? (
            <Empty
              title="No bills found"
              description="Start by creating your first bill or try adjusting your search criteria."
              icon="CreditCard"
            />
          ) : (
            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <div
                  key={bill.Id}
                  className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:shadow-md hover:border-primary-300 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="Receipt" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">
                        Bill #{bill.Id}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-secondary-600">
                        <span className="flex items-center gap-1">
                          <ApperIcon name="User" className="w-3 h-3" />
                          {getPatientName(bill.patientId)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Calendar" className="w-3 h-3" />
                          {format(new Date(bill.date), "MMM dd, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="DollarSign" className="w-3 h-3" />
                          ${bill.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getStatusVariant(bill.status)} className="text-xs capitalize">
                          {bill.status}
                        </Badge>
                        {bill.paidAt && (
                          <span className="text-xs text-secondary-500">
                            Paid on {format(new Date(bill.paidAt), "MMM dd, yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bill.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handlePaymentUpdate(bill.Id, "paid")}
                        className="flex items-center gap-1 bg-success-600 hover:bg-success-700"
                      >
                        <ApperIcon name="Check" className="w-3 h-3" />
                        <span className="hidden sm:inline">Mark Paid</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ApperIcon name="Eye" className="w-3 h-3" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-primary-600"
                    >
                      <ApperIcon name="Download" className="w-3 h-3" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;