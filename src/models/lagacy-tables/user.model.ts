import { DataTypes, Model, Sequelize } from 'sequelize';

const User = ({ sequelize }: { sequelize: Sequelize }) => {
    class User extends Model {}
    User.init(
        {
            // id: {
            //     type: DataTypes.STRING,
            //     primaryKey: true,
            // },
        },
        {
            modelName: 'user',
            tableName: 'users',
            sequelize,
        }
    );

    return User;
};

export default User;
