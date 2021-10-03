<template>
    <div class="form-inline mb-3">
        <div class="mb-2 mr-sm-2 mb-sm-0 position-relative form-group">
            <label for="exampleEmail22" class="mr-sm-2">Fecha inicial</label>
            <input type="datetime-local" id="exampleEmail22" class="form-control" v-model="dateInitial">
        </div>
        <div class="mb-2 mr-sm-2 mb-sm-0 position-relative form-group">
            <label for="examplePassword22" class="mr-sm-2">Fecha final</label>
            <input type="datetime-local"  id="examplePassword22" class="form-control" v-model="dateFinal">
        </div>
        <button class="btn btn-primary" @click="emitData">
            <i class="fa fa-search"></i> Buscar
        </button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dateInitial: '',
                dateFinal: ''
            }
        },
        methods: {
            emitData() {
                this.$emit('emitData', { dateInitial: this.dateInitial, dateFinal: this.dateFinal })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>