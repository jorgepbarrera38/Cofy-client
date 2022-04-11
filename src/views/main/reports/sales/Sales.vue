<template>            
    <div class="row">
        <div class="col-lg-3 col-md-4 col-sm-12 mb-2">
            <div class="card">
                <div class="card-header">
                    INFORME DE VENTAS
                </div>
                <div class="card-body">
                    <search @emitData="search" :errorsWhenGetSales="errorsWhenGetSales" :users="users"/>
                </div>
            </div>
        </div>
        <div class="col-lg-9 col-md-8 col-sm-12">
            <div class="card">
                <div class="card-header">
                    RESULTADOS
                    <div class="btn-actions-pane-right">
                        <span v-if="sales.data.length" class="mr-3">Total: ${{ $formatNum(total) }}</span>
                        <button class="btn btn-success" @click="downloadSalesInExcel" :disabled="(!sales.data.length && !salesDetails.data.length) || downloadingSalesInExcel">
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
                        <div v-if="searchData.typeReport == 'resumido'">
                            <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Consecutivo</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Cliente</th>
                                        <th>Usuario que generó</th>
                                        <th>Usuario que anuló</th>
                                        <th nowrap>Generado por</th>
                                        <th>Total</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="sale in sales.data" :key="sale.index">
                                            <td>{{ sale.number_bill }}</td>
                                            <td nowrap>{{ $moment(sale.date_bill).format('LLL') }}</td>
                                            <td>{{ sale.status }}</td>
                                            <td>{{ sale.client.identification + ' - ' + sale.client.full_names }}</td>
                                            <td>{{ sale.user_create.names }}</td>
                                            <td>{{ sale.user_cancel ? sale.user_cancel.names : '' }}</td>
                                            <td>
                                                <span>
                                                    {{ `${ sale.order.type }: ${ sale.order.id }` }}
                                                </span>
                                            </td>
                                            <td>${{ $formatNum(sale.total_bill) }}</td>
                                            <td nowrap>
                                                <button class="btn btn-danger mr-1" title="Anular venta" @click="showFormToCancelBill(sale)" :disabled="sale.canceling"
                                                    v-if="sale.status == 'Confirmado'">
                                                    <div class="spinner-border text-light spinner-border-sm" role="status" v-if="sale.canceling">
                                                        <span class="sr-only">Loading...</span>
                                                    </div>
                                                    <i class="fa fa-times-circle" v-else></i>
                                                </button>
                                                <button class="btn btn-info" title="Imprimir venta" @click="printBill(sale)" :disabled="sale.printingBill">
                                                    <div class="spinner-border text-light spinner-border-sm" role="status" v-if="sale.printingBill">
                                                        <span class="sr-only">Loading...</span>
                                                    </div>
                                                    <i class="fa fa-print" v-else></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <pagination :data="sales" @pagination-change-page="getSales"></pagination>
                            <modal name="cancel-bill-modal" :adaptive="true" height="auto">
                                <div class="p-4">
                                    <h5 class="mb-3">Anular venta</h5>
                                    <div class="alert alert-danger" v-if="Object.keys(errorsWhenCancelBills).length">
                                        <li v-for="(error, index) in errorsWhenCancelBills" :key="index">
                                            {{ error[0] }}
                                        </li>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-12">
                                            <label for="">Consecutivo: </label>
                                            {{ billSelectedToDelete.id }}
                                        </div>
                                        <div class="form-group col-md-12" v-if="billSelectedToDelete.order.table_id">
                                            <label for="">Mesa: </label>
                                            {{ billSelectedToDelete.order.table_id }}
                                        </div>
                                        <div class="form-group col-md-12" v-if="billSelectedToDelete.order.type != 3">
                                            <div class="custom-checkbox custom-control">
                                                <input type="checkbox" id="exampleCustomCheckbox" class="custom-control-input" v-model="cancelOrderOrDelivery">
                                                <label class="custom-control-label" for="exampleCustomCheckbox">
                                                    Anular {{ billSelectedToDelete.order.table_id ? 'orden de pedido' : 'domicilio' }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    <button class="btn btn-secondary mr-1" @click="$modal.hide('cancel-bill-modal')" :disabled="cancelingBill">
                                        <i class="fa fa-times"></i> Cerrar
                                    </button>
                                    <button class="btn btn-danger" @click="cancelBill" :disabled="cancelingBill">
                                        <div class="spinner-border text-light spinner-border-sm" role="status" v-if="cancelingBill">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                        <i class="fa fa-times-circle" v-else></i> Anular
                                    </button>
                                </div>
                            </modal>
                        </div>
                        <div v-else>
                            <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Consecutivo</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th>Usuario que generó orden/domicilio/venta</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="saleDetail in salesDetails.data" :key="`saleDetail-${saleDetail.id}`">
                                            <td>{{ saleDetail.bill.id }}</td>
                                            <td>{{ $moment(saleDetail.bill.date_bill).format('LLL') }}</td>
                                            <td>{{ saleDetail.bill.status }}</td>
                                            <td>{{ saleDetail.product.name }}</td>
                                            <td>${{ $formatNum(saleDetail.price) }}</td>
                                            <td>{{ saleDetail.quantity }}</td>
                                            <td>${{ $formatNum(saleDetail.price * saleDetail.quantity) }}</td>
                                            <td>{{ saleDetail.bill.order.user_create.names }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <pagination :data="salesDetails" @pagination-change-page="getSales"></pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchSaleComponent from './SearchSaleComponent'
    import downloadJs from 'downloadjs'
    import printJs from 'print-js'
    export default {
        name: 'reports.sales',
        components: {
            'search' : SearchSaleComponent,
        },
        created () {
            this.getUsers()
        },
        data() {
            return {
                sales: {
                    data: []
                },
                salesDetails: {
                    data: []
                },
                total: 0,
                searchData: {
                    dateInitial: '',
                    dateFinal: '',
                    typeReport: '',
                    includeCanceleds: '',
                    user_id: ''
                },
                users: [],
                errorsWhenGetSales: {},
                billSelectedToDelete: {
                    order: {}
                },
                cancelOrderOrDelivery: true,
                cancelingBill: false,
                errorsWhenCancelBills: {},
                loadingData: false,
                downloadingSalesInExcel: false,
            }
        },
        methods: {
            getUsers() {
                this.$http.get('reports/get-users').then(response => {
                    this.users = response.data
                })
            },
            search (search) {
                this.searchData = search
                this.loadingData = true
                this.getSales(1)
            },
            getSales(page = 1) {
                this.total = 0
                this.$http.get(`reports/sales?page=${ page }&date_initial=${ this.searchData.dateInitial }
                                    &date_final=${ this.searchData.dateFinal }&type_report=${ this.searchData.typeReport }
                                    &include_canceleds=${ this.searchData.includeCanceleds }&user_id=${ this.searchData.user_id ? this.searchData.user_id : '' }`).then( response => {
                    if (this.searchData.typeReport == 'resumido') {
                        this.sales = response.data.bills
                        this.sales.data.forEach(sale => {
                            this.$set(sale, 'printingBill', false)
                        });
                    } else {
                        this.salesDetails = response.data.billDetails
                    }
                    
                    this.total = response.data.total
                    this.errorsWhenGetSales = {}
                    this.loadingData = false
                }).catch(error => {
                    if (error.response.status == 422) {
                        this.errorsWhenGetSales = error.response.data.errors
                    }
                    this.loadingData = false
                })
            },
            downloadSalesInExcel() {
                this.downloadingSalesInExcel = true
                this.$http.get(`reports/sales/download-sales-in-excel?date_initial=${ this.searchData.dateInitial }
                                    &date_final=${ this.searchData.dateFinal }&type_report=${ this.searchData.typeReport }
                                    &include_canceleds=${ this.searchData.includeCanceleds }&user_id=${ this.searchData.user_id ? this.searchData.user_id : '' }`, { responseType: 'blob' }).then(response => {
                    downloadJs(response.data, 'Informe-de-ventas.xlsx')
                    this.downloadingSalesInExcel = false
                    this.errorsWhenGetSales = {}
                }).catch(() => {
                    this.downloadingSalesInExcel = false
                    this.$toastr.error('Ocurrió un error al descargar el archivo')
                })
            },
            showFormToCancelBill(bill) {
                this.cancelOrderOrDelivery = true
                this.errorsWhenCancelBills = {}
                this.billSelectedToDelete = bill
                this.$modal.show('cancel-bill-modal')
            },
            cancelBill() {
                this.cancelingBill = true
                
                this.$http.post(`bills/${ this.billSelectedToDelete.id }/cancel-bill`, { cancelOrderOrDelivery: this.cancelOrderOrDelivery }).then( response => {
                    this.getSales()
                    this.$modal.hide('cancel-bill-modal')
                    this.cancelingBill = false
                    this.errorsWhenCancelBills = {}
                }).catch(error => {
                    this.cancelingBill = false
                    if (error.response.status == 422) {
                        this.errorsWhenCancelBills = error.response.data.errors
                    }
                })
            },
            printBill(bill) {
                bill.printingBill = true
                this.$http.get(`bills/${ bill.id }/print-bill`, { responseType: 'blob' }).then( response => {
                    printJs(URL.createObjectURL(response.data))
                    bill.printingBill = false
                }).catch(error => {
                    thibills.printingBill = false
                    this.$toastr.error('El comprobante de venta no se pudo generar')
                })
            }
        },
    }
</script>