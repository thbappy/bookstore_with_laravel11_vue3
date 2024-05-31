<template>
    <div>
        <div class="text-center">
            <h4 class="text-center">User List {{ users.length }}</h4>
        </div>
        <table class="table table-sm">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                    <button class="btn btn-sm btn-warning" @click="showUpdateModal(user)">Update</button>
                    <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>

        <!-- Update User Modal -->
        <div class="modal fade" id="updateUserModal" tabindex="-1" aria-labelledby="updateUserModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="updateUserModalLabel">Update User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="updateUser">
                            <div class="mb-3">
                                <label for="userName" class="form-label">Name</label>
                                <input v-model="selectedUser.name" type="text" class="form-control" id="userName" required>
                            </div>
                            <div class="mb-3">
                                <label for="userEmail" class="form-label">Email</label>
                                <input v-model="selectedUser.email" type="email" class="form-control" id="userEmail" required>
                            </div>
                            <div class="mb-3">
                                <label for="userRole" class="form-label">Role</label>
                                <select v-model="selectedUser.role" class="form-control" id="userRole" required>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">Save changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

export default {
    name: 'UserList',
    data() {
        return {
            users: [],
            selectedUser: {}
        };
    },
    methods: {
        async getUser() {
            try {

                const response = await axios.get('/api/admin/user-list', {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`,
                    },
                });
                if (response.status === 200) {
                    this.users = response.data;
                }
            } catch (error) {
                console.error(error);
            }
        },
        showUpdateModal(user) {
            this.selectedUser = { ...user };
            const modalElement = document.getElementById('updateUserModal');
            const modal = new Modal(modalElement);
            modal.show();
        },
        async updateUser() {
            try {
                const response = await axios.put(`/api/admin/user/${this.selectedUser.id}`, this.selectedUser, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`,
                    },
                });
                if (response.status === 200) {
                    this.getUser();
                    const modalElement = document.getElementById('updateUserModal');
                    const modal = Modal.getInstance(modalElement);
                    modal.hide();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'User updated successfully'
                    });
                }
            } catch (error) {
                console.error(error);
            }
        },
        async deleteUser(userId) {
            try {

                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const response = await axios.delete(`/api/admin/user/${userId}`, {
                            headers: {
                                Authorization: `Bearer ${this.$store.state.token}`,
                            },
                        });
                        if (response.status === 200) {
                            this.getUser();
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'User Delete successfully'
                            });
                        }
                    }
                });


            } catch (error) {
                console.error(error);
            }
        }
    },
    created() {
        this.getUser();
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
