import { Handler, Context, Callback } from 'aws-lambda';
import config from './config';
import AWS = require('aws-sdk');
import oracledb = require('oracledb');
import strftime = require('strftime');

const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  console.log('Received event: ', JSON.stringify(event, null, 2));

  AWS.config.update({ region: "us-west-2" });

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

  const LANES_PER_BATCH = config.lanesPerBatch;
  for (let i = 1; i < result; i = i + LANES_PER_BATCH) {
    const st = strftime('%Y-%m-%d@%H:%M:%S')
    const batchName = `pred-${st}`

    try {
    /* submit jobs */
    let jobResult = await createBatchJob(1, LANES_PER_BATCH, batchName)
    console.log(`Batch jobID ${jobResult.jobId} submitted`);
    } catch (err) {
      console.log(err, err.stack);
      throw err;
    }
  }
}

export async function createBatchJob(batchNum: number, lanes: number, name: string) {
  let batch = new AWS.Batch()

  console.log(name);
  const batchParams = {
    jobDefinition: "pred-dev01-pred:5",
    jobName: "pred-batch-sequence",
    jobQueue: "pred-dev01-high",
    containerOverrides: {
      environment: [
        {
          name: 'PROCESS_NUMBER',
          value: `${batchNum}`
        },
        {
          name: 'LANES_PER_BATCH',
          value: `${lanes}`
        },
        {
          name: 'BATCH_NAME',
          value: `${name}`
        }
      ]
    }
  }

  let result = await batch.submitJob(batchParams).promise()
  return result
}

export async function getConnection(connectString: string, user: string, pass: string) {
  let connection = await oracledb.getConnection(
    {
      user: user,
      password: pass,
      connectString: connectString
    }
  )

  return connection;
}

/* execute our query and return result */
async function query(connection: any) {
  let result = await connection.execute("SELECT MAX(group_number) FROM dw_admin.stage_pred_rates_90");

  /* return just the number we want */
  return result.rows[0][0];
}

export { handler };
