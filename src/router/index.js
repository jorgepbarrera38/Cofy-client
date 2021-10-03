import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/main/Main'
import Dashboard from '../views/main/Dashboard'
import ProductIndex from '../views/main/products/Index'
import ProductCreate from '../views/main/products/Create'
import ProductEdit from '../views/main/products/Edit'
import TableIndex from '../views/main/tables/Index'
import TableCreate from '../views/main/tables/Create'
import TableEdit from '../views/main/tables/Edit'
import CategoryIndex from '../views/main/categories/Index'
import CategoryCreate from '../views/main/categories/Create'
import CategoryEdit from '../views/main/categories/Edit'
import OrderIndex from '../views/main/orders/Index'
import OrderCreate from '../views/main/orders/Create'
import OrderEdit from '../views/main/orders/Edit'
import ClientIndex from '../views/main/clients/Index'
import ClientCreate from '../views/main/clients/Create'
import ClientEdit from '../views/main/clients/Edit'
import DeliveryIndex from '../views/main/deliveries/Index'
import DeliveryCreate from '../views/main/deliveries/Create'
import DeliveryEdit from '../views/main/deliveries/Edit'
import ReportSales from '../views/main/reports/sales/Sales'
import ReportOrders from '../views/main/reports/Orders'
import ReportDeliveries from '../views/main/reports/Deliveries'
import ReportSalesStatistic from '../views/main/reports/salesStatistic/salesStatistic'
import Login from '../views/login/Login'
import RoomIndex from '../views/main/rooms/Index'
import RoomCreate from '../views/main/rooms/Create'
import RoomEdit from '../views/main/rooms/Edit'
import ParameterIndex from '../views/main/parameters/Index'
import SaleCreate from '../views/main/sales/Create'
import Company from '../views/main/company/Index'
import UserIndex from '../views/main/users/Index'
import UserCreate from '../views/main/users/Create'
import UserEdit from '../views/main/users/Edit'
import KitchenIndex from '../views/main/kitchen/Index'
import UserPermission from '../views/main/users/Permission'
import PaymentMethodIndex from '../views/main/payment_methods/Index'
import PaymentMethodCreate from '../views/main/payment_methods/Create'
import PaymentMethodEdit from '../views/main/payment_methods/Edit'

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/',
    component: Main,
    children: [
      {
        name: 'login',
        path: '/iniciar-sesion',
        component: Login
      },
      { path: '/', name: 'dashboard', component: Dashboard },
      { path: 'productos', name: 'products.index', component: ProductIndex },
      { path: 'productos/nuevo', name: 'products.create', component: ProductCreate },
      { path: 'productos/:id/editar', name: 'products.edit', component: ProductEdit },
      { path: 'categorias-de-comidas', name: 'categories.index', component: CategoryIndex },
      { path: 'categorias-de-comidas/nuevo', name: 'categories.create', component: CategoryCreate },
      { path: 'categorias-de-comidas/:id/editar', name: 'categories.edit', component: CategoryEdit },
      { path: 'mesas', name: 'tables.index', component: TableIndex },
      { path: 'mesas/nuevo', name: 'tables.create', component: TableCreate },
      { path: 'mesas/:id/editar', name: 'tables.edit', component: TableEdit },
      { path: 'ordenes-de-pedido', name: 'orders.index', component: OrderIndex },
      { path: 'ordenes-de-pedido/:tableId/nuevo', name: 'orders.create', component: OrderCreate },
      { path: 'ordenes-de-pedido/:orderId/editar', name: 'orders.edit', component: OrderEdit },
      { path: 'clientes', name: 'clients.index', component: ClientIndex },
      { path: 'clientes/nuevo', name: 'clients.create', component: ClientCreate },
      { path: 'clientes/:id/editar', name: 'clients.edit', component: ClientEdit },
      { path: 'domicilios', name: 'deliveries.index', component: DeliveryIndex },
      { path: 'domicilios/nuevo', name: 'deliveries.create', component: DeliveryCreate },
      { path: 'domicilios/:deliveryId/editar', name: 'deliveries.edit', component: DeliveryEdit },
      { path: 'reportes/ventas', name: 'reports.sales', component: ReportSales },
      { path: 'reportes/ordenes-de-pedido', name: 'reports.orders', component: ReportOrders },
      { path: 'reportes/domicilios', name: 'reports.deliveries', component: ReportDeliveries },
      { path: 'reportes/estadistico-de-ventas', name: 'reports.salesStatistic', component: ReportSalesStatistic },
      { path: 'salas', name: 'rooms.index', component: RoomIndex },
      { path: 'salas/nuevo', name: 'rooms.create', component: RoomCreate },
      { path: 'salas/:id/editar', name: 'rooms.edit', component: RoomEdit },
      { path: 'parametros', name: 'parameters.index', component: ParameterIndex },
      { path: 'ventas', name: 'sales.create', component: SaleCreate },
      { path: 'empresa', name: 'company.index', component: Company },
      { path: 'users', name: 'users.index', component: UserIndex },
      { path: 'users/nuevo', name: 'users.create', component: UserCreate },
      { path: 'users/:id/editar', name: 'users.edit', component: UserEdit },
      { path: 'users/:id/permisos-del-usuario', name: 'users.permission', component: UserPermission },
      { path: 'cocina', name: 'kitchen.index', component: KitchenIndex },
      { path: 'metodos-de-pago', name: 'paymentMethods.index', component: PaymentMethodIndex },
      { path: 'metodos-de-pago/nuevo', name: 'paymentMethods.create', component: PaymentMethodCreate },
      { path: 'metodos-de-pago/:id/editar', name: 'paymentMethods.edit', component: PaymentMethodEdit },      
    ]
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
