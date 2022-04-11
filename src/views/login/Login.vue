<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 offset-md-3 mt-5">
                <div class="card">
                    <div class="card-header">
                        <i class="fa fa-user mr-1"></i>
                        Iniciar sesión
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="login" class="form-row">                            
                            <div class="form-group col-md-12">
                                <label for="">Usuario</label>
                                <input type="text" class="form-control" v-model="user.username">
                            </div>
                            <div class="form-group col-md-12">
                                <label for="">Contraseña</label>
                                <input type="password" class="form-control" v-model="user.password">
                            </div>
                            <div class="col-md-12">
                                <button type="submit" class="btn btn-primary" :disabled="logining">
                                    <div class="spinner-border text-light spinner-border-sm" role="status" v-if="logining">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                    <i class="fa fa-sign-in-alt" v-else></i>
                                    Login
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
    import axios from 'axios'
    import { mapMutations } from 'vuex'
    export default {
        name: 'login',
        data() {
            return {
                user: {
                    username: 'admin',
                    password: 123
                },
                logining: false
            }
        },
        methods: {
            login() {
                this.logining = true

                this.$http.post(`auth/login`, this.user).then( response => {
                    let access_token = response.data.access_token
                    localStorage.setItem('access_token', access_token)
                    localStorage.setItem('names_user', response.data.user.names)
                    localStorage.setItem('nameCompany', response.data.nameCompany)
                    localStorage.setItem('permissions', JSON.stringify(response.data.permissions))
                    this.setNamesFromUserAuthenticated(response.data.user.names)
                    axios.defaults.headers.common['Authorization'] = `bearer ${ access_token }`
                    this.$router.push({ name: 'dashboard' })
                }).catch(error => {
                    this.logining = false
                    if (error.response.status == 401) {
                        this.$toastr.error(error.response.data.error)
                    }
                })
            },
            ...mapMutations(['setNamesFromUserAuthenticated'])
        },
    }
</script>