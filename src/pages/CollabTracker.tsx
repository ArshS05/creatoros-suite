import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  Search,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Download,
  ExternalLink,
  Building2,
  TrendingUp,
  X,
  Trash2,
  Edit,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createCollab, getCollabs, updateCollab, deleteCollab } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Deal {
  id: string;
  brand: string;
  campaign: string | null;
  value: number | null;
  status: string;
  deliverables: string[] | null;
  deadline: string | null;
  payment_status: string | null;
  contract_signed: boolean | null;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  negotiating: { label: "Negotiating", color: "bg-amber-500/10 text-amber-500", icon: Clock },
  contracted: { label: "Contracted", color: "bg-primary/10 text-primary", icon: FileText },
  "in-progress": { label: "In Progress", color: "bg-cyan-500/10 text-cyan-500", icon: TrendingUp },
  delivered: { label: "Delivered", color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
  paid: { label: "Paid", color: "bg-emerald-600/10 text-emerald-600", icon: DollarSign },
  completed: { label: "Completed", color: "bg-emerald-600/10 text-emerald-600", icon: CheckCircle2 },
};

const paymentStatusColors: Record<string, string> = {
  pending: "text-muted-foreground",
  invoiced: "text-amber-500",
  paid: "text-emerald-500",
};

export default function CollabTracker() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    brand: "",
    campaign: "",
    value: "",
    status: "negotiating",
    deliverables: "",
    deadline: "",
    payment_status: "pending",
    contract_signed: false,
    notes: "",
  });

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await getCollabs();
      setDeals(data || []);
    } catch (error) {
      console.error("Failed to load deals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      campaign: "",
      value: "",
      status: "negotiating",
      deliverables: "",
      deadline: "",
      payment_status: "pending",
      contract_signed: false,
      notes: "",
    });
  };

  const handleCreate = async () => {
    if (!formData.brand.trim()) {
      toast({ title: "Please enter a brand name", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      await createCollab({
        brand: formData.brand,
        campaign: formData.campaign || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        status: formData.status,
        deliverables: formData.deliverables.split(",").map(d => d.trim()).filter(Boolean),
        deadline: formData.deadline || undefined,
        payment_status: formData.payment_status,
        contract_signed: formData.contract_signed,
        notes: formData.notes || undefined,
      });
      toast({ title: "Deal created!" });
      setShowAddModal(false);
      resetForm();
      loadDeals();
    } catch (error) {
      console.error("Failed to create deal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingDeal) return;

    setIsSaving(true);
    try {
      await updateCollab(editingDeal.id, {
        brand: formData.brand,
        campaign: formData.campaign || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        status: formData.status,
        deliverables: formData.deliverables.split(",").map(d => d.trim()).filter(Boolean),
        deadline: formData.deadline || undefined,
        payment_status: formData.payment_status,
        contract_signed: formData.contract_signed,
        notes: formData.notes || undefined,
      });
      toast({ title: "Deal updated!" });
      setShowEditModal(false);
      setEditingDeal(null);
      resetForm();
      loadDeals();
    } catch (error) {
      console.error("Failed to update deal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCollab(id);
      setDeals(deals.filter(d => d.id !== id));
      toast({ title: "Deal deleted" });
    } catch (error) {
      console.error("Failed to delete deal:", error);
    }
  };

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      brand: deal.brand,
      campaign: deal.campaign || "",
      value: deal.value?.toString() || "",
      status: deal.status,
      deliverables: deal.deliverables?.join(", ") || "",
      deadline: deal.deadline || "",
      payment_status: deal.payment_status || "pending",
      contract_signed: deal.contract_signed || false,
      notes: deal.notes || "",
    });
    setShowEditModal(true);
  };

  const handleMarkComplete = async (deal: Deal) => {
    try {
      await updateCollab(deal.id, { status: "completed", payment_status: "paid" });
      loadDeals();
      toast({ title: "Deal marked as completed!" });
    } catch (error) {
      console.error("Failed to update deal:", error);
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesStatus = selectedStatus === "all" || deal.status === selectedStatus;
    const matchesSearch = deal.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.campaign?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalValue = deals.reduce((acc, deal) => acc + (deal.value || 0), 0);
  const pendingPayments = deals
    .filter(d => d.payment_status !== "paid")
    .reduce((acc, deal) => acc + (deal.value || 0), 0);
  const activeDeals = deals.filter(d => ["contracted", "in-progress"].includes(d.status)).length;

  const FormModal = ({ isEdit }: { isEdit: boolean }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{isEdit ? "Edit Deal" : "Add New Deal"}</h2>
          <button onClick={() => { isEdit ? setShowEditModal(false) : setShowAddModal(false); resetForm(); }} className="p-2 hover:bg-secondary rounded-lg">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Brand Name *</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g., Nike, Apple..."
              className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Campaign</label>
            <input
              type="text"
              value={formData.campaign}
              onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
              placeholder="Campaign name..."
              className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Value ($)</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="5000"
                className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Deliverables</label>
            <input
              type="text"
              value={formData.deliverables}
              onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
              placeholder="1x Instagram Post, 2x TikTok..."
              className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="negotiating">Negotiating</option>
                <option value="contracted">Contracted</option>
                <option value="in-progress">In Progress</option>
                <option value="delivered">Delivered</option>
                <option value="paid">Paid</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Payment Status</label>
              <select
                value={formData.payment_status}
                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-secondary border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Pending</option>
                <option value="invoiced">Invoiced</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="contract"
              checked={formData.contract_signed}
              onChange={(e) => setFormData({ ...formData, contract_signed: e.target.checked })}
              className="w-5 h-5 rounded border-border"
            />
            <label htmlFor="contract" className="text-sm font-medium text-foreground">Contract Signed</label>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1" onClick={() => { isEdit ? setShowEditModal(false) : setShowAddModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button 
            variant="default" 
            className="flex-1 gap-2" 
            onClick={isEdit ? handleUpdate : handleCreate}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEdit ? "Update Deal" : "Add Deal"
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Modals */}
        {showAddModal && <FormModal isEdit={false} />}
        {showEditModal && <FormModal isEdit={true} />}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Collab Tracker</h1>
            <p className="text-muted-foreground mt-1">Track deals, payments, deadlines, and contracts</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="default" className="gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Add Deal
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <DollarSign className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${pendingPayments.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeDeals}</p>
                <p className="text-sm text-muted-foreground">Active Deals</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10">
                <TrendingUp className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{deals.length}</p>
                <p className="text-sm text-muted-foreground">Total Deals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deals..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedStatus("all")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                selectedStatus === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  selectedStatus === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Empty State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No deals yet</h3>
            <p className="text-muted-foreground mb-4">Start tracking your brand collaborations!</p>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Deal
            </Button>
          </div>
        ) : (
          <>
            {/* Deals Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Brand</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaign</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Value</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Deadline</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Payment</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contract</th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDeals.map((deal) => {
                      const config = statusConfig[deal.status] || statusConfig.negotiating;
                      const StatusIcon = config.icon;
                      return (
                        <tr key={deal.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-background" />
                              </div>
                              <span className="font-medium text-foreground">{deal.brand}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-foreground">{deal.campaign || "-"}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {deal.deliverables?.length || 0} deliverables
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-emerald-500">
                              ${(deal.value || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                              config.color
                            )}>
                              <StatusIcon className="w-3 h-3" />
                              {config.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {deal.deadline ? new Date(deal.deadline).toLocaleDateString() : "-"}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "text-sm font-medium capitalize",
                              paymentStatusColors[deal.payment_status || "pending"]
                            )}>
                              {deal.payment_status || "pending"}
                            </span>
                          </td>
                          <td className="p-4">
                            {deal.contract_signed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-amber-500" />
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {deal.status !== "completed" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleMarkComplete(deal)}
                                  title="Mark as completed"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openEditModal(deal)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(deal.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timeline View */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Upcoming Deadlines</h3>
              <div className="space-y-4">
                {deals
                  .filter(d => d.status !== "paid" && d.status !== "completed" && d.deadline)
                  .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
                  .slice(0, 4)
                  .map((deal) => {
                    const config = statusConfig[deal.status] || statusConfig.negotiating;
                    return (
                      <div
                        key={deal.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30"
                      >
                        <div className="w-12 text-center">
                          <p className="text-2xl font-bold text-foreground">
                            {new Date(deal.deadline!).getDate()}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {new Date(deal.deadline!).toLocaleString('default', { month: 'short' })}
                          </p>
                        </div>
                        <div className="h-12 w-px bg-border" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{deal.brand} - {deal.campaign}</p>
                          <p className="text-sm text-muted-foreground">
                            {deal.deliverables?.join(", ") || "No deliverables"}
                          </p>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          config.color
                        )}>
                          {config.label}
                        </span>
                      </div>
                    );
                  })}
                {deals.filter(d => d.status !== "paid" && d.status !== "completed" && d.deadline).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No upcoming deadlines</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
