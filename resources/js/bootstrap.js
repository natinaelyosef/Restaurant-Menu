import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// Include cookies on cross-site requests so session cookie is sent with API calls
window.axios.defaults.withCredentials = true;

// Add route helper if needed
window.route = window.route || function(name, params) {
    return '/' + name;
};