import generatetoken from '../Token/Token.js';
import User from '../Models/UserModel.js';

const Authenticatingusers = async (req, res) => {
  const { Email, Password } = req.body;
  const user = await User.findOne({ Email: Email });

  if (user && (await user.matchPassword(Password))) {
    res.json({
      _id: user._id,
      Name: user.Name,
      Email: user.Email,
      IsAdmin: user.IsAdmin,
      IsSeller: user.IsSeller, // Include IsSeller in the response
      token: generatetoken(user._id),
    });
  } else {
    res.status(401).send("Invalid email or password");
  }
};

const RegisteringUsers = async (req, res) => {
  try {
    const { Name, Email, Password,IsAdmin,IsSeller } = req.body;
    const userpresent = await User.findOne({ Email: Email });

    if (userpresent) {
      res.status(400).json("User already exists");
    } else {
      const user = await User.create({ Name,Email,Password,});

      if (user) {
        res.status(201).json({
          _id: user._id,
          Name: user.Name,
          Email: user.Email,
          IsAdmin: user.IsAdmin,
          IsSeller: user.IsSeller, // Include IsSeller in the response
          token: generatetoken(user._id),
        });
      } else {
        res.status(400).json("Invalid details");
      }
    }
  } catch (error) {
    res.json(error);
  }
};

const Profileofusers = async (req, res) => {
  const user = await User.findById(req.user._id).select('-Password');
  if (user) {
    res.json({
      _id: user._id,
      Name: user.Name,
      Email: user.Email,
      IsAdmin: user.IsAdmin,
      IsSeller: user.IsSeller, // Include IsSeller in the response
    }).status(200);
  } else {
    res.json("User not found").status(400);
  }
};

const allusers = async (req, res) => {
  const users = await User.find().select('-Password'); // Exclude Password
  res.json(users);
};

const singleuser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-Password');
  if (user) {
    res.json(user);
  } else {
    res.status(400).json("User not found");
  }
};

const deleteusers = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json("User Deleted");
};


const updatinguser = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if the updated email already exists in the database
      if (req.body.Email && req.body.Email !== user.Email) {
          const existingUser = await User.findOne({ Email: req.body.Email });
          if (existingUser) {
              return res.status(400).json({ message: 'Email already exists' });
          }
      }

      // Update user fields
      user.Name = req.body.Name || user.Name;
      user.Email = req.body.Email || user.Email;
      user.IsAdmin = req.body.IsAdmin || user.IsAdmin;
      user.IsSeller = req.body.IsSeller || user.IsSeller; // Update IsSeller

      // Save the updated user
      const updatedUser = await user.save();

      // Return the updated user data along with a new token
      res.status(200).json({
          _id: updatedUser._id,
          Name: updatedUser.Name,
          Email: updatedUser.Email,
          IsAdmin: updatedUser.IsAdmin,
          IsSeller: updatedUser.IsSeller,
          token: generatetoken(updatedUser._id), // Replace with your token generation logic
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

  
  
  
  export {
    Authenticatingusers,
    Profileofusers,
    RegisteringUsers,
    allusers,
    deleteusers,
    updatinguser,
    singleuser
  };
  