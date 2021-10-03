<template>            
    <div class="row">
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
                </div>
                <div class="pl-3 pr-3 pt-2">
                    <strong>Consecutivo: </strong>{{ orderAndDelivery.id }} <br>
                    <strong>Tipo: </strong>{{ orderAndDelivery.type == 1 ? 'Orden de pedido' : 'Domicilio' }}
                    <span v-if="orderAndDelivery.type == 1">
                        <strong> - Mesa: </strong>{{ orderAndDelivery.table.number }}
                    </span>
                    <br>
                    <strong>Usuario que generó: </strong>{{ orderAndDelivery.user_create.identification + ' - ' + orderAndDelivery.user_create.names }}
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
            }, 5000)
        },
        destroyed () {
            clearInterval(this.interval)
        },
        data() {
            return {
                ordersAndDeliveries: [],
                loadingData: true,
                interval: '',
            }
        },
        methods: {
            getOrdersAndDeliveries() {
                this.$http.get(`kitchen`).then( response => {
                    this.ordersAndDeliveries = response.data
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            deleteClient(client, index) {
                if (!this.$hasPermission('clients.destroy')) return this.$toastr.error('No tiene permisos para esta acción')
                client.deleting = true
                this.$http.delete(`clients/${ client.id }`).then( () => {
                    this.getClients()
                    this.clients.data.splice(index, 1)
                    client.deleting = false
                    this.$toastr.success('Cliente eliminado')
                }).catch(error => {
                    client.deleting = false
                    if (error.response.status == 422) {
                        return this.$toastr.error(error.response.data.errors.message[0]);
                    }
                    this.$toastr.error('El cliente no se pudo eliminar')
                })
            },
            selectAsFirst(client) {
                if (!this.$hasPermission('clients.selectAsFirst')) return this.$toastr.error('No tiene permisos para esta acción')
                client.updatingToFirst = true
                this.$http.put(`clients/${ client.id }/select-as-first`).then( () => {
                    this.getClients()
                    this.clients.data.forEach(client => {
                        client.first = false
                    })
                    client.first = 1
                    client.updatingToFirst = false
                    this.$toastr.success('Cliente seleccionado como principal')
                }).catch(() => {
                    client.updatingToFirst = false
                })
            },
            goToRouteCreateClient() {
                if (!this.$hasPermission('clients.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'clients.create' })
            },
            goToRouteEditClient(client) {
                if (!this.$hasPermission('clients.update')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'clients.edit', params: { id: client.id } })
            },
            getOnlyProductsThatShowInKitchen(orderDetails) {
                return orderDetails.filter(orderDetail => orderDetail.product.show_in_kitchen)
            }
        },
        computed: {
        },
    }
</script>