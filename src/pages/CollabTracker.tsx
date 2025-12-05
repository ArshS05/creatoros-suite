import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  Filter,
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
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Deal {
  id: string;
  brand: string;
  campaign: string;
  value: number;
  status: "negotiating" | "contracted" | "in-progress" | "delivered" | "paid";
  deliverables: string[];
  deadline: string;
  paymentStatus: "pending" | "invoiced" | "paid";
  contractSigned: boolean;
}

const sampleDeals: Deal[] = [
  {
    id: "1",
    brand: "Nike",
    campaign: "Summer Sportswear Launch",
    value: 8500,
    status: "in-progress",
    deliverables: ["2x Instagram Reels", "1x YouTube Video", "3x Stories"],
    deadline: "Dec 20, 2024",
    paymentStatus: "pending",
    contractSigned: true,
  },
  {
    id: "2",
    brand: "Glossier",
    campaign: "Holiday Collection",
    value: 3000,
    status: "contracted",
    deliverables: ["1x Instagram Post", "2x TikTok"],
    deadline: "Dec 25, 2024",
    paymentStatus: "pending",
    contractSigned: true,
  },
  {
    id: "3",
    brand: "Adidas",
    campaign: "New Year Campaign",
    value: 12000,
    status: "negotiating",
    deliverables: ["3x Instagram Posts", "2x YouTube Shorts", "5x Stories"],
    deadline: "Jan 5, 2025",
    paymentStatus: "pending",
    contractSigned: false,
  },
  {
    id: "4",
    brand: "Apple",
    campaign: "Product Review",
    value: 5000,
    status: "delivered",
    deliverables: ["1x YouTube Video"],
    deadline: "Nov 30, 2024",
    paymentStatus: "invoiced",
    contractSigned: true,
  },
  {
    id: "5",
    brand: "Spotify",
    campaign: "Wrapped Campaign",
    value: 4500,
    status: "paid",
    deliverables: ["2x Instagram Stories", "1x TikTok"],
    deadline: "Nov 15, 2024",
    paymentStatus: "paid",
    contractSigned: true,
  },
];

const statusConfig = {
  negotiating: { label: "Negotiating", color: "bg-amber-500/10 text-amber-500", icon: Clock },
  contracted: { label: "Contracted", color: "bg-primary/10 text-primary", icon: FileText },
  "in-progress": { label: "In Progress", color: "bg-cyan-500/10 text-cyan-500", icon: TrendingUp },
  delivered: { label: "Delivered", color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
  paid: { label: "Paid", color: "bg-emerald-600/10 text-emerald-600", icon: DollarSign },
};

const paymentStatusColors = {
  pending: "text-muted-foreground",
  invoiced: "text-amber-500",
  paid: "text-emerald-500",
};

export default function CollabTracker() {
  const [deals] = useState(sampleDeals);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredDeals = selectedStatus === "all" 
    ? deals 
    : deals.filter(d => d.status === selectedStatus);

  const totalValue = deals.reduce((acc, deal) => acc + deal.value, 0);
  const pendingPayments = deals
    .filter(d => d.paymentStatus !== "paid")
    .reduce((acc, deal) => acc + deal.value, 0);
  const activeDeals = deals.filter(d => ["contracted", "in-progress"].includes(d.status)).length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
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
            <Button variant="default" className="gap-2">
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
                  const StatusIcon = statusConfig[deal.status].icon;
                  return (
                    <tr key={deal.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <span className="font-medium text-foreground">{deal.brand}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-foreground">{deal.campaign}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {deal.deliverables.length} deliverables
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-emerald-500">
                          ${deal.value.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                          statusConfig[deal.status].color
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[deal.status].label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {deal.deadline}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "text-sm font-medium capitalize",
                          paymentStatusColors[deal.paymentStatus]
                        )}>
                          {deal.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {deal.contractSigned ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
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
              .filter(d => d.status !== "paid")
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .slice(0, 4)
              .map((deal, index) => (
                <div
                  key={deal.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30"
                >
                  <div className="w-12 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {new Date(deal.deadline).getDate()}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {new Date(deal.deadline).toLocaleString('default', { month: 'short' })}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{deal.brand} - {deal.campaign}</p>
                    <p className="text-sm text-muted-foreground">
                      {deal.deliverables.join(", ")}
                    </p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    statusConfig[deal.status].color
                  )}>
                    {statusConfig[deal.status].label}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
