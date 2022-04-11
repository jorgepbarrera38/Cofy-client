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
                    Editar domicilio
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-danger mr-1" :disabled="saving"
                            @click="$router.push({ name: 'deliveries.index' })">
                            <i class="fa fa-undo"></i> Atrás
                        </button>
                        <button class="btn btn-primary" :disabled="saving"
                            @click="save">
                            <div class="spinner-border text-light spinner-border-sm" role="status" v-if="saving">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <i class="fa fa-save" v-else></i> Actualizar domicilio
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="alert alert-danger" v-if="Object.keys(errors).length">
                        <li v-for="(error, index) in errors" :key="`error-${ index }`">
                            {{ error[0] }}
                        </li>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="">Cliente</label>
                            <v-select :options="clients" 
                                            :reduce="client => client.id" 
                                            label="identificationAndfullNames" 
                                            v-model="order.client_id">
                                        <template v-slot:no-options="{ searching }">
                                            <template v-if="searching">
                                                No hay coincidencias.
                                            </template>
                                        </template>
                            </v-select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="">Valor domicilio</label>
                            <input type="number" class="form-control" v-model="order.value_delivery" :disabled="!order.allow_change_value_delivery" min="0" max="999999">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="">Dirección</label>
                            <input type="text" class="form-control" v-model="order.address" maxlength="150">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="">Observaciónes (opcional)</label>
                            <input type="text" class="form-control" v-model="order.observations" maxlength="250" >
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover table-sm">
                            <thead>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th>Observaciónes</th>
                                <th></th>
                            </thead>
                            <tbody>
                                <tr v-for="(orderDetail, index) in order.order_details" :key="`orderDetail-${ index }`">
                                    <td>
                                        <img width="40" class="rounded-circle mr-1" :src="orderDetail.product.image ? $hostServer + orderDetail.product.image : require('@/assets/placeholder-image.jpg')" alt="">
                                        {{ orderDetail.product.name }}
                                    </td>
                                    <td>${{ $formatNum(orderDetail.product.price) }}</td>
                                    <td>
                                        <input type="number" class="form-control" v-model="orderDetail.quantity">
                                    </td>
                                    <td>${{ $formatNum(orderDetail.quantity * orderDetail.product.price) }}</td>
                                    <td>
                                        <input type="text" class="form-control" v-model="orderDetail.observations" maxlength="60">
                                    </td>
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ListProduct from '../orders/ListProductComponent'
    export default {
        components: {
            'list-product': ListProduct
        },
        created () {
            this.getDelivery()
            this.getProductsCategoriesClientsAndParameters()
        },
        name: 'deliveries.create',
        data() {
            return {
                getOnlyProducts: false,
                products: [],
                categoriesFromProduct: [],
                clients: [],
                order: {
                    client_id: '',
                    address: '',
                    observations: '',
                    order_details: [],
                    value_delivery: '',
                    allow_change_value_delivery: true
                },
                saving: false,
                errors: {},
                loadingData: true
            }
        },
        methods: {
            getDelivery() {
                this.$http.get(`deliveries/${ this.$route.params.deliveryId }`).then( response => {
                    this.order = response.data
                    this.order.allow_change_value_delivery = true

                })
            },
            getProductsCategoriesClientsAndParameters() {
                this.$http.get(`orders/get-products-categories-clients-and-parameters?get_only_products=${ this.getOnlyProducts }`).then( response => {
                    if (this.getOnlyProducts) {
                        this.products = response.data
                    } else {
                        this.products = response.data.products
                        this.categoriesFromProduct = response.data.categories

                        if (response.data.parameters) {
                            //this.order.value_delivery = response.data.parameters.value_delivery
                            this.order.allow_change_value_delivery = response.data.parameters.allow_change_value_delivery
                        }

                        this.clients = response.data.clients
                        this.clients.forEach(client => {
                            client.identificationAndfullNames = `${ client.identification } - ${ client.full_names }`
                        })

                        this.getOnlyProducts = true
                    }
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            addProductToOrder(product) {
                let productFound = this.order.order_details.find( detail => {
                    return detail.product.id == product.id
                })

                if (productFound) {
                    return productFound.quantity = parseInt(productFound.quantity) + 1
                }

                let data = {
                    product: { id: product.id, name: product.name, price: product.price, image: product.image },
                    quantity: 1,
                    observations: ''
                }
                this.order.order_details.push(data)
            },
            deleteProductFromOrder (productIndex) {
                this.order.order_details.splice(productIndex, 1)
            },
            save() {
                let orderDetails = this.order.order_details.map(detail => {
                    return {
                        product_id: detail.product.id,
                        quantity: detail.quantity,
                        observations: detail.observations
                    }
                })
                let data = {
                    client_id: this.order.client_id,
                    value_delivery: this.order.value_delivery,
                    address: this.order.address,
                    observations: this.order.observations,
                    orderDetails
                }
                
                this.saving = true
                this.$http.put(`deliveries/${ this.$route.params.deliveryId }`, data).then( response => {
                    this.$toastr.success('Domicilio actualizado')
                    this.$router.push({ name: 'deliveries.index' })
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            getTotal() {
                let total = 0

                this.order.order_details.forEach(detail => {
                    total += detail.quantity * detail.product.price
                })

                return total
            },
        },
    }
</script>