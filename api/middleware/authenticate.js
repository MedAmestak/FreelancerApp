const authenticate = (req, res, next) => {
    // Check if the user is logged in
    if (!req.isAuthenticated()) {
      // User is not logged in, return an error response or redirect to the login page
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    // User is logged in, proceed to the next middleware or route handler
    next();
  };
  
  export default authenticate;
  