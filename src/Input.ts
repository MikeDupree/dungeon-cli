
import config from "../config";
import { PlayerInterface } from "./Player";

const keypress = require('keypress'); // we have to use require cause import give a ts error.

// without this, we would only get streams once enter is pressed
process.stdin.setRawMode(true);


// Input Controller
//
// TODO play around with reading this buffer.
//const readable = Readable.from(process.stdin);
//readable.on('data', (chunk: any) => {
//  console.log('chunk', chunk);
//});

const InputContoller = ({ player }: { player: PlayerInterface }) => {
  keypress(process.stdin);
  process.stdin.on('keypress', function(ch, key) {
    // Kill process on Ctl-C 
    if (key.sequence === '\x03') {
      process.exit();
    }
    config.debug && console.log('key', key);

    player.checkInput(key.sequence);
  })
}

export default InputContoller;
