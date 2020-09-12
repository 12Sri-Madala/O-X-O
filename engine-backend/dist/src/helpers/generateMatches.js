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
    init: function (owner, days) {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        let matches = [];
        for (let i = 0; i < days; i++) {
            let match = {
                type: 'OWNER',
                status: 'Unavailable',
                current: true,
                date: format(date),
                ownerID: owner.id,
            };
            matches.push(match);
            date.setDate(date.getDate() + 1);
        }
        return (matches);
    },
    addDaily: function (owner) {
        let date = new Date();
        date.setDate(date.getDate() + 14);
        let matches = [];
        owner.forEach((driver) => {
            let match = {
                type: 'OWNER',
                status: 'Unavailable',
                current: true,
                date: format(date),
                ownerID: owner.id,
            };
            matches.push(match);
        });
        return matches;
    },
};
function format(d) {
    let month = (d.getMonth() >= 9) ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
    let day = (d.getDate() >= 10) ? d.getDate() : `0${d.getDate()}`;
    let year = d.getFullYear();
    return `${month}/${day}/${year}`;
}
// module.export = initMatches;
//# sourceMappingURL=generateMatches.js.map