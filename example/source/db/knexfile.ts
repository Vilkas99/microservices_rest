require('dotenv').config()

const configs = ({
    client: 'pg',
    connection: {
      host : process.env.POSTGRESS_URL as string,
      port : process.env.POSTGRESS_PORT as string,
      user : process.env.POSTGRESS_USER as string,
      password : process.env.POSTGRESS_PASSWORD as string,
      database : process.env.POSTGRESS_DB as string,
      connectionString: 'postgres://csarutbvtoijrh:4da964f2b87c74028ef6e0eaad5a4905e396a346bb3075356472b46d1cdd9218@ec2-54-235-98-1.compute-1.amazonaws.com:5432/d3ma6kapb1nnft',
      ssl: { rejectUnauthorized: false }
    }, 
    migrations: {
      tableName: 'Wallet',
      directory: __dirname + '/migrations'
    }, 
    seeds: {
      directory: __dirname + '/seeds'
    }
  });

  export default configs
