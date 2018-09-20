import { handler, getConnection } from './index';
import config from './config';
import { sleep } from 'sleep';
//import oracledb = require('oracledb');

const event = {
}

/* create database */
export async function start() {
  let connection

  /* oracle container takes time to start up (keep retrying) */
  while (true) {
    try {
      connection = await getConnection(config.connectString, config.dbUser, config.dbPass)
      break
    } catch (err) {
      console.log("Database not initialized, sleeping for 20 seconds")
      await sleep(20)
    }
  }

  try {
    await seedDb(connection)
    await connection.close()

    /* call lambda handler */
    await handler(event, null, null)

    console.log('Lambda finished')
    process.stdin.resume();
  } catch (err) {
    throw err
  }
}

/* seed database */
async function seedDb(connection: any) {
  try {
    let result = await connection.execute(
      `
      declare
      userexist integer;
      BEGIN
        select count(*) into userexist from dba_users where username = 'DW_ADMIN';
        if (userexist = 0) then
          execute immediate 'CREATE USER dw_admin IDENTIFIED BY password';
          execute immediate 'GRANT UNLIMITED TABLESPACE TO dw_admin';
          execute immediate 'CREATE TABLE dw_admin.stage_pred_rates_90 (group_number NUMBER)';
          COMMIT;
        end if;
      END;`
    )

    result = await connection.execute(
      `
      BEGIN
        INSERT INTO dw_admin.stage_pred_rates_90 (group_number) VALUES (45329);
        COMMIT;
      END;`
    )

    return result
  } catch (err) {
    console.log(err, err.stack)
    throw err
  }
}

start()
