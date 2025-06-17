// Dados mockados para o sistema
export const mockUsers = [
  {
    id: 1,
    email: "admin@restaurant.com",
    password: "admin123",
    name: "Administrador",
    role: "admin"
  },
  {
    id: 2,
    email: "cliente@email.com", 
    password: "cliente123",
    name: "Cliente Teste",
    role: "customer"
  },
  {
    id: 3,
    email: "garcom@restaurant.com",
    password: "garcom123", 
    name: "Garçom",
    role: "waiter"
  }
];

export const mockCategories = [
  { id: 1, name: "Entradas", slug: "entradas" },
  { id: 2, name: "Pratos Principais", slug: "pratos-principais" },
  { id: 3, name: "Bebidas", slug: "bebidas" },
  { id: 4, name: "Sobremesas", slug: "sobremesas" }
];

export const mockProducts = [
  {
    id: 1,
    name: "Bruschetta Italiana",
    description: "Pão italiano tostado com tomate, manjericão e azeite",
    price: 18.90,
    category: "entradas",
    image: "/api/placeholder/300/200",
    available: true,
    prepTime: 15
  },
  {
    id: 2,
    name: "Carpaccio de Salmão",
    description: "Fatias finas de salmão com alcaparras e molho especial",
    price: 32.90,
    category: "entradas", 
    image: "/api/placeholder/300/200",
    available: true,
    prepTime: 10
  },
  {
    id: 3,
    name: "Risotto de Camarão",
    description: "Risotto cremoso com camarões frescos e ervas finas",
    price: 45.90,
    category: "pratos-principais",
    image: "/api/placeholder/300/200", 
    available: true,
    prepTime: 25
  },
  {
    id: 4,
    name: "Filé Mignon Grelhado",
    description: "Filé mignon grelhado com batatas rústicas e legumes",
    price: 52.90,
    category: "pratos-principais",
    image: "/api/placeholder/300/200",
    available: true,
    prepTime: 30
  },
  {
    id: 5,
    name: "Salmão Grelhado",
    description: "Salmão grelhado com quinoa e vegetais orgânicos",
    price: 48.90,
    category: "pratos-principais",
    image: "/api/placeholder/300/200",
    available: true,
    prepTime: 20
  },
  {
    id: 6,
    name: "Água Mineral",
    description: "Água mineral sem gás 500ml",
    price: 4.50,
    category: "bebidas",
    image: "/api/placeholder/300/200",
    available: true,
    prepTime: 2
  },
  {
    id: 7,
    name: "Refrigerante",
    description: "Coca-Cola, Guaraná ou Fanta 350ml",
    price: 6.90,
    category: "bebidas",
    image: "/api/placeholder/300/200",
    available: true,
    prepTime: 2
  },
  {
    id: 8,
    name: "Suco Natural",
    description: "Suco natural de laranja, limão ou maracujá",
    price: 8.90,
    category: "bebidas",
    image: "/api/placeholder/300/200",
    available: true,
    prepTime: 5
  },
  {
    id: 9,
    name: "Tiramisu",
    description: "Sobremesa italiana com café, mascarpone e cacau",
    price: 16.90,
    category: "sobremesas",
    image: "/api/placeholder/300/200",
    available: true,
    prepTime: 5
  },
  {
    id: 10,
    name: "Petit Gateau",
    description: "Bolinho de chocolate quente com sorvete de baunilha",
    price: 19.90,
    category: "sobremesas",
    image: "/api/placeholder/300/200",
    available: true,
    prepTime: 15
  }
];

export const mockOrders = [
  {
    id: "000001",
    customerId: 2,
    items: [
      { productId: 1, quantity: 2, observations: "Sem cebola", price: 18.90 },
      { productId: 3, quantity: 1, observations: "", price: 45.90 }
    ],
    status: "completed",
    paymentMethod: "cartao",
    total: 83.70,
    createdAt: "2025-06-17T10:30:00Z",
    estimatedTime: 25,
    history: [
      { status: "aguardando", time: "10:30", description: "Pedido recebido" },
      { status: "preparo", time: "10:35", description: "Iniciado preparo" },
      { status: "pronto", time: "10:55", description: "Pedido pronto" },
      { status: "entregue", time: "11:00", description: "Pedido entregue" }
    ]
  },
  {
    id: "000002", 
    customerId: 2,
    items: [
      { productId: 4, quantity: 1, observations: "Mal passado", price: 52.90 },
      { productId: 7, quantity: 2, observations: "", price: 6.90 }
    ],
    status: "preparing",
    paymentMethod: "pix",
    total: 66.70,
    createdAt: "2025-06-17T12:15:00Z",
    estimatedTime: 30,
    history: [
      { status: "aguardando", time: "12:15", description: "Pedido recebido" },
      { status: "preparo", time: "12:20", description: "Iniciado preparo" }
    ]
  }
];

export const orderStatuses = {
  pending: { label: "Aguardando Preparo", color: "bg-yellow-500" },
  preparing: { label: "Em Preparo", color: "bg-blue-500" },
  ready: { label: "Pronto", color: "bg-green-500" },
  completed: { label: "Finalizado", color: "bg-gray-500" },
  cancelled: { label: "Cancelado", color: "bg-red-500" }
};

export const paymentMethods = [
  { id: "dinheiro", label: "Dinheiro" },
  { id: "cartao", label: "Cartão" },
  { id: "pix", label: "Pix" }
];

