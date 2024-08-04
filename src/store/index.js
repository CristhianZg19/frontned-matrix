import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    matrix: null,
    statistics: null,
    error: null,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    SET_MATRIX(state, matrix) {
      state.matrix = matrix;
    },
    SET_STATISTICS(state, statistics) {
      state.statistics = statistics;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    LOGOUT(state) {
      state.token = '';
      state.matrix = null;
      state.statistics = null;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('http://localhost:3000/login', credentials);
        commit('SET_TOKEN', response.data.token);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
    async fetchMatrix({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/get-matrix', {
          headers: { Authorization: `Bearer ${this.state.token}` },
        });
        commit('SET_MATRIX', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
    async rotateMatrix({ commit, state }) {
      try {
        const response = await axios.post('http://localhost:3000/rotate-matrix', { matrix: state.matrix }, {
          headers: { Authorization: `Bearer ${this.state.token}` },
        });
        commit('SET_MATRIX', response.data);
        await this.dispatch('fetchStatistics');
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
    async fetchStatistics({ commit, state }) {
      try {
        const response = await axios.post('http://localhost:3001/calculate-statistics', { matrix: state.matrix }, {
          headers: { Authorization: `Bearer ${this.state.token}` },
        });
        commit('SET_STATISTICS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
  },
});
