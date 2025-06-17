# Sistema Automatic Waiter - Documentação

## Descrição
Sistema completo de restaurante desenvolvido em React com funcionalidades de:
- Login e autenticação
- Cardápio digital interativo
- Carrinho de compras
- Acompanhamento de pedidos em tempo real
- Gerenciamento administrativo
- Relatórios de vendas com gráficos

## Tecnologias Utilizadas
- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Roteamento**: React Router DOM
- **Estado**: Context API + useReducer

## Como Executar

### Pré-requisitos
- Node.js 18+ 
- pnpm (ou npm/yarn)

### Instalação
```bash
# Extrair o arquivo ZIP
unzip automatic-waiter-sistema.zip
cd automatic-waiter

# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

## Contas de Teste

### Cliente
- **Email**: cliente@email.com
- **Senha**: cliente123

### Administrador
- **Email**: admin@restaurant.com
- **Senha**: admin123

### Garçom
- **Email**: garcom@restaurant.com
- **Senha**: garcom123

## Funcionalidades Implementadas

### Para Clientes
- ✅ Login/Logout
- ✅ Dashboard com visão geral
- ✅ Cardápio digital com categorias
- ✅ Carrinho de compras funcional
- ✅ Acompanhamento de pedidos em tempo real
- ✅ Histórico de pedidos com filtros
- ✅ Solicitação de garçom

### Para Administradores
- ✅ Dashboard administrativo
- ✅ Gerenciamento completo do cardápio (CRUD)
- ✅ Histórico de todos os pedidos
- ✅ Relatórios de vendas com gráficos
- ✅ Controle de status dos pedidos

## Estrutura do Projeto
```
src/
├── components/
│   ├── ui/              # Componentes Shadcn/UI
│   ├── layout/          # Componentes de layout
│   ├── forms/           # Componentes de formulário
│   └── common/          # Componentes reutilizáveis
├── pages/
│   ├── auth/            # Páginas de autenticação
│   ├── customer/        # Páginas do cliente
│   └── admin/           # Páginas administrativas
├── context/
│   └── AppContext.jsx   # Contexto global da aplicação
├── data/
│   └── mockData.js      # Dados simulados
└── hooks/               # Hooks customizados
```

## Recursos Especiais
- **Responsivo**: Funciona em desktop e mobile
- **Simulação Real**: Status de pedidos atualiza automaticamente
- **Persistência**: Dados salvos no localStorage
- **Interface Moderna**: Design limpo e intuitivo
- **Gráficos Interativos**: Relatórios visuais de vendas

## Próximos Passos (Melhorias Futuras)
- Integração com backend real
- Sistema de notificações push
- Upload real de imagens
- Integração com pagamentos
- Sistema de avaliações
- Chat em tempo real

## Suporte
Para dúvidas ou problemas, consulte a documentação do React e das bibliotecas utilizadas.

---
**Desenvolvido com base nos wireframes e requisitos fornecidos**

