class BuddySystem {
  constructor(memorySize) {
    this.totalMemory = memorySize;
    this.freeBlocks = [{ start: 0, size: memorySize }];
  }

  // allocate memory
  allocate(size) {
    const initialSize = size;
    size = this.roundUpToPowerOfTwo(size);
    const blockIndex = this.findFreeBlock(size);

    if (blockIndex === -1) {
      console.error(
        `Allocation failed: No suitable block found for size ${size}.`
      );
      return null;
    }

    let block = this.freeBlocks[blockIndex];
    while (block.size > size) {
      this.splitBlock(blockIndex);
      block = this.freeBlocks[blockIndex];
    }

    this.freeBlocks.splice(blockIndex, 1);
    console.log(
      `${initialSize} Allocated block of size ${size} at address ${block.start}.`
    );
    return block.start;
  }

  // free memory
  free(address, size) {
    const initialSize = size;
    size = this.roundUpToPowerOfTwo(size);
    const block = { start: address, size };

    this.freeBlocks.push(block);
    this.freeBlocks.sort((a, b) => a.start - b.start);
    this.mergeBlocks();
    console.log(`${initialSize} Freed block of size ${size} at address ${address}.`);
  }

  // find the first suitable block
  findFreeBlock(size) {
    return this.freeBlocks.findIndex((block) => block.size >= size);
  }

  // split a larger block into two smaller blocks
  splitBlock(index) {
    const block = this.freeBlocks[index];
    const halfSize = block.size / 2;

    this.freeBlocks[index] = { start: block.start, size: halfSize };
    this.freeBlocks.splice(index + 1, 0, {
      start: block.start + halfSize,
      size: halfSize,
    });
  }

  // merge adjacent buddy blocks
  mergeBlocks() {
    for (let i = 0; i < this.freeBlocks.length - 1; i++) {
      const current = this.freeBlocks[i];
      const next = this.freeBlocks[i + 1];

      if (
        current.size === next.size &&
        current.start + current.size === next.start
      ) {
        this.freeBlocks[i] = { start: current.start, size: current.size * 2 };
        this.freeBlocks.splice(i + 1, 1);
        i--;
      }
    }
  }

  // round up size to the nearest power of two
  roundUpToPowerOfTwo(size) {
    return 1 << Math.ceil(Math.log2(size));
  }
}

// create an object
const memory = new BuddySystem(1024);
memory.allocate(126);
memory.allocate(250);
memory.allocate(64);
memory.free(0, 126);
memory.free(256, 250);
memory.allocate(126);
memory.allocate(240);
