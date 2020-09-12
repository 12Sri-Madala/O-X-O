/*
Creates an array of 7 or 14 empty matches which can be added to the database.
Driver is the driver object for which we are creating new matches.
Should be called with days === 7 on a Sunday for a driver who already exists.
Should be called with days === 14 when it is a new driver.
Still to do:
- Add these blank matches to the database
- Move any current matches for an existing user to previous matches (set current to false)
*/

module.exports = {
    init: function(driver, days){
        let date = new Date();
        date.setDate(date.getDate() + 1);
        let matches = [];
        for(let i = 0; i < days; i++){
            let match = {
                type: 'DRIVER',
                status: 'Unavailable',
                current: true,
                date: format(date),
                driverID: driver.id,
                driverRating: (driver.rating ? driver.rating : null),
            }
            matches.push(match);
            date.setDate(date.getDate() + 1);
        }
        
        return(matches);
    },
    addDaily: function(drivers){
        let date = new Date();
        date.setDate(date.getDate() + 14);
        let matches = [];
        drivers.forEach((driver) => {
            let match = {
                type: 'DRIVER',
                status: 'Unavailable',
                current: true,
                date: format(date),
                driverID: driver.id,
                driverRating: (driver.rating ? driver.rating : null)
            };
            matches.push(match);
        });
        return matches;
    },
}

function format(d){
    let month = (d.getMonth() >= 9) ? d.getMonth() + 1 : `0${d.getMonth()+1}`;
    let day = (d.getDate() >= 10) ? d.getDate() : `0${d.getDate()}`;
    let year = d.getFullYear();
    return `${month}/${day}/${year}`;
}

// module.export = initMatches;
