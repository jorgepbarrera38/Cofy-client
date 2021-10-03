<template>            
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    Nuevo producto
                </div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <div class="alert alert-danger" v-if="Object.keys(errors).length">
                            <li v-for="(error, index) in errors" :key="index">
                                {{ error[0] }}
                            </li>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label for="">Nombre</label>
                                <input type="text" class="form-control" v-model="product.name" maxlength="60">
                            </div>
                            <div class="form-group col-md-4">
                                <label for="">Categoría</label>
                                <select class="form-control" v-model="product.category_from_product_id">
                                    <option value="">Seleccione categoría</option>
                                    <option :value="category.id" v-for="category in categories" :key="`categ-${ category.id }`">
                                        {{ category.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-4">
                                <label for="">Precio</label>
                                <input type="number" class="form-control" v-model="product.price" min="1" max="999999">
                            </div>
                            <div class="form-group col-md-12">
                                <label for="">Descripción</label>
                                <textarea rows="4" class="form-control" v-model="product.description" maxlength="500"></textarea>
                            </div>
                            <croppa v-model="myCroppa" 
                                :prevent-white-space="true"
                                :width="270"
                                :height="270"
                                :remove-button-size="20"
                                :placeholder-font-size="14"
                                placeholder="Seleccione imagen">
                            </croppa>
                            <div class="form-group col-md-12">
                                <label class="form-check-label">
                                    <input type="checkbox" v-model="product.show_in_kitchen"> Mostrar en cocina
                                </label>
                            </div>
                        </div>

                        <div class="spinner-border text-primary" role="status" v-if="saving">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div v-else>
                            <button type="submit" class="btn btn-primary mr-1">
                                <i class="fa fa-save"></i> Guardar
                            </button>
                            <router-link class="btn btn-danger" :to="{ name: 'products.index' }">
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
        name: 'products.create',
        created () {
            this.getCategories()
        },
        data() {
            return {
                product: {
                    name: '',
                    description: '',
                    price: '',
                    show_in_kitchen: true,
                    category_from_product_id: '',
                },
                myCroppa: {},
                categories: [],
                saving: false,
                errors: {}
            }
        },
        methods: {
            getCategories() {
                this.$http.get('products/get-categories', this.product).then( response => {
                    this.categories = response.data
                })
            },
            save() {
                this.saving = true

                this.myCroppa.generateBlob(blob => {
                    
                    let data = new FormData
                    data.append('name', this.product.name)
                    data.append('description', this.product.description)
                    data.append('price', this.product.price)
                    data.append('show_in_kitchen', this.product.show_in_kitchen ? 1 : 0)
                    data.append('category_from_product_id', this.product.category_from_product_id)

                    if (blob) {
                        data.append('image', blob)
                    }

                    this.$http.post('products', data).then( () => {
                        this.$toastr.success('Producto creado')
                        this.saving = false
                        this.product = {
                            name: '',
                            description: '',
                            price: '',
                            category_from_product_id: '',
                        }
                        this.myCroppa.remove()
                        this.errors = {}
                    }).catch(error => {
                        this.saving = false
                        if (error.response.status == 422) {
                            this.errors = error.response.data.errors
                        }
                    })

                }, 'image/jpg', 0.8)

            }
        },
    }
</script>