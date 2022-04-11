<template>            
    <div class="row">
        <div class="col-md-12">    
            <!--<div class="row">
                <div class="col-md-4">
                    <search-simple @searchNow="searchTable" placeholder="Número mesa"/>
                </div>
            </div>-->
            <div v-if="loadingTableWithOrders" class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status" >
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div v-else>
                <ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
                    <li class="nav-item" v-for="room in rooms" :key="`room-${ room.id }`" @click.prevent="roomSelected = room.id">
                        <a :class="{ 'nav-link': true, show: true, active: roomSelected == room.id }" href="#">
                            <span>{{ room.name }}</span>
                        </a>
                    </li>
                </ul>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-xl-4" v-for="table in filterTablesForRoom" :key="`table-${ table.id }`">
                        <div class="card mb-3 widget-content">
                            <div class="widget-content-outer">
                                <div class="widget-content-wrapper">
                                    <div class="widget-content-left">
                                        <div class="widget-heading" style="font-size: 15px">Mesa: {{ table.number }}</div>
                                        <div class="widget-subheading" :style="{ opacity: table.orders.length ? .7 : 0 }">Consecutivo: {{ table.orders.length ? table.orders[0].id : '' }}</div>
                                    </div>
                                    <div class="widget-content-right">
                                        <div class="widget-numbers text-success">{{ table.orders.length ? `$${$formatNum(table.orders[0].total_order)}` : '' }}</div>
                                    </div>
                                </div>
                                <div class="widget-progress-wrapper">
                                    <div class="progress-sub-label">
                                        <div class="sub-label-left">
                                            <div :class="{ badge: true, 'badge-success': table.free, 'badge-danger': !table.free  }">
                                                {{ table.free ? 'LIBRE' : 'OCUPADA' }}
                                            </div>
                                        </div>
                                        <div class="sub-label-right">
                                            <button class="btn btn-success" v-if="table.free" title="Tomar pedido"
                                                @click="goToRouteCreateOrder(table)">
                                                <i class="fa fa-plus"></i> Tomar
                                            </button>
                                            <button class="btn btn-danger mr-1" v-if="!table.free" title="Anular pedido"
                                                @click="showModalToCancelOrder(table)">
                                                <i class="fa fa-times-circle"></i>
                                            </button>
                                            <button class="btn btn-warning mr-1" v-if="!table.free" title="Editar pedido"
                                                @click="goToRouteEditOrder(table)">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-secondary mr-1" v-if="!table.free" title="Trasladar pedido"
                                                @click="showModalTotransferOrder(table.orders[0])">
                                                <i class="fa fa-exchange-alt"></i>
                                            </button>
                                            <button class="btn btn-info" v-if="!table.free" @click="showModal(table.orders[0])" title="Pagar pedido">
                                                <i class="fa fa-cash-register"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <modal name="show-details-and-pay-modal" :adaptive="true" height="auto">
                    <div class="p-4">
                        <h5 class="mb-3">Pagar pedido</h5>
                        <div class="alert alert-danger" v-if="Object.keys(errorsWhenPayOrder).length">
                            <li v-for="(error, index) in errorsWhenPayOrder" :key="`err-${ index }`">
                                {{ error[0] }}
                            </li>
                        </div>
                        <div class="mb-2">
                            <strong>Cliente: </strong>{{ orderSelected.client ? orderSelected.client.full_names : '' }}
                        </div>
                        <div class="table-responsive" style="max-height:180px;overflow:auto">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </thead>
                                <tbody>
                                    <tr v-for="(orderDetail, index) in orderSelected.orderDetails" :key="`det-${ index }`">
                                        <td>{{ orderDetail.product.name }}</td>
                                        <td>${{ $formatNum(orderDetail.price) }}</td>
                                        <td>
                                            <input type="number" class="form-control" v-model="orderDetail.quantity" v-if="orderDetail.edit">
                                            <span v-else>{{ orderDetail.quantity }}</span>
                                        </td>
                                        <td>${{ $formatNum(orderDetail.subtotal) }}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td><strong>Total:</strong></td>
                                        <td>${{ $formatNum(orderSelected.total_order) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <label for="">Método de pago</label>
                                <select class="form-control" v-model="orderSelected.payment_method_id">
                                    <option value="">Seleccione método de pago</option>
                                    <option :value="paymentMethod.id" v-for="paymentMethod in paymentMethods" :key="`paymentMethod-${ paymentMethod.id }`">
                                        {{ paymentMethod.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="">Valor con que pagan</label>
                                <input type="number" class="form-control" v-model="orderSelected.valueWithPay">
                            </div>
                            <div class="form-group col-md-12">
                                <label for="">Valor a devolver</label>
                                <h2 :class="{ 'text-danger': getChange < 0, 'text-success': getChange >= 0 }">
                                    ${{ $formatNum(getChange) }}
                                </h2>
                            </div>
                            <div class="form-group col-md-12">
                                <label class="form-check-label">
                                    <input type="checkbox" v-model="orderSelected.printBill"> Imprimir comprobante de venta
                                </label>
                            </div>
                        </div>
                        <hr>
                        <button class="btn btn-secondary mr-1" @click="$modal.hide('show-details-and-pay-modal')" :disabled="paying">
                            <i class="fa fa-times"></i> Cerrar
                        </button>
                        <button class="btn btn-primary" @click="pay" :disabled="paying">
                            <div class="spinner-border text-light spinner-border-sm" role="status" v-if="paying">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <i class="fa fa-cash-register" v-else></i> Pagar
                        </button>
                    </div>
                </modal>

                <modal name="transfer-order-from-table" :adaptive="true" height="auto">
                    <div class="p-4">
                        <h5 class="mb-3">Trasladar pedido</h5>
                        <div class="alert alert-danger" v-if="Object.keys(errorsWhenTransferOrder).length">
                            <li v-for="(error, index) in errorsWhenTransferOrder" :key="`err-${ index }`">
                                {{ error[0] }}
                            </li>
                        </div>
                        <div class="form-group">
                            <label for="">Mesa</label>
                            <select class="form-control" v-model="transfer.tableId">
                                <option value="">Seleccione mesa</option>
                                <option :value="table.id" v-for="table in allTablesToTransferOrder" :key="`alltable-${ table.id }`">
                                    {{ table.number }}
                                </option>
                            </select>
                        </div>
                        <hr>
                        <button class="btn btn-secondary mr-1" @click="$modal.hide('transfer-order-from-table')" :disabled="transferingOrder">
                            <i class="fa fa-times"></i> Cerrar
                        </button>
                        <button class="btn btn-primary" title="Guardar" :disabled="transferingOrder"
                            @click="transferOrder">
                            <div class="spinner-border text-light spinner-border-sm" role="status" v-if="transferingOrder">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <i class="fa fa-save" v-else></i> Guardar
                        </button>
                    </div>
                </modal>

                <modal name="cancel-order-modal" :adaptative="true" height="auto">
                    <div class="p-4">
                        <h5 class="mb-3">Anular orden de pedido</h5>
                        <p>¿Seguro que desea anular la orden de pedido?</p>
                        <hr>
                        <button class="btn btn-secondary mr-1" @click="$modal.hide('cancel-order-modal')" :disabled="cancelingOrder">
                            <i class="fa fa-times"></i> Cerrar
                        </button>
                        <button class="btn btn-danger" :disabled="cancelingOrder"
                            @click="cancelOrder">
                            <div class="spinner-border text-light spinner-border-sm" role="status" v-if="cancelingOrder">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <i class="fa fa-times-circle" v-else></i> Anular
                        </button>
                    </div>
                </modal>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSimple from '../components/SearchSimple'
    import printJS from 'print-js'

    export default {
        name: 'orders.index',
        components: {
            'search-simple' : SearchSimple,
        },
        created () {
            this.getTablesRoomsAndPaymentMethods()
            this.getAllTablesToTransferOrder()
        },
        destroyed () {
            clearInterval(this.interval)
        },
        data() {
            return {
                tables: [],
                rooms: [],
                paymentMethods: [],
                roomSelected: '',
                getTablesWithRooms: true,
                loadingTableWithOrders: true,
                interval: '',
                orderSelected: {
                    id: '',
                    orderDetails: [],
                    valueWithPay: '',
                    payment_method_id: '',
                    total_order: '',
                    printBill: true
                },
                transfer: {
                    orderId: '',
                    tableId: ''
                },
                TableWithOrderSelectedToDelete: {
                },
                allTablesToTransferOrder: [],
                transferingOrder: false,
                cancelingOrder: false,
                errorsWhenTransferOrder: {},
                paying: false,
                errorsWhenPayOrder: {}
            }
        },
        methods: {
            searchTable (search) {
                this.loadingTableWithOrders = true
                this.getTablesRoomsAndPaymentMethods(search)
            },
            getTablesRoomsAndPaymentMethods(search = '') {
                this.$http.get(`orders/get-tables-rooms-and-payment-methods?number=${ search }&get_tables_with_rooms=${ this.getTablesWithRooms }`).then( response => {
                    if (this.getTablesWithRooms) {
                        this.tables = response.data.tables
                        this.rooms = response.data.rooms
                        this.paymentMethods = response.data.paymentMethods
                        this.paymentMethods.forEach(paymentMethod => {
                            if (paymentMethod.first) {
                                this.orderSelected.payment_method_id = paymentMethod.id
                            }
                        })
                        this.roomSelected = this.rooms.find(room => room.first).id || ''
                        this.getTablesWithRooms = false
                         this.interval = setInterval(() => {
                            this.getTablesRoomsAndPaymentMethods()
                        }, 10000)
                    } else {
                        this.tables = response.data
                    }
                    this.loadingTableWithOrders = false
                }).catch(() => {
                    this.loadingTableWithOrders = false
                })
            },
            getAllTablesToTransferOrder() {
                this.$http.get(`orders/get-all-tables-to-transfer`).then( response => {
                    this.allTablesToTransferOrder = response.data
                })
            },
            getTotal(orderDetails) {
                let total = 0

                orderDetails.forEach(detail => {
                    total += detail.quantity * detail.price
                })

                return total
            },
            showModalToCancelOrder(table) { 
                if (!this.$hasPermission('orders.cancel')) return this.$toastr.error('No tiene permisos para esta acción')
                this.TableWithOrderSelectedToDelete = table
                this.$modal.show('cancel-order-modal')
            },
            cancelOrder() {
                
                this.cancelingOrder = true
                this.$http.delete(`orders/${ this.TableWithOrderSelectedToDelete.orders[0].id }/cancel-order`).then( response => {
                    this.getTablesRoomsAndPaymentMethods()
                    this.cancelingOrder = false
                    this.$modal.hide('cancel-order-modal')
                    this.$toastr.success('Pedido anulado')
                }).catch(error => {
                    this.cancelingOrder = false
                    if (error.response.status == 422) {
                        this.$toastr.error(error.response.data.errors[0])
                    }
                })
            },
            showModal(order) {
                if (!this.$hasPermission('orders.pay')) return this.$toastr.error('No tiene permisos para esta acción')
                this.errorsWhenPayOrder = {}
                this.orderSelected.valueWithPay = ''
                this.orderSelected.id = order.id
                this.orderSelected.client = order.client
                this.orderSelected.orderDetails = order.order_details
                this.orderSelected.total_order = order.total_order
                this.$modal.show('show-details-and-pay-modal');
            },
            showModalTotransferOrder(order) {
                if (!this.$hasPermission('orders.transfer')) return this.$toastr.error('No tiene permisos para esta acción')
                this.errorsWhenTransferOrder = {}
                this.transfer.tableId = ''
                this.transfer.orderId = order.id
                this.$modal.show('transfer-order-from-table')
            },
            transferOrder() {
                this.transferingOrder = true
                this.$http.post(`orders/${ this.transfer.orderId }/transfer-order`, { table: this.transfer.tableId }).then( response => {
                    this.getTablesRoomsAndPaymentMethods()
                    this.$modal.hide('transfer-order-from-table')
                    this.transferingOrder = false
                    this.errorsWhenTransferOrder = {}
                    this.transfer.tableId = ''
                    this.transfer.orderId = ''
                }).catch(error => {
                    this.transferingOrder = false
                    if (error.response.status == 422) {
                        this.errorsWhenTransferOrder = error.response.data.errors
                    }
                })
            },
            pay() {
                this.paying = true
                
                let data = { 
                                valueWithPay: this.orderSelected.valueWithPay, 
                                payment_method_id: this.orderSelected.payment_method_id,
                                printBill: this.orderSelected.printBill
                            }
                
                this.$http.post(`orders/${ this.orderSelected.id }/pay`, data, { responseType: 'blob' }).then( response => {
                    //window.open(URL.createObjectURL(response.data), '_blank')
                    this.getTablesRoomsAndPaymentMethods()
                    this.paying = false
                    this.$modal.hide('show-details-and-pay-modal')
                    this.$toastr.success('Pago registrado')
                    printJS(URL.createObjectURL(response.data))
                }).catch(error => {
                    this.paying = false
                    if (error.response.status == 422) {
                        error.response.data.text().then(response => {
                            this.errorsWhenPayOrder = JSON.parse(response).errors
                        })
                    }
                })
            },
            goToRouteCreateOrder(table) {
                if (!this.$hasPermission('orders.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'orders.create', params: { tableId: table.id } })
            },
            goToRouteEditOrder(table) {
                if (!this.$hasPermission('orders.update')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'orders.edit', params: { orderId: table.orders[0].id } })
            },
        },
        computed: {
            filterTablesForRoom() {
                return this.tables.filter(table => {
                    return table.room_id == this.roomSelected
                })
            },
            getChange() {
                return this.orderSelected.valueWithPay - this.orderSelected.total_order
            }
        },
    }
</script>