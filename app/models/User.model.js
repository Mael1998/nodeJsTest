const mongoose = require("mongoose");
const hash = require("../hash");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    validate: {
      validator: function(mailValue) {
        // c.f. http://emailregex.com/
        const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegExp.test(mailValue);
      },
      message: "L'adresse email {VALUE} n'est pas une adresse RFC valide."
    }
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
});

UserSchema.statics.signup = function(
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) {
  return hash(password).then(data => {
    return this.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      salt: data.salt,
      hash: data.hash
    }).catch(err => {
      // Fabrication d'un tableau de messages d'erreur (extraits de l'objet 'ValidationError' renvoyé par Mongoose)
      if (err.errors)
        throw Object.keys(err.errors).map(field => err.errors[field].message);

      throw [err.message ? err.message : err];
    });
  });
};

module.exports = mongoose.model("User", UserSchema);
