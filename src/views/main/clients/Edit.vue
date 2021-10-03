<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Editar categoría
                </div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <div class="alert alert-danger" v-if="Object.keys(errors).length">
                            <li v-for="(error, index) in errors" :key="index">
                                {{ error[0] }}
                            </li>
                        </div>

                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="">Identificación</label>
                                <input type="text" class="form-control" v-model="client.identification" maxlength="15">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="">Nombres</label>
                                <input type="text" class="form-control" v-model="client.names" maxlength="60">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="">Apellidos</label>
                                <input type="text" class="form-control" v-model="client.surnames" maxlength="60">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="">Teléfono (opcional)</label>
                                <input type="text" class="form-control" v-model="client.phonenumber" maxlength="30">
                            </div>
                        </div>

                        <div class="spinner-border text-primary" role="status" v-if="saving">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div v-else>
                            <button type="submit" class="btn btn-primary mr-1">
                                <i class="fa fa-save"></i> Guardar
                            </button>
                            <router-link class="btn btn-danger" :to="{ name: 'clients.index' }">
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
        name: 'categoriesFromProduct.edit',
        created () {
            this.getClient()
        },
        data() {
            return {
                client: {
                    identification: '',
                    names: '',
                    surnames: '',
                    phonenumber: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            getClient() {
                this.$http.get(`clients/${ this.$route.params.id }`).then( response => {
                    this.client = response.data
                })
            },
            save() {
                this.saving = true
                this.$http.put(`clients/${ this.$route.params.id }`, this.client).then( () => {
                    this.$toastr.success('Cliente actualizado')
                    this.$router.push({ name: 'clients.index' })
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