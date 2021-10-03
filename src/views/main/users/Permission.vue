<template>            
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card">
                <div class="card-header">
                    Permisos del usuario: <span v-if="user_names" class="ml-1"> {{ user_names }}</span>
                </div>
                <div class="card-body">
                    <div class="alert alert-danger" v-if="Object.keys(errors).length">
                        <li v-for="(error, index) in errors" :key="index">
                            {{ error[0] }}
                        </li>
                    </div>
                    <div v-if="loadingData" class="d-flex justify-content-center">
                        <div class="spinner-border text-primary" role="status" >
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div  v-else>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <input type="text" class="form-control" v-model="namePermissionToSearch" placeholder="Buscar permiso">
                            </div>
                        </div>
                        <div class="table-responsive" style="max-height:500px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Permiso</th>
                                    <th nowrap class="text-center">
                                        <button class="btn btn-defualt" @click="selectAllPermissions">
                                            Todos
                                        </button>
                                        <button class="btn btn-defualt" @click="unSelectAllPermissions">
                                            Ninguno
                                        </button>
                                    </th>
                                </thead>
                                <tbody>
                                    <tr v-for="permission in permissionsFiltered" :key="`permission-${ permission.id }`">
                                        <td>{{ permission.description }}</td>
                                        <td class="text-center">
                                            <input type="checkbox" v-model="permissionsFromUser" :value="permission">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mt-3">
                        <div class="spinner-border text-primary" role="status" v-if="saving">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div v-else>
                            <button type="submit" class="btn btn-primary mr-1" @click="save">
                                <i class="fa fa-save"></i> Guardar
                            </button>
                            <router-link class="btn btn-danger" :to="{ name: 'users.index' }">
                                <i class="fa fa-undo"></i> Atrás
                            </router-link>                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'users.edit',
        created () {
            this.getAllPermissionsFromSystemAndUser()
        },
        data() {
            return {
                user_names: '',
                permissions: [],
                permissionsFromUser: [],
                namePermissionToSearch: '',
                saving: false,
                errors: {},
                loadingData: true
            }
        },
        methods: {
            getAllPermissionsFromSystemAndUser() {
                this.$http.get(`users/${ this.$route.params.id }/get-all-permissions-from-system-and-user`).then( response => {
                    this.user_names = response.data.user_names
                    this.permissions = response.data.permissions
                    this.permissions = this.permissions.map(permission => {
                        return {
                            id:  permission.id,
                            name: permission.name,
                            description: permission.description,
                        }
                    })
                    this.permissionsFromUser = response.data.permissionsFromUser
                    this.permissionsFromUser = this.permissionsFromUser.map(permission => {
                        return {
                            id:  permission.id,
                            name: permission.name,
                            description: permission.description,
                        }
                    })
                    this.loadingData = false
                })
            },
            selectAllPermissions() {
                this.permissionsFromUser = this.permissions
            },
            unSelectAllPermissions() {
                this.permissionsFromUser = []
            },
            save() {
                this.saving = true
                let idsFromPermissionsSelected = this.$_.pluck(this.permissionsFromUser, 'id')
                this.$http.put(`users/${ this.$route.params.id }/update-permissions`, idsFromPermissionsSelected).then( response => {
                    this.$toastr.success('Permisos de usuario actualizados')
                    this.saving = false
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
        },
        computed: {
            permissionsFiltered() {
                return this.permissions.filter(permission => permission.description.includes(this.namePermissionToSearch))
            }
        },
    }
</script>
