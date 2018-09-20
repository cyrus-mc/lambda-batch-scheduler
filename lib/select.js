var oracledb = require('oracledb');

oracledb.getConnection(
  {
    user: "matthew",
    password: "1234",
    connectString: "localhost"
  }
);
