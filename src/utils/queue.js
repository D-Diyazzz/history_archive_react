export class FIFOQueue {
    constructor() {
        this.items = [];
    }

    // Добавить элемент в конец очереди
    enqueue(item) {
        this.items.push(item);
    }

    // Удалить элемент из начала очереди
    dequeue() {
        if (this.isEmpty()) {
            return "Очередь пуста";
        }
        return this.items.shift();
    }

    // Проверка на пустоту
    isEmpty() {
        return this.items.length === 0;
    }

    // Получить первый элемент
    peek() {
        return this.items[0];
    }

    // Получить размер очереди
    size() {
        return this.items.length;
    }
}


