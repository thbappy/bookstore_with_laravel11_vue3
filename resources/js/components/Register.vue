<template>
    <div class="container mt-5">
        <h1 class="text-center">Register</h1>
        <form @submit.prevent="register" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input v-model="name" type="text" class="form-control" id="name" placeholder="Name" required />
                <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" id="email" placeholder="Email" required />
                <div v-if="errors.email" class="text-danger">{{ errors.email[0] }}</div>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input v-model="password_confirmation" type="password" class="form-control" id="password" placeholder="password." required />
                    <div v-if="errors.password" class="text-danger">{{ errors.password[0] }}</div>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Password Confirmation</label>
                <input v-model="password" type="password" class="form-control" id="confirm_password" placeholder="Please enter confirm password." required />
                <div class="invalid-feedback">
                    Please enter a password.
                </div>
            </div>
            <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            errors: {},
        };
    },
    methods: {
        async register() {
            try {
                const response = await axios.post('/api/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                });

                if(response.status == 200) {
                    this.$router.push('/login');
                }

            } catch (error) {
                console.error('Registration failed:', error);
                this.errors = error.response.data.errors;
            }
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 500px;
}
</style>
