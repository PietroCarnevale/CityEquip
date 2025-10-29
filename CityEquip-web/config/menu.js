const baseMenu = [
    { slug: '/equipments', title: 'Equipments' },
    { slug: '/map', title: 'Map' },
    { slug: '/top', title: 'Top' }
];

const loggedMenu = [...baseMenu, { slug: '/mytop', title: 'My Top'}, { slug: '/reviews', title: 'My Reviews'}];

function getMenuForRole(role = 'guest') {
    if (role === 'administrator') {
        return [...loggedMenu, { slug: '/add', title: 'Add'}];
    }
    if (role === 'user') {
        return loggedMenu;
    }
    return baseMenu;
}

module.exports = getMenuForRole;