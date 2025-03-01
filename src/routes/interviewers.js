const router = require("express").Router();

module.exports = db => {
  router.get("/interviewers", (request, response) => {
    db.query(`SELECT * FROM interviewers`).then(({ rows: interviewers }) => {
      response.json(
        interviewers.reduce(
          (previous, current) => ({
            ...previous,
            [current.id]: {
              ...current,
              avatar: `http://localhost:8001/${current.avatar}`, // Prepend server URL
            },
          }),
          {}
        )
      );
    });
  });

  return router;
};
