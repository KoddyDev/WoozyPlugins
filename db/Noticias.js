const { DataTypes, Model } = require('sequelize');

module.exports = class Licencas extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: { 
                type: DataTypes.STRING
            },
            description: { 
                type: DataTypes.STRING
            },
            author: { 
                type: DataTypes.STRING
            }
        }, {
            tableName: 'Noticias',
            timestamps: true,
            sequelize
        });
    }
}