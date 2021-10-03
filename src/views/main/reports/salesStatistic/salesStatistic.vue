<template>            
    <div class="row">
        <div class="col-lg-3 col-md-4 col-sm-12 mb-2">
            <div class="card">
                <div class="card-header">
                    ESTADÍSTICO DE VENTAS
                </div>
                <div class="card-body">
                    <search @emitData="search" :errorsWhenGetSales="errorsWhenGetSales"/>
                </div>
            </div>
        </div>
        <div class="col-lg-9 col-md-8 col-sm-12">
            <div class="card">
                <div class="card-header">
                    RESULTADOS
                    <div class="btn-actions-pane-right">
                        <span v-if="sales.data.length" class="mr-3">Total: ${{ $formatNum(total) }}</span>
                        <button class="btn btn-success" @click="downloadSalesStatisticInExcel" :disabled="!sales.data.length || downloadingSalesInExcel">
                            <div class="spinner-border text-light spinner-border-sm" role="status" v-if="downloadingSalesInExcel">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <i class="fa fa-file-excel" v-else></i> Descargar
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="loadingData" class="d-flex justify-content-center">
                        <div class="spinner-border text-primary" role="status" >
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div v-else>
                            <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Año</th>
                                        <th>Mes</th>
                                        <th>Total</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(sale, index) in sales.data" :key="`sale-${ index }`">
                                            <td>{{ sale.year_bill }}</td>
                                            <td>{{ getMonth(sale.month_bill) }}</td>
                                            <td>${{ $formatNum(sale.total) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <pagination :data="sales" @pagination-change-page="getSalesStatistic"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSaleStatisticComponent from './SearchSaleStatisticComponent'
    import downloadJs from 'downloadjs'
    export default {
        name: 'reports.sales',
        components: {
            'search' : SearchSaleStatisticComponent,
        },
        data() {
            return {
                sales: {
                    data: []
                },
                total: 0,
                searchData: {
                    dateInitial: '',
                    dateFinal: ''
                },
                errorsWhenGetSales: {},
                loadingData: false,
                downloadingSalesInExcel: false,
                months: [
                    'Enero',
                    'Febrero',
                    'Marzo',
                    'Abril',
                    'Mayo',
                    'Junio',
                    'Julio',
                    'Agosto',
                    'Septiembre',
                    'Octubre',
                    'Noviembre',
                    'Diciembre'
                ]
            }
        },
        methods: {
            search (search) {
                this.searchData = search
                this.loadingData = true
                this.getSalesStatistic(1)
            },
            getSalesStatistic(page = 1) {
                this.total = 0
                this.$http.get(`reports/sales-statistic?page=${ page }&date_initial=${ this.searchData.dateInitial }
                                    &date_final=${ this.searchData.dateFinal }`).then( response => {
                    
                    this.sales = response.data.bills
                    this.total = response.data.total
                    this.loadingData = false
                    this.errorsWhenGetSales = {}

                }).catch(error => {
                    if (error.response.status == 422) {
                        this.errorsWhenGetSales = error.response.data.errors
                    }
                    this.loadingData = false
                })
            },
            downloadSalesStatisticInExcel() {
                this.downloadingSalesInExcel = true
                this.$http.get(`reports/sales-statistic/download-sales-statistic-in-excel?date_initial=${ this.searchData.dateInitial }
                                    &date_final=${ this.searchData.dateFinal }`, { responseType: 'blob' }).then(response => {
                    downloadJs(response.data, 'Estadistico-de-ventas.xlsx')
                    this.downloadingSalesInExcel = false
                    this.errorsWhenGetSales = {}
                }).catch(() => {
                    this.downloadingSalesInExcel = false
                    this.$toastr.error('Ocurrió un error al descargar el archivo')
                })
            },
            getMonth(monthNumber) {
                return this.months[monthNumber - 1]
            }
        },
    }
</script>