const User = require('../models/user/userModels')

// handle GET request
const user_list = async (req, res) => {
    /* more logic here */
    console.log('wwww')
    res.send('hello from list')
};

// handle GET request base on ID
const user_get = async (req, res) => {
    const { id } = req.params;
    /* more logic here */
};

// handle POST request
const user_post = async (req, res) => {
  /* more logic here */
  const data = req.body
  await User.create(data)
  res.json({message:'success'})
};

// handle DELETE request
const user_delete = async (req, res) => {
    const { id } = req.params;
    /* more logic here */
};

// handle PUT request
const user_put = async (req, res) => {
    const { id } = req.params;
    /* more logic here */
};

// handle PATCH request
const user_patch = async (req, res) => {
    const { id } = req.params;
    /* more logic here */
};

module.exports = {
    user_list,
    user_get,
    user_post,
    user_delete,
    user_put,
    user_patch,
};
