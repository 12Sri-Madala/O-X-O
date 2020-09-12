const models = require('../models');
const timber = require('../logs/timber');

async function verifyOwner(id, token) {
  try {
    const verified = await models.owner.count({
      where: {
        id, token,
      },
    });
    if (verified === 1) {
      return true;
    }

    // Logging unverified request
    timber.debug('recieved unverified request', {
      user: {
        id,
        token,
      },
      source: 'generated',
      created_in: 'verifyOwner',
    }).catch((error) => {
      console.log(error);
    });
    return false;
  } catch (error) {
    timber.error('Error verifying driver', {
      error,
      user: { id },
      created_in: 'dash_verifyDriver',
      source: 'generated',
    }).catch((err) => {
      console.log(err);
    });
  }
  return false;
}

module.exports = verifyOwner;
