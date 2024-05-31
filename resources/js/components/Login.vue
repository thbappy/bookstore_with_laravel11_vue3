<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h1 class="mt-5">Login</h1>
                <form @submit.prevent="loginInfo" class="mt-3">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input
                            v-model="email"
                            type="email"
                            class="form-control"
                            id="email"
                            placeholder="example@example.com"
                            required
                        />
                        <div v-if="errors.email" class="text-danger">{{ errors.email[0] }}</div>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input
                            v-model="password"
                            type="password"
                            class="form-control"
                            id="password"
                            placeholder="Password"
                            required
                        />
                        <div v-if="errors.password" class="text-danger">{{ errors.password[0] }}</div>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios'
import {mapActions} from 'vuex'

export default {
    data() {
        return {
            email: '',
            password: '',
            errors: {},
        };
    },
    created() {
        if (this.$store.state.token != null) {
            this.$router.push('/admin');
        }
    },
    methods: {
        ...mapActions(['login', 'logout']),
        async loginInfo() {
            try {
                const response = await axios.post('/api/login', {
                    email: this.email,
                    password:  this.password,
                });

                if (response.status === 200) {
                    this.login({
                        token: response.data.token,
                        role: response.data.role,
                        user: response.data,
                    });
                    if(response.data.role == "admin"){
                        this.$router.push('/admin');
                    }
                    else {
                        this.$router.push('/dashboard');
                    }

                }
            } catch (error) {
                this.errors = error.response.data.errors;
            }
        },
    },
};
</script>

<style scoped>
.container {
    margin-top: 50px;
}
</style>
