<template>            
    <div class="row">
        <div class="col-lg-3 col-md-4 col-sm-12 mb-2">
            <div class="card">
                <div class="card-header">
                    INFORME DE ORDENES DE PEDIDO
                </div>
                <div class="card-body">
                    <search @emitData="search" :errorsWhenGetOrders="errorsWhenGetOrders"/>
                </div>
            </div>
        </div>
        <div class="col-lg-9 col-md-8 col-sm-12">
            <div class="card">
                <div class="card-header">
                    RESULTADOS
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-success" @click="downloadOrdersInExcel" :disabled="!orders.data.length || downloadingOrdersInExcel">
                            <div class="spinner-border text-light spinner-border-sm" role="status" v-if="downloadingOrdersInExcel">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <i class="fa fa-file-excel" v-else></i> Descargar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="loadingData" class="d-flex justify-content-center">
                        <div class="spinner-border text-primary" role="status" >
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="searchData.typeReport == 'resumido'">
                            <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Consecutivo</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Mesa</th>
                                        <th>Cliente</th>
                                        <th>Usuario que registró</th>
                                        <th>Usuario que anuló</th>
                                        <th>Total</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="order in orders.data" :key="order.index">
                                            <td>{{ order.id }}</td>
                                            <td>{{ $moment(order.created_at).format('LLL') }}</td>
                                            <td>{{ order.status }}</td>
                                            <td>{{ order.table.number }}</td>
                                            <td>{{ order.client.identification + ' - ' + order.client.full_names }}</td>
                                            <td>{{ order.user_create.names }}</td>
                                            <td>{{ order.user_cancel ? order.user_cancel.names : '' }}</td>
                                            <td>
                                                ${{ $formatNum(order.total_order) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <pagination :data="orders" @pagination-change-page="getOrders"></pagination>
                        </div>
                        <div v-else>
                            <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Consecutivo</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="orderDetail in ordersDetails.data" :key="`orderDetail-${orderDetail.id}`">
                                            <td>{{ orderDetail.order.id }}</td>
                                            <td>{{ $moment(orderDetail.order.created_at).format('LLL') }}</td>
                                            <td>{{ orderDetail.order.status }}</td>
                                            <td>{{ orderDetail.product.name }}</td>
                                            <td>{{ $formatNum(orderDetail.price) }}</td>
                                            <td>{{ orderDetail.quantity }}</td>
                                            <td>${{ $formatNum(orderDetail.subtotal) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <pagination :data="ordersDetails" @pagination-change-page="getOrders"></pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchOrderDeliveryComponent from './SearchOrderDeliveryComponent'
    import downloadJs from 'downloadjs'
    export default {
        name: 'reports.orders',
        components: {
            'search' : SearchOrderDeliveryComponent,
        },
        data() {
            return {
                orders: {
                    data: []
                },
                ordersDetails: {
                    data: []
                },
                searchData: {
                    dateInitial: '',
                    dateFinal: '',
                    typeReport: '',
                },
                errorsWhenGetOrders: {},
            
                loadingData: false,
                downloadingOrdersInExcel: false
            }
        },
        methods: {
            search (search) {
                this.searchData = search
                this.loadingData = true
                this.getOrders(1)
            },
            getOrders(page = 1) {
                this.$http.get(`reports/orders?page=${ page }&date_initial=${ this.searchData.dateInitial }
                                &date_final=${ this.searchData.dateFinal }&type_report=${ this.searchData.typeReport }`).then( response => {
                    if (this.searchData.typeReport == 'resumido') {
                        this.orders = response.data.orders
                    } else {
                        this.ordersDetails = response.data.ordersDetails
                    }

                    this.errorsWhenGetOrders = {}
                    this.loadingData = false
                }).catch(error => {
                    if (error.response.status == 422) {
                        this.errorsWhenGetOrders = error.response.data.errors
                    }
                    this.loadingData = false
                })
            },
            downloadOrdersInExcel() {
                this.downloadingOrdersInExcel = true
                this.$http.get(`reports/orders/download-orders-in-excel?date_initial=${ this.searchData.dateInitial }&date_final=${ this.searchData.dateFinal }&type_report=${ this.searchData.typeReport }`, { responseType: 'blob' }).then(response => {
                    downloadJs(response.data, 'Informe-de-ordenes-de-pedido.xlsx')
                    this.downloadingOrdersInExcel = false
                    this.errorsWhenGetOrders = {}
                }).catch(() => {
                    this.downloadingOrdersInExcel = false
                    this.$toastr.error('Ocurrió un error al descargar el archivo')
                })
            },
            getTotal(orderDetails, statusOrder) {
                let total = 0
                orderDetails.forEach(detail => {
                    total += detail.quantity * detail.price
                })

                return total
            },
        },
    }
</script>