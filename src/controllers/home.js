const indexPage = (req, res) =>
  res.status(200).json({ message: "Welcome to the Nuzlocke tracker!" });

export default indexPage;
