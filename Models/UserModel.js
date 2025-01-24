import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import Chance from 'chance';
import readline from 'readline';

const chance = new Chance();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;

const generateStrongPassword = () => {
  let password = chance.string({ length: 12 });
  while (!strongPasswordRegex.test(password)) {
    password = chance.string({ length: 12 });
  }
  return password;
};

const generateUniqueEmail = async () => {
  let email = chance.email();
  let existingUser = await User.findOne({ Email: email });
  while (existingUser) {
    email = chance.email();
    existingUser = await User.findOne({ Email: email });
  }
  return email;
};

const generateFakeUser = async () => {
  const roleChance = chance.integer({ min: 1, max: 3 });
  let isAdmin = false;
  let isSeller = false;

  if (roleChance === 1) {
    isAdmin = true;
  } else if (roleChance === 2) {
    isSeller = true;
  }

  return {
    Name: chance.name(),
    Email: await generateUniqueEmail(),
    Password: generateStrongPassword(),
    IsAdmin: isAdmin,
    IsSeller: isSeller,
  };
};

const UserSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
  },
  IsAdmin: {
    type: Boolean,
    default: false
  },
  IsSeller: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('Password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);

const askUserForNumberOfUsers = () => {
  return new Promise((resolve, reject) => {
    rl.question('How many users would you like to generate? ', (answer) => {
      const numUsers = parseInt(answer);
      if (!Number.isInteger(numUsers) || numUsers < 0) {
        reject('Please enter a valid positive integer');
      } else {
        resolve(numUsers);
      }
    });
  });
};

(async () => {
  try {
    await mongoose.connect("mongodb+srv://SAN3005:SAN3005@cluster0.9coqr.mongodb.net/Project?authSource=admin&replicaSet=atlas-mfdnmj-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true");

    console.log('Connected to MongoDB through user model');

    const numUsersToGenerate = await askUserForNumberOfUsers();
    rl.close();

    if (numUsersToGenerate === 0) {
      console.log('No users to generate.');
      return;
    }

    const fakeUsers = [];

    for (let i = 0; i < numUsersToGenerate; i++) {
      const fakeUserData = await generateFakeUser();
      fakeUsers.push(fakeUserData);
      const user = new User(fakeUserData);
      await user.save();
    }

    const csvFile = './CsvData/users.csv';
    const csvWriter = fs.createWriteStream(csvFile);

    csvWriter.write('Name,Email,Password,IsAdmin,IsSeller\n');
    fakeUsers.forEach((user) => {
      csvWriter.write(`${user.Name},${user.Email},${user.Password},${user.IsAdmin},${user.IsSeller}\n`);
    });

    csvWriter.end();

    console.log(`${numUsersToGenerate} fake user data saved to MongoDB with hashed passwords, and ${csvFile} with unhashed passwords.`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // mongoose.connection.close();
  }
})();

export default User;
