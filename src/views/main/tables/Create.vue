<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Nueva mesa
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
                                <label for="">Número</label>
                                <input type="number" class="form-control" v-model="table.number" min="1" max="1000">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="">Sala</label>
                                <select class="form-control" v-model="table.room_id">
                                    <option value="">Seleccione sala</option>
                                    <option :value="room.id" v-for="room in rooms" :key="`room-${ room.id }`">
                                        {{ room.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="spinner-border text-primary" role="status" v-if="saving">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div v-else>
                            <button type="submit" class="btn btn-primary mr-1">
                                <i class="fa fa-save"></i> Guardar
                            </button>
                            <router-link class="btn btn-danger" :to="{ name: 'tables.index' }">
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
        name: 'tables.create',
        created () {
            this.getRooms()
        },
        data() {
            return {
                table: {
                    number: '',
                    room_id: ''
                },
                rooms: [],
                saving: false,
                errors: {}
            }
        },
        methods: {
            getRooms() {
                this.$http.get('tables/get-rooms').then( response => {
                    this.rooms = response.data
                })
            },
            save() {
                this.saving = true
                this.$http.post('tables', this.table).then( () => {
                    this.$toastr.success('Mesa creada')
                    this.saving = false
                    this.table.number = ''
                    this.table.room_id = ''
                    this.errors = {}
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