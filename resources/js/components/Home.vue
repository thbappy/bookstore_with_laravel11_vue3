<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-3 mb-4" v-for="book in books" :key="book.id">
                <div class="card h-100">
                    <img :src="`/storage/${book.cover_image}`" class="card-img-top" alt="Book Cover">
                    <div class="card-body">
                        <h5 class="card-title">{{ book.name }}</h5>
                        <p class="card-text">{{ truncateText(book.description, 50) }}</p>
                        <p class="card-text"><strong>${{ book.price }}</strong></p>
                        <button @click="toggleFavorite(book)" class="btn btn-outline-danger">
                            <i :class="{'fas fa-heart': book.isFavorite, 'far fa-heart': !book.isFavorite}"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            books: [],
        };
    },
    methods: {
        async fetchBooks() {
            try {
                const response = await axios.get('/api/book-list');
                this.books = response.data.map(book => ({ ...book, isFavorite: false }));
            } catch (error) {
                console.error(error);
            }
        },
        toggleFavorite(book) {
            // Optimistic UI update
            book.isFavorite = !book.isFavorite;

            // Send POST request to server to update the favorite status
            axios.get(`/favorites/${book.id}`).then(response => {
                // Handle the response
                Swal.fire({
                    position: 'top-end',
                    icon: book.isFavorite ? 'success' : 'info',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            }).catch(error => {
                console.error('Error toggling favorite:', error);
                // Revert the favorite status on error
                book.isFavorite = !book.isFavorite;
            });
        },
        truncateText(text, length) {
            return text.length > length ? text.substring(0, length) + '...' : text;
        }
    },
    created() {
        this.fetchBooks();
    }
};
</script>

<style scoped>
.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: scale(1.05);
}

.card-img-top {
    object-fit: cover;
    height: 150px;
}

.fas.fa-heart {
    color: red;
}
</style>
