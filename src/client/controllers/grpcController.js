// import { Router } from "express";
import { ipcRenderer } from "electron";
import { remote } from 'electron';

var PROTO_PATH = __dirname + '/../../../protos/savedfile.proto';

var async = require('async');
var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
const grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');


// let rpcFunctions = [0, 1, 2, 3];
let grpcController = {};
//package helloworld;
// service Greeter {
//   // Sends a greeting
//   rpc SayHello (HelloRequest) returns (HelloReply) {}
//   rpc SayHelloCS (stream HelloRequest) returns (HelloReply) {}
//   rpc SayHellos (HelloRequest) returns (stream HelloReply) {}
//   rpc SayHelloBidi (stream HelloRequest) returns (stream HelloReply) {}
// }
// // The request message containing the user's name.
// message HelloRequest {
//   string name = 1;
// }
// // The response message containing the greetings
// message HelloReply {
//   string message = 1;
// }


grpcController.openGrpcConnection = (reqResObj2, connectionArray) => {
  // reqResObj.response.headers = {};
  // reqResObj.response.events = [];
  // reqResObj.response.cookies = [];
  // reqResObj.connection = 'open';
  // reqResObj.timeSent = Date.now();
    let reqResObj = {
      service : 'BookService',
      rpc : 'GetGreatestBook',
      packageName : "helloworld",
      queryArr: [{isbn: 68, author: 'Bob', title: 'Bobby'}, {isbn: 4, author: 'wicki', title: 'wack'}, {isbn: 52, author: 'okey', title: 'dokey'}],
      servicesObj: [
        {
          name: 'BookService',
          messages: [
            {
              name: "Book",
              def: {
                isbn: 'int64',
                title: 'string',
                author: 'string',
              }
            },
            {
              name: "GetBookRequest",
              def: {
                isbn: 'int64'
              }
            },
            {
              name: "GetBookViaAuthor",
              def: {
                author: 'string',
              }
            }
          ],
          rpcs: [
            {
              name: "GetBook",
              type: 'UNARY',
              req: 'GetBookRequest',
              res: 'Book'
            },
            {
              name: "GetBooksViaAuthor",
              type: 'SERVER STREAM',
              req: 'GetBookViaAuthor',
              res: 'Book'
            },
            {
              name: "GetGreatestBook",
              type: 'CLIENT STREAM',
              req: 'GetBookRequest',
              res: 'Book'
            },
            {
              name: "GetBooks",
              type: 'BIDIRECTIONAL',
              req: 'GetBookRequest',
              res: 'Book'
            },
          ]
        },
        {
          name: 'DogService',
          messages: [
            {
              name: "Info",
              def: {
                name: 'string',
                breed: 'string'
              }
            },
            {
              name: "GetAge",
              def: {
                age: 'string'
              }
            }
          ],
          rpcs: [
            {
              name: "GetInfo",
              type: 'UNARY',
              req: 'GetAge',
              res: 'Info',
            },
            {
              name: "GetBackground",
              type: 'BIDIRECTIONAL',
              req: 'GetAge',
              res: 'Info'
            },
          ]
        }
      ], }
    console.log('we made it to grpcController, noice')

      //check for connection, if not open one

    if (false) {
        //use existing connection
    }
    else {
        //STUFF that we probably will need from reqresobj/state
        //proto file already parsed and details passed to state and then to reqresObj
        //service name = reqResObj.grpcServiceName
        //serverName = reqResObj.grpcServerName
        //serviceType = reqResObj.serviceFunctionType
        //serviceFunction = reqResObj.serviceFunction
        //     this.ws = websocket;
        // this.url = undefined
        // this.serviceInput =  undefined;
        // this.messageInput = undefined;
        // this.requestInput = undefined;
        // this.package = undefined;
        // this.protoFile = undefined;
        // this.streamType = undefined;
        // this._call = undefined;
        //write the proto file we uploaded somewhere, then add that as protopath?

        // let server = this.url;
        function runCallback(error, response){
          if (error) {
            console.log(error);
            return;
          }
          if (response === '') {
            console.log('Found no helloReply at ')
          } else {
            console.log('Found reply called "' + response.message)
        }
      }
      // definition: "rpc (HelloRequest) returns (HelloReply) {}"

      // def : ["string name = 1;",
      // "string lastName = 2;",
      // "numnber age = 3;"]
      //get rpc defintion from rpc name
      let service = reqResObj.service;
      let rpc = reqResObj.rpc;
      let services = reqResObj.servicesObj;
      let packageName = reqResObj.packageName;
      //go through services object, find service where name matches our passed in service, then grab the rpc list of that service, also save that service
      let rpcList;
      let foundService;
      for ( let i = 0; i < services.length; i += 1) {
        let currentService = services[i];
        if ( currentService.name === service) {
          foundService = currentService;
          rpcList = currentService.rpcs;
          console.log('got rpc list', rpcList)
        }
      }
      // go through that rpcList and find the one that matches passed in rpc, then grab its definition and type
      let rpcType;
      let rpcReq;
      let foundRpc;
      for ( let i = 0; i < rpcList.length; i += 1) {
        let currentRPC = rpcList[i];
        if ( currentRPC.name === rpc) {
          console.log('found correct rpc')
          foundRpc = currentRPC;
          rpcReq = currentRPC.req;
          rpcType = currentRPC.type;
        }
      }
        // def: "rpc (GetBookViaAuthor) returns (stream Book) {}"
        //go through definition and using splits, end up with rpcMessageArr as two element array of request and response (rpcMessagesArr)
        // const rpcMessageNames = rpcDefinition.split('(').slice(1);
        let rpcMessagesArr = [foundRpc.req, foundRpc.res];

        // for (let i = 0; i < rpcMessageNames.length; i += 1) {
        //   let ele = rpcMessageNames[i];
        //   ele = ele.split(')')[0];
        //   rpcMessagesArr.push(ele)
        // }
        // go through messages of our chosen service and grab the keys in an array
        let messageDefObj;
        let keysArray;
        for (let messageIdx in foundService.messages) {
          let message = foundService.messages[messageIdx];
          console.log(message);
          // {
          //   name: "Book",
          //   def: {
          //     isbn: 'int64',
          //     title: 'string',
          //     author: 'string',
          //   }
          // },
          if (foundRpc.req === message.name || foundRpc.req === 'stream ' +message.name) {
            console.log('found matching message name')
            messageDefObj = message.def;
            keysArray = [];
            for (const key in messageDefObj) {
              keysArray.push(key);

            }
            console.log('keysarray', keysArray)
            // for (let i = 1; i < Object.keys(messageDefObj).length + 1; i += 1) {
            //   console.log(messageDefObj)
            //   let key = messageDefObj[i].split(' ')[1];
            //   console.log('key is', key)
            //   keysArray.push(key);
            // }
          }
        }
        const messageKey = [];
        console.log('rpcMessagesArr:', rpcMessagesArr, 'keysArray:', keysArray)
        // const message = reqResObj.message;
        const dirName = remote.app.getAppPath();
        // const service = services[0].name;
        // const rpc = services[0].rpcs[0].name;
        let PROTO_PATH = path.join( dirName, "grpc_mockData/protos/hw2.proto")
        const packageDefinition = protoLoader.loadSync(
            PROTO_PATH,
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true

            }
        )
        let serverName = grpc.loadPackageDefinition(packageDefinition)[packageName];
        // let client = new serverName[service]('localhost:50051', grpc.credentials.createInsecure()); //localhost should be variable destination from reqresObj

        if (rpcType === 'UNARY') {
          // let queryObj = {};
          // for (let i = 0; i < keysArray.length; i+= 1) {
          //   let key = keysArray[i];
          //   queryObj[key] = reqResObj.queryArr[i];
          // }
          client[rpc](reqResObj.queryArr[0], (data)=> {
            console.log('sent UNARY request', data);
            reqResObj.response.events.push(data)
          })

        }
        else if (rpcType === 'CLIENT STREAM') {
          // call = client[rpc](function(error, response) {
          //   if (error) {
          //     console.log(error);
          //     return;
          //   }
          // else {
          //   reqResObj.response.events.push(reponse)
          //   console.log('in client stream response', response);
          // }});

          let callStack = reqResObj.queryArr;
          console.log('callstack before map', callStack);
          callStack = callStack.map((ele)=> {
          //   let queryObj = {};
          //     for (let i = 0; i < keysArray.length; i+= 1) {
          //   let key = keysArray[i];
          //   queryObj[key] = reqResObj.queryArr[i];
          // }
            // let key = keysArray[i];
            // let callObj = {key : ele}
            console.log('callobj' , ele)
            return () => {
              call.write(ele)
            }
          })
          console.log('callstack array', callStack)
          async.series(callStack, function(err, result) {
            call.end();
            // reqResObj.response.events.push(result)
            console.log('result of async series', result);

            console.log('ran all functions')
          });

        }
        else if (rpcType === 'SERVER STREAM') {
          let dataArr;
          const call = client[rpc](reqResObj.queryArr[0]);
          call.on("data", data => {
            console.log('server streaming message:', data);
            //do something to data we got
            reqResObj.response.events.push(data)

            dataArr.push(data);
          })
          call.on('end', () => {
            console.log('server side stream completed', dataArr)
          })
        }
        //else BIDIRECTIONAL
        else {
          let call = client[service];
          call.on('data', (response) => {
          console.log('Got server response "' + response );
          reqResObj.response.events.push(data)

            });

          call.on('end', ()=> {
            console.log('server response ended')
          });

          for (var i = 0; i < queryArr.length; i++) {
            let query = queryArr[i];

            call.write(query);
          }
          call.end();
        }
      reqResObj.connection = 'closed';
      reqResObj.connectionType = 'plain';
      reqResObj.timeReceived = Date.now();
      store.default.dispatch(actions.reqResUpdate(reqResObj));

    }

    // old code taken from other controllers
    const sendGrpcToMain = (args) => {
        return new Promise(resolve => {
            ipcRenderer.send('open-grpc', args)
            ipcRenderer.on('reply-grpc', (event, result) => {
            // needs formatting because component reads them in a particular order
            result.reqResObj.response.cookies = this.cookieFormatter(result.reqResObj.response.cookies);
            resolve(result);
        })
      })
    }
    const openGrpcConnection = (reqResObj) => {
    // initialize response data
        reqResObj.response.headers = {};
        reqResObj.response.events = [];
        reqResObj.response.cookies = [];
        reqResObj.connection = 'open';
        reqResObj.timeSent = Date.now();
        store.default.dispatch(actions.reqResUpdate(reqResObj));

        this.sendGrpcToMain({reqResObj})
        .then(response => {
        response.error ? this.handleError(response.error, response.reqResObj) : this.handleResponse(response.data, response.reqResObj);
        });
  }
  const handleResponse = (response, reqResObj) => {
    reqResObj.connection = 'closed';
    reqResObj.connectionType = 'plain';
    reqResObj.timeReceived = Date.now();
    reqResObj.response.events.push(JSON.stringify(response.data));
  }

  const handleError =  (errorsObj, reqResObj) => {
    reqResObj.connection = 'error';
    reqResObj.timeReceived = Date.now();
    reqResObj.response.events.push(JSON.stringify(errorsObj));
    store.default.dispatch(actions.reqResUpdate(reqResObj));
  }
};
export default grpcController;
