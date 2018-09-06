const mongoose = require("mongoose");
const hash = require("../hash");

// Définition du "Schéma" d'un utilisateur
const UserSchema = mongoose.Schema({

	firstName:  { type: String, required: [true, 'Le champs "prénom" est obligatoire'] },
    lastName:   { type: String, required: [true, 'Le champs "nom" est obligatoire'] },
    
    // Validateur personnalisé qui vérifie le format d'une adresse e-mail.
    // Basé sur la documentation de mongoose : http://mongoosejs.com/docs/validation.html#custom-validators 
    email : {
        type: String,
        validate: {
            validator: function(mailValue) {
                // c.f. http://emailregex.com/
                const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegExp.test(mailValue);
            },
            message: 'L\'adresse email {VALUE} n\'est pas une adresse RFC valide'
        },
        required: [true, 'Le champs "email" est obligatoire']
    },

    salt: { type: String, required: true },
    hash: { type: String, required: true }
});

UserSchema.statics.signup = function(firstName, lastName, email, password, confirmPassword) {

  // Vérification des champs de mot de passe
  const pass_errors = []

  if (password.trim() === '')
      pass_errors.push('Le champs "mot de passe" est obligatoire')

  if (confirmPassword.trim() === '')
      pass_errors.push('Le champs "confirmation de mot de passe" est obligatoire')

  if (pass_errors.length === 0 && password.trim() !== confirmPassword.trim())
      pass_errors.push('Les mots de passe doivent être identiques')

  if (pass_errors.length > 0)
      return Promise.reject(pass_errors)

  /*
      Insertion en base, en utilisant la méthode .create() de d'un Model mongoose
      c.f. http://mongoosejs.com/docs/api.html#create_create

      Cette méthode renvoie une Promesse JS. Avec l'instruction 'return', on renvoie donc
      la promesse comme valeur de 'UserSchema.statics.signup'
  */
  
  return this.findOne({ email: email })
      .then(user => {
          if (user)
              return Promise.reject(new Error(`Cette adresse email est déjà utilisée (${user.email})`));
      })
      .then(() => hash(password))
      .then( ({salt, hash}) => {
      return this.create({
          firstName : firstName,
          lastName : lastName,
          email : email,
          salt : salt,
          hash : hash
      })
  }).catch(err => {
      // Fabrication d'un tableau de messages d'erreur (extraits de l'objet 'ValidationError' renvoyé par Mongoose)
      if (err.errors)
          throw Object.keys(err.errors).map(field => err.errors[field].message);
      
      throw [err.message ? err.message : err];
  })

  
};

// Export du Modèle mongoose représentant un objet User
module.exports = mongoose.model('User', UserSchema);