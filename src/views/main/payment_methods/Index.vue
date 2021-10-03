<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Métodos de pago
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-success" @click="goToRouteCreatePaymentMethod">
                            <i class="fa fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <search-simple @searchNow="searchPaymentMethod" placeholder="Nombre método de pago"/>
                        </div>
                    </div>
                    <div v-if="loadingData" class="d-flex justify-content-center">
                        <div class="spinner-border text-primary" role="status" >
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div v-else>
                        <div class="table-responsive">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th>Principal</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="(paymentMethod, index) in paymentMethods.data" :key="`paymentMethod-${paymentMethod.id}`">
                                        <td nowrap>{{ paymentMethod.name }}</td>
                                        <td>
                                            <div class="badge badge-success" v-if="paymentMethod.first">
                                                <i class="fa fa-check"></i>
                                            </div>
                                        </td>
                                        <td nowrap>
                                            <button class="btn btn-warning mr-1" title="Editar"
                                                @click="goToRouteEditPaymentMethod(paymentMethod)">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger mr-1" title="Eliminar" :disabled="paymentMethod.deleting"
                                                @click="deletePaymentMethod(paymentMethod, index)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="paymentMethod.deleting">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-trash-alt" v-else></i>
                                            </button>
                                            <button class="btn btn-success mr-1" title="Seleccionar como principal"
                                                :disabled="paymentMethod.updatingToFirst"
                                                v-if="!paymentMethod.first"
                                                @click="selectAsFirst(paymentMethod)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="paymentMethod.updatingToFirst">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-check-circle" v-else></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="paymentMethods" @pagination-change-page="getPaymentMethods"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSimple from '../components/SearchSimple'
    export default {
        name: 'paymentMethods.index',
        components: {
            'search-simple' : SearchSimple,
        },
        created () {
            this.getPaymentMethods()
        },
        data() {
            return {
                paymentMethods: {},
                loadingData: true,
            }
        },
        methods: {
            searchPaymentMethod (search) {
                this.loadingData = true
                this.getPaymentMethods(1, search)
            },
            getPaymentMethods(page = 1, search = '') {
                this.$http.get(`payment-methods?page=${ page }&name=${ search }`).then( response => {
                    this.paymentMethods = response.data
                    this.paymentMethods.data.forEach(paymentMethod => {
                        this.$set(paymentMethod, 'deleting', false)
                        this.$set(paymentMethod, 'updatingToFirst', false)
                    })
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            selectAsFirst(paymentMethod) {
                if (!this.$hasPermission('paymentMethods.selectAsFirst')) return this.$toastr.error('No tiene permisos para esta acción')
                paymentMethod.updatingToFirst = true
                this.$http.put(`payment-methods/${ paymentMethod.id }/select-as-first`).then( () => {
                    this.getPaymentMethods()
                    this.paymentMethods.data.forEach(paymentMethod => {
                        paymentMethod.first = false
                    })
                    paymentMethod.first = 1
                    paymentMethod.updatingToFirst = false
                    this.$toastr.success('Medio de pago seleccionado como principal')
                }).catch(() => {
                    paymentMethod.updatingToFirst = false
                })
            },
            deletePaymentMethod(paymentMethod, index) {
                if (!this.$hasPermission('paymentMethods.destroy')) return this.$toastr.error('No tiene permisos para esta acción')
                paymentMethod.deleting = true
                this.$http.delete(`payment-methods/${ paymentMethod.id }`).then( () => {
                    this.getPaymentMethods()
                    this.paymentMethods.data.splice(index, 1)
                    paymentMethod.deleting = false
                    this.$toastr.success('Método de pago eliminado')
                }).catch(error => {
                    paymentMethod.deleting = false
                    if (error.response.status == 422) {
                        return this.$toastr.error(error.response.data.errors.message[0]);
                    }
                    this.$toastr.error('El método de pago no se pudo eliminar')
                })
            },
            goToRouteCreatePaymentMethod() {
                if (!this.$hasPermission('paymentMethods.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'paymentMethods.create' })
            },
            goToRouteEditPaymentMethod(paymentMethod) {
                if (!this.$hasPermission('paymentMethods.update')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'paymentMethods.edit', params: { id: paymentMethod.id } })
            },
        },
    }
</script>