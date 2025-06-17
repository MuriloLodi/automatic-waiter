import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock } from 'lucide-react';

export default function OrderTracking() {
  const { currentOrder, updateOrderStatus } = useApp();
  const navigate = useNavigate();

  // Simular atualização automática do status do pedido
  useEffect(() => {
    if (!currentOrder || currentOrder.status === 'completed') return;

    const statusFlow = {
      pending: { next: 'preparing', delay: 5000, description: 'Iniciado preparo' },
      preparing: { next: 'ready', delay: 15000, description: 'Pedido pronto' },
      ready: { next: 'completed', delay: 10000, description: 'Pedido entregue' }
    };

    const currentStatus = statusFlow[currentOrder.status];
    if (currentStatus) {
      const timer = setTimeout(() => {
        updateOrderStatus(currentOrder.id, currentStatus.next, currentStatus.description);
      }, currentStatus.delay);

      return () => clearTimeout(timer);
    }
  }, [currentOrder, updateOrderStatus]);

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-xl font-bold text-gray-900">Acompanhar Pedido</h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nenhum pedido ativo</h2>
            <p className="text-gray-600 mb-6">Você não possui pedidos em andamento no momento.</p>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => navigate('/menu')}
            >
              Fazer Pedido
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusProgress = (status) => {
    const statusMap = {
      pending: 25,
      preparing: 50,
      ready: 75,
      completed: 100
    };
    return statusMap[status] || 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      preparing: 'bg-blue-500',
      ready: 'bg-green-500',
      completed: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Aguardando Preparo',
      preparing: 'Em Preparo',
      ready: 'Pronto',
      completed: 'Finalizado'
    };
    return labels[status] || status;
  };

  const isStatusActive = (targetStatus) => {
    const statusOrder = ['pending', 'preparing', 'ready', 'completed'];
    const currentIndex = statusOrder.indexOf(currentOrder.status);
    const targetIndex = statusOrder.indexOf(targetStatus);
    return targetIndex <= currentIndex;
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
            <h1 className="text-xl font-bold text-gray-900">Acompanhar Pedido</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Order Number */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pedido #{currentOrder.id}
            </h2>
            <Badge className={`${getStatusColor(currentOrder.status)} text-white`}>
              {getStatusLabel(currentOrder.status)}
            </Badge>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="mb-4">
              <Progress value={getStatusProgress(currentOrder.status)} className="h-3" />
            </div>
            
            <div className="flex justify-between text-sm">
              <div className={`text-center ${isStatusActive('pending') ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${isStatusActive('pending') ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                Aguardando<br />Preparo
              </div>
              <div className={`text-center ${isStatusActive('preparing') ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${isStatusActive('preparing') ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                Em Preparo
              </div>
              <div className={`text-center ${isStatusActive('ready') ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${isStatusActive('ready') ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                Pronto
              </div>
              <div className={`text-center ${isStatusActive('completed') ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${isStatusActive('completed') ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                Finalizado
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estimated Time */}
        {currentOrder.status !== 'completed' && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">Tempo estimado</h3>
              <p className="text-2xl font-bold text-orange-600">
                {currentOrder.estimatedTime - 5}-{currentOrder.estimatedTime} min
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.observations && (
                      <p className="text-sm text-gray-600">Obs: {item.observations}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.quantity}x</p>
                    <p className="text-sm text-gray-600">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentOrder.history.map((entry, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{entry.description}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {entry.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          className="w-full h-12 bg-orange-600 hover:bg-orange-700"
          onClick={() => {
            alert('Garçom solicitado! Ele estará com você em breve.');
          }}
        >
          Solicitar Garçom
        </Button>
      </div>
    </div>
  );
}

