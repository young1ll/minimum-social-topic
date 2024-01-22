import db from '@/utils/dbseed';
import { DataTypes, Model } from 'sequelize';

class User extends Model {}
User.init(
    {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
    },
    {
        modelName: 'user',
        tableName: 'users',
        sequelize: db.sequelize,
    }
);

export default User;
