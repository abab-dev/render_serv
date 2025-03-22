import { Room, Client } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Player, OfficeState } from './schema/OfficeState'
import { Message } from '../types/Messages' 
import PlayerUpdateCommand from '../rooms/commands/PlayerUpdateCommand'

export class MyOffice extends Room<OfficeState> {
  private dispatcher = new Dispatcher(this)

  onCreate(options: any) {
    this.setState(new OfficeState())

    // Listen for the UPDATE_PLAYER message from clients
    this.onMessage(
      Message.UPDATE_PLAYER,
      (client, message: { x: number; y: number; anim: string }) => {
        // Dispatch the PlayerUpdateCommand to update the player's state
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          client,
          x: message.x,
          y: message.y,
          anim: message.anim,
        })
      }
    )
    // Listen for the READY_TO_CONNECT message from clients
    this.onMessage(
      Message.READY_TO_CONNECT,(client)=>{
        // Broadcast the READY_TO_CONNECT message to all other clients except the sender
        this.broadcast(Message.READY_TO_CONNECT,client.sessionId,{except:client})
      }
    )
  }

  onJoin(client: Client, options: any) {
    // Create a new player and add them to the room state
    this.state.players.set(client.sessionId, new Player())
    // this.state.players.forEach((value, key) => {
    //   console.log('key =>', key)
    //   console.log('value =>', value.x)
    // })
    // client.send('string', this.state.players)
  }

  onLeave(client: Client, consented: boolean) {
    // Remove the player from the room state
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
  }
}

