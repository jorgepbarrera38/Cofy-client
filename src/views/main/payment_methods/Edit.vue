<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Editar método de pago
                </div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <div class="alert alert-danger" v-if="Object.keys(errors).length">
                            <li v-for="(error, index) in errors" :key="index">
                                {{ error[0] }}
                            </li>
                        </div>
                        <div class="form-group">
                            <label for="">Nombre</label>
                            <input type="text" class="form-control" v-model="paymentMethod.name" maxlength="40">
                        </div>
                        <div class="spinner-border text-primary" role="status" v-if="saving">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div v-else>
                            <button type="submit" class="btn btn-primary mr-1">
                                <i class="fa fa-save"></i> Guardar
                            </button>
                            <router-link class="btn btn-danger" :to="{ name: 'paymentMethods.index' }">
                                <i class="fa fa-undo"></i> Atrás
                            </router-link>                        
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'paymentMethods.edit',
        created () {
            this.getPaymentMethod()
        },
        data() {
            return {
                paymentMethod: {
                    name: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            getPaymentMethod() {
                this.$http.get(`payment-methods/${ this.$route.params.id }`).then( response => {
                    this.paymentMethod = response.data
                })
            },
            save() {
                this.saving = true
                this.$http.put(`payment-methods/${ this.$route.params.id }`, this.paymentMethod).then( () => {
                    this.$toastr.success('Método de pago actualizado')
                    this.$router.push({ name: 'paymentMethods.index' })
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            }
        },
    }
</script>