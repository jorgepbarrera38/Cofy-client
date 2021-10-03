<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Usuarios del sistema
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-success" @click="goToRouteCreateUser">
                            <i class="fa fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <search-simple @searchNow="searchUser" placeholder="Nombres usuario"/>
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
                                    <th>Identificación</th>
                                    <th>Nombres</th>
                                    <th>usuario</th>
                                    <th>Activo</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="user in users.data" :key="`user-${user.id}`">
                                        <td>{{ user.identification }}</td>
                                        <td nowrap>{{ user.names }}</td>
                                        <td>{{ user.username }}</td>
                                        <td>
                                             <div :class="{ badge: true, 'badge-success': user.active, 'badge-danger': !user.active }">
                                                <i :class="{ fa: true, 'fa-check': user.active, 'fa-times': !user.active }"></i>
                                            </div>
                                        </td>
                                        <td nowrap>
                                            <button class="btn btn-info mr-1" title="Permisos"
                                                @click="goToRoutePermissionUser(user)">
                                                <i class="fa fa-door-open"></i>
                                            </button>
                                            <button class="btn btn-warning mr-1" title="Editar"
                                                @click="goToRouteEditUser(user)">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-success mr-1" title="Cambiar estado"
                                                :disabled="user.changingState"
                                                @click="changeState(user)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="user.changingState">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-sync" v-else></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="users" @pagination-change-page="getUsers"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSimple from '../components/SearchSimple'
    export default {
        name: 'users.index',
        components: {
            'search-simple' : SearchSimple,
        },
        created () {
            this.getUsers()
        },
        data() {
            return {
                users: {},
                loadingData: true,
            }
        },
        methods: {
            searchUser (search) {
                this.loadingData = true
                this.getUsers(1, search)
            },
            getUsers(page = 1, search = '') {
                this.$http.get(`users?page=${ page }&names=${ search }`).then( response => {
                    this.users = response.data
                    this.users.data.forEach(user => {
                        this.$set(user, 'changingState', false)
                    })
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            changeState(user) {
                if (!this.$hasPermission('users.changeState')) return this.$toastr.error('No tiene permisos para esta acción')
                user.changingState = true
                this.$http.put(`users/${ user.id }/change-state`).then( response => {
                    this.getUsers()
                    user.active = !user.active
                    user.changingState = false
                    this.$toastr.success('Estado del usuario actualizado')
                }).catch(() => {
                    user.changingState = false
                })
            },
            goToRouteCreateUser() {
                if (!this.$hasPermission('users.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'users.create'})
            },
            goToRouteEditUser(user) {
                if (!this.$hasPermission('users.update')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'users.edit', params: { id: user.id } })
            },
            goToRoutePermissionUser(user) {
                if (!this.$hasPermission('users.permission')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'users.permission', params: { id: user.id } })
            },
        },
    }
</script>