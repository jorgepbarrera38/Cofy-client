<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Categorías de productos
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-success" @click="goToRouteCreateCategory">
                            <i class="fa fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <search-simple @searchNow="searchCategory" placeholder="Nombre categoría"/>
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
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="(category, index) in categories.data" :key="`catg-${category.id}`">
                                        <td>{{ category.name }}</td>
                                        <td nowrap>
                                            <button class="btn btn-warning mr-1" title="Editar"
                                                @click="goToRouteEditCategory(category)">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger" title="Eliminar" :disabled="category.deleting"
                                                @click="deleteCategory(category, index)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="category.deleting">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-trash-alt" v-else></i>
                                            </button>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="categories" @pagination-change-page="getCategories"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSimple from '../components/SearchSimple'
    export default {
        name: 'categoriesFromProduct.index',
        components: {
            'search-simple' : SearchSimple,
        },
        created () {
            this.getCategories()
        },
        data() {
            return {
                categories: {},
                loadingData: true,
            }
        },
        methods: {
            searchCategory (search) {
                this.loadingData = true
                this.getCategories(1, search)
            },
            getCategories(page = 1, search = '') {
                this.$http.get(`categories-from-products?page=${ page }&name=${ search }`).then( response => {
                    this.categories = response.data
                    this.categories.data.forEach(category => {
                        this.$set(category, 'deleting', false)
                    })
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            deleteCategory(category, index) {
                if (!this.$hasPermission('categories.destroy')) return this.$toastr.error('No tiene permisos para esta acción')
                category.deleting = true
                this.$http.delete(`categories-from-products/${ category.id }`).then( (response) => {
                    this.getCategories()
                    this.categories.data.splice(index, 1)
                    category.deleting = false
                    this.$toastr.success('Categoría eliminada')
                }).catch(error => {
                    category.deleting = false
                    if (error.response.status == 422) {
                        return this.$toastr.error(error.response.data.errors.message[0]);
                    }
                    this.$toastr.error('La categoría no se pudo eliminar')
                })
            },
            goToRouteCreateCategory() {
                if (!this.$hasPermission('categories.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'categories.create' })
            },
            goToRouteEditCategory(category) {
                if (!this.$hasPermission('categories.update')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'categories.edit', params: { id: category.id } })
            }
        },
    }
</script>