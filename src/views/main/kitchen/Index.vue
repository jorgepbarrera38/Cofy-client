<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="alert alert-danger" v-if="errors">
                <li v-for="(error, index) in errors" :key="`error-${ index }`">
                    {{ error[0] }}
                </li>
            </div>
        </div>  
        <div class="col-md-12" v-if="loadingData">
            <div class="d-flex justify-content-center">
                
                    <div class="spinner-border text-primary" role="status" >
                        <span class="sr-only">Loading...</span>
                    </div>
            </div>
        </div>
        <div  v-else class="col-lg-4 col-md-6 col-sm-12" v-for="orderAndDelivery in ordersAndDeliveries" :key="`order-or-delivery-${ orderAndDelivery.id }`">
            <div class="main-card mb-3 card">
                <div class="card-header">
                    FECHA: {{ $moment(orderAndDelivery.created_at).format('LLL') }}
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-warning mt-1" v-if="orderAndDelivery.status_kitchen == 'Pendiente'" :disabled="orderAndDelivery.updating_status_kitchen"
                            @click="orderAndDeliveryIsPrepared(orderAndDelivery)">
                            <div class="spinner-border spinner-border-sm" role="status" v-if="orderAndDelivery.updating_status_kitchen">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <i class="fa fa-check" v-else></i> Se preparó
                        </button>
                        <button class="btn btn-success mt-1" v-if="orderAndDelivery.status_kitchen == 'Preparado'" :disabled="orderAndDelivery.updating_status_kitchen"
                            @click="orderAndDeliveryIsDelivered(orderAndDelivery)">
                            <div class="spinner-border spinner-border-sm" role="status" v-if="orderAndDelivery.updating_status_kitchen">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <i class="fa fa-check" v-else></i> Se entregó
                        </button>
                    </div>
                </div>
                <div class="pl-3 pr-3 pt-2">
                    <strong>Consecutivo: </strong>{{ orderAndDelivery.id }} <br>
                    <strong>Tipo: </strong>{{ orderAndDelivery.type }}
                    <span v-if="orderAndDelivery.type == 1">
                        <strong> - Mesa: </strong>{{ orderAndDelivery.table.number }}
                    </span>
                    <br>
                    <strong>Usuario que generó: </strong>{{ orderAndDelivery.user_create.identification + ' - ' + orderAndDelivery.user_create.names }} <br>
                    <span :class="{badge: true, 
                                'badge-danger': orderAndDelivery.status_kitchen == 'Pendiente',
                                'badge-warning': orderAndDelivery.status_kitchen == 'Preparado',
                                'badge-success': orderAndDelivery.status_kitchen == 'Entregado'}">
                            {{ orderAndDelivery.status_kitchen }}
                    </span>
                </div>
                <hr>
                <div class="table-responsive" style="min-height:300px;max-height:300px;overflow:auto">
                    <table class="align-middle mb-0 table table-borderless table-striped table-hover">
                        <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th>Producto</th>
                            <th class="text-center">Cantidad</th>
                            <th class="text-center">Observaciónes</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(orderDetail, index) in getOnlyProductsThatShowInKitchen(orderAndDelivery.order_details)" :key="`orderDetail-${ orderDetail.id }`">
                                <td class="text-center">{{ index + 1 }}</td>
                                <td>
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left mr-3">
                                                <div class="widget-content-left">
                                                    <img width="40" class="rounded-circle" 
                                                        :src="orderDetail.product.image ? $hostServer + orderDetail.product.image : require('@/assets/placeholder-image.jpg')" 
                                                        alt="">
                                                </div>
                                            </div>
                                            <div class="widget-content-left flex2">
                                                <div class="widget-heading">{{ orderDetail.product.name }}</div>
                                                <!--<div class="widget-subheading opacity-7">{{ product.product.category_from_product.name }}</div>-->
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-center">{{ orderDetail.quantity }}</td>
                                <td class="text-center">{{ orderDetail.observations }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-block text-center card-footer">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'kitchen.index',
        created () {
            this.getOrdersAndDeliveries()
            this.interval = setInterval(() => {
                this.getOrdersAndDeliveries()
            }, 15000)
        },
        destroyed () {
            clearInterval(this.interval)
        },
        data() {
            return {
                ordersAndDeliveries: [],
                loadingData: true,
                interval: '',
                errors: null,
            }
        },
        methods: {
            getOrdersAndDeliveries() {
                this.$http.get(`kitchen`).then( response => {
                    this.ordersAndDeliveries = response.data
                    this.ordersAndDeliveries.forEach(orderAndDelivery => {
                        this.$set(orderAndDelivery, 'updating_status_kitchen', false)
                    })
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            getOnlyProductsThatShowInKitchen(orderDetails) {
                return orderDetails.filter(orderDetail => orderDetail.product.show_in_kitchen)
            },
            orderAndDeliveryIsPrepared (orderAndDelivery) {
                orderAndDelivery.updating_status_kitchen = true
                this.$http.put(`kitchen/${ orderAndDelivery.id }/order-and-delivery-is-prepared`).then( response => {
                    orderAndDelivery.status_kitchen = 'Preparado'
                    orderAndDelivery.updating_status_kitchen = false
                }).catch(error => {
                    orderAndDelivery.updating_status_kitchen = false
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            orderAndDeliveryIsDelivered (orderAndDelivery) {
                orderAndDelivery.updating_status_kitchen = true
                this.$http.put(`kitchen/${ orderAndDelivery.id }/order-and-delivery-is-delivered`).then( response => {
                    orderAndDelivery.status_kitchen = 'Entregado'
                    orderAndDelivery.updating_status_kitchen = false
                }).catch(error => {
                    orderAndDelivery.updating_status_kitchen = false
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            }
        },
        computed: {
        },
    }
</script>