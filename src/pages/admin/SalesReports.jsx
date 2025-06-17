import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft, Download, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

export default function SalesReports() {
  const { orders, products } = useApp();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('daily');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  const reportData = useMemo(() => {
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      
      return orderDate >= fromDate && orderDate <= toDate && order.status === 'completed';
    });

    // Dados para o gráfico de vendas
    const salesByDate = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('pt-BR');
      if (!salesByDate[date]) {
        salesByDate[date] = { date, vendas: 0, pedidos: 0 };
      }
      salesByDate[date].vendas += order.total;
      salesByDate[date].pedidos += 1;
    });

    const chartData = Object.values(salesByDate).sort((a, b) => 
      new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-'))
    );

    // Produtos mais vendidos
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          const product = products.find(p => p.id === item.productId);
          productSales[item.productId] = {
            name: item.name || (product ? product.name : 'Produto'),
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Métricas gerais
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

    return {
      chartData,
      topProducts,
      totalSales,
      totalOrders,
      averageTicket,
      filteredOrders
    };
  }, [orders, products, dateFrom, dateTo]);

  const generateReport = () => {
    alert('Relatório gerado! Em um sistema real, isso faria o download de um arquivo PDF ou Excel.');
  };

  const exportData = () => {
    const csvContent = [
      ['Data', 'Pedido', 'Cliente', 'Total', 'Pagamento'],
      ...reportData.filteredOrders.map(order => [
        new Date(order.createdAt).toLocaleDateString('pt-BR'),
        order.id,
        `Cliente #${order.customerId}`,
        `R$ ${order.total.toFixed(2).replace('.', ',')}`,
        order.paymentMethod
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-vendas-${dateFrom}-${dateTo}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Relatórios de Vendas</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configurações do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Período</label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Data de</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Data até</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={generateReport}
                >
                  Gerar Relatório
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-50">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {reportData.totalSales.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-50">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {reportData.averageTicket.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-50">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vendas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'vendas' ? `R$ ${value.toFixed(2).replace('.', ',')}` : value,
                      name === 'vendas' ? 'Vendas' : 'Pedidos'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#ea580c" 
                    strokeWidth={2}
                    name="vendas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pedidos" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="pedidos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} unidades vendidas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">R$ {product.revenue.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              ))}
              {reportData.topProducts.length === 0 && (
                <p className="text-center text-gray-500 py-8">Nenhum produto vendido no período</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Dados Detalhados</CardTitle>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum pedido encontrado no período
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.filteredOrders.slice(0, 10).map(order => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>Cliente #{order.customerId}</TableCell>
                      <TableCell>R$ {order.total.toFixed(2).replace('.', ',')}</TableCell>
                      <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {reportData.filteredOrders.length > 10 && (
              <div className="p-4 text-center text-sm text-gray-500">
                Mostrando 10 de {reportData.filteredOrders.length} pedidos
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

