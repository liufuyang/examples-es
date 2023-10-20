// Copyright 2021-2023 The Connect Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createPromiseClient } from "@connectrpc/connect";
import {createConnectTransport, createGrpcTransport, createGrpcWebTransport} from "@connectrpc/connect-node";
import { ElizaService } from "./gen/connectrpc/eliza/v1/eliza_connect.js";
import { stdin, stdout } from "process";
import * as readline from "node:readline/promises";
import {State} from "./gen/connectrpc/eliza/v1/eliza_pb";

const rl = readline.createInterface(stdin, stdout);

// Alternatively, use createGrpcTransport or createGrpcWebTransport here
// to use one of the other supported protocols.
const transport = createGrpcWebTransport({
  httpVersion: "1.1",
  baseUrl: "http://localhost:3000",
  useBinaryFormat: true,
});

void (async () => {
  const client = createPromiseClient(ElizaService, transport);

  const name = await rl.question("What is your name?\n> ");
  const a = "1"
  const stateA = State[a as keyof typeof State]
  const stateB = State["B"]
  console.log(stateA)        // print A
  console.log(typeof stateA) // print string
  console.log(stateB)        // print 2
  console.log(typeof stateB) // print number

  for await (const res of client.introduce({ name })) {
    rl.write(res.sentence + "\n");
  }

  for (;;) {
    const sentence = await rl.question("> ");
    const res = await client.say({ sentence, state: stateA}); // Here will print error
    rl.write(res.sentence + "\n");
  }
})();
