import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";

const nftSchema = mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    donation: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre('save', async function(next){
//     if(!this.isModified('password')){
//         next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt)

// })

// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

const NFT = mongoose.model("NFT", nftSchemaSchema);
export default NFT;
