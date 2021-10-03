<template>
    <div class="form-row">
        <div class="form-group col-md-12">
            <div class="alert alert-danger" v-if="Object.keys(errorsWhenGetOrders).length">
                <li v-for="(error, index) in errorsWhenGetOrders" :key="index">
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
            <button class="btn btn-primary" @click="emitData">
                <i class="fa fa-search"></i> Buscar
            </button>
        </div>
        

    </div>
</template>

<script>
    export default {
        props: {
            errorsWhenGetOrders: {
                type: Object,
                default: () => {}
            },
        },
        data() {
            return {
                dateInitial: '',
                dateFinal: '',
                typeReport: 'resumido',
            }
        },
        methods: {
            emitData() {
                this.$emit('emitData', { dateInitial: this.dateInitial, dateFinal: this.dateFinal, typeReport: this.typeReport })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>