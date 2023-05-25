<template>
    <div class="row">
        <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content">
                <div class="widget-content-outer">
                    <div class="widget-content-wrapper">
                        <div class="widget-content-left">
                            <div class="widget-heading">Total vendido</div>
                            <div class="widget-subheading">Durante la semana</div>
                        </div>
                        <div class="widget-content-right">
                            <div class="widget-numbers text-success">${{ $formatNum(totalLastWeek) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content">
                <div class="widget-content-outer">
                    <div class="widget-content-wrapper">
                        <div class="widget-content-left">
                            <div class="widget-heading">Total vendido</div>
                            <div class="widget-subheading">Último mes</div>
                        </div>
                        <div class="widget-content-right">
                            <div class="widget-numbers text-success">${{ $formatNum(totalLastMonth) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-4">
            <div class="card mb-3 widget-content">
                <div class="widget-content-outer">
                    <div class="widget-content-wrapper">
                        <div class="widget-content-left">
                            <div class="widget-heading">Total vendido</div>
                            <div class="widget-subheading">A la fecha</div>
                        </div>
                        <div class="widget-content-right">
                            <div class="widget-numbers text-success">${{ $formatNum(totalSold) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="main-card mb-3 card">
                <div class="card-header">
                    Top 5 más vendidos
                </div>
                <div class="table-responsive">
                    <table class="align-middle mb-0 table table-borderless table-striped table-hover">
                        <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th>Producto</th>
                            <th class="text-center">Cantidad</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in mostSelledProducts" :key="`mostSelledProduct-${ product.product_id }`">
                                <td class="text-center">{{ index + 1 }}</td>
                                <td>
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left mr-3">
                                                <div class="widget-content-left">
                                                    <img width="40" class="rounded-circle" 
                                                        :src="product.product.image ? APP_URL + product.product.image : require('@/assets/placeholder-image.jpg')" 
                                                        alt="">
                                                </div>
                                            </div>
                                            <div class="widget-content-left flex2">
                                                <div class="widget-heading">{{ product.product.name }}</div>
                                                <div class="widget-subheading opacity-7">{{ product.product.category_from_product.name }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-center">{{ product.quantity }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-block text-center card-footer">
                </div>
            </div>
        </div>
        
        <div class="col-sm-9 col-md-6 col-lg-9">
            <div class="card-shadow-success mb-3 widget-chart widget-chart2 text-left card">
                <div class="widget-content">
                    <div class="widget-content-outer">
                        <div class="widget-content-wrapper">
                            <div class="widget-content-left pr-2 fsize-1">
                                <div class="widget-numbers mt-0 fsize-3 text-success">{{ getPercentageOfOccupation ? getPercentageOfOccupation : 0 }}%</div>
                            </div>
                            <div class="widget-content-right w-100">
                                <div class="progress-bar-xs progress">
                                    <div class="progress-bar bg-success" role="progressbar" 
                                            aria-valuenow="54" aria-valuemin="0" 
                                            aria-valuemax="100" :style="{ width: `${ getPercentageOfOccupation ? getPercentageOfOccupation : 0 }%`}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="widget-content-left fsize-1">
                            <div class="text-muted opacity-6">Ocupación de mesas</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-3 col-md-6 col-lg-3">
            <div class="card mb-3 widget-content">
                <div class="widget-content-outer">
                    <div class="widget-content-wrapper">
                        <div class="widget-content-left">
                            <div class="widget-heading">Domicilios pendientes</div>
                            <!--<div class="widget-subheading">People Interested</div>-->
                        </div>
                        <div class="widget-content-right">
                            <div class="widget-numbers text-danger">{{ deliveriesPendings }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        created () {
            this.getMostSelledProducts()
        },
        data() {
            return {
                mostSelledProducts: [],
                totalSold: '',
                totalLastMonth: '',
                totalLastWeek: '',
                tables: [],
                deliveriesPendings: ''
            }
        },
        methods: {
            getMostSelledProducts() {
                this.$http.get('dashboard/get-most-selled-products').then(response => {
                    this.mostSelledProducts = response.data.mostSelledProducts
                    this.totalSold = response.data.totalSold
                    this.totalLastMonth = response.data.totalLastMonth
                    this.totalLastWeek = response.data.totalLastWeek
                    this.tables = response.data.tables
                    this.deliveriesPendings = response.data.deliveriesPendings
                })
            }
        },
        computed: {
            ...mapState(['APP_URL']),
            getPercentageOfOccupation() {
                let totalTables = this.tables.length
                let tablesOccupied = this.tables.filter(table => !table.free).length

                return parseInt((tablesOccupied * 100) / totalTables)

                return 100
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>