<template>
    <div class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContainer">
        <Header/>
        <div class="app-main">
            <!--Sidebar inicio-->
            <Sidebar/>
            <!--Sidebar fin-->
            <div class="app-main__outer">
                <!--Inicio Main-->
                <div class="app-main__inner" style="height: 100%; max-height: 100%">
                   <router-view/>
                </div>
                <!--Fin Main-->
                <div class="app-wrapper-footer">
                    <div class="app-footer">
                        <div class="app-footer__inner">
                            <div class="app-footer-left">
                                <ul class="nav">
                                    <li class="nav-item">
                                        <a href="https://www.facebook.com/digitalprog" target="_blank" class="nav-link">
                                            Digital Pro - Cofy
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link" @click.prevent.stop="">
                                            Versión: 1.0
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    </div>
</template>

<script>
    import Sidebar from './partials/Sidebar'
    import Header from './partials/Header'
    export default {
        components: {
            Sidebar, Header
        },
        
    }
</script>