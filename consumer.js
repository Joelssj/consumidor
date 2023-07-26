import { connect as _connect } from 'amqplib';
import fetch from 'node-fetch';

const rabbitSettings = {
  protocol: 'amqp',
  hostname: '3.229.42.196',
  port: 5672,
  username: 'guest',
  password: 'guest'
};

async function connect() {
  const queue = 'mqtt';
  try {
    const conn = await _connect(rabbitSettings);
    console.log('Conexión exitosa');
    const channel = await conn.createChannel();
    console.log('Canal creado exitosamente');

    channel.consume(queue, async (msn) => {
      const messageContent = msn.content.toString();
      try {
        const response = await fetch('http://3.220.243.236:3010/sensores/', {
          method: 'POST',
          body: messageContent,
          headers: { 'Content-Type': 'application/json', "Accept": "application/json"}
        });

        if (response.ok) {
          console.log('Mensaje enviado a la API');
        } else {
          console.error('Error al enviar mensaje');
        }
      } catch (error) {
        console.error('Error al llamar la API', error);
      }
      channel.ack(msn);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

connect();