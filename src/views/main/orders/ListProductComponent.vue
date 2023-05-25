<template>
    <div class="card mb-2" style="height:100%" id="card">
        <div class="card-header">
            Carta
        </div>
        <div class="card-body">
            <div class="input-group mb-3">
                <input type="text" class="form-control" v-model="searchProduct.name" placeholder="Nombre producto">
            </div>
            <div>
                <button class="mb-2 mr-2 btn-transition btn btn-outline-info" @click="searchProductByCategory(category.id)"
                    v-for="category in categoriesFromProduct" :key="`categ-${ category.id }`">
                    {{ category.name }}
                </button>
                <button class="mb-2 mr-2 btn-transition btn btn-outline-info" @click="searchProductByCategory('todos')">
                    Todos
                </button>
            </div>
            <div v-if="loadingData" class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status" >
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div v-else>
                <div :style="{'max-height':heightDivOfProducts, overflow:'auto'}">
                    <li class="list-group-item" v-for="product in productsFilteredsByNameOrCategory" :key="`product-${product.id}`" style="cursor:pointer"
                        @click="showInfoFromProductInModal(product)">
                        <div class="widget-content p-0">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left mr-3">
                                    <img width="50"  
                                        @click.stop="addProductToOrder(product)" 
                                        class="rounded-circle" :src="product.image ? APP_URL + product.image : require('@/assets/placeholder-image.jpg')" 
                                        alt="">
                                </div>
                                <div class="widget-content-left">
                                    <div class="widget-heading">{{ product.name }}
                                         <br> 
                                         <div class="badge badge-danger" v-if="!product.active">
                                             No disponible
                                         </div>
                                    </div>
                                    <div class="widget-subheading">{{ product.category_from_product.name }}</div>
                                </div>
                                <div class="widget-content-right">
                                    <div class="font-size-xlg text-muted">
                                        <small class="opacity-5 pr-1">$</small>
                                        <span>{{ $formatNum(product.price) }}</span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </li>
                </div>
                <modal name="info-from-product-modal" :adaptive="true" height="auto">
                            <div class="p-4">
                                <h5 class="mb-3">Información del producto</h5>

                                    <center>
                                        <img width="140" @click.stop="$emit('addProductToOrder', product)" 
                                        class="rounded-circle" :src="productToShowInfo.image ? APP_URL + productToShowInfo.image : require('@/assets/placeholder-image.jpg')" alt="">
                                    </center>
                                    
                                    <div class="mb-2">
                                        {{ productToShowInfo.name }} - ${{ $formatNum(productToShowInfo.price) }}
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
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        props: {
            products: {
                type: Array,
                default: () => []
            },
            categoriesFromProduct: {
                type: Array,
                default: () => []
            },
            loadingData: {
                type: Boolean,
                default: true
            }
        },
        mounted () {
            if (screen.width >= 992) {
                let heightFromCard = document.getElementById('card').clientHeight - 207
                this.heightDivOfProducts = heightFromCard + 'px'
            } else {
                this.heightDivOfProducts = '300px'
            }
        },
        data() {
            return {
                heightDivOfProducts: '',
                searchProduct: {
                    name: '',
                    categoryId: 'todos'
                },
                productToShowInfo: {},
            }
        },
        methods: {
            searchProductByCategory(categoryId) {
                this.searchProduct.categoryId = categoryId
            },
            showInfoFromProductInModal(product) {
                this.productToShowInfo = product
                this.$modal.show('info-from-product-modal')
            },
            addProductToOrder(product) {
                if (!product.active) {
                    return this.$toastr.error('El producto no está disponible')
                }
                
                this.$emit('addProductToOrder', product)
            }
        },
        computed: {
            ...mapState(['APP_URL']),
            productsFilteredsByNameOrCategory() {
                if (this.searchProduct.categoryId == 'todos') {
                    return this.products.filter(product => {
                        return product.name.toLowerCase().includes(this.searchProduct.name.toLowerCase())
                    })
                } else {
                    return this.products.filter(product => {
                        return product.name.toLowerCase().includes(this.searchProduct.name.toLowerCase()) &&
                            product.category_from_product_id == this.searchProduct.categoryId
                    })
                }
            },
        },
        
    }
</script>

<style lang="scss" scoped>

</style>