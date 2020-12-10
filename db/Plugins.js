const { DataTypes, Model } = require('sequelize');

module.exports = class Licencas extends Model {
    static init(sequelize) {
        return super.init({
            nome: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            valor: { 
                type: DataTypes.STRING
            },
            tipo: { 
                type: DataTypes.STRING
            }
        }, {
            tableName: 'Plugins',
            timestamps: true,
            sequelize
        });
    }
}