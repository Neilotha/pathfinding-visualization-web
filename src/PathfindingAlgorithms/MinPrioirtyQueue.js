
export class MinPriorityQueue {
    constructor() {
        this.size = 0;
        this.heap = [];
    }

    getSize() {
        return this.size;
    }

    parent(i) {
        return Math.floor((i - 1) / 2);
    }

    leftChild(i) {
        return Math.floor((2 * i) + 1);
    }
    
    rightChild(i) {
        return Math.floor((2 * i) + 2);
    }

    swap(i, j) {
        let temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
        this.heap[i].index = i;
        this.heap[j].index = j;
    }

    // function to shift up the node in order to maintain the heap property
    shiftUp(i) {
        while ( i > 0 && this.heap[i].distance < this.heap[this.parent(i)].distance ) {
            // swap parent and the current node
            this.swap(this.parent(i), i);

            // Update i to parent of i
            i = this.parent(i);
        }

    }

    shiftDown(i) {
        let minIndex = i;

        // left child
        let l = this.leftChild(i);

        if ( l < this.size && this.heap[l].distance < this.heap[minIndex].distance ) {
            minIndex = l;
        }

        // right child
        let r = this.rightChild(i);

        if ( r < this.size && this.heap[r].distance < this.heap[minIndex].distance ) {
            minIndex = r;
        }

        //  if i not same as minIndex
        if ( i !== minIndex ) {
            this.swap(i, minIndex);
            this.shiftDown(minIndex);
        }
    }

    insert(p) {
        this.size = this.size + 1;
        this.heap.push(p);
        this.heap[this.size - 1].index = this.size - 1;
        this.shiftUp(this.size - 1);
    }

    extractMin() {
        let result = this.heap[0];
        this.size = this.size - 1;

        if ( this.size === 0 ) {
            this.heap.pop()
        }
        else {
            // Replace the value of the root with the last leaf
            this.heap.shift();

            // maintain the heap property
            this.shiftDown(0);
        }
        return result;
    }

    // Change the priority of an element
    changePrioirty(i, p)     {
        let oldp = this.heap[i].distance;
        this.heap[i].distance = p;

        if ( p < oldp ) this.shiftUp(i);
        else this.shiftDown(i);
    }

    getMin() {
        return this.heap[0];
    }

    remove(i) {
        this.heap[i].distance = this.getMin() - 1;

        // shift the node to the root
        this.shiftUp(i);

        this.extractMin();
    }

}