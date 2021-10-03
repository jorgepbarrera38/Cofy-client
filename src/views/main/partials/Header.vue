<template>
    <div class="app-header header-shadow bg-asteroid header-text-light">
            <div class="app-header__logo">
                <div style="color:white">
                    <h4 v-if="showTitle">
                        <i class="fa fa-coffee mr-1"></i>
                        Cofy
                    </h4>
                </div>
                <div class="header__pane ml-auto">
                    <div>
                        <button type="button" class="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar" @click="hideTitle">
                            <span class="hamburger-box">
                                <span class="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="app-header__mobile-menu">
                <div>
                    <button type="button" class="hamburger hamburger--elastic mobile-toggle-nav" id="buttonHamburguer">
                        <span class="hamburger-box">
                            <span class="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
            </div>
            <div class="app-header__menu">
                <span>
                    <button type="button" class="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                        <span class="btn-icon-wrapper">
                            <i class="fa fa-ellipsis-v fa-w-6"></i>
                        </span>
                    </button>
                </span>
            </div>    
            <div class="app-header__content" id="headerBotonUser">
                <div class="app-header-left" v-show="this.$route.name != 'login'">
                    <ul class="header-menu nav">
                        <li class="nav-item">
                            <a href="#" class="nav-link" @click.prevent="goToRouteDeliveryCreate">
                                <i class="nav-link-icon fa fa-map-marked-alt"> </i>
                                Nuevo domicilio
                            </a>
                        </li>
                    </ul>        
                </div>
                <div class="app-header-right">
                    <div class="header-btn-lg pr-0">
                        <div class="widget-content p-0">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left">
                                    <div class="btn-group">
                                        <a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="p-0 btn">
                                            <img width="42" class="rounded-circle" src="assets/images/avatars/1.png" alt="">
                                            <i class="fa fa-angle-down ml-2 opacity-8"></i>
                                        </a>
                                        <div v-show="this.$route.name != 'login'" tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu dropdown-menu-right">
                                            <button type="button" tabindex="0" class="dropdown-item" @click="logout">Cerrar sesión</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="widget-content-left  ml-3 header-user-info">
                                    <div class="widget-heading">
                                        {{ namesFromUserAuthenticated }}
                                    </div>
                                    <div class="widget-subheading">
                                        <!--VP People Manager-->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>        </div>
            </div>
        </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    export default {
        data() {
            return {
                showTitle: true
            }
        },
        methods: {
            logout() {
                document.getElementById('headerBotonUser').classList.remove('header-mobile-open')
                document.getElementById('buttonHamburguer').classList.remove('is-active')
                document.getElementById('appContainer').classList.remove('sidebar-mobile-open')
                localStorage.removeItem('access_token')
                localStorage.removeItem('names_user')
                localStorage.removeItem('nameCompany')
                localStorage.removeItem('permissions')
                this.setNamesFromUserAuthenticated('')
                this.$router.push({ name: 'login' })
              
                document.getElementsByName('liMenuToCollapse').forEach(element => {
                    element.removeAttribute('class')
                });
                
                document.getElementsByName('ulMenuToCollapse').forEach(element => {
                    element.classList.remove('mm-show')
                });
            
                this.$http.post('auth/logout')
            },
            ...mapMutations(['setNamesFromUserAuthenticated']),
            goToRouteDeliveryCreate() {
                if (!this.$hasPermission('deliveries.store')) return this.$toastr.error('No tiene permisos para esta acción')
                this.$router.push({ name: 'deliveries.create' })
            },
            hideTitle() {                
                if (!document.getElementById('appContainer').classList.contains('closed-sidebar')) {
                    this.showTitle = false
                } else {
                    this.showTitle = true
                }
            }
        },
        computed: {
            ...mapState(['namesFromUserAuthenticated'])
        },
    }
</script>

<style lang="scss" scoped>

</style>