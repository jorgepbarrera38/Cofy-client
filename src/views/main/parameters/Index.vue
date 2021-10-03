<template>            
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card">
                <div class="card-header">
                    Parámetros
                </div>
                <div class="card-body">
                    <div v-if="loadingData" class="d-flex justify-content-center">
                        <div class="spinner-border text-primary" role="status" >
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div v-else>
                         <div class="alert alert-danger" v-if="Object.keys(errors).length">
                            <li v-for="(error, index) in errors" :key="index">
                                {{ error[0] }}
                            </li>
                        </div>
                        <form @submit.prevent="save">
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Valor domicilio</span>
                                    </div>
                                    <input type="number" class="form-control" v-model="parameters.value_delivery" min="1" max="999999">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="invalidCheck" v-model="parameters.allow_change_value_delivery">
                                    <label class="form-check-label" for="invalidCheck">
                                        Cambiar valor de domicilio
                                    </label>
                                </div>
                            </div>
                            
                            <div class="spinner-border text-primary" role="status" v-if="saving">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div v-else>
                                <button type="submit" class="btn btn-primary mr-1">
                                    <i class="fa fa-save"></i> Guardar
                                </button>                      
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'parameters.index',
        created () {
            this.getParameters(9)
        },
        data() {
            return {
                parameters: {
                    value_delivery: '',
                    allow_change_value_delivery: false
                },
                loadingData: true,
                saving: false,
                errors: {},
            }
        },
        methods: {
            getParameters() {
                this.$http.get(`parameters`).then( response => {
                    if (response.data) {
                        this.parameters = response.data
                    }
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            save() {
                this.saving = true
                
                let data = {
                    value_delivery: this.parameters.value_delivery,
                    allow_change_value_delivery: this.parameters.allow_change_value_delivery ? 1 : 0

                }

                this.$http.post(`parameters`, data).then( response => {
                    this.saving = false
                    this.$toastr.success('Parámetros actualizados')
                    this.errors = {}
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
        },
    }
</script>