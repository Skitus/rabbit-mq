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

    // Получаем сообщение и тип из аргументов командной строки
    var msg = process.argv.slice(3).join(' ') || 'Hello World!';
    var msgType = process.argv[2] || 'info';

    // Объявляем новые обменники
    channel.assertExchange(exchangeLogs, 'direct', { durable: false });
    channel.assertExchange(exchangeErrors, 'direct', { durable: false });

    // Маршрутизация по типу сообщения
    if (msgType === 'info') {
      channel.publish(exchangeLogs, 'info', Buffer.from(msg));
      console.log(" [x] Sent INFO: %s", msg);
    } else if (msgType === 'error') {
      channel.publish(exchangeErrors, 'error', Buffer.from(msg));
      console.log(" [x] Sent ERROR: %s", msg);
    } else {
      console.log(" [x] Unknown message type. Please use 'info' or 'error'.");
    }
  });

  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});
