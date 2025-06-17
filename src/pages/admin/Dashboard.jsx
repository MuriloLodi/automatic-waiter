import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Users, ShoppingBag, TrendingUp, Settings, FileText, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, orders, products } = useApp();
  const navigate = useNavigate();

  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return today === orderDate;
  });

  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing');
  const completedToday = todayOrders.filter(order => order.status === 'completed');
  const todayRevenue = completedToday.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      title: 'Pedidos Pendentes',
      value: pendingOrders.length,
      icon: ShoppingBag,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Pedidos Hoje',
      value: todayOrders.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Receita Hoje',
      value: `R$ ${todayRevenue.toFixed(2).replace('.', ',')}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Produtos Ativos',
      value: products.filter(p => p.available).length,
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      preparing: 'bg-blue-500',
      ready: 'bg-green-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Aguardando',
      preparing: 'Em Preparo',
      ready: 'Pronto',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user.name}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/menu-management')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-orange-600" />
                Gerenciar Cardápio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Adicionar, editar e remover produtos do cardápio</p>
              <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                Acessar
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/orders')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Histórico de Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Visualizar e gerenciar todos os pedidos</p>
              <Button className="w-full mt-4" variant="outline">
                Acessar
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/reports')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Relatórios de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Análises e relatórios de vendas</p>
              <Button className="w-full mt-4" variant="outline">
                Acessar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Pedido #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(order.status)} text-white mb-1`}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <p className="text-sm font-medium">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
              
              {pendingOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum pedido pendente no momento
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

