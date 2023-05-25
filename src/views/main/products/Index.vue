<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Productos
                    <div class="btn-actions-pane-right">
                        <button class="btn btn-success" @click="goToRouteCreateProduct">
                            <i class="fa fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <search-simple @searchNow="searchProduct" placeholder="Nombre producto"/>
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
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Mostrar en cocina</th>
                                    <th>Activo</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="(product, index) in products.data" :key="`prod-${product.id}`">
                                        <td nowrap>
                                            <img width="40" class="rounded-circle mr-1" :src="product.image ? APP_URL + product.image : require('@/assets/placeholder-image.jpg')" alt="">
                                            {{ product.name }}
                                        </td>
                                        <td>{{ product.category_from_product.name }}</td>
                                        <td>${{ $formatNum(product.price) }}</td>
                                        <td>
                                            <div :class="{ badge: true, 'badge-success': product.show_in_kitchen, 'badge-danger': !product.show_in_kitchen }">
                                                <i :class="{ fa: true, 'fa-check': product.show_in_kitchen, 'fa-times': !product.show_in_kitchen }"></i>
                                            </div>    
                                        </td>
                                        <td>
                                            <div :class="{ badge: true, 'badge-success': product.active, 'badge-danger': !product.active }">
                                                <i :class="{ fa: true, 'fa-check': product.active, 'fa-times': !product.active }"></i>
                                            </div>
                                        </td>
                                        <td nowrap>
                                            <button class="btn btn-info mr-1" title="Info del producto"
                                                @click="showInfoFromProductInModal(product)">
                                                <i class="fa fa-info-circle"></i>
                                            </button>
                                            <button class="btn btn-warning mr-1" title="Editar"
                                                @click="goToRouteEditProduct(product)">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger mr-1" title="Eliminar" :disabled="product.deleting"
                                                @click="deleteProduct(product, index)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="product.deleting">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-trash-alt" v-else></i>
                                            </button>
                                            <button class="btn btn-success mr-1" title="Cambiar estado"
                                                :disabled="product.changingState"
                                                @click="changeState(product)">
                                                <div class="spinner-border text-light spinner-border-sm" role="status" v-if="product.changingState">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-sync" v-else></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="products" @pagination-change-page="getProducts"></pagination>
                        <modal name="info-from-product-modal" :adaptive="true" height="auto">
                            <div class="p-4">
                                <h5 class="mb-3">Información del producto</h5>

                                    <center>
                                        <img width="140" @click.stop="$emit('addProductToOrder', product)" 
                                        class="rounded-circle" :src="productToShowInfo.image ? APP_URL + productToShowInfo.image : require('@/assets/placeholder-image.jpg')" alt="">
                                    </center>
                                    
                                    <div class="mb-2">
                                        {{ productToShowInfo.name }} - ${{ $formatNum(productToShowInfo.price) }} <br>
                                        <strong>Mostrar en cocina: </strong>{{ productToShowInfo.show_in_kitchen ? 'Si' : 'No' }}
                                    </div>
                                    <div class="text-justify">
                                        {{ productToShowInfo.description }}
                                    </div>
                                <hr>
                                <button class="btn btn-secondary mr-1" @click="$modal.hide('info-from-product-modal')">
                                    <i class="fa fa-times"></i> Cerrar
                                </button>
                            </div>
                        </modal>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSimple from '../components/SearchSimple'
    import { mapState } from 'vuex'
    export default {
        name: 'products.index',
        components: {
            'search-simple' : SearchSimple,
        },
        created () {
            this.getProducts()
        },
        data() {
            return {
                products: {},
                productToShowInfo: {
                    category_from_product: ''
                },
                loadingData: true,
            }
        },
        methods: {
            searchProduct (search) {
                this.loadingData = true
                this.getProducts(1, search)
            },
            getProducts(page = 1, search = '') {
                this.$http.get(`products?page=${ page }&name=${ search }`).then( response => {
                    this.products = response.data
                    this.products.data.forEach(product => {
                        this.$set(product, 'deleting', false)
                        this.$set(product, 'changingState', false)
                    })
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            showInfoFromProductInModal(product) {
                this.productToShowInfo = product
                this.$modal.show('info-from-product-modal')
            },
            deleteProduct(product, index) {
                if (!this.$hasPermission('products.destroy')) return this.$toastr.error('No tiene permisos para esta acción')
                product.deleting = true
                this.$http.delete(`products/${ product.id }`).then( () => {
                    this.getProducts()
                    this.products.data.splice(index, 1)
                    product.deleting = false
                    this.$toastr.success('Producto eliminado')
                }).catch(error => {
                    product.deleting = false
                    if (error.response.status == 422) {
                        return this.$toastr.error(error.response.data.errors.message[0]);
                    }
                    this.$toastr.error('El producto no se pudo eliminar')
                })
            },
            changeState(product) {
                if (!this.$hasPermission('products.changeState')) return this.$toastr.error('No tiene permisos para esta acción')
                product.changingState = true
                this.$http.put(`products/${ product.id }/change-state`).then( response => {
                    this.getProducts()
                    product.active = !product.active
                    product.changingState = false
                    this.$toastr.success('Estado del producto actualizado')
                }).catch(() => {
                    product.changingState = false
                })
            },
            goToRouteCreateProduct() {
                if (!this.$hasPermission('products.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'products.create' })
            },
            goToRouteEditProduct(product) {
                if (!this.$hasPermission('products.update')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'products.edit', params: { id: product.id } })
            },
        },
        computed: {
            ...mapState(['APP_URL']),
        },
    }
</script>