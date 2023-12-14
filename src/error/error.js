const errorHandler = (err, req, res, next) => {
    // if (process.env.NODE_ENV !== "test") {
    //     console.log(pe.render(err));
    // }
  console.log('error here', err)
  //   const messagePerStatus = {
  //       404: "not found",
  //       401: "no authorization",
  //   };
  // const message = messagePerStatus[err.status];
  const error = {
      error: {
          status: err.status || 500,
          message: err.message || "something went wrong",
      },
  };
    return res.status(err.status || 500).json(error);
};

module.exports = errorHandler;
