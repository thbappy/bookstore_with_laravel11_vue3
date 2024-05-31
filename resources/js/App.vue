<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">

                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container-fluid">
                        <router-link class="navbar-brand" to="/">Bajara-BookStore</router-link>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul v-if="$store.state.token == null" class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <router-link class="nav-link" to="/login">Login</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link" to="/register">Register</router-link>
                                </li>
                            </ul>

                            <ul v-if="$store.state.token != null" class="navbar-nav mb-lg-0">
                                <li class="nav-item">
                                    <router-link class="nav-link active" aria-current="page" to="/admin/users">User</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link class="nav-link active" aria-current="page" to="/admin/books">Books</router-link>
                                </li>
                                <li  class="nav-item">
                                    <a class="nav-link" @click.prevent="logoutInfo">Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <router-view></router-view>
            </div>
        </div>

    </div>

</template>

<script>
import {mapActions} from "vuex";

export default {
    name: 'App',
    methods: {
        ...mapActions(['logout']),
        logoutInfo(){
           this.logout();
            this.$router.push('/login');
        }
    }
};
</script>
