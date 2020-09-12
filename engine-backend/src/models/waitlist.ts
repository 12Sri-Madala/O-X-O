export {};
import uuid from "uuid/v4";

module.exports = (sequelize: any, DataTypes: any) => {
  const Waitlist = sequelize.define("waitlist", {
    id: {
      type: DataTypes.UUID,
      defaultType: DataTypes.UUIDV4,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING //WAITLISTED, DENIED, ACTIVATED
    },
    userID: {
      type: DataTypes.UUID
    },
    points: {
      type: DataTypes.INTEGER
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE
    }
  });

  Waitlist.beforeCreate((waitlistEntry: any) => (waitlistEntry.id = uuid()));

  return Waitlist;
};
