import { thisTypeAnnotation } from "@babel/types";

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
    }

    // function to shift up the node in order to maintain the heap property
    shiftUp(i) {
        while ( i > 0 && (this.heap[i].distance < this.heap[this.parent(i)].distance || this.isCloserToTarget(i, this.parent(i))) ) {
            // swap parent and the current node
            this.swap(this.parent(i), i);

            // Update i to parent of i
            i = this.parent(i);
        }

    }

    // returns true if i has a lower h-value than j while they both have the same distance
    isCloserToTarget(i, j) {
        let result = false;
        if ( this.heap[i].distance === this.heap[j].distance ) {
            if ( this.heap[i].h < this.heap[j].h ) result = true
        }

        return result;
    }

    shiftDown(i) {
        let minIndex = i;

        // left child
        let l = this.leftChild(i);

        if ( l < this.size && (this.heap[l].distance < this.heap[minIndex].distance || this.isCloserToTarget(l, minIndex)) ) {
            minIndex = l;
        }

        // right child
        let r = this.rightChild(i);

        if ( r < this.size && (this.heap[r].distance < this.heap[minIndex].distance || this.isCloserToTarget(r, minIndex)) ) {
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
        this.heap[this.size - 1].inQueue = true;
        this.shiftUp(this.size - 1);
    }

    extractMin() {
        let result = this.heap[0];
        result.inQueue = false;
        this.size = this.size - 1;

        if ( this.size === 0 ) {
            this.heap.pop()
        }
        else {
            this.heap[0] = this.heap.pop();
            this.shiftDown(0);
        }
        return result;
    }

    // Change the priority of an element
    changePrioirty(i, h, g)     {
        let oldh = this.heap[i].h;
        let oldg = this.heap[i].g;
        this.heap[i].distance = h + g;
        this.heap[i].g = g;
        this.heap[i].h = h;

        if ( oldh + oldg > h + g || (oldh + oldg === h + g && oldh > h) ) this.shiftUp(i);
        else this.shiftDown(i);
    }

    getMin() {
        return this.heap[0];
    }

    remove(i) {
        this.heap[i].distance = this.getMin() - 1;

        // shift the node to the root
        this.shiftUp(i);

        let temp = this.extractMin();
    }

    getIndex(node) {
        return this.heap.indexOf(node);
    }

    getTempNode() {
        return{
            distance: Infinity,
            h: Infinity,
            g: Infinity,
          };
    }

}