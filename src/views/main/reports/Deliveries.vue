<template>            
    <div class="row">
        <div class="col-lg-3 col-md-4 col-sm-12 mb-2">
            <div class="card">
                <div class="card-header">
                    INFORME DE DOMICILIOS
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
                        <button class="btn btn-success" @click="downloadDeliveriesInExcel" :disabled="!deliveries.data.length || downloadingDeliveriesInExcel">
                            <div class="spinner-border text-light spinner-border-sm" role="status" v-if="downloadingDeliveriesInExcel">
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
                                        <th>Usuario que registró</th>
                                        <th>Usuario que anuló</th>
                                        <th>Valor productos</th>
                                        <th>Valor domicilio</th>
                                        <th>Total</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="delivery in deliveries.data" :key="delivery.index">
                                            <td>{{ delivery.id }}</td>
                                            <td>{{ $moment(delivery.created_at).format('LLL') }}</td>
                                            <td>{{ delivery.status }}</td>
                                            <td>{{ delivery.user_create.names }}</td>
                                            <td>{{ delivery.user_cancel ? delivery.user_cancel.names : '' }}</td>
                                            <td>${{ $formatNum(delivery.total_order - delivery.value_delivery) }}</td>
                                            <td>${{ $formatNum(delivery.value_delivery) }}</td>
                                            <td>
                                                ${{ $formatNum(delivery.total_order) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <pagination :data="deliveries" @pagination-change-page="getDeliveries"></pagination>
                        </div>
                        <div class="table-responsive" v-else>
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Consecutivo</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Usuario que registró</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="deliveryDetail in deliveriesDetails.data" :key="`deliveryDetail-${deliveryDetail.id}`">
                                        <td>{{ deliveryDetail.order.id }}</td>
                                        <td>{{ $moment(deliveryDetail.order.created_at).format('LLL') }}</td>
                                        <td>{{ deliveryDetail.order.status }}</td>
                                        <td>{{ deliveryDetail.product.name }}</td>
                                        <td>
                                            ${{ $formatNum(deliveryDetail.price) }}
                                        </td>
                                        <td>{{ deliveryDetail.quantity }}</td>
                                        <td>${{ $formatNum(deliveryDetail.price * deliveryDetail.quantity) }}</td>
                                        <td>{{ deliveryDetail.order.user_create.names }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="deliveriesDetails" @pagination-change-page="getDeliveries"></pagination>
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
        name: 'reports.deliveries',
        components: {
            'search' : SearchOrderDeliveryComponent,
        },
        data() {
            return {
                deliveries: {
                    data: []
                },
                deliveriesDetails: {
                    data: []
                },
                searchData: {
                    dateInitial: '',
                    dateFinal: '',
                    typeReport: '',
                },
                errorsWhenGetOrders: {},
            
                loadingData: false,
                downloadingDeliveriesInExcel: false
            }
        },
        methods: {
            search (search) {
                this.searchData = search
                this.loadingData = true
                this.getDeliveries(1)
            },
            getDeliveries(page = 1) {
                this.$http.get(`reports/deliveries?page=${ page }&date_initial=${ this.searchData.dateInitial }
                                &date_final=${ this.searchData.dateFinal }&type_report=${ this.searchData.typeReport }`).then( response => {
                    if (this.searchData.typeReport == 'resumido') {
                        this.deliveries = response.data.orders
                    } else {
                        this.deliveriesDetails = response.data.ordersDetails
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
            downloadDeliveriesInExcel() {
                this.downloadingDeliveriesInExcel = true
                this.$http.get(`reports/deliveries/download-deliveries-in-excel?date_initial=${ this.searchData.dateInitial }&date_final=${ this.searchData.dateFinal }&type_report=${ this.searchData.typeReport }`, { responseType: 'blob' }).then(response => {
                    downloadJs(response.data, 'Informe-de-ordenes-de-pedido.xlsx')
                    this.downloadingDeliveriesInExcel = false
                    this.errorsWhenGetOrders = {}
                }).catch(() => {
                    this.downloadingDeliveriesInExcel = false
                    this.$toastr.error('Ocurrió un error al descargar el archivo')
                })
            },
            getTotal(orderDetails, delivery) {
                let total = 0
                orderDetails.forEach(detail => {
                    total += detail.quantity * detail.price
                })

                total += delivery.value_delivery

                return total
            },
        },
    }
</script>