import store from '@/stores';
const getters = store.getters;
const allAuths = getters.auth;
console.log('********************');
console.log(getters)
console.log(getters.auth)
console.log('********************');
const hasOprAuth = (value) => {
    return allAuths.includes(value);
};

export default hasOprAuth;
