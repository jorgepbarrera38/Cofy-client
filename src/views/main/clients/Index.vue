<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Clientes
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-success" @click="goToRouteCreateClient">
                            <i class="fa fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <search-simple @searchNow="searchClient" placeholder="Nombres cliente"/>
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
                                    <th>Teléfono</th>
                                    <th>Principal</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="(client, index) in clients.data" :key="`client-${client.id}`">
                                        <td>{{ client.identification }}</td>
                                        <td nowrap>{{ client.full_names }}</td>
                                        <td>{{ client.phonenumber }}</td>
                                        <td>
                                            <div class="badge badge-success" v-if="client.first">
                                                <i class="fa fa-check"></i>
                                            </div>
                                        </td>
                                        <td nowrap>
                                            <button class="btn btn-warning mr-1" title="Editar"
                                                @click="goToRouteEditClient(client)">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger mr-1" title="Eliminar" :disabled="client.deleting"
                                                @click="deleteClient(client, index)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="client.deleting">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-trash-alt" v-else></i>
                                            </button>
                                            <button class="btn btn-success mr-1" title="Seleccionar como principal"
                                                :disabled="client.updatingToFirst"
                                                v-if="!client.first"
                                                @click="selectAsFirst(client)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="client.updatingToFirst">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-check-circle" v-else></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="clients" @pagination-change-page="getClients"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSimple from '../components/SearchSimple'
    export default {
        name: 'clients.index',
        components: {
            'search-simple' : SearchSimple,
        },
        created () {
            this.getClients()
        },
        data() {
            return {
                clients: {},
                loadingData: true,
            }
        },
        methods: {
            searchClient (search) {
                this.loadingData = true
                this.getClients(1, search)
            },
            getClients(page = 1, search = '') {
                this.$http.get(`clients?page=${ page }&full_names=${ search }`).then( response => {
                    this.clients = response.data
                    this.clients.data.forEach(client => {
                        this.$set(client, 'deleting', false)
                        this.$set(client, 'updatingToFirst', false)
                    })
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
        },
    }
</script>