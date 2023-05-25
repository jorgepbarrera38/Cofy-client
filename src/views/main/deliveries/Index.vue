<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Domicilios
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-success" @click="goToRouteCreateDelivery">
                            <i class="fa fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <!--<div class="row">
                        <div class="col-md-12">
                            <search-delivery @emitData="searchDelivery"/>
                        </div>
                    </div>-->
                    <div v-if="loadingData" class="d-flex justify-content-center">
                        <div class="spinner-border text-primary" role="status" >
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div v-else>
                        <div class="table-responsive">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Consecutivo</th>
                                    <th>Fecha</th>
                                    <th>Dirección</th>
                                    <th>Observaciónes</th>
                                    <th>Estado</th>
                                    <th>Valor domicilio</th>
                                    <th>Total</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="delivery in deliveries.data" :key="`deliv-${delivery.id}`">
                                        <td>{{ delivery.consecutive }}</td>
                                        <td nowrap>{{ $moment(delivery.created_at).format('LLL') }}</td>
                                        <td>{{ delivery.address }}</td>
                                        <td>{{ delivery.observations }}</td>
                                        <td>
                                            <div :class="{ 
                                                    badge: true,
                                                    'badge-success': delivery.status == 'Confirmado',
                                                    'badge-warning': delivery.status == 'Registrado',
                                                    'badge-secondary': delivery.status == 'Anulado'
                                            }">
                                                {{ delivery.status }}
                                            </div>
                                        </td>
                                        <td>${{ $formatNum(delivery.value_delivery) }}</td>
                                        <td>${{ $formatNum(getTotal(delivery.order_details, delivery)) }}</td>
                                        <td nowrap>
                                            <button class="btn btn-secondary mr-1" title="Editar domicilio" v-if="delivery.status != 'Registrado'"
                                                @click="showModalToSeeInfoFromDelivery(delivery)">
                                                <i class="fa fa-eye"></i>
                                            </button>
                                            <button class="btn btn-danger mr-1" title="Anular domicilio" v-if="delivery.status == 'Registrado'" :disabled="delivery.deleting"
                                                @click="showModalToCancelDelivery(delivery)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="delivery.deleting">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-times-circle" v-else></i>
                                            </button>
                                            <button class="btn btn-warning mr-1" title="Editar domicilio" v-if="delivery.status == 'Registrado'"
                                                @click="goToRouteEditDelivery(delivery)">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-info" title="Pagar domicilio" v-if="delivery.status == 'Registrado'"
                                                @click="showModalToPay(delivery)">
                                                <i class="fa fa-cash-register"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="deliveries" @pagination-change-page="getDeliveries"></pagination>
                        <modal name="info-from-delivery-modal" :adaptive="true" height="auto">
                            <div class="p-4">
                                <h5 class="mb-3">Información del domicilio</h5>
                                <div class="form-row">
                                    <div class="form-group col-md-12">
                                        <div class="table-responsive" style="max-height:280px;overflow:auto">
                                            <table class="table table-hover table-sm">
                                                <thead>
                                                    <th>Producto</th>
                                                    <th>Precio</th>
                                                    <th>Cantidad</th>
                                                    <th>Subtotal</th>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="order_detail in deliverySelectedToShowInfo.order_details" :key="`order-det-${ order_detail.id }`">
                                                        <td>{{ order_detail.product.name }}</td>
                                                        <td>${{ $formatNum(order_detail.price) }}</td>
                                                        <td>{{ order_detail.quantity }}</td>
                                                        <td>
                                                            ${{ $formatNum(order_detail.subtotal) }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td nowrap><strong>Valor domicilio:</strong></td>
                                                        <td>
                                                            ${{ $formatNum(deliverySelectedToShowInfo.value_delivery) }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td><strong>Total:</strong></td>
                                                        <td>
                                                            ${{ $formatNum(deliverySelectedToShowInfo.total_order) }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <hr>
                                <button class="btn btn-secondary mr-1" @click="$modal.hide('info-from-delivery-modal')" :disabled="paying">
                                    <i class="fa fa-times"></i> Cerrar
                                </button>
                            </div>
                        </modal>
                        
                        <modal name="cancel-delivery-modal" :adaptive="true" height="auto">
                            <div class="p-4">
                                <h5 class="mb-3">Anular domicilio</h5>
                                <div class="row">
                                    <div class="col-md-12">
                                        <p>¿Seguro que desea anular el domicilio?</p>
                                        <hr>
                                        <button class="btn btn-secondary mr-1" @click="$modal.hide('cancel-delivery-modal')" :disabled="cancelingDelivery">
                                            <i class="fa fa-times"></i> Cerrar
                                        </button>
                                        <button class="btn btn-danger" :disabled="cancelingDelivery"
                                            @click="cancelDelivery">
                                            <div class="spinner-border text-light spinner-border-sm" role="status" v-if="cancelingDelivery">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                            <i class="fa fa-times-circle" v-else></i> Anular
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </modal>
                        
                        <modal name="pay-modal" :adaptive="true" height="auto">
                            <div class="p-4">
                                <h5 class="mb-3">Pagar pedido</h5>
                                <div class="alert alert-danger" v-if="Object.keys(errorsWhenPay).length">
                                    <li v-for="(error, index) in errorsWhenPay" :key="`err-${ index }`">
                                        {{ error[0] }}
                                    </li>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="table-responsive" style="max-height:280px;overflow:auto">
                                            <table class="table table-hover table-sm">
                                                <thead>
                                                    <th>Producto</th>
                                                    <th>Precio</th>
                                                    <th>Cantidad</th>
                                                    <th class="text-right">Subtotal</th>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="order_detail in deliverySelectedToShowInfo.order_details" :key="`order-det-${ order_detail.id }`">
                                                        <td>{{ order_detail.product.name }}</td>
                                                        <td>${{ $formatNum(order_detail.price) }}</td>
                                                        <td>{{ order_detail.quantity }}</td>
                                                        <td class="text-right">
                                                            ${{ $formatNum(order_detail.subtotal) }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td class="text-right" nowrap><strong>Valor domicilio:</strong></td>
                                                        <td class="text-right">
                                                            ${{ $formatNum(deliverySelectedToShowInfo.value_delivery) }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td class="text-right"><strong>Total:</strong></td>
                                                        <td class="text-right">
                                                            ${{ $formatNum(deliverySelectedToShowInfo.total_order) }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-12">
                                        <label for="">Método de pago</label>
                                        <select class="form-control" v-model="payData.payment_method_id">
                                            <option value="">Seleccione método de pago</option>
                                            <option :value="paymentMethod.id" v-for="paymentMethod in paymentMethods" :key="`paymentMethod-${ paymentMethod.id }`">
                                                {{ paymentMethod.name }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label for="">Valor con que pagan</label>
                                        <input type="number" class="form-control" v-model="payData.valueWithPay">
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label class="form-check-label">
                                            <input type="checkbox" v-model="payData.printBill"> Imprimir comprobante de venta
                                        </label>
                                    </div>
                                </div>
                                <hr>
                                <button class="btn btn-secondary mr-1" @click="$modal.hide('pay-modal')" :disabled="paying">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchDeliveryComponent from './SearchDeliveryComponent'
    import printJS from 'print-js'
    export default {
        name: 'deliveries.index',
        components: {
            'search-delivery' : SearchDeliveryComponent,
        },
        created () {
            this.getDeliveries()
        },
        data() {
            return {
                deliveries: {},
                paymentMethods: [],
                loadingData: true,
                deliverySelectedToShowInfo: {
                    order_details: []
                },
                paying: false,
                payData: {
                    delivery_id: '',
                    valueWithPay: '',
                    payment_method_id: '',
                    total: '',
                    printBill: true
                },
                errorsWhenPay: {},
                deliverySelectedToDelete: {},
                cancelingDelivery: false,
                searchData: {
                    dateInitial: '',
                    dateFinal: ''
                }
            }
        },
        methods: {
            searchDelivery (search) {
                this.searchData = search
                this.loadingData = true
                this.getDeliveries(1)
            },
            getDeliveries(page = 1) {
                this.$http.get(`deliveries?page=${ page }&date_initial=${ this.searchData.dateInitial }&date_final=${ this.searchData.dateFinal }`).then( response => {
                    this.deliveries = response.data.deliveries
                    this.paymentMethods = response.data.paymentMethods
                    this.paymentMethods.forEach(paymentMethod => {
                            if (paymentMethod.first) {
                                this.payData.payment_method_id = paymentMethod.id
                            }
                        })
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            getTotal(orderDetails, delivery) {
                let total = 0
                orderDetails.forEach(detail => {
                    total += detail.quantity * detail.price
                })

                if (delivery.value_delivery) {
                    total += delivery.value_delivery
                }

                return total
            },
            showModalToSeeInfoFromDelivery(delivery) {
                this.deliverySelectedToShowInfo = delivery
                this.$modal.show('info-from-delivery-modal')
            },
            showModalToCancelDelivery(delivery) {
                if (!this.$hasPermission('deliveries.cancel')) return this.$toastr.error('No tiene permisos para esta acción')
                this.deliverySelectedToDelete = delivery
                this.$modal.show('cancel-delivery-modal')
            },
            cancelDelivery() {
                this.cancelingDelivery = true
                this.$http.delete(`deliveries/${ this.deliverySelectedToDelete.id }`).then( () => {
                    this.getDeliveries()
                    this.cancelingDelivery = false
                    this.$modal.hide('cancel-delivery-modal')
                    this.$toastr.success('Domicilio anulado')
                }).catch(error => {
                    this.cancelingDelivery = false
                    if (error.response.status == 422) {
                        this.$toastr.error(error.response.data.errors[0])
                    } else {
                        this.$toastr.error('El domicilio no se pudo anular')
                    }
                })
            },
            showModalToPay(delivery) {
                if (!this.$hasPermission('deliveries.pay')) return this.$toastr.error('No tiene permisos para esta acción')
                this.errorsWhenPay = {}
                this.payData.delivery_id = delivery.id
                this.payData.valueWithPay = ''
                this.deliverySelectedToShowInfo = delivery
                this.$modal.show('pay-modal')
            },
            pay() {
                this.paying = true

                let data = { valueWithPay: this.payData.valueWithPay, payment_method_id: this.payData.payment_method_id, printBill: this.payData.printBill }

                this.$http.post(`deliveries/${ this.payData.delivery_id }`, data, { responseType: 'blob' }).then(response => {
                    this.getDeliveries()
                    this.$modal.hide('pay-modal')
                    this.paying = false
                    this.$toastr.success('Pago registrado')
                    this.errorsWhenPay = {}
                    printJS(URL.createObjectURL(response.data))
                }).catch(error => {
                    this.paying = false
                    if (error.response.status == 422) {
                        error.response.data.text().then(response => {
                            this.errorsWhenPay = JSON.parse(response).errors
                        })
                    }
                })
            },
            goToRouteCreateDelivery() {
                if (!this.$hasPermission('deliveries.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'deliveries.create'})
            },
            goToRouteEditDelivery(delivery) {
                if (!this.$hasPermission('deliveries.update')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'deliveries.edit', params: { deliveryId: delivery.id } })
            },
        },
    }
</script>