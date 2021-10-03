<template>            
    <div class="row" style="height:100%">
        <div class="col-lg-5 col-md-6 col-sm-12" style="height:100%">
            <list-product :products="products" 
                        :categoriesFromProduct="categoriesFromProduct"
                        @addProductToOrder="addProductToOrder"
                        :loadingData="loadingData"
                        />
        </div>
        <div class="col-lg-7 col-md-6 col-sm-12" style="height:100%">
            <div class="card" style="height:100%">
                <div class="card-header">
                    Venta directa
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-primary"
                            @click="showModalToPay">
                            <i class="fa fa-cash-register"></i> Pagar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="">Cliente</label>
                        <v-select :options="clients" 
                                        :reduce="client => client" 
                                        label="identificationAndfullNames" 
                                        v-model="order.client">
                                    <template v-slot:no-options="{ searching }">
                                        <template v-if="searching">
                                            No hay coincidencias.
                                        </template>
                                    </template>
                        </v-select>
                    </div>
                    <div class="table-responsive"> <!--:style="{'max-height':heightDivOfProducts, overflow:'auto'}"-->
                        <table class="table table-hover table-sm">
                            <thead>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th></th>
                            </thead>
                            <tbody>
                                <tr v-for="(orderDetail, index) in order.orderDetails" :key="`orderDetail-${ index }`">
                                    <td nowrap>
                                        <img width="40" class="rounded-circle mr-1" :src="orderDetail.product_image ? $hostServer + orderDetail.product_image : require('@/assets/placeholder-image.jpg')" alt="">
                                        {{ orderDetail.product_name }}
                                    </td>
                                    <td>${{ $formatNum(orderDetail.product_price) }}</td>
                                    <td>
                                        <input type="number" class="form-control" v-model="orderDetail.quantity">
                                    </td>
                                    <td>${{ $formatNum(orderDetail.quantity * orderDetail.product_price) }}</td>
                                    <td nowrap>
                                        <button class="btn btn-danger" title="Eliminar"
                                            @click="deleteProductFromOrder(index)">
                                            <i class="fa fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td><strong>Total:</strong></td>
                                    <td>${{ $formatNum(getTotal()) }}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <modal name="pay-modal" :adaptive="true" height="auto">
                        <div class="p-4">
                            <h5 class="mb-3">Pagar</h5>
                            <div class="alert alert-danger" v-if="Object.keys(errorsWhenPayOrder).length">
                                <li v-for="(error, index) in errorsWhenPayOrder" :key="`err-${ index }`">
                                    {{ error[0] }}
                                </li>
                            </div>
                            <!--<div class="mb-2">
                                <strong>Cliente: </strong>{{ order.client ? order.client.full_names : '' }}
                            </div>-->
                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="">Método de pago</label>
                                    <select class="form-control" v-model="order.payment_method_id">
                                        <option value="">Seleccione método de pago</option>
                                        <option :value="paymentMethod.id" v-for="paymentMethod in paymentMethods" :key="`paymentMethod-${ paymentMethod.id }`">
                                            {{ paymentMethod.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group col-md-12">
                                    <label for="">Valor con que pagan</label>
                                    <input type="number" class="form-control" v-model="order.valueWithPay">
                                </div>
                                <div class="form-group col-md-12">
                                    <label for="">Valor a devolver</label>
                                    <h2 :class="{ 'text-danger': getChange < 0, 'text-success': getChange >= 0 }">
                                        ${{ $formatNum(getChange) }}
                                    </h2>
                                </div>
                                <div class="form-group col-md-12">
                                    <label class="form-check-label">
                                        <input type="checkbox" v-model="order.printBill"> Imprimir factura de venta
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
</template>

<script>
    import ListProduct from '../orders/ListProductComponent'
    import printJS from 'print-js'
    export default {
        components: {
            'list-product': ListProduct
        },
        created () {
            this.getProductsCategoriesClientsAndPaymentMethods()  
        },
        name: 'orders.create',
        data() {
            return {
                products: [],
                categoriesFromProduct: [],
                clients: [],
                paymentMethods: [],
                order: {
                    client: '',
                    client_id: '',
                    valueWithPay: '',
                    orderDetails: [],
                    payment_method_id: '',
                    printBill: true
                },
                payment_method_original: '',
                paying: false,
                errorsWhenPayOrder: {},
                loadingData: true
            }
        },
        methods: {
            getProductsCategoriesClientsAndPaymentMethods() {
                this.$http.get(`sales/get-products-categories-clients-and-payment-methods`).then( response => {
                    
                    this.products = response.data.products
                    this.categoriesFromProduct = response.data.categories

                    this.clients = response.data.clients
                    this.clients.forEach(client => {
                        if (client.first) {
                            this.order.client = client
                        }
                        client.identificationAndfullNames = `${ client.identification } - ${ client.full_names }`
                    })

                    this.paymentMethods = response.data.paymentMethods
                    this.paymentMethods.forEach(paymentMethod => {
                            if (paymentMethod.first) {
                                this.order.payment_method_id = paymentMethod.id
                                this.payment_method_original = paymentMethod.id
                            }
                        })

                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            addProductToOrder(product) {
                let productFound = this.order.orderDetails.find( detail => {
                    return detail.product_id == product.id
                })

                if (productFound) {
                    return productFound.quantity = parseInt(productFound.quantity) + 1
                }

                let data = {
                    product_id: product.id,
                    product_image: product.image,
                    quantity: 1,
                    product_name: product.name,
                    product_price: product.price
                }
                this.order.orderDetails.push(data)
            },
            deleteProductFromOrder (productIndex) {
                this.order.orderDetails.splice(productIndex, 1)
            },
            showModalToPay() {
                this.order.client_id = this.order.client.id ? this.order.client.id : ''

                if (this.order.client_id == '') {
                    return this.$toastr.error('Debe Seleccionar el cliente')
                }

                if (!this.order.orderDetails.length) {
                    return this.$toastr.error('Debe agregar productos')
                }

                this.$modal.show('pay-modal')
            },
            pay() {
                this.paying = true

                this.$http.post(`sales/pay`, this.order, { responseType: 'blob' }).then( response => {
                    this.paying = false
                    this.$toastr.success('Venta registrada')
                    this.$modal.hide('pay-modal')
                    this.order = {
                        client_id: '',
                        valueWithPay: '',
                        orderDetails: [],
                        payment_method_id: this.payment_method_original,
                        printBill: true
                    }
                    this.clients.forEach(client => {
                        if (client.first) {
                            this.order.client = client
                        }
                    })
                    printJS(URL.createObjectURL(response.data))
                    this.errorsWhenPayOrder = {}
                }).catch(error => {
                    this.paying = false
                    if (error.response.status == 422) {
                        error.response.data.text().then(response => {
                            this.errorsWhenPayOrder = JSON.parse(response).errors
                        })
                    }
                })
            },
            getTotal() {
                let total = 0

                this.order.orderDetails.forEach(detail => {
                    total += detail.quantity * detail.product_price
                })

                return total
            },
        },
        computed: {
            getChange() {
                return this.order.valueWithPay - this.getTotal()
            }
        },
        
    }
</script>
