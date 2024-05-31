<template>
    <div>
        <button class="btn btn-primary mb-3" @click="showCreateModal">Add Book</button>

        <div class="text-center">
            <h4>Book List {{ books.length }}</h4>
        </div>
        <table class="table table-sm">
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
<!--                <th>Description</th>-->
                <th>Cover Image</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(book, index) in books" :key="book.id">
                <th>{{ index + 1 }}</th>
                <td>{{ book.name }}</td>
<!--                <td>{{ book.description }}</td>-->
                <td><img :src="`/storage/${book.cover_image}`" alt="" width="50"></td>
                <td>{{ book.price }}</td>
                <td>
                    <button class="btn btn-warning btn-sm" @click="showUpdateModal(book)">Edit</button>
                    <button class="btn btn-danger btn-sm" @click="confirmDeleteBook(book.id)">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>

        <!-- Create/Update Book Modal -->
        <div class="modal fade" id="bookModal" tabindex="-1" aria-labelledby="bookModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="bookModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveBook">
                            <div class="mb-3">
                                <label for="name" class="form-label">Name</label>
                                <input v-model="form.name" type="text" class="form-control" id="name" required>
                            </div>
                            <div class="mb-3">
                                <label for="description" class="form-label">Description</label>
                                <textarea v-model="form.description" class="form-control" id="description" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="cover_image" class="form-label">Cover Image</label>
                                <input @change="onFileChange" type="file" class="form-control" id="cover_image">
                            </div>
                            <div class="mb-3">
                                <label for="price" class="form-label">Price</label>
                                <input v-model="form.price" type="number" class="form-control" id="price" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Save</button>
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
    data() {
        return {
            books: [],
            form: {
                id: null,
                name: '',
                description: '',
                cover_image: null,
                price: null,
            },
            modalTitle: 'Add Book',
            selectedFile: null,
        };
    },
    methods: {
        async getBooks() {
            try {
                const response = await axios.get('/api/admin/books',{
                    headers: {
                    Authorization: `Bearer ${this.$store.state.token}`,
                }});
                this.books = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        showCreateModal() {
            this.modalTitle = 'Add Book';
            this.form = {
                id: null,
                name: '',
                description: '',
                cover_image: null,
                price: null,
            };
            this.selectedFile = null;
            const modalElement = document.getElementById('bookModal');
            const modal = new Modal(modalElement);
            modal.show();
        },
        showUpdateModal(book) {
            this.modalTitle = 'Edit Book';
            this.form = { ...book };
            this.selectedFile = null;
            const modalElement = document.getElementById('bookModal');
            const modal = new Modal(modalElement);
            modal.show();
        },
        async saveBook() {
            try {
                const formData = new FormData();
                formData.append('name', this.form.name);
                formData.append('description', this.form.description);
                if (this.selectedFile) {
                    formData.append('cover_image', this.selectedFile);
                }
                formData.append('price', this.form.price);

                if (this.form.id) {
                    formData.append('_method', "PUT");
                    await axios.post(`/api/admin/books/${this.form.id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.token}`,
                        },
                    });
                } else {
                    await axios.post('/api/admin/books', formData, {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.token}`,
                        },
                    });
                }

                this.getBooks();
                const modalElement = document.getElementById('bookModal');
                const modal = Modal.getInstance(modalElement);
                modal.hide();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Book saved successfully',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } catch (error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed to save book',
                    showConfirmButton: false,
                    timer: 1500,
                });
                console.error(error);
            }
        },
        async confirmDeleteBook(bookId) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                position: 'top-end',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.deleteBook(bookId);
                }
            });
        },
        async deleteBook(bookId) {
            try {
                await axios.delete(`/api/admin/books/${bookId}`, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`,
                    },
                });
                this.getBooks();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Book deleted successfully',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } catch (error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed to delete book',
                    showConfirmButton: false,
                    timer: 1500,
                });
                console.error(error);
            }
        },
        onFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
    },
    created() {
        this.getBooks();
    },
};
</script>
