import {DataTypes} from 'sequelize'
import bcrypt from 'bcrypt'

/**
 @param sequelize
 @returns {UserClass} 
*/

const User = function(sequelize) {
    const model = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        lastName: DataTypes.STRING,
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false
        }
    },{
        timestamp: true,
        tableName: 'users',
        hooks: {
            beforeCreate: async (user) => {
                if(user.password){
                    const salt = await bcrypt.genSalt(10);  
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if(user.password) {
                    const salt = await bcrypt.genSalt(10);  
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    })
    return model 
}

export default User