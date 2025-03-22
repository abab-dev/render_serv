import { Room, Client } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Player, OfficeState } from './schema/OfficeState'
import { Message } from '../types/Messages' 
import PlayerUpdateCommand from '../rooms/commands/PlayerUpdateCommand'

export class MyOffice extends Room<OfficeState> {
  private dispatcher = new Dispatcher(this)
    // onAuth(client, options, request) {
    // const origin = request.headers.origin;
    // if (!allowedOrigins.includes(origin)) {
    //   console.log(`Blocked WebSocket connection from ${origin}`);
    //   return false; // Reject connection
    // }
    // return true;
  }

  onCreate(options: any) {
    this.setState(new OfficeState())

    // when receiving updatePlayer message, call the PlayerUpdateCommand
    this.onMessage(
      Message.UPDATE_PLAYER,
      (client, message: { x: number; y: number; anim: string }) => {
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          client,
          x: message.x,
          y: message.y,
          anim: message.anim,
        })
      }
    )
    this.onMessage(
      Message.READY_TO_CONNECT,(client)=>{
        this.broadcast(Message.READY_TO_CONNECT,client.sessionId,{except:client})
      }
    )
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player())
    // this.state.players.forEach((value, key) => {
    //   console.log('key =>', key)
    //   console.log('value =>', value.x)
    // })
    // client.send('string', this.state.players)
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
  }
}
