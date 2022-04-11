<template>
    <div class="form-row">
        <div class="form-group col-md-12">
            <div class="alert alert-danger" v-if="Object.keys(errorsWhenGetSales).length">
                <li v-for="(error, index) in errorsWhenGetSales" :key="index">
                    {{ error[0] }}
                </li>
            </div>
        </div>
        <div class="form-group col-md-12">
            <label class="mr-sm-2">Fecha inicial</label>
            <input type="datetime-local" class="form-control" v-model="dateInitial">
        </div>
        <div class="form-group col-md-12">
            <label class="mr-sm-2">Fecha final</label>
            <input type="datetime-local" class="form-control" v-model="dateFinal">
        </div>
        <!--<div class="form-group col-md-12">
            <label class="mr-sm-2">Usuario que generó orden/domicilio/venta</label>
            <v-select :options="users" 
                            :reduce="user => user.id" 
                            label="names" 
                            v-model="user_id">
                        <template v-slot:no-options="{ searching }">
                            <template v-if="searching">
                                No hay coincidencias.
                            </template>
                        </template>
            </v-select>
        </div>-->
        <div class="form-group col-md-12">
            <label class="mr-sm-2">Tipo</label>
            <div class="custom-radio custom-control">
                <input type="radio" id="exampleCustomRadio" name="customRadio" class="custom-control-input" value="resumido" v-model="typeReport">
                <label class="custom-control-label" for="exampleCustomRadio">Resumido</label>
            </div>
            <div class="custom-radio custom-control">
                <input type="radio" id="exampleCustomRadio2" name="customRadio" class="custom-control-input" value="detallado" v-model="typeReport">
                <label class="custom-control-label" for="exampleCustomRadio2">Detallado</label>
            </div>
        </div>
        <div class="form-group col-md-12">
            <label class="form-check-label"><input type="checkbox" class="" v-model="includeCanceleds"> Incluir anuladas</label>
        </div>

        <div class="form-group col-md-12">
            <button class="btn btn-primary" @click="emitData">
                <i class="fa fa-search"></i> Buscar
            </button>
        </div>
        

    </div>
</template>

<script>
    export default {
        props: {
            errorsWhenGetSales: {
                type: Object
            },
            users: {
                type: Array
            }
        },
        data() {
            return {
                dateInitial: '',
                dateFinal: '',
                typeReport: 'resumido',
                includeCanceleds: false,
                user_id: ''
            }
        },
        methods: {
            emitData() {
                this.$emit('emitData', { 
                    dateInitial: this.dateInitial, 
                    dateFinal: this.dateFinal, 
                    typeReport: this.typeReport, 
                    includeCanceleds: this.includeCanceleds,
                    user_id: this.user_id
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>