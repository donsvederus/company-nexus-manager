
import { useEffect, useState } from "react";
import { useClients } from "@/context/ClientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { ClientStatus } from "@/types/client";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { clients } = useClients();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    recentClients: [],
  });

  useEffect(() => {
    const total = clients.length;
    const active = clients.filter((client) => client.status === "active").length;
    const inactive = clients.filter((client) => client.status === "inactive").length;
    
    // Get 5 most recent clients
    const recentClients = [...clients]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 5);
    
    setStats({
      total,
      active,
      inactive,
      recentClients,
    });
  }, [clients]);

  const statusColors = {
    total: "bg-brand-50 text-brand-700",
    active: "bg-green-50 text-green-700",
    inactive: "bg-red-50 text-red-700",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Active Clients" value={stats.active} colorClass={statusColors.active} />
        <StatsCard title="Inactive Clients" value={stats.inactive} colorClass={statusColors.inactive} />
        <StatsCard title="Total Clients" value={stats.total} colorClass={statusColors.total} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Company</th>
                  <th className="text-left p-2">Account Manager</th>
                  <th className="text-left p-2">Start Date</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <Link to={`/clients/${client.id}`} className="text-brand-600 hover:underline">
                        {client.companyName}
                      </Link>
                    </td>
                    <td className="p-2">{client.accountManager}</td>
                    <td className="p-2">{new Date(client.startDate).toLocaleDateString()}</td>
                    <td className="p-2">
                      <StatusBadge status={client.status as ClientStatus} />
                    </td>
                  </tr>
                ))}
                {stats.recentClients.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No clients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  colorClass: string;
}

function StatsCard({ title, value, colorClass }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center font-bold text-lg`}>
            {value}
          </div>
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
