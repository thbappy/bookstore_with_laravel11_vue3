import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

export default new createStore({
    state: {
        token: null,
        role: null,
        user: {},
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setRole(state, role) {
            state.role = role;
        },
        setUser(state, user) {
            state.user = user;
        },
        clearAuth(state) {
            state.token = null;
            state.role = null;
            state.user = {};
        },
    },
    actions: {
        login({ commit }, { token, user,role }) {
            commit('setToken', token);
            commit('setRole', role);
            commit('setUser', user);
        },
        logout({ commit }) {
            try {
                commit('clearAuth');
            }
            catch (error) {
                console.error('Logout failed:', error);
            }
        },
    },
    plugins: [createPersistedState()],
});
