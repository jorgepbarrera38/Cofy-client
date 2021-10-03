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
            <input type="month" class="form-control" v-model="dateInitial">
        </div>
        <div class="form-group col-md-12">
            <label class="mr-sm-2">Fecha final</label>
            <input type="month" class="form-control" v-model="dateFinal">
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
            }
        },
        methods: {
            emitData() {
                this.$emit('emitData', { 
                    dateInitial: this.dateInitial, 
                    dateFinal: this.dateFinal, 
                })
            }
        },
    }
</script>