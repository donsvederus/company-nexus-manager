
import { useState, useMemo } from "react";
import { useClients } from "@/context/ClientContext";
import { useServices } from "@/context/ServiceContext";
import { ClientStatus } from "@/types/client";
import { getFinalCost } from "@/utils/formatUtils";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const { clients } = useClients();
  const { services, clientServices, getServiceDetails } = useServices();
  const [activeTab, setActiveTab] = useState("overview");
  
  const activeClients = useMemo(() => 
    clients.filter(client => client.status === "active"), 
  [clients]);

  // Calculate total costs by client
  const clientCostData = useMemo(() => {
    return activeClients.map(client => {
      const clientServiceItems = clientServices.filter(cs => cs.clientId === client.id && cs.isActive);
      const totalCost = clientServiceItems.reduce((acc, cs) => {
        const service = getServiceDetails(cs.serviceId);
        if (!service) return acc;
        const cost = getFinalCost(service, cs);
        return acc + cost;
      }, 0);
      
      return {
        name: client.companyName,
        totalCost: parseFloat(totalCost.toFixed(2)),
        clientId: client.id
      };
    }).sort((a, b) => b.totalCost - a.totalCost);
  }, [activeClients, clientServices, getServiceDetails]);
  
  // Calculate total costs by service category
  const categoryCostData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    
    clientServices.forEach(cs => {
      if (!cs.isActive) return;
      
      const service = getServiceDetails(cs.serviceId);
      if (!service) return;
      
      const cost = getFinalCost(service, cs);
      const category = service.category;
      
      if (!categories[category]) {
        categories[category] = 0;
      }
      
      categories[category] += cost;
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(value.toFixed(2))
    })).sort((a, b) => b.value - a.value);
  }, [clientServices, getServiceDetails]);
  
  // Calculate total costs over time (simulated monthly data for the last 6 months)
  const monthlyCostData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const categories = [...new Set(services.map(s => s.category))];
    
    // Generate simulated monthly data
    return months.map((month, i) => {
      const monthData: { [key: string]: number | string } = { name: month };
      let totalMonthly = 0;
      
      categories.forEach(category => {
        // Simulate slightly increasing costs for each category
        const baseCost = categoryCostData.find(c => c.name.toLowerCase() === category)?.value || 0;
        const monthlyCost = baseCost * (0.9 + (i * 0.05));
        monthData[category] = parseFloat(monthlyCost.toFixed(2));
        totalMonthly += monthlyCost;
      });
      
      monthData["total"] = parseFloat(totalMonthly.toFixed(2));
      return monthData;
    });
  }, [categoryCostData, services]);
  
  // Summary statistics
  const totalMonthlyCost = useMemo(() => 
    parseFloat(clientCostData.reduce((sum, client) => sum + client.totalCost, 0).toFixed(2)),
  [clientCostData]);
  
  const avgClientCost = useMemo(() => 
    activeClients.length > 0 ? parseFloat((totalMonthlyCost / activeClients.length).toFixed(2)) : 0,
  [totalMonthlyCost, activeClients]);
  
  const topServiceCategory = useMemo(() => 
    categoryCostData.length > 0 ? categoryCostData[0].name : "None",
  [categoryCostData]);
  
  const pieColors = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#10B981", "#6B7280", "#EC4899"];
  
  const chartConfig = {
    hosting: { theme: { light: "#8B5CF6", dark: "#A78BFA" } },
    design: { theme: { light: "#D946EF", dark: "#E879F9" } },
    maintenance: { theme: { light: "#F97316", dark: "#FB923C" } },
    marketing: { theme: { light: "#0EA5E9", dark: "#38BDF8" } },
    consulting: { theme: { light: "#10B981", dark: "#34D399" } },
    other: { theme: { light: "#6B7280", dark: "#9CA3AF" } },
    total: { theme: { light: "#EC4899", dark: "#F472B6" } },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyCost}</div>
            <p className="text-xs text-muted-foreground">From {activeClients.length} active clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Client Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgClientCost}</div>
            <p className="text-xs text-muted-foreground">Per active client monthly</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Service Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topServiceCategory}</div>
            <p className="text-xs text-muted-foreground">Highest revenue generator</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">By Client</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="trend">Monthly Trend</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue by Client</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ChartContainer config={chartConfig}>
                    <BarChart data={clientCostData.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="totalCost" name="Monthly Revenue" fill="#8B5CF6" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie
                        data={categoryCostData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {categoryCostData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend content={<ChartLegendContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ChartContainer config={chartConfig}>
                  <LineChart data={monthlyCostData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="total" stroke="#EC4899" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Monthly Revenue</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientCostData.map((client) => (
                    <TableRow key={client.clientId}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>${client.totalCost}</TableCell>
                      <TableCell className="text-right">
                        {totalMonthlyCost > 0 ? 
                          `${(client.totalCost / totalMonthlyCost * 100).toFixed(1)}%` : 
                          '0%'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Service Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80">
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie
                        data={categoryCostData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {categoryCostData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend content={<ChartLegendContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryCostData.map((category, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: pieColors[index % pieColors.length] }}
                            />
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell>${category.value}</TableCell>
                        <TableCell className="text-right">
                          {totalMonthlyCost > 0 ? 
                            `${(category.value / totalMonthlyCost * 100).toFixed(1)}%` : 
                            '0%'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={chartConfig}>
                  <LineChart data={monthlyCostData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend content={<ChartLegendContent />} />
                    {Object.keys(monthlyCostData[0])
                      .filter(key => key !== 'name' && key !== 'total')
                      .map((category, index) => (
                        <Line 
                          key={category}
                          type="monotone" 
                          dataKey={category} 
                          stroke={pieColors[index % pieColors.length]}
                        />
                      ))}
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
