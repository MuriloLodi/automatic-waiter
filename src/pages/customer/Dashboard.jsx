import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, ShoppingCart, Clock, CheckCircle } from 'lucide-react';

export default function CustomerDashboard() {
  const { user, logout, orders, currentOrder } = useApp();
  const navigate = useNavigate();

  const userOrders = orders.filter(order => order.customerId === user.id);
  const recentOrders = userOrders.slice(0, 3);

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
      completed: 'Finalizado',
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
              <h1 className="text-xl font-bold text-gray-900">RESTAURANTE</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/cart')}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Menu Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/menu')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-orange-600" />
                Cardápio Digital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Explore nosso cardápio e faça seu pedido</p>
              <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                Ver Cardápio
              </Button>
            </CardContent>
          </Card>

          {/* Current Order Card */}
          {currentOrder && (
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/order-tracking')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Pedido Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">Pedido #{currentOrder.id}</p>
                  <Badge className={getStatusColor(currentOrder.status)}>
                    {getStatusLabel(currentOrder.status)}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Tempo estimado: {currentOrder.estimatedTime} min
                  </p>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Acompanhar Pedido
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Order History Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/order-history')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Histórico de Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Veja seus pedidos anteriores</p>
              <div className="mt-4 space-y-2">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center text-sm">
                    <span>#{order.id}</span>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                Ver Histórico
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              className="h-16 bg-orange-600 hover:bg-orange-700"
              onClick={() => navigate('/menu')}
            >
              Fazer Novo Pedido
            </Button>
            <Button 
              variant="outline" 
              className="h-16"
              onClick={() => navigate('/cart')}
            >
              Ver Carrinho
            </Button>
            {currentOrder && (
              <Button 
                variant="outline" 
                className="h-16"
                onClick={() => navigate('/order-tracking')}
              >
                Acompanhar Pedido
              </Button>
            )}
            <Button 
              variant="outline" 
              className="h-16"
              onClick={() => {
                // Simular solicitação de garçom
                alert('Garçom solicitado! Ele estará com você em breve.');
              }}
            >
              Solicitar Garçom
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

