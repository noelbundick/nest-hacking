import * as express from 'express';
import * as http from 'http';
import {HomebridgeAPI} from 'homebridge/lib/api';
import {Logger} from 'homebridge/lib/logger';
import {default as axios} from 'axios';
import protobuf = require('protobufjs');
import fetch from 'node-fetch';

const HomebridgeNest = require('homebridge-nest');
const homebridge = new HomebridgeAPI();
homebridge.registerPlatform('homebridge-nest', 'Nest', HomebridgeNest);

// require('homebridge-nest/lib/nest-device-accessory')({
//   Accessory: homebridge.platformAccessory,
//   Service: homebridge.hap.Service,
//   Characteristic: homebridge.hap.Characteristic,
//   hap: homebridge.hap,
//   uuid: homebridge.hap.uuid,
// });
// const ThermostatAccessory =
//   require('homebridge-nest/lib/nest-thermostat-accessory')();
// const TempSensorAccessory =
//   require('homebridge-nest/lib/nest-tempsensor-accessory')();
const NestConnection = require('homebridge-nest/lib/nest-connection');
// const NestEndpoints = require('homebridge-nest/lib/nest-endpoints');

async function main() {
  const app = express();

  const config = {
    googleAuth: {
      issueToken:
        'https://accounts.google.com/o/oauth2/iframerpc?action=issueToken&response_type=token%20id_token&login_hint=AJDLj6LQu-SMCQLMJfOUep6S7tCeYPauiICtkZ2P1KSgMiIE3gGZzktQaJD-SQv5fL1cbxTfXIfBJdFxLhwll-5rIk5evhPHfQ&client_id=733249279899-44tchle2kaa9afr5v9ov7jbuojfr9lrq.apps.googleusercontent.com&origin=https%3A%2F%2Fhome.nest.com&scope=openid%20profile%20email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fnest-account&ss_domain=https%3A%2F%2Fhome.nest.com',
      cookies:
        '__Secure-3PSID=AQgH2veCZNslG01apKcNtP70KhutI1vomyMKiV7lAMuUqJ4qKvyMzGNV80PmQF95jCotlg.; __Host-3PLSID=AQgH2qcacEkxptvusMT4EIvkSZ4rvUJUIa3jWASaFRpVGyM62IKkiqB_-ScsFbQuU9T4OQ.; __Secure-3PAPISID=jX8TFbbOryRbHcCN/A8aCQHQOOdVgARNSq; NID=220=QyBQNeSSS-Nk20noW4Sf0BKBBh8Pjrh4UGY6o7ZHyU5IIbq5fPxIRlQltge0VSWF8TRcC28wDp7hlNV5JhEjvAEj5E5qTtMJB0Wt-m9qhqn1GwwUC07OYuUw-JUHkEqRiWhIUUSVQzqNRrQgwFrNGb6AarnBTo9-NeKHcyPORel3g3KpZsL_-TF2nvexIXCN; __Secure-3PSIDCC=AJi4QfE7lnVF29Gcutr9-DlKGc_XMkdaW1iEixuibFP7VcUR5y9LteyGhSV0iTwSNmjc2g_iZw',
    },
  };

  const thermostatId = '6416660000B958C2';
  const sensors = {
    office: '18B430C1468E63C1',
    upstairs: '18B430C2B0298F8D',
    bedroom: '18B430C2B2FC61FD',
    livingRoom: '18B430C418D466A6',
    pepper: '18B430C4205E8134',
    guestRoom: '18B430C833EF2E4A',
  };

  Logger.setDebugEnabled(true);

  const logger = new Logger();
  const conn = new NestConnection(
    config,
    logger, // log
    true, // verbose
    false // fieldTestMode
  );
  await conn.auth();
  await conn.subscribe(handleUpdates);
  await conn.observe(handleUpdates);
  const state = conn.apiResponseToObjectTree(conn.currentState);

  function handleUpdates(updates: any) {
    // console.log(updates);
  }

  const platform = {
    optionSet: () => false,
  };

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  app.get('/', async (req, res) => {
    console.log(homebridge.version);
    const x = 3;

    // Set using protobuf API
    let cmd = {
      traitLabel: 'structure_mode',
      command: {
        type_url:
          'type.nestlabs.com/nest.trait.occupancy.StructureModeTrait.StructureModeChangeRequest',
        value: {
          structureMode: 'STRUCTURE_MODE_AWAY',
          reason: 'STRUCTURE_MODE_REASON_EXPLICIT_INTENT',
          userId: {
            resourceId: 'USER_015EAD8C8610D455',
          },
        },
      },
    };
    // await conn.protobufSendCommand([cmd], 'STRUCTURE_' + '017AE532755798AD');

    const sensorValue = {
      associatedRcsSensors: [
        {
          deviceId: {
            resourceId: 'DEVICE_18B430C4205E8134',
          },
          vendorId: 9050,
          productId: 26,
        },
        {
          deviceId: {
            resourceId: 'DEVICE_18B430C1468E63C1',
          },
          vendorId: 9050,
          productId: 26,
        },
        {
          deviceId: {
            resourceId: 'DEVICE_18B430C2B0298F8D',
          },
          vendorId: 9050,
          productId: 26,
        },
        {
          deviceId: {
            resourceId: 'DEVICE_18B430C833EF2E4A',
          },
          vendorId: 9050,
          productId: 26,
        },
        {
          deviceId: {
            resourceId: 'DEVICE_18B430C2B2FC61FD',
          },
          vendorId: 9050,
          productId: 26,
        },
        {
          deviceId: {
            resourceId: 'DEVICE_18B430C418D466A6',
          },
          vendorId: 9050,
          productId: 26,
        },
      ],
      rcsControlMode: 'RCS_CONTROL_MODE_HOLD',
      activeRcsSelection: {
        rcsSourceType: 'RCS_SOURCE_TYPE_SINGLE_SENSOR',
        activeRcsSensor: {
          resourceId: 'DEVICE_18B430C4205E8134',
        },
      },
      multiSensorSettings: null,
    };

    let cmd2 = {
      traitLabel: 'remote_comfort_sensing_settings',
      command: {
        type_url:
          'type.nestlabs.com/nest.trait.hvac.RemoteComfortSensingSettingsTrait',
        value: sensorValue,
      },
    };

    // calls wrong endpoint
    // await conn.protobufSendCommand([cmd2], 'DEVICE_6416660000B958C2');
    await conn.pushUpdates([
      {
        using_protobuf: true,
        object: {
          object_key: 'DEVICE.6416660000B958C2',
          op: 'MERGE',
          value: sensorValue,
        },
      },
    ]);

    // await conn.update(`device.${thermostatId}`, 'target_temperature', 69);

    // await conn.pushUpdates([
    //   {
    //     using_protobuf: true,
    //     object: {
    //       object_key: `rcs_settings.${thermostatId}`,
    //       op: 'MERGE',
    //       value: {
    //         active_rcs_sensors: [],
    //         rcs_control_setting: 'OFF',
    //       },
    //       // value: {
    //       //   active_rcs_sensors: [`kryptonite.${sensors.pepper}`],
    //       //   rcs_control_setting: 'OVERRIDE',
    //       // },
    //     },
    //   },
    // ]);

    //   await axios({
    //     method: 'POST',
    //     // followAllRedirects: true,
    //     timeout: API_TIMEOUT_SECONDS * 1000,
    //     url: this.transport_url + NestEndpoints.ENDPOINT_PUT,
    //     headers: {
    //         'User-Agent': NestEndpoints.USER_AGENT_STRING,
    //         'Authorization': 'Basic ' + this.token,
    //         'X-nl-protocol-version': 1
    //     },
    //     data: {
    //         objects: updatesToSend.map(el => el.object)
    //     },
    //     // json: true
    // });

    // const response = await axios({
    //   method: 'POST',
    //   // followAllRedirects: true,
    //   url: NestEndpoints.URL_PROTOBUF + NestEndpoints.ENDPOINT_UPDATE,
    //   headers: {
    //     'User-Agent': NestEndpoints.USER_AGENT_STRING,
    //     Authorization: 'Basic ' + conn.token,
    //     'Content-Type': 'application/x-protobuf',
    //     'X-Accept-Content-Transfer-Encoding': 'binary',
    //     'X-Accept-Response-Streaming': 'true',
    //   },
    //   data: '\nÑ\u0004\n`\n\u0017DEVICE_6416660000B958C2\u0012\u001fremote_comfort_sensing_settings\u001a$cf80c0b9-82ce-4a72-80af-6e6c6957dfd5\u0012ì\u0003\nCtype.nestlabs.com/nest.trait.hvac.RemoteComfortSensingSettingsTrait\u0012¤\u0003\b\u0001\u0012\u001d\b\u0002\u0012\u0019\n\u0017DEVICE_18B430C1468E63C1\u001a´\u0001\n+\b\u0000\u0012\'\n\u001d\b\u0002\u0012\u0019\n\u0017DEVICE_18B430C1468E63C1\u0010ñÄ\u0001\u0018°µ\u0002\n+\b\u0001\u0012\'\n\u001d\b\u0002\u0012\u0019\n\u0017DEVICE_18B430C1468E63C1\u0010±µ\u0002\u0018Â\u0003\n+\b\u0002\u0012\'\n\u001d\b\u0002\u0012\u0019\n\u0017DEVICE_18B430C4205E8134\u0010Â\u0003\u0018ÐÎ\u0004\n+\b\u0003\u0012\'\n\u001d\b\u0002\u0012\u0019\n\u0017DEVICE_18B430C4205E8134\u0010ÑÎ\u0004\u0018ðÄ\u0001" \n\u0019\n\u0017DEVICE_18B430C2B2FC61FD\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C4205E8134\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C1468E63C1\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C2B0298F8D\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C418D466A6\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C833EF2E4A\u0010ÚF\u0018\u001a',
    // });

    // const device = state.devices.thermostats[thermostatId];
    // const structure = state.structures[device.structure_id];

    // const proto = {
    //   root: await protobuf.load(
    //     'node_modules/homebridge-nest/lib/protobuf/root.proto'
    //   ),
    // };
    // const TraitMap = proto.root.lookupType('nest.rpc.NestMessage');

    // const original =
    //   '\nÑ\u0004\n`\n\u0017DEVICE_6416660000B958C2\u0012\u001fremote_comfort_sensing_settings\u001a$9a066afe-188e-40a1-bfee-a35efb94b680\u0012ì\u0003\nCtype.nestlabs.com/nest.trait.hvac.RemoteComfortSensingSettingsTrait\u0012¤\u0003\u0008\u0001\u0012\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C1468E63C1\u001a´\u0001\n+\u0008\u0000\u0012\'\n\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C1468E63C1\u0010ñÄ\u0001\u0018°µ\u0002\n+\u0008\u0001\u0012\'\n\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C1468E63C1\u0010±µ\u0002\u0018\u0080Â\u0003\n+\u0008\u0002\u0012\'\n\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C4205E8134\u0010\u0081Â\u0003\u0018ÐÎ\u0004\n+\u0008\u0003\u0012\'\n\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C4205E8134\u0010ÑÎ\u0004\u0018ðÄ\u0001" \n\u0019\n\u0017DEVICE_18B430C2B2FC61FD\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C4205E8134\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C1468E63C1\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C2B0298F8D\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C833EF2E4A\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C418D466A6\u0010ÚF\u0018\u001a';
    // const buffer = Buffer.from(original, 'utf16le');
    // const foo = TraitMap.decode(buffer);

    // const trait = '';
    // const data = [
    //   {
    //     object: {
    //       id: `DEVICE_${thermostatId}`,
    //       key: 'remote_comfort_sensing_settings',
    //       uuid: uuidv4(),
    //     },
    //     property: {
    //       type_url:
    //         'type.nestlabs.com/nest.trait.hvac.RemoteComfortSensingSettingsTrait',
    //       value: '',
    //     },
    //   },
    // ];
    // const protobufData = TraitMap.encode(
    //   TraitMap.fromObject({set: data})
    // ).finish();

    // await axios({
    //   method: 'POST',
    //   url: NestEndpoints.URL_PROTOBUF + NestEndpoints.ENDPOINT_UPDATE,
    //   headers: {
    //     'User-Agent': NestEndpoints.USER_AGENT_STRING,
    //     Authorization: 'Basic ' + conn.token,
    //     'Content-Type': 'application/x-protobuf',
    //     'X-Accept-Content-Transfer-Encoding': 'binary',
    //     'X-Accept-Response-Streaming': 'true',
    //   },
    //   data: protobufData,
    // });

    // works
    // const thermostat = new ThermostatAccessory(
    //   conn,
    //   conn.log,
    //   device,
    //   structure,
    //   platform
    // );

    // doesn't work
    // // no sensor
    // const noSensorValue = {
    //   active_rcs_sensors: [],
    //   rcs_control_setting: 'OFF',
    // };

    // pick a sensor
    // await conn.pushUpdates([
    //   {
    //     using_protobuf: true,
    //     object: {
    //       object_key: `rcs_settings.${thermostatId}`,
    //       op: 'MERGE',
    //       value: {
    //         active_rcs_sensors: [`kryptonite.${sensors['pepper']}`],
    //         rcs_control_setting: 'OVERRIDE',
    //       },
    //     },
    //   },
    // ]);

    //   curl 'https://grpc-web.production.nest.com/nestlabs.gateway.v1.TraitBatchApi/BatchUpdateState' \
    // -H 'authority: grpc-web.production.nest.com' \
    // -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Microsoft Edge";v="96"' \
    // -H 'dnt: 1' \
    // -H 'x-accept-response-streaming: true' \
    // -H 'x-accept-content-transfer-encoding: base64' \
    // -H 'sec-ch-ua-mobile: ?0' \
    // -H 'authorization: Basic g.0.eyJraWQiOiIyMzhiNTUxZmMyM2EyM2Y4M2E2ZTE3MmJjZTg0YmU3ZjgxMzAzMmM4IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJuZXN0X2lkOm5lc3QtcGhvZW5peC1wcm9kOjU2ODg2NCIsImlzcyI6Im5lc3Qtc2VjdXJpdHktYXV0aHByb3h5QG5lc3Qtc2VjdXJpdHktYXV0aHByb3h5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwicG9sIjoiYXV0aHByb3h5LW9hdXRoLXBvbGljeSIsImV4cCI6MTYzNzYyOTE2MiwidXRvayI6Ilx1MDAwMF3Do2JWLVxuw4J5w73DgirCtWvDucKuw71cdTAwMDbCsMK7WVx1MDA5Q3PCqkg0bnt0w7k2wqlDwrDCrcOuPMK0w6tcdTAwMDTDhMO5XHTDq8K4wq5cdTAwMTFcdTAwMDJ3KcOISVVQw7tgwrJdwr3Dh8Ozwq4nwqDDjMOGw5bDgsOoLiQgw6pcdTAwMDPDksO7wqxcdTAwMTB8wqvCo1x1MDAxQ8KxXHUwMDAxwqvDnFx1MDAwNEdRXHUwMDg1XHUwMDFDw7dcdTAwOUXDsTxnO8Oqw6PDmVx1MDAxRsO7wrrCv1x1MDA4M8K7XHUwMDA3XHUwMDk0SMO5RVx1MDAwNS1cdTAwOELDnknCtsOXRcO_wrLDoMOGw6VcIlxuXHUwMDE3wr_DscOGRcOkdcOlbsKkw74jwrsyXHUwMDA0w7BfXHUwMDhBXHI2Xlx1MDAxMVXDucKzwqDDi8KuMyFFw4A9Slx1MDA4NGXDqcOHw6tbfsOWR2NcdTAwMTZ1XHUwMDkxcVx1MDAwRsOdw4zCqFx1MDAwNmlcdTAwOThcdTAwN0bDp8OmdVx1MDAwNFx0XHUwMDg3QEbDvcKywrfDtlx1MDA5N8Kkd8OZM8OjXHUwMDE0TVx1MDAwNyIsInV0b2t0IjoiR09PR0xFX09BVVRIIn0.jGuPMNksXxWG5JSlQZFhq2p5joFMBb2YjLoV_Bqf2_IxkvSNXwHbLVkJ32DKK-sQ43Oy3LBYKTLm-oyPa76XSgtUnJn-vYe8ag4fs_9aoC84s9R6H9jaMMiPs5tCloPJtMk0sf7yKV0yjtgsJtVmDafCTiw0A5hwTJG3SUSER78x_KEXmLG2zawKGInTnxCrYAxhglNF24pRwm4GVRUvtOkNf7bdgdT-4arFTDNRpVZkYndMnePVzCBX_zmED30SNrD0OC4UO_uLl5MiAGURY_2ubthxw-ddkpCYEBFL3lEYqVM1UdZTcacp4TXkdrzJnMZoTprFKb0JQghBKfQzTg' \
    // -H 'content-type: application/x-protobuf' \
    // -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29' \
    // -H 'request-id: 9a066afe-188e-40a1-bfee-a35efb94b680' \
    // -H 'x-nl-webapp-version: NlAppSDKVersion/9.5.3 NlSchemaVersion/2.1.20-336-g3111f722b' \
    // -H 'sec-ch-ua-platform: "Windows"' \
    // -H 'accept: */*' \
    // -H 'origin: https://home.nest.com' \
    // -H 'sec-fetch-site: same-site' \
    // -H 'sec-fetch-mode: cors' \
    // -H 'sec-fetch-dest: empty' \
    // -H 'referer: https://home.nest.com/' \
    // -H 'accept-language: en-US,en;q=0.9' \
    // --data-raw $'\nÑ\u0004\n`\n\u0017DEVICE_6416660000B958C2\u0012\u001fremote_comfort_sensing_settings\u001a$9a066afe-188e-40a1-bfee-a35efb94b680\u0012ì\u0003\nCtype.nestlabs.com/nest.trait.hvac.RemoteComfortSensingSettingsTrait\u0012¤\u0003\u0008\u0001\u0012\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C1468E63C1\u001a´\u0001\n+\u0008\u0000\u0012\'\n\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C1468E63C1\u0010ñÄ\u0001\u0018°µ\u0002\n+\u0008\u0001\u0012\'\n\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C1468E63C1\u0010±µ\u0002\u0018\u0080Â\u0003\n+\u0008\u0002\u0012\'\n\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C4205E8134\u0010\u0081Â\u0003\u0018ÐÎ\u0004\n+\u0008\u0003\u0012\'\n\u001d\u0008\u0002\u0012\u0019\n\u0017DEVICE_18B430C4205E8134\u0010ÑÎ\u0004\u0018ðÄ\u0001" \n\u0019\n\u0017DEVICE_18B430C2B2FC61FD\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C4205E8134\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C1468E63C1\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C2B0298F8D\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C833EF2E4A\u0010ÚF\u0018\u001a" \n\u0019\n\u0017DEVICE_18B430C418D466A6\u0010ÚF\u0018\u001a' \
    // --compressed

    // Timeout other API calls after this number of seconds
    // const API_TIMEOUT_SECONDS = 40;
    // await axios({
    //   method: 'POST',
    //   timeout: API_TIMEOUT_SECONDS * 1000,
    //   url: conn.transport_url + NestEndpoints.ENDPOINT_PUT,
    //   headers: {
    //     'User-Agent': NestEndpoints.USER_AGENT_STRING,
    //     Authorization: 'Basic ' + conn.token,
    //     'X-nl-protocol-version': 1,
    //   },
    //   data: {
    //     objects: [
    //       {
    //         object_key: `rcs_settings.${thermostatId}`,
    //         op: 'MERGE',
    //         value: sensorValue,
    //       },
    //     ],
    //   },
    // });

    // console.log(state);
    res.sendStatus(200);
  });

  const server = http.createServer(app);
  server.listen(5000);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
