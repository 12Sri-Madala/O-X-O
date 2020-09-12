'use strict';

module.exports = {
  	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('vehicles', [
			{
        id: "4ffe668a-9de2-11e9-a2a3-2a2ae2dbcce4",
				make: 'Toyota',
				model: 'Camry',
				year: 2016,
				VIN: '1234567890qwertyu',
				plateNumber: '65L-AB9',
				color: 'Grey',
				companies: '{"registered": ["Uber"], "pending": ["Lyft"]}',
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]);
  	},

  	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('vehicles');
  	}
};
