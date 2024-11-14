export class EvenEmmiter {
  //храним подписчиков
  subscribers = {};
  //сохранить подписчиков
  subscribe(eventName, callback) {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }
    this.subscribers[eventName].push(callback);
  }
  //вызвать подписчиков
  emit(eventName, data = null) {
    this.subscribers[eventName]?.forEach((cb) => cb(data));
  }
  //отписаться
  unsubscribe(eventName, callback) {
    this.subscribers[eventName] = this.subscribers[eventName].filter(
      (cb) => cb !== callback,
    );
  }
}
