import { Sequelize } from "sequelize";
export const sequelize = new Sequelize('bd_express_sequelize', 'root', 'GracoSoft#00', {
 dialect: 'mysql',
 host: 'localhost'
});
