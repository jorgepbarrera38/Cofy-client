<template>
    <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="search" @keyup.enter="searchNow" :placeholder="placeholder">
        <div class="input-group-append">
            <button class="btn btn-primary" @click="searchNow">
                <i class="fa fa-search"></i> Buscar
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            placeholder: {
                type: String
            },
        },
        data() {
            return {
                search: ''
            }
        },
        methods: {
            searchNow() {
                this.$emit('searchNow', this.search)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>