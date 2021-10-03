<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Salas
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-success" @click="goToRouteCreateRoom">
                            <i class="fa fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <search-simple @searchNow="searchRoom" placeholder="Nombre sala"/>
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
                                    <th>Nombre</th>
                                    <th>Principal</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="(room, index) in rooms.data" :key="`room-${room.id}`">
                                        <td nowrap>{{ room.name }}</td>
                                        <td>
                                            <div class="badge badge-success" v-if="room.first">
                                                <i class="fa fa-check"></i>
                                            </div>
                                        </td>
                                        <td nowrap>
                                            <button class="btn btn-warning mr-1" title="Editar"
                                                @click="goToRouteEditRoom(room)">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger mr-1" title="Eliminar" :disabled="room.deleting"
                                                @click="deleteRoom(room, index)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="room.deleting">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-trash-alt" v-else></i>
                                            </button>
                                            <button class="btn btn-success mr-1" title="Seleccionar como principal"
                                                :disabled="room.updatingToFirst"
                                                v-if="!room.first"
                                                @click="selectAsFirst(room)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="room.updatingToFirst">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-check-circle" v-else></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="rooms" @pagination-change-page="getRooms"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSimple from '../components/SearchSimple'
    export default {
        name: 'rooms.index',
        components: {
            'search-simple' : SearchSimple,
        },
        created () {
            this.getRooms()
        },
        data() {
            return {
                rooms: {},
                loadingData: true,
            }
        },
        methods: {
            searchRoom (search) {
                this.loadingData = true
                this.getRooms(1, search)
            },
            getRooms(page = 1, search = '') {
                this.$http.get(`rooms?page=${ page }&name=${ search }`).then( response => {
                    this.rooms = response.data
                    this.rooms.data.forEach(room => {
                        this.$set(room, 'deleting', false)
                        this.$set(room, 'updatingToFirst', false)
                    })
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            selectAsFirst(room) {
                if (!this.$hasPermission('rooms.selectAsFirst')) return this.$toastr.error('No tiene permisos para esta acción')
                room.updatingToFirst = true
                this.$http.put(`rooms/${ room.id }/select-as-first`).then( () => {
                    this.getRooms()
                    this.rooms.data.forEach(room => {
                        room.first = false
                    })
                    room.first = 1
                    room.updatingToFirst = false
                    this.$toastr.success('Sala seleccionada como principal')
                }).catch(() => {
                    room.updatingToFirst = false
                })
            },
            deleteRoom(room, index) {
                if (!this.$hasPermission('rooms.destroy')) return this.$toastr.error('No tiene permisos para esta acción')
                room.deleting = true
                this.$http.delete(`rooms/${ room.id }`).then( () => {
                    this.getRooms()
                    this.rooms.data.splice(index, 1)
                    room.deleting = false
                    this.$toastr.success('Sala eliminada')
                }).catch(error => {
                    room.deleting = false
                    if (error.response.status == 422) {
                        return this.$toastr.error(error.response.data.errors.message[0]);
                    }
                    this.$toastr.error('La sala no se pudo eliminar')
                })
            },
            goToRouteCreateRoom() {
                if (!this.$hasPermission('rooms.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'rooms.create' })
            },
            goToRouteEditRoom(room) {
                if (!this.$hasPermission('rooms.update')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'rooms.edit', params: { id: room.id } })
            },
        },
    }
</script>