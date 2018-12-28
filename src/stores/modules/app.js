import $cookie from '@mr/fe/utils/cookie';

const app = {
    state: {
        sidebar: {
            opened: !+$cookie.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop'
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                $cookie.set('sidebarStatus', 1);
            } else {
                $cookie.set('sidebarStatus', 0);
            }
            state.sidebar.opened = !state.sidebar.opened;
            state.sidebar.withoutAnimation = false;
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            $cookie.set('sidebarStatus', 1);
            state.sidebar.opened = false;
            state.sidebar.withoutAnimation = withoutAnimation;
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device;
        }
    },
    actions: {
        ToggleSideBar: ({ commit }) => {
            commit('TOGGLE_SIDEBAR');
        },
        CloseSideBar({ commit }, { withoutAnimation }) {
            commit('CLOSE_SIDEBAR', withoutAnimation);
        },
        ToggleDevice({ commit }, device) {
            commit('TOGGLE_DEVICE', device);
        }
    }
};

export default app;
