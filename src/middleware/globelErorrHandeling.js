export const globleErorrHandeler=(err, req, res, next) => {
  console.error(err.stack)
  res.status(err['case']||500).json({message:err.message,stack:err.stack})
}