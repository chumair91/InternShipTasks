import { Button, Container, Typography, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client'

const App = () => {
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketId, setSocketId] = useState('')
  const [roomName, setRoomName] = useState('')

  const socket = useMemo(() => io('http://localhost:3000'), []);
  // const socket = io('http://localhost:3000')

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected', socket.id);
      setSocketId(socket.id)
    })
    socket.on('welcome', (w) => console.log(w))
    socket.on('received-msg', ({ message, id }) => {
      console.log('received msg:', message, " from", id);

    })
    socket.on('receive-msg', (data) => {
      console.log('received msg:', data);

    })
    return () => {
      socket.disconnect()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', { message, room })
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join-room',roomName)
  }

  return (
    <Container maxWidth='sm'>
      <Typography variant='h2' component='div' gutterBottom>
        Welcome to Socket.io
      </Typography>
      <Typography variant='h3' component='div' gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>join room</h5>
        <TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} id='outlined-basic' label='Room Name' variant='outlined' />
        <Button type='submit' variant='contained' color='primary'>join</Button>
      </form>

      <form onSubmit={handleSubmit} >
        <TextField value={message} onChange={(e) => setMessage(e.target.value)} id='outlined-basic' label='Outlined' variant='outlined' />
        <TextField value={room} onChange={(e) => setRoom(e.target.value)} id='outlined-basic' label='Room' variant='outlined' />
        <Button type='submit' variant='contained' color='primary'>send</Button>
      </form>

    </Container>
  )
}

export default App