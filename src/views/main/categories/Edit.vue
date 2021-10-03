<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Editar categoría
                </div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <div class="alert alert-danger" v-if="Object.keys(errors).length">
                            <li v-for="(error, index) in errors" :key="index">
                                {{ error[0] }}
                            </li>
                        </div>
                        <div class="form-group">
                            <label for="">Nombre</label>
                            <input type="text" class="form-control" v-model="category.name" maxlength="60">
                        </div>
                        <div class="spinner-border text-primary" role="status" v-if="saving">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div v-else>
                            <button type="submit" class="btn btn-primary mr-1">
                                <i class="fa fa-save"></i> Guardar
                            </button>
                            <router-link class="btn btn-danger" :to="{ name: 'categories.index' }">
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
        name: 'categoriesFromProduct.edit',
        created () {
            this.getCategory()
        },
        data() {
            return {
                category: {
                    name: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            getCategory() {
                this.$http.get(`categories-from-products/${ this.$route.params.id }`).then( response => {
                    this.category = response.data
                })
            },
            save() {
                this.saving = true
                this.$http.put(`categories-from-products/${ this.$route.params.id }`, this.category).then( () => {
                    this.$toastr.success('Categoría actualizada')
                    this.$router.push({ name: 'categories.index' })
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