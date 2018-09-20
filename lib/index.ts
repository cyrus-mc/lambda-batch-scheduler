import { Handler, Context, Callback } from 'aws-lambda';
import config from './config';
import AWS = require('aws-sdk');
import oracledb = require('oracledb');

const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  console.log('Received event: ', JSON.stringify(event, null, 2));

  AWS.config.update({ region: "us-west-2" });

/*  if (config.localRun as boolean) {
    try {
      var sts = new AWS.STS();
      const assumeRole = await sts.assumeRole({
        RoleArn: 'arn:aws:iam::755621335444:role/DATDevOps',
        RoleSessionName: 'lambdaRun'}).promise();

      console.log(assumeRole)
      AWS.config.update({
        accessKeyId: assumeRole.Credentials.AccessKeyId,
        secretAccessKey: assumeRole.Credentials.SecretAccessKey,
        sessionToken: assumeRole.Credentials.SessionToken
      })
    } catch (err) {
      console.log(err, err.stack);
      throw err;
    }
  }
  */

  let result;
  try {
    let connection = await getConnection(config.connectString, config.dbUser, config.dbPass);

    /* query database */
    result = await query(connection);

    connection.close();
  } catch (err) {
    console.log(err, err.stack);
    throw err;
  }


//  let params = {}
 // var s3 = new AWS.S3();
  //let s3Buckets = await s3.listBuckets(params).promise();
  //console.log(s3Buckets);
  const LANES_PER_BATCH = config.lanesPerBatch;
  for (let i = 1; i < result; i = i + LANES_PER_BATCH) {
    console.log(i);
    /* submit jobs */
    let params = {
    }
  }

}

export async function getConnection(connectString: string, user: string, pass: string) {
  try {
    let connection = await oracledb.getConnection(
      {
        user: user,
        password: pass,
        connectString: connectString
      }
    )

    return connection;
  } catch (err) {
    console.log(err, err.stack);
    throw err;
  }
}

/* execute our query and return result */
async function query(connection: any) {
  try {
    let result = await connection.execute("SELECT MAX(group_number) FROM dw_admin.stage_pred_rates_90");
    return result.rows[0][0];
  } catch (err) {
    console.log(err, err.stack);
    throw err;
  }
}

export { handler };
