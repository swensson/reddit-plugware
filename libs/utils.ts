export const route = (f) => (req, res, next) => {
  try {
    Promise.resolve(f(req, res)).then((d) => res.json(d)).catch((err) => next(err));
  } catch (e) {
    next(e);
  }
};
