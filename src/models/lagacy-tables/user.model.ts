import { DataTypes, Model, Sequelize } from 'sequelize';

const User = ({ sequelize }: { sequelize: Sequelize }) => {
    class User extends Model {}
    User.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            profileImage: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bio: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            darkmode: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            locale: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'en',
            },
            expired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            modelName: 'user',
            tableName: 'users',
            sequelize,
            indexes: [
                { unique: true, fields: ['id'] },
                { unique: true, fields: ['email'] },
                { type: 'FULLTEXT', fields: ['username', 'email'] },
            ],
        }
    );

    return User;
};

export default User;
