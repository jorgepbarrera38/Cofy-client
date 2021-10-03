<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Mesas
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-success" @click="goToRouteCreateTable">
                            <i class="fa fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <search-simple @searchNow="searchTable" placeholder="Número mesa"/>
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
                                    <th>Número</th>
                                    <th>Sala</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="(table, index) in tables.data" :key="`table-${table.id}`">
                                        <td>{{ table.number }}</td>
                                        <td>{{ table.room.name }}</td>
                                        <td nowrap>
                                            <button class="btn btn-warning mr-1" title="Editar"
                                                @click="goToRouteEditTable(table)">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger" title="Eliminar" :disabled="table.deleting"
                                                @click="deleteTable(table, index)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="table.deleting">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-trash-alt" v-else></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="tables" @pagination-change-page="getTables"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSimple from '../components/SearchSimple'
    export default {
        name: 'tables.index',
        components: {
            'search-simple' : SearchSimple,
        },
        created () {
            this.getTables()
        },
        data() {
            return {
                tables: {},
                loadingData: true,
            }
        },
        methods: {
            searchTable (search) {
                this.loadingData = true
                this.getTables(1, search)
            },
            getTables(page = 1, search = '') {
                this.$http.get(`tables?page=${ page }&name=${ search }`).then( response => {
                    this.tables = response.data
                    this.tables.data.forEach(table => {
                        this.$set(table, 'deleting', false)
                    })
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            deleteTable(table, index) {
                if (!this.$hasPermission('tables.destroy')) return this.$toastr.error('No tiene permisos para esta acción')
                table.deleting = true
                this.$http.delete(`tables/${ table.id }`).then( () => {
                    this.getTables()
                    this.tables.data.splice(index, 1)
                    table.deleting = false
                    this.$toastr.success('Mesa eliminada')
                }).catch(error => {
                    table.deleting = false
                    if (error.response.status == 422) {
                        return this.$toastr.error(error.response.data.errors.message[0]);
                    }
                    this.$toastr.error('La mesa no se pudo eliminar')
                })
            },
            goToRouteCreateTable() {
                if (!this.$hasPermission('tables.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'tables.create' })
            },
            goToRouteEditTable(table) {
                if (!this.$hasPermission('tables.update')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'tables.edit', params: { id: table.id } })
            },
        },
    }
</script>