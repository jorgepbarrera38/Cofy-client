<template>            
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card">
                <div class="card-header">
                    Empresa
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
                                        <span class="input-group-text">NIT</span>
                                    </div>
                                    <input type="text" class="form-control" v-model="company.nit" maxlength="30">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Nombre de empresa</span>
                                    </div>
                                    <input type="text" class="form-control" v-model="company.name" maxlength="60">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Dirección</span>
                                    </div>
                                    <input type="text" class="form-control" v-model="company.address" maxlength="30">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Teléfono</span>
                                    </div>
                                    <input type="text" class="form-control" v-model="company.phonenumber" maxlength="12">
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
        name: 'company.index',
        created () {
            this.getCompany()
        },
        data() {
            return {
                company: {
                    nit: '',
                    name: '',
                    address: '',
                    phonenumber: '',
                },
                loadingData: true,
                saving: false,
                errors: {},
            }
        },
        methods: {
            getCompany() {
                this.$http.get(`company`).then( response => {
                    if (response.data) {
                        this.company = response.data
                    }
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            save() {
                this.saving = true
                
                let data = {
                    name: this.company.name,
                    nit: this.company.nit,
                    address: this.company.address,
                    phonenumber: this.company.phonenumber,
                    
                    }

                this.$http.post(`company`, data).then( response => {
                    this.saving = false
                    this.$toastr.success('Datos de empresa actualizados')
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