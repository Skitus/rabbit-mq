#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    // Создаем уникальные обменники для избежания конфликта
    var exchangeLogs = 'direct_logs';  // Используем новое имя для direct exchange
    var exchangeErrors = 'direct_errors';

    // Объявляем обменник для логов с типом direct
    channel.assertExchange(exchangeLogs, 'direct', { durable: false });

    // Создаем очередь для "info" сообщений
    channel.assertQueue('', { exclusive: true }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for INFO messages in %s. To exit press CTRL+C", q.queue);

      // Привязываем очередь к exchange 'logs' с routing key 'info'
      channel.bindQueue(q.queue, exchangeLogs, 'info');

      channel.consume(q.queue, function(msg) {
        if (msg.content) {
          console.log(" [x] Received INFO: %s", msg.content.toString());
        }
      }, { noAck: true });
    });

    // Объявляем обменник для ошибок с типом direct
    channel.assertExchange(exchangeErrors, 'direct', { durable: false });

    // Создаем очередь для "error" сообщений
    channel.assertQueue('', { exclusive: true }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for ERROR messages in %s. To exit press CTRL+C", q.queue);

      // Привязываем очередь к exchange 'errors' с routing key 'error'
      channel.bindQueue(q.queue, exchangeErrors, 'error');

      channel.consume(q.queue, function(msg) {
        if (msg.content) {
          console.log(" [x] Received ERROR: %s", msg.content.toString());
        }
      }, { noAck: true });
    });
  });
});
