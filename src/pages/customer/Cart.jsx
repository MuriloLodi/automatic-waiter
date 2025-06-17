import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { paymentMethods } from '../../data/mockData';

export default function Cart() {
  const { cart, products, removeFromCart, updateCartItem, clearCart, createOrder } = useApp();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');

  const getProductById = (id) => products.find(p => p.id === id);

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
    } else {
      updateCartItem(index, { quantity: newQuantity });
    }
  };

  const updateObservations = (index, observations) => {
    updateCartItem(index, { observations });
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxes = subtotal * 0.1; // 10% de taxa de serviço
  const total = subtotal + taxes;

  const handleFinishOrder = () => {
    if (!paymentMethod) {
      alert('Por favor, selecione um método de pagamento.');
      return;
    }
    
    if (cart.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    createOrder(paymentMethod);
    navigate('/order-tracking');
  };

  const handleCancelOrder = () => {
    if (confirm('Tem certeza que deseja cancelar o pedido?')) {
      clearCart();
      navigate('/menu');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/menu')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">MEU PEDIDO</h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione alguns itens do cardápio para continuar.</p>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => navigate('/menu')}
            >
              Ver Cardápio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/menu')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">MEU PEDIDO</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cart.map((item, index) => {
            const product = getProductById(item.productId);
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        R$ {item.price.toFixed(2).replace('.', ',')} cada
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{item.quantity}</span>
                      <span className="text-gray-400">×</span>
                      <span className="font-semibold">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Textarea
                      placeholder="Observações"
                      value={item.observations || ''}
                      onChange={(e) => updateObservations(index, e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      REMOVER
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de serviço (10%)</span>
                <span>R$ {taxes.toFixed(2).replace('.', ',')}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Método de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map(method => (
                <Button
                  key={method.id}
                  variant={paymentMethod === method.id ? "default" : "outline"}
                  onClick={() => setPaymentMethod(method.id)}
                  className={paymentMethod === method.id ? "bg-orange-600 hover:bg-orange-700" : ""}
                >
                  {method.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCancelOrder}
            className="h-12"
          >
            CANCELAR PEDIDO
          </Button>
          <Button
            size="lg"
            onClick={handleFinishOrder}
            className="h-12 bg-orange-600 hover:bg-orange-700"
          >
            FINALIZAR PEDIDO
          </Button>
        </div>
      </div>
    </div>
  );
}

