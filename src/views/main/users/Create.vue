<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Nuevo usuario
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
                                <input type="text" class="form-control" v-model="user.identification" maxlength="15">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="">Nombres completos</label>
                                <input type="text" class="form-control" v-model="user.names" maxlength="60">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="">Nombre de usuario</label>
                                <input type="text" class="form-control" v-model="user.username" maxlength="20">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="">Contraseña (opcional)</label>
                                <input type="password" class="form-control" v-model="user.password" maxlength="20">
                            </div>
                        </div>

                        <div class="spinner-border text-primary" role="status" v-if="saving">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div v-else>
                            <button type="submit" class="btn btn-primary mr-1">
                                <i class="fa fa-save"></i> Guardar
                            </button>
                            <router-link class="btn btn-danger" :to="{ name: 'users.index' }">
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
        name: 'users.create',
        data() {
            return {
                user: {
                    identification: '',
                    names: '',
                    username: '',
                    password: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            save() {
                this.saving = true
                this.$http.post(`users`, this.user).then( () => {
                    this.$toastr.success('Usuario registrado')
                    this.$router.push({ name: 'users.index' })
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