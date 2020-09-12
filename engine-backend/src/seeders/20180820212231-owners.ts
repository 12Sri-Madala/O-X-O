'use strict';
export{}
let vehicles = '{"vehicles": [1]}';
let matches = '{"current": ["4","5","6","7","8","9","10","11","12","13"], "previous": ["1","2","3"]}';
let addresses = '{"addresses": [{"label": "Home", "address": "5 Crenshaw Ct, Bolingbrook IL"}, {"label": "Work", "address": "532 Cole St, San Francisco CA"}]}';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('owners', [
            {
                id: "4ffe668a-9de2-11e9-a2a3-2a2ae2dbcce4",
                token: null,
                firstName: 'Neil',
                lastName: 'Armstrong',
                address: '36.7783x119.4179',
                phoneNumber: '+18186965646',
                profileImage: base64Image,
                email: 'armstrong@gmail.com',
                rating: 4.6,
                isDriver: false,
                vehicles: vehicles,
                matches: matches,
                addresses: addresses,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('owners');
    }
};

const base64Image = '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'