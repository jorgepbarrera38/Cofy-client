<template>
    <div class="app-sidebar sidebar-shadow bg-vicious-stance sidebar-text-light">
                <div class="app-header__logo">
                    <div class="logo-src"></div>
                    <div class="header__pane ml-auto">
                        <div>
                            <button type="button" class="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                                <span class="hamburger-box">
                                    <span class="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="app-header__mobile-menu">
                    <div>
                        <button type="button" class="hamburger hamburger--elastic mobile-toggle-nav">
                            <span class="hamburger-box">
                                <span class="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
                <div class="app-header__menu">
                    <span>
                        <button type="button" class="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                            <span class="btn-icon-wrapper">
                                <i class="fa fa-ellipsis-v fa-w-6"></i>
                            </span>
                        </button>
                    </span>
                </div>    
                <div class="scrollbar-sidebar" v-show="this.$route.name != 'login'">
                    <div class="app-sidebar__inner">
                        <ul class="vertical-nav-menu">
                            <li class="app-sidebar__heading">Dashboards</li>
                            <li>
                                <a href="#" class="mm-active" @click.prevent="goToRouteDashboardIndex">
                                    <i class="metismenu-icon pe-7s-rocket"></i>
                                    Dashboard
                                </a>
                            </li>

                            <li class="app-sidebar__heading">Menú</li>
                            <li name="liMenuToCollapse">
                                <a href="#">
                                    <i class="metismenu-icon fa fa-cogs"></i>
                                    Administración
                                    <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                                </a>
                                <ul name="ulMenuToCollapse">
                                    <li>
                                        <a href="#" @click.prevent="goToRouteCategoryIndex">
                                            <i class="metismenu-icon"></i>
                                            Categorías
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRouteProductIndex">
                                            <i class="metismenu-icon"></i>
                                            Productos
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRouteClientIndex">
                                            <i class="metismenu-icon"></i>
                                            Clientes
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRouteRoomIndex">
                                            <i class="metismenu-icon"></i>
                                            Salas
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRouteTableIndex">
                                            <i class="metismenu-icon"></i>
                                            Mesas
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRoutePaymentMethodIndex">
                                            <i class="metismenu-icon"></i>
                                            Métodos de pago
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRouteParameterIndex">
                                            <i class="metismenu-icon"></i>
                                            Parámetros
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRouteCompanyIndex">
                                            <i class="metismenu-icon"></i>
                                            Empresa
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="#" @click.prevent="goToRouteOrderIndex">
                                    <i class="metismenu-icon fa fa-clipboard-list"></i>
                                    Órdenes de pedido
                                </a>
                            </li>
                            <li>
                                <a href="#" @click.prevent="goToRouteDeliveryIndex">
                                    <i class="metismenu-icon fa fa-map-marked-alt"></i>
                                    Domicilios
                                </a>
                            </li>
                            <li>
                                <a href="#" @click.prevent="goToRouteSaleIndex">
                                    <i class="metismenu-icon fa fa-cart-arrow-down"></i>
                                    Ventas directas
                                </a>
                            </li>
                            <li>
                                <a href="#" @click.prevent="goToRouteKitchenIndex">
                                    <i class="metismenu-icon fa fa-utensils"></i>
                                    Cocina
                                </a>
                            </li>
                            <li name="liMenuToCollapse">
                                <a href="#">
                                    <i class="metismenu-icon fa fa-chart-line"></i>
                                    Informes
                                    <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                                </a>
                                <ul name="ulMenuToCollapse">
                                    <li>
                                        <a href="#" @click.prevent="goToRouteReportIndex('reports.orders')">
                                            <i class="metismenu-icon"></i>
                                            Ordenes de pedido
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRouteReportIndex('reports.deliveries')">
                                            <i class="metismenu-icon"></i>
                                            Domicilios
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRouteReportIndex('reports.sales')">
                                            <i class="metismenu-icon"></i>
                                            Ventas
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" @click.prevent="goToRouteReportIndex('reports.salesStatistic')">
                                            <i class="metismenu-icon"></i>
                                            Estadístico de ventas
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li name="liMenuToCollapse">
                                <a href="#">
                                    <i class="metismenu-icon fa fa-user-cog"></i>
                                    Sistema
                                    <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                                </a>
                                <ul name="ulMenuToCollapse">
                                    <li>
                                        <a href="#" @click.prevent="goToRouteUserIndex">
                                            <i class="metismenu-icon"></i>
                                            Usuarios del sistema
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="#" @click.prevent="$modal.show('about-modal')">
                                    <i class="metismenu-icon fa fa-info"></i>
                                    Acerca de
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <modal name="about-modal" :adaptative="true" height="auto">
                    <div class="p-4">
                        <h5 class="mb-3"><i class="fa fa-coffee"></i> Acerca de Cofy</h5>
                        <p class="text-justify">
                            Software para cafeterías, restaurantes, bares, negocios de comidas y similares. Registre salas y mesas, productos, órdenes de pedido, domicilios, ventas directas; 
                            genere reportes de ventas, cree usuarios con permisos y mida la productividad de sus empleados, entre muchas cosas más.
                        </p>
                        <p>
                            Desarrollado por 
                            <a href="https://web.facebook.com/digitalappsoftware" target="_blank">DigitalApp</a> <br>
                            Teléfono: <a href="tel:3203719962" target="_blank">320 371 9962</a> <br>
                            WhatsApp: <a href="https://api.whatsapp.com/send?phone=573203719962" target="_blank">320 371 9962</a>
                        </p>
                        <hr>
                        <button class="btn btn-secondary mr-1" @click="$modal.hide('about-modal')">
                            <i class="fa fa-times"></i> Cerrar
                        </button>
                    </div>
                </modal>
            </div>
</template>

<script>
    export default {
        methods: {
            goToRouteDashboardIndex() {
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'dashboard' })
            },
            goToRouteCategoryIndex() {
                if (!this.$hasPermission('categories.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'categories.index' })
            },
            goToRouteProductIndex() {
                if (!this.$hasPermission('products.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'products.index' })
            },
            goToRouteClientIndex() {
                if (!this.$hasPermission('clients.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'clients.index' })
            },
            goToRouteRoomIndex() {
                if (!this.$hasPermission('rooms.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'rooms.index' })
            },
            goToRouteTableIndex() {
                if (!this.$hasPermission('tables.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'tables.index' })
            },
            goToRoutePaymentMethodIndex() {
                if (!this.$hasPermission('paymentMethods.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'paymentMethods.index' })
            },
            goToRouteParameterIndex() {
                if (!this.$hasPermission('parameters.update')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'parameters.index' })
            },
            goToRouteCompanyIndex() {
                if (!this.$hasPermission('company.update')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'company.index' })
            },
            goToRouteOrderIndex() {
                if (!this.$hasPermission('orders.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'orders.index' })
            },
            goToRouteDeliveryIndex() {
                if (!this.$hasPermission('deliveries.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'deliveries.index' })
            },
            goToRouteSaleIndex() {
                if (!this.$hasPermission('sales.create')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'sales.create' })
            },
            goToRouteReportIndex(nameRoute) {
                if (!this.$hasPermission('reports.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: nameRoute })
            },
            goToRouteUserIndex() {
                if (!this.$hasPermission('users.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'users.index' })
            },
            goToRouteKitchenIndex() {
                if (!this.$hasPermission('kitchen.index')) return this.$toastr.error('No tiene permisos para esta acción')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                this.$router.push({ name: 'kitchen.index' })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>